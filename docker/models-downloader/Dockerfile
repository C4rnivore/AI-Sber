FROM python:3.11-slim-bookworm

WORKDIR /app

RUN pip install --no-cache-dir "gdown>=5.2.0"

COPY backend/model_downloader.py .

CMD ["python", "model_downloader.py"]
