import os
from typing import Optional

from fastapi import APIRouter
from api.base import NotFoundException
from schemas.base import BaseModelRead
from translation import TranslationService, TranslatorConfig

router = APIRouter(prefix="/translation", tags=["Translation"])

_translation_service: Optional[TranslationService] = None


def get_translation_service() -> TranslationService:
    """
    Возвращает глобальный экземпляр сервиса перевода.
    Создает его при первом вызове. Чтобы не загружать модель каждый раз при каждом запросе.
    """
    global _translation_service
    
    if _translation_service is None:
        config = TranslatorConfig(
            hugging_face_token=os.getenv("HUGGING_FACE_API_TOKEN"),
            model_id="facebook/mbart-large-50-many-to-many-mmt",
            cache_dir="mbart/",
            lora_dir="mbart/loras",
            filenames=[
                "config.json", 
                "generation_config.json", 
                "flax_model.msgpack", 
                "model.safetensors", 
                "pytorch_model.bin", 
                "rust_model.ot", 
                "sentencepiece.bpe.model", 
                "tokenizer_config.json", 
                "tf_model.h5"
            ]
        )
        _translation_service = TranslationService(config)
    
    return _translation_service


@router.get(
    "/to-russian",
    response_model=BaseModelRead,
    summary="Translate from Nanai to Russian",
)
async def translate_to_russian(
        nanai_text: str,
        attempt: int,
) -> BaseModelRead:

    service = get_translation_service()
    if attempt > 1:
        translation_rus = service.translate_with_attempts(nanai_text,attempt, target_language="russian")
    else:
        translation_rus = service.translate(nanai_text, target_language="russian")
    
    if not translation_rus:
        raise NotFoundException(detail="Failed to translate")
    
    return BaseModelRead(text_to_translated=translation_rus)


@router.get(
    "/to-nanai",
    response_model=BaseModelRead,
    summary="Translate from Russian to Nanai",
)
async def translate_to_nanai(
        russian_text: str,
        attempt: int,
) -> BaseModelRead:
    service = get_translation_service()
    if attempt > 1:
        translation_nanai = service.translate_with_attempts(russian_text,attempt,target_language="nanai")
    else:
        translation_nanai = service.translate(russian_text, target_language="nanai")
    
    if not translation_nanai:
        raise NotFoundException(detail="Failed to translate")
    
    return BaseModelRead(text_to_translated=translation_nanai)