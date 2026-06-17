import tempfile
from fastapi import HTTPException, APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from schemas.base import BaseModelRead
from translation.stt import get_stt_service

router = APIRouter(prefix="/stt", tags=["STT"])


@router.get(
    "/nanai-stt",
    response_model=BaseModelRead,
    summary="Speech to Text from Nanai",
)
async def speech_to_text_nanai(nanai_audio: str) -> BaseModelRead:
    if not nanai_audio:
        raise HTTPException(status_code=400, detail="Голосовое сообщение не может быть пустым")
    try:
        audio_base64 = get_stt_service().audio_to_text(nanai_audio, "gld_Cyrl")

        return JSONResponse({
            "text": audio_base64
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post('/russian-stt')
async def speech_to_text_ru(
        audio: UploadFile = File(..., description="Аудиофайл для распознавания")
):
    if not audio:
        raise HTTPException(status_code=400, detail="Нет аудиофайла")

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as tmp:
            contents = await audio.read()
            tmp.write(contents)
            tmp_path = tmp.name

        transcribe_audio = get_stt_service().audio_to_text(tmp_path)

        return JSONResponse(
            {
                'text': transcribe_audio
            })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при обработке: {str(e)}")
