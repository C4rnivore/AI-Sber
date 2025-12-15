from typing import Optional
from fastapi import APIRouter
from api.base import NotFoundException
from schemas.base import BaseModelRead
from translation import TranslationService, TranslatorConfig
from pathlib import Path


router = APIRouter(prefix="/translation", tags=["Translation"])

_translation_service: Optional[TranslationService] = None


def get_translation_service() -> TranslationService:
    global _translation_service

    if _translation_service is None:
        project_root = Path(__file__).parent.parent
        base_model_path = project_root / "mbart"
        lora_dir = base_model_path / "loras"

        print(f"Инициализация TranslationService:")
        print(f"  Базовая модель: {base_model_path}")
        print(f"  LoRA адаптеры: {lora_dir}")

        _translation_service = TranslationService(
            base_model_path=base_model_path,
            lora_dir=lora_dir
        )

        print("✅ TranslationService инициализирован")

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