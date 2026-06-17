from pathlib import Path
from fastapi import HTTPException, APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from PIL import Image
from io import BytesIO
from typing import Optional
from translation.ocr_service import OCRService

router = APIRouter(prefix="/ocr", tags=["OCR"])

_ocr_service: Optional[OCRService] = None


def get_ocr_service() -> OCRService:
    global _ocr_service
    if _ocr_service is None:
        project_root = Path(__file__).parent.parent
        model_path = project_root / "ocr"

        print("Инициализация OCRService:")
        print(f"OCR модель: {model_path}")

        _ocr_service = OCRService(
            model_path=str(model_path)
        )

        print("✅ OCRService инициализирован")

    return _ocr_service


@router.post('/ocr')
async def ocr(
        image: UploadFile = File(..., description="Фотография для распознавания")
):
    if not image:
        raise HTTPException(status_code=400, detail="Не найден файл для распознования")

    service = get_ocr_service()

    try:
        contents = await image.read()
        input_img = Image.open(BytesIO(contents)).convert("RGB")

        recognized_text = service.recognize_pil(input_img)

        return JSONResponse({'text': recognized_text})

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при обработке: {str(e)}")
