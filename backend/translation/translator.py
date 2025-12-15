import logging
import os
import torch
from typing import Literal, Dict, Tuple, List
from .config import TranslatorConfig
from dotenv import load_dotenv
from huggingface_hub import hf_hub_download, try_to_load_from_cache
from peft import PeftModel
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
from pathlib import Path

load_dotenv()


class TranslationService:
    """
    Сервис для перевода текста. Загружает модели один раз при инициализации
    и переиспользует их для всех последующих запросов.
    """

    def __init__(self, base_model_path: str, lora_dir: str):
        self.base_model_path = Path(base_model_path)
        self.lora_dir = Path(lora_dir)
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.models: Dict[str, Tuple] = {}

        print(f"Загрузка базовой модели из: {self.base_model_path}")
        print(f"LoRA адаптеры из: {self.lora_dir}")

        self._load_all_models()

    def translate_with_attempts(self, text: str, attempt: int, target_language: Literal["russian", "nanai"]):
        """Перевод с несколькими попытками разбиения текста"""
        all_variants = []

        chunks = self.split_for_translation(text, attempt)

        translated_chunks = []
        for chunk in chunks:
            translated_chunk = self.translate(chunk, target_language=target_language)
            translated_chunks.append(translated_chunk)

        full_translation = " ".join(translated_chunks)

        if text.strip().endswith(('.', '!', '?', '…')) and not full_translation.strip().endswith(
                ('.', '!', '?', '…')):
            full_translation = full_translation.strip() + text.strip()[-1]

        all_variants.append(full_translation.strip())

        return all_variants[0]

    def split_for_translation(self, text: str, attempt: int):
        """Разбиение текста на части для перевода"""
        if attempt < 1:
            raise ValueError("attempt должен быть >= 1")

        words = text.split()
        n_words = len(words)

        if n_words == 0:
            return []

        if attempt == 1:
            return [text]

        num_chunks = min(attempt, n_words)
        chunk_sizes = []
        base_size = n_words // num_chunks
        remainder = n_words % num_chunks

        for i in range(num_chunks):
            size = base_size + (1 if i < remainder else 0)
            if size == 0:
                size = 1
            chunk_sizes.append(size)

        while sum(chunk_sizes) < n_words:
            chunk_sizes.append(1)
        result = []
        idx = 0

        for size in chunk_sizes:
            chunk_words = words[idx:idx + size]
            chunk_text = ' '.join(chunk_words)
            result.append(chunk_text)
            idx += size

        print(f"Разбиение на {len(result)} частей: {result}")
        return result

    def translate(self, text: str, target_language: Literal["russian", "nanai"], max_length: int = 1000) -> str:
        """Основной метод перевода"""
        if not text or len(text) == 0:
            raise ValueError("Текст для перевода не может быть пустым.")

        if target_language not in self.models:
            raise ValueError(f"Язык {target_language} не поддерживается")

        model, tokenizer = self.models[target_language]

        # Подготовка входных данных
        inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512).to(self.device)

        # Генерация перевода
        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_length=max_length,
                num_beams=5,
                early_stopping=True
            )

        return tokenizer.decode(outputs[0], skip_special_tokens=True)

    def _load_all_models(self) -> None:
        """Загружает все модели (с LoRA адаптерами)"""
        print("Загрузка моделей с LoRA адаптерами...")

        # Загружаем модель для перевода с нанайского на русский
        self.models["russian"] = self._load_model_with_lora("nanai_lora")

        # Загружаем модель для перевода с русского на нанайский
        self.models["nanai"] = self._load_model_with_lora("nanai_lora_reverse")

        print("✅ Все модели загружены")

    def _load_model_with_lora(self, lora_name: str) -> Tuple:
        """Загружает базовую модель с LoRA адаптером"""
        lora_path = self.lora_dir / lora_name

        print(f"  Загрузка LoRA адаптера: {lora_name}")
        print(f"  Путь к адаптеру: {lora_path}")

        if not lora_path.exists():
            raise FileNotFoundError(f"LoRA адаптер не найден: {lora_path}")

        # Загружаем базовую модель
        print(f"  Загрузка базовой модели из: {self.base_model_path}")
        base_model = AutoModelForSeq2SeqLM.from_pretrained(
            str(self.base_model_path),
            local_files_only=True
        )

        # Загружаем LoRA адаптер
        model_with_lora = PeftModel.from_pretrained(base_model, str(lora_path))
        model_with_lora.to(self.device)
        model_with_lora.eval()

        # Загружаем токенизатор из папки с LoRA адаптером
        tokenizer = AutoTokenizer.from_pretrained(
            str(lora_path),
            local_files_only=True
        )

        print(f"  ✅ {lora_name} загружен")
        return model_with_lora, tokenizer