import uvicorn
import sys
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from dotenv import load_dotenv
from api import api_router
from api.translation import get_translation_service
from fastapi.middleware.cors import CORSMiddleware


load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Управление жизненным циклом приложения.
    Загружает модели при старте и очищает ресурсы при остановке.
    """
    try:
        print("Server starting")
        get_translation_service()
        print("Server ready")
    except Exception as e:
        print("Server error")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    yield


app = FastAPI(
    title="AI-Sber Translation API",
    description="API для перевода текста между русским и нанайским языками",
    version="1.0.0",
    lifespan=lifespan
)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

if __name__ == "__main__":
    uvicorn.run("main:app", host=os.getenv("DEV_HOST"), port=int(os.getenv("DEV_PORT")), reload=False)