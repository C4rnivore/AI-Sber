import gdown
import os

MODEL_REMOTE_URL = "https://drive.google.com/drive/folders/1XcXWzn22uZ44z78yvxlyYKvMPPrC1riP?usp=sharing"
MODEL_LOCAL_PATH = "mbart"
os.makedirs(MODEL_LOCAL_PATH, exist_ok=True)

def download_model():
    print("Скачиваю модель из Google Drive...")
    gdown.download_folder(
        MODEL_REMOTE_URL,
        output=MODEL_LOCAL_PATH,
        quiet=False,
        use_cookies=True,
        remaining_ok=True
    )

download_model()