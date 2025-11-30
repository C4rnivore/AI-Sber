import logging
import os
import torch
from typing import Literal, Dict, Tuple, List
from .config import TranslatorConfig
from dotenv import load_dotenv
from huggingface_hub import hf_hub_download, try_to_load_from_cache
from peft import PeftModel
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

load_dotenv()


class TranslationService:
    """
    Сервис для перевода текста. Загружает модели один раз при инициализации
    и переиспользует их для всех последующих запросов.
    """
    def __init__(self, config: TranslatorConfig):
        self._hf_token = config.hugging_face_token
        self.model_id = config.model_id
        self.cache_dir = config.cache_dir
        self.lora_dir = config.lora_dir
        self.filenames = config.filenames
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.models: Dict[str, Tuple] = {}
        self._ensure_model_cached()
        self._load_all_models()

    def translate_with_attempts(self, text: str, attempt: int, target_language: Literal["russian", "nanai"] ):
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

    def split_for_translation(self,text: str, attempt: int) -> List[str]:

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

        print(result)
        return result

    def translate(self, text: str, target_language: Literal["russian", "nanai"], max_length: int = 1000) -> str:
        if not text or len(text) == 0:
            raise ValueError("Текст для перевода не может быть пустым.")
        
        model, tokenizer = self.models[target_language]
        
        inputs = tokenizer(text, return_tensors="pt").to(self.device)
        outputs = model.generate(**inputs, max_length=max_length)
        return tokenizer.decode(outputs[0], skip_special_tokens=True)

    def _load_all_models(self) -> None:
        self.models["russian"] = self._load_model_with_lora("nanai_lora")
        self.models["nanai"] = self._load_model_with_lora("nanai_lora_reverse")

    def _ensure_model_cached(self) -> None:
        if not self._is_model_cached():
            self._download_model()

    def _is_model_cached(self) -> bool:
        try:
            path = try_to_load_from_cache(self.model_id, "config.json", cache_dir=self.cache_dir)
            return path is not None
        except Exception:
            return False

    def _download_model(self) -> None:
        for filename in self.filenames:
            hf_hub_download(
                repo_id=self.model_id,
                filename=filename,
                token=self._hf_token,
                local_dir=self.cache_dir,
            )

    def _load_model_with_lora(self, lora_name: str):
        lora_path = f"{self.lora_dir}/{lora_name}"
        
        base_model = AutoModelForSeq2SeqLM.from_pretrained(
            self.model_id, 
            cache_dir=self.cache_dir
        )
        model_with_lora = PeftModel.from_pretrained(base_model, lora_path)
        model_with_lora.to(self.device)
        model_with_lora.eval()
        tokenizer = AutoTokenizer.from_pretrained(lora_path)
        return model_with_lora, tokenizer
