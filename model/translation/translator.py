import os
import torch
from dotenv import load_dotenv
from huggingface_hub import hf_hub_download
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from peft import PeftModel

load_dotenv()

HUGGING_FACE_API_TOKEN = os.getenv("HUGGING_FACE_API_TOKEN")
_MODEL_ID = "facebook/mbart-large-50-many-to-many-mmt"
_CACHE_DIR = "hf_model"
_LORA_DIR = "models/core-model"

_translator = None
_device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


def get_translator(lora_model_dir):
    """
    Возвращает объект Translator.
    Загружает модель и LoRA, если они ещё не загружены.
    """
    global _translator

    if _translator is None:
        # Загружаем базовую модель
        if not is_loaded():
            print("[INFO] Модель не загружена. Скачиваем...")
            load_model()

        print("[INFO] Загружаем базовую модель и LoRA...")
        base_model = AutoModelForSeq2SeqLM.from_pretrained(_MODEL_ID, cache_dir=_CACHE_DIR)
        model_with_lora = PeftModel.from_pretrained(base_model, lora_model_dir)
        model_with_lora.to(_device)

        tokenizer = AutoTokenizer.from_pretrained(lora_model_dir)

        # Создаём обёртку Translator
        _translator = Translator(model_with_lora, tokenizer, _device)

    return _translator


def is_loaded(model_id: str = _MODEL_ID, cache_dir: str = _CACHE_DIR) -> bool:
    """
    Проверяет, загружена ли базовая модель в кэш.
    """
    from huggingface_hub import try_to_load_from_cache

    try:
        path = try_to_load_from_cache(model_id, "config.json", cache_dir=cache_dir)
        return path is not None
    except Exception:
        return False


def load_model(output_dir: str = _CACHE_DIR) -> None:
    """
    Скачивает необходимые файлы модели из HuggingFace.
    """
    filenames = [
        "pytorch_model.bin",
        "config.json",
        "generation_config.json",
        "rust_model.ot",
        "source.spm",
        "target.spm",
        "tokenizer_config.json",
        "tf_model.h5"
    ]

    for filename in filenames:
        hf_hub_download(
            repo_id=_MODEL_ID,
            filename=filename,
            token=HUGGING_FACE_API_TOKEN,
            local_dir=output_dir
        )


class Translator:
    """
    Класс-обёртка для перевода текста с использованием модели и LoRA.
    """

    def __init__(self, model, tokenizer, device):
        self.model = model
        self.tokenizer = tokenizer
        self.device = device

    def __call__(self, text: str, max_length: int = 1000) -> str:
        inputs = self.tokenizer(text, return_tensors="pt").to(self.device)
        outputs = self.model.generate(**inputs, max_length=max_length)
        return self.tokenizer.decode(outputs[0], skip_special_tokens=True)
