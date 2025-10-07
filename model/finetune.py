import os
import torch
import numpy as np
from datasets import load_dataset
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, Seq2SeqTrainer, Seq2SeqTrainingArguments
from peft import LoraConfig, get_peft_model, TaskType
from nltk.translate.bleu_score import sentence_bleu, SmoothingFunction
import nltk

# Скачиваем необходимые данные для nltk (если еще не скачаны)
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

# --- Параметры ---
MODEL_ID = "Helsinki-NLP/opus-mt-ru-en"
DATA_PATH = "dmitry_dataset_no_duplicates.json"
CACHE_DIR = "hf_model"
OUTPUT_DIR = "./nanai_lora"
BATCH_SIZE = 4
EPOCHS = 3
LEARNING_RATE = 5e-4

# --- 1. Загружаем датасет ---
print("[INFO] Загружаем датасет...")
dataset = load_dataset("json", data_files=DATA_PATH, split="train")

split_dataset = dataset.train_test_split(test_size=0.1, seed=42, shuffle=True)
train_dataset = split_dataset["train"]
val_dataset = split_dataset["test"]

print(f"Размер тренировочной выборки: {len(train_dataset)}")
print(f"Размер валидационной выборки: {len(val_dataset)}")

# --- 2. Токенизация ---
print("[INFO] Токенизация...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_ID, legacy=False, cache_dir=CACHE_DIR)


def tokenize(batch):
    inputs = tokenizer(
        batch["translation"],
        truncation=True,
        padding="max_length",
        max_length=128  # Уменьшил длину для стабильности
    )

    with tokenizer.as_target_tokenizer():
        targets = tokenizer(
            batch["original"],
            truncation=True,
            padding="max_length",
            max_length=128
        )

    inputs["labels"] = targets["input_ids"]
    return inputs


tokenized_train = train_dataset.map(tokenize, batched=True)
tokenized_val = val_dataset.map(tokenize, batched=True)


# --- 3. Улучшенная функция для вычисления BLEU ---
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
        pred_clean = pred.strip()
        label_clean = label.strip()

        # Пропускаем пустые строки
        if not pred_clean or not label_clean:
            bleu_scores.append(0.0)
            continue

        # Токенизируем для BLEU
        pred_tokens = nltk.word_tokenize(pred_clean.lower())
        label_tokens = [nltk.word_tokenize(label_clean.lower())]  # BLEU требует список списков

        try:
            # Начинаем с BLEU-1 для более стабильных результатов
            bleu_score = sentence_bleu(
                label_tokens,
                pred_tokens,
                weights=(1.0, 0, 0, 0),  # Начнем с BLEU-1
                smoothing_function=smoothie
            )
            bleu_scores.append(bleu_score)
        except Exception as e:
            if i < 3:  # Выводим ошибки только для первых примеров
                print(f"Ошибка BLEU для примера {i}: {e}")
                print(f"Pred: {pred_tokens}")
                print(f"Label: {label_tokens}")
            bleu_scores.append(0.0)

    avg_bleu = np.mean(bleu_scores) if bleu_scores else 0.0

    # Дополнительная метрика: точность на уровне слов
    word_accuracy = []
    for pred, label in zip(decoded_preds, decoded_labels):
        pred_words = set(nltk.word_tokenize(pred.strip().lower()))
        label_words = set(nltk.word_tokenize(label.strip().lower()))

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


# --- 4. Загружаем модель и подключаем LoRA ---
print("[INFO] Инициализация модели...")
model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_ID, cache_dir=CACHE_DIR)

lora_config = LoraConfig(
    r=8,
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.1,
    bias="none",
    task_type=TaskType.SEQ_2_SEQ_LM
)

model = get_peft_model(model, lora_config)
model.print_trainable_parameters()

# --- 5. Настройка обучения ---
device = 0 if torch.cuda.is_available() else -1
print(f"[INFO] Используем {'GPU' if device >= 0 else 'CPU'} для обучения")

training_args = Seq2SeqTrainingArguments(
    output_dir=OUTPUT_DIR,
    per_device_train_batch_size=BATCH_SIZE,
    per_device_eval_batch_size=BATCH_SIZE,
    num_train_epochs=EPOCHS,
    learning_rate=LEARNING_RATE,
    eval_strategy="steps",
    eval_steps=1500,  # Уменьшил для более частой оценки
    save_strategy="steps",
    save_steps=1500,
    logging_strategy="steps",
    logging_steps=100,
    save_total_limit=2,
    predict_with_generate=True,
    generation_max_length=128,  # Добавил ограничение генерации
    generation_num_beams=1,  # Упростим генерацию для скорости
    fp16=True if device >= 0 else False,
    load_best_model_at_end=True,
    metric_for_best_model="bleu",
    greater_is_better=True,
    report_to=None,
)

trainer = Seq2SeqTrainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_train,
    eval_dataset=tokenized_val,
    tokenizer=tokenizer,
    compute_metrics=compute_metrics,
)

# --- 6. Проверка данных перед обучением ---
print("\n[INFO] Проверка данных...")
sample = tokenized_val[0]
print("Пример входных данных:")
print("Input IDs shape:", sample["input_ids"][:10], "...")
print("Labels shape:", sample["labels"][:10], "...")

# --- 7. Запуск обучения ---
print("[INFO] Запуск обучения...")
trainer.train()

# --- 8. Финальная оценка ---
print("\n[INFO] Финальная оценка на валидационной выборке...")
eval_results = trainer.evaluate()
print(f"Финальные метрики: {eval_results}")

# --- 9. Сохранение модели ---
print(f"[INFO] Сохраняем модель в {OUTPUT_DIR}...")
model.save_pretrained(OUTPUT_DIR)
tokenizer.save_pretrained(OUTPUT_DIR)

print("[INFO] Обучение завершено!")