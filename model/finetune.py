import os
import torch
from datasets import load_dataset
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, Seq2SeqTrainer, Seq2SeqTrainingArguments
from peft import LoraConfig, get_peft_model, TaskType

# --- Параметры ---
MODEL_ID = "Helsinki-NLP/opus-mt-ru-en"
DATA_PATH = "dataset.json"
CACHE_DIR = "hf_model"
OUTPUT_DIR = "./nanai_lora"
BATCH_SIZE = 4
EPOCHS = 3
LEARNING_RATE = 5e-4

# --- 1. Загружаем датасет ---
print("[INFO] Загружаем датасет...")
dataset = load_dataset("json", data_files=DATA_PATH, split="train")

split_dataset = dataset.train_test_split(test_size=0.1, seed=42, shuffle=True)  # 10% на валидацию
train_dataset = split_dataset["train"]
val_dataset = split_dataset["test"]

# --- 2. Токенизация ---
print("[INFO] Токенизация...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_ID, legacy=False, cache_dir=CACHE_DIR)


def tokenize(batch):
    return tokenizer(
        batch["source"],
        text_target=batch["translation"],
        truncation=True,     # <-- обрезка длинных текстов
        padding="max_length", # <-- паддинг до max_length
        max_length=128        # <-- можно выбрать подходящую длину
    )

tokenized_train = train_dataset.map(tokenize, batched=True)
tokenized_val = val_dataset.map(tokenize, batched=True)

# --- 3. Загружаем модель и подключаем LoRA ---
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

# --- 4. Настройка обучения ---
device = 0 if torch.cuda.is_available() else -1
print(f"[INFO] Используем {'GPU' if device>=0 else 'CPU'} для обучения")

training_args = Seq2SeqTrainingArguments(
    output_dir=OUTPUT_DIR,
    per_device_train_batch_size=BATCH_SIZE,
    num_train_epochs=EPOCHS,
    learning_rate=LEARNING_RATE,
    logging_steps=10,
    save_steps=50,
    save_total_limit=2,
    predict_with_generate=True,
    fp16=True if device >= 0 else False,
)

trainer = Seq2SeqTrainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_train,
    eval_dataset=tokenized_val, 
    tokenizer=tokenizer,
)

# --- 5. Запуск обучения ---
print("[INFO] Запуск обучения...")
trainer.train()

# --- 6. Сохранение модели ---
print(f"[INFO] Сохраняем модель в {OUTPUT_DIR}...")
model.save_pretrained(OUTPUT_DIR)
tokenizer.save_pretrained(OUTPUT_DIR)

print("[INFO] Обучение завершено!")
