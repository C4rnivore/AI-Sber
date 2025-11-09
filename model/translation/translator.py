import os
from typing import Literal, Optional
import torch
from dotenv import load_dotenv
from huggingface_hub import hf_hub_download, try_to_load_from_cache
from peft import PeftModel
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

load_dotenv()


class Translator:
    """
    Класс для перевода текста с использованием базовой модели и адаптера LoRA.
    """

    _MODEL_ID = "facebook/mbart-large-50-many-to-many-mmt"
    _CACHE_DIR = "models/core"
    _LORA_DIR = "models/core/loras"

    def __init__(self, target_language: Literal["russian", "nanai"] = "russian"):
        self.target_language = target_language
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self._hf_token = os.getenv("HUGGING_FACE_API_TOKEN")

        self._ensure_model_cached()
        self.model, self.tokenizer = self._load_model_with_lora()

    def translate(self, text:str, max_length: int = 1000) -> str:
        """
        Выполняет перевод текста.
        """
        if not text or len(text) == 0:
            raise ValueError("Текст для перевода не может быть пустым.")

        inputs = self.tokenizer(text, return_tensors="pt").to(self.device)
        outputs = self.model.generate(**inputs, max_length=max_length)
        return self.tokenizer.decode(outputs[0], skip_special_tokens=True)

    def _ensure_model_cached(self) -> None:
        if not self._is_model_cached():
            print("[INFO] Модель не загружена. Скачиваем...")
            self._download_model()

    def _is_model_cached(self) -> bool:
        try:
            path = try_to_load_from_cache(self._MODEL_ID, "config.json", cache_dir=self._CACHE_DIR)
            return path is not None
        except Exception:
            return False

    def _download_model(self) -> None:
        filenames = [
            "pytorch_model.bin",
            "config.json",
            "generation_config.json",
            "rust_model.ot",
            "source.spm",
            "target.spm",
            "tokenizer_config.json",
            "tf_model.h5",
        ]

        for filename in filenames:
            hf_hub_download(
                repo_id=self._MODEL_ID,
                filename=filename,
                token=self._hf_token,
                local_dir=self._CACHE_DIR,
            )

    def _load_model_with_lora(self):
        lora_path = f"{self._LORA_DIR}/nani_lora" if self.target_language == "nanai" else f"{self._LORA_DIR}/nanai_lora_reverse"
        
        print("[INFO] Загружаем базовую модель и LoRA...")
        base_model = AutoModelForSeq2SeqLM.from_pretrained(self._MODEL_ID, cache_dir=self._CACHE_DIR)
        model_with_lora = PeftModel.from_pretrained(base_model, lora_path)
        model_with_lora.to(self.device)

        tokenizer = AutoTokenizer.from_pretrained(lora_path)
        return model_with_lora, tokenizer
