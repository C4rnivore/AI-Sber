from fastapi import APIRouter
from api.translation import router as translation_router

api_router = APIRouter()
api_router.include_router(translation_router)
