import os
import sys
import traceback
from contextlib import asynccontextmanager

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import api_router
from api.translation import get_translation_service
from api.ocr import get_ocr_service
from translation.stt import get_stt_service
from translation.tts import get_tts_service

load_dotenv("example.env")


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        print("Server starting")
        get_translation_service()
        get_ocr_service()
        get_tts_service()
        get_stt_service()
        print("Server ready")
    except Exception:
        print("Server error")
        traceback.print_exc()
        sys.exit(1)
    yield


app = FastAPI(
    title="AI-Sber Translation API",
    description="API для перевода текста между русским и нанайским языками",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=os.getenv("DEV_HOST"),
        port=int(os.getenv("DEV_PORT")),
        reload=False
    )
