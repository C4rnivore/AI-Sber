from fastapi import APIRouter
from error import internal_server_error
from translation import router as translation_router

api_router = APIRouter(
    responses={
        **internal_server_error("Internal Server Error"),
    }
)

api_router.include_router(translation_router)
