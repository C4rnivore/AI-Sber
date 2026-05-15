from fastapi import APIRouter

from api.dictionary import router as dictionary_router
from api.translation import router as translation_router
from api.tts import router as tts_router
from api.stt import router as stt_router
from api.ocr import router as ocr_router

api_router = APIRouter()
api_router.include_router(translation_router)
api_router.include_router(dictionary_router)
api_router.include_router(tts_router)
api_router.include_router(stt_router)
api_router.include_router(ocr_router)
