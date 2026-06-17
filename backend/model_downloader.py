import os
from pathlib import Path

import gdown

MODEL_REMOTE_URL = (
    "https://drive.google.com/drive/folders/"
    "1XcXWzn22uZ44z78yvxlyYKvMPPrC1riP?usp=sharing"
)
MODEL_REMOTE_OCR_URL = (
    "https://drive.google.com/drive/folders/"
    "1dZdLPX2-MYqRNLejVI4Ol4xtGxynOih0"
)


def _is_mbart_ready(path: Path) -> bool:
    return (path / "config.json").exists() or any(path.glob("*.safetensors"))


def _is_ocr_ready(path: Path) -> bool:
    return path.exists() and any(path.iterdir())


def download_models():
    """Download model weights from Google Drive."""
    download_mbart = os.getenv("DOWNLOAD_MBART", "1").lower() not in ("0", "false", "no")
    download_ocr = os.getenv("DOWNLOAD_OCR", "1").lower() not in ("0", "false", "no")

    mbart_path = Path(os.getenv("MBART_PATH", "mbart"))
    ocr_path = Path(os.getenv("OCR_PATH", "ocr"))

    if download_mbart:
        mbart_path.mkdir(parents=True, exist_ok=True)
        if _is_mbart_ready(mbart_path):
            print(f"Модель mbart уже есть в {mbart_path}, пропускаю загрузку")
        else:
            print("Скачиваю модель mbart из Google Drive...")
            gdown.download_folder(
                MODEL_REMOTE_URL,
                output=str(mbart_path),
                quiet=False,
                use_cookies=True,
            )
    else:
        print("DOWNLOAD_MBART=0 — пропускаю загрузку mbart")

    if download_ocr:
        ocr_path.mkdir(parents=True, exist_ok=True)
        if _is_ocr_ready(ocr_path):
            print(f"Модель OCR уже есть в {ocr_path}, пропускаю загрузку")
        else:
            print("Скачиваю модель OCR из Google Drive...")
            gdown.download_folder(
                MODEL_REMOTE_OCR_URL,
                output=str(ocr_path),
                quiet=False,
                use_cookies=True,
            )
    else:
        print("DOWNLOAD_OCR=0 — пропускаю загрузку OCR")


if __name__ == "__main__":
    download_models()
