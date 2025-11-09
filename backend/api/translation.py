from fastapi import APIRouter

from backend.api.base import NotFoundException
from backend.schems.base import BaseModelRead
from model.translation.translator import Translator

router = APIRouter(prefix="/translation", tags=["Translation"])

@router.get(
    "/{translation_russian}",
    response_model=BaseModelRead,
    summary="Get russian translation by nanai language",
)
async def get_russian_translation(
        nanai_text: str,
) -> BaseModelRead:
    translator = Translator(target_language="nanai")
    translation_rus = translator.translate(nanai_text)
    if not translation_rus:
        raise NotFoundException(detail="Failed to translate")
    return BaseModelRead.model_validate(translation_rus)

@router.get(
    "/{translation_nanai}",
    response_model=BaseModelRead,
    summary="Get nanai translation by russian language",
)
async def get_nanai_translation(
        russian_text: str,
) -> BaseModelRead:
    translator = Translator(target_language="russian")
    translation_nanai = translator.translate(russian_text)
    if not translation_nanai:
        raise NotFoundException(detail="Failed to translate")
    return BaseModelRead.model_validate(translation_nanai)