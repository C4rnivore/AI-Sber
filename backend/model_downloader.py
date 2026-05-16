import os

import gdown

MODEL_REMOTE_URL = (
    "https://drive.google.com/drive/folders/"
    "1XcXWzn22uZ44z78yvxlyYKvMPPrC1riP?usp=sharing"
)
MODEL_LOCAL_PATH = "mbart"

MODEL_REMOTE_OCR_URL = (
    "https://drive.google.com/drive/folders/"
    "1dZdLPX2-MYqRNLejVI4Ol4xtGxynOih0"
)

MODEL_LOCAL_OCR_PATH = "ocr"

def download_models():
    """Download model from Google Drive."""
    os.makedirs(MODEL_LOCAL_PATH, exist_ok=True)
    print("Скачиваю модель mbart из Google Drive...")
    gdown.download_folder(
        MODEL_REMOTE_URL,
        output=MODEL_LOCAL_PATH,
        quiet=False,
        use_cookies=True,
        remaining_ok=True
    )

    os.makedirs(MODEL_LOCAL_OCR_PATH, exist_ok=True)
    print("Скачиваю модель ocr из Google Drive...")
    gdown.download_folder(
        MODEL_REMOTE_OCR_URL,
        output=MODEL_LOCAL_OCR_PATH,
        quiet=False,
        use_cookies=True,
        remaining_ok=True
    )


if __name__ == "__main__":
    download_models()
