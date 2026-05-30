from fastapi import HTTPException, APIRouter
from fastapi.responses import JSONResponse
from schemas.base import BaseModelRead
from translation.tts import get_tts_service

router = APIRouter(prefix="/tts", tags=["TTS"])

@router.get(
    "/nanai-tts",
    response_model=BaseModelRead,
    summary="Text to Speech from Nanai",
)
async def text_to_speech_nanai(nanai_text: str) -> BaseModelRead:
    if not nanai_text:
        raise HTTPException(status_code=400, detail="Текст не может быть пустым")
    try:
        audio_base64 = get_tts_service().text_to_audio_base64(nanai_text, "nanai")

        return JSONResponse({
            "audio": audio_base64
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get(
    "/russian-tts",
    response_model=BaseModelRead,
    summary="Text to Speech from Russian",
)
async def text_to_speech_ru(ru_text: str) -> BaseModelRead:
    if not ru_text:
        raise HTTPException(status_code=400, detail="Текст не может быть пустым")
    try:
        audio_base64 = get_tts_service().text_to_audio_base64(ru_text, "ru")

        return JSONResponse({
            "audio": audio_base64
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))