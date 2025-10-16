from finetuning.preprocessor import preprocess_nanai_text, smart_preprocess_russian_text, preprocess_russian_text
from finetuning.utils import init_nltk, lemmatize_dataset, load_config
from nltk.translate.bleu_score import sentence_bleu, SmoothingFunction
from peft import LoraConfig, get_peft_model, TaskType
from datasets import load_dataset
from transformers import (
    AutoTokenizer, AutoModelForSeq2SeqLM,
    Seq2SeqTrainer, Seq2SeqTrainingArguments,
    get_scheduler
)
import numpy as np
import random
import torch
import nltk
import os
import re


config = load_config("finetuning/finetune_cfg.yaml")
# Принудительно приводим типы (на случай, если YAML загрузился не так)
config["training"]["LEARNING_RATE"] = float(config["training"]["LEARNING_RATE"])
config["training"]["BATCH_SIZE"] = int(config["training"]["BATCH_SIZE"])
config["training"]["EPOCHS"] = int(config["training"]["EPOCHS"])
config["training"]["EVAL_STEPS"] = int(config["training"]["EVAL_STEPS"])
config["training"]["SAVE_STEPS"] = int(config["training"]["SAVE_STEPS"])
config["training"]["LOGGING_STEPS"] = int(config["training"]["LOGGING_STEPS"])
config["training"]["SAVE_TOTAL_LIMIT"] = int(config["training"]["SAVE_TOTAL_LIMIT"])
config["training"]["WARMUP_STEPS"] = int(config["training"]["WARMUP_STEPS"])

init_nltk()
os.environ["WANDB_DISABLED"] = "true"

# ------------------------------ 1. Загружаем датасет ------------------------------
print("[INFO] Загружаем датасет...")
dataset = load_dataset("json", data_files=config["paths"]["DATA_PATH"], split="train")

if config["tokenizer"]["LEMMATIZE"]:
    print("[INFO] Применяем лемматизацию к датасету...")
    lemmatized_dataset = dataset.map(
        lemmatize_dataset,
        batched=True,
        batch_size=500,  
        desc="Лемматизация датасета"
    )
    split_dataset = lemmatized_dataset.train_test_split(test_size=0.1, seed=42, shuffle=True)
else:
    split_dataset = dataset.train_test_split(test_size=0.1, seed=42, shuffle=True)

train_dataset = split_dataset["train"]
val_dataset = split_dataset["test"]

print(f"Размер тренировочной выборки: {len(train_dataset)}")
print(f"Размер валидационной выборки: {len(val_dataset)}")


# ------------------------------ 2. Токенизация ------------------------------
print("[INFO] Токенизация...")
tokenizer = AutoTokenizer.from_pretrained(config["paths"]["MODEL_ID"], legacy=False, cache_dir=config["paths"]["CACHE_DIR"])
tokenizer.src_lang = config["tokenizer"]["SRC_LANG"]  # исходный язык - английский
tokenizer.tgt_lang = config["tokenizer"]["TGT_LANG"]  # целевой язык - русский

def tokenize(batch):
    inputs = tokenizer(
        batch["original"],
        truncation=True,
        padding="max_length",
        max_length=config["tokenizer"]["MAX_LENGTH"]
    )

    with tokenizer.as_target_tokenizer():
        targets = tokenizer(
            batch["translation"],
            truncation=True,
            padding="max_length",
            max_length=config["tokenizer"]["MAX_LENGTH"]
        )

    inputs["labels"] = targets["input_ids"]
    return inputs

tokenized_train = train_dataset.map(tokenize, batched=True)
tokenized_val = val_dataset.map(tokenize, batched=True)


# ------------------------------ 3. Вычисление BLEU ------------------------------
def compute_metrics(eval_pred):
    predictions, labels = eval_pred

    # Декодируем предсказания
    decoded_preds = tokenizer.batch_decode(predictions, skip_special_tokens=True)

    # Заменяем -100 в labels на pad_token_id для декодирования
    labels = np.where(labels != -100, labels, tokenizer.pad_token_id)
    decoded_labels = tokenizer.batch_decode(labels, skip_special_tokens=True)

    # Отладка: выведем первые несколько примеров
    print("\n--- Отладка BLEU ---")
    print("Первые 3 предсказания:", decoded_preds[:3])
    print("Первые 3 эталоны:", decoded_labels[:3])
    print("-------------------\n")

    # Вычисляем BLEU score
    bleu_scores = []
    smoothie = SmoothingFunction().method1

    for i, (pred, label) in enumerate(zip(decoded_preds, decoded_labels)):
        # Для BLEU применяем лемматизацию к русскому тексту
        pred_clean = preprocess_russian_text(pred)
        label_clean = preprocess_russian_text(label)

        # Пропускаем пустые строки
        if not pred_clean or not label_clean:
            bleu_scores.append(0.0)
            continue

        # Токенизируем для BLEU
        pred_tokens = nltk.word_tokenize(pred_clean)
        label_tokens = [nltk.word_tokenize(label_clean)]

        try:
            bleu_score = sentence_bleu(
                label_tokens,
                pred_tokens,
                weights=(1.0, 0, 0, 0),  # BLEU-1
                smoothing_function=smoothie
            )
            bleu_scores.append(bleu_score)
        except Exception as e:
            if i < 3:
                print(f"Ошибка BLEU для примера {i}: {e}")
            bleu_scores.append(0.0)

    avg_bleu = np.mean(bleu_scores) if bleu_scores else 0.0

    # Word accuracy с лемматизацией
    word_accuracy = []
    for pred, label in zip(decoded_preds, decoded_labels):
        pred_processed = preprocess_russian_text(pred)
        label_processed = preprocess_russian_text(label)

        pred_words = set(nltk.word_tokenize(pred_processed))
        label_words = set(nltk.word_tokenize(label_processed))

        if not label_words:
            word_accuracy.append(0.0)
        else:
            common_words = pred_words.intersection(label_words)
            accuracy = len(common_words) / len(label_words)
            word_accuracy.append(accuracy)

    word_acc = np.mean(word_accuracy) if word_accuracy else 0.0

    return {
        "bleu": avg_bleu,
        "word_accuracy": word_acc
    }


# ------------------------------ 4. Загружаем модель и подключаем LoRA ------------------------------
print("[INFO] Инициализация модели...")
model = AutoModelForSeq2SeqLM.from_pretrained(config["paths"]["MODEL_ID"], cache_dir=config["paths"]["CACHE_DIR"])

lora_config = LoraConfig(
    r=config["lora"]["R"],
    lora_alpha=config["lora"]["LORA_ALPHA"],
    target_modules=config["lora"]["TARGET_MODULES"],
    lora_dropout=config["lora"]["LORA_DROPOUT"],
    bias=config["lora"]["BIAS"],
    task_type=TaskType.SEQ_2_SEQ_LM
)

model = get_peft_model(model, lora_config)
model.print_trainable_parameters()


# ------------------------------ 5. Настройка обучения ------------------------------
device = 0 if torch.cuda.is_available() else -1
print(f"[INFO] Используем {'GPU' if device >= 0 else 'CPU'} для обучения")

training_args = Seq2SeqTrainingArguments(
    output_dir=config["paths"]["OUTPUT_DIR"],
    generation_num_beams=config["training"]["GENERATION_NUM_BEAMS"],
    per_device_train_batch_size=config["training"]["BATCH_SIZE"],
    per_device_eval_batch_size=config["training"]["BATCH_SIZE"],
    lr_scheduler_type=config["training"]["LR_SCHEDULER_TYPE"],
    save_total_limit=config["training"]["SAVE_TOTAL_LIMIT"],
    generation_max_length=config["tokenizer"]["MAX_LENGTH"],
    logging_steps=config["training"]["LOGGING_STEPS"],
    learning_rate=config["training"]["LEARNING_RATE"],
    warmup_steps=config["training"]["WARMUP_STEPS"],
    num_train_epochs=config["training"]["EPOCHS"],
    eval_steps=config["training"]["EVAL_STEPS"],
    save_steps=config["training"]["SAVE_STEPS"],
    gradient_accumulation_steps=config["training"]["GRADIENT_ACCUMULATION_STEPS"] or 1,
    
    metric_for_best_model="bleu",
    logging_strategy="steps",
    eval_strategy="steps",
    save_strategy="steps",
    
    report_to=None,
    greater_is_better=True,
    predict_with_generate=True,
    load_best_model_at_end=True,
    fp16=True if device >= 0 else False,
)

trainer = Seq2SeqTrainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_train,
    eval_dataset=tokenized_val,
    tokenizer=tokenizer,
    compute_metrics=compute_metrics
)

# ------------------------------ 6. Проверка данных перед обучением --------------
print("\n[INFO] Проверка данных...")
sample = tokenized_val[0]
print("Пример входных данных:")
print("Input IDs shape:", sample["input_ids"][:10], "...")

# ------------------------------ 7. Запуск обучения ------------------------------
print("[INFO] Запуск обучения...")
trainer.train()

# ------------------------------ 8. Финальная оценка -----------------------------
print("\n[INFO] Финальная оценка на валидационной выборке...")
eval_results = trainer.evaluate()
print(f"Финальные метрики: {eval_results}")

# ------------------------------ 9. Сохранение модели ----------------------------
print(f"[INFO] Сохраняем модель в {config["paths"]["OUTPUT_DIR"]}...")
model.save_pretrained(config["paths"]["OUTPUT_DIR"])
tokenizer.save_pretrained(config["paths"]["OUTPUT_DIR"])

print("[INFO] Обучение завершено!")