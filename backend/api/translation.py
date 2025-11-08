from fastapi import APIRouter

from backend.api.base import NotFoundException
from backend.schems.base import BaseModelRead
from model.translation.translator import get_translator

router = APIRouter(prefix="/translation", tags=["Translation"])

@router.get(
    "/{translation_russian}",
    response_model=BaseModelRead,
    summary="Get russian translation by nani language",
)
async def get_russian_translation(
        nani_text: str,
) -> BaseModelRead:
    translator = get_translator()
    translation_rus = translator(nani_text)
    if not translation_rus.exists():
        raise NotFoundException(detail="Failed to translate")
    return BaseModelRead.model_validate(translation_rus)

@router.get(
    "/{translation_nani}",
    response_model=BaseModelRead,
    summary="Get nani translation by russian language",
)
async def get_nani_translation(
        russian_text: str,
) -> BaseModelRead:
    translator = get_translator()
    translation_nani = translator(russian_text)
    if not translation_nani.exists():
        raise NotFoundException(detail="Failed to translate")
    return BaseModelRead.model_validate(translation_nani)