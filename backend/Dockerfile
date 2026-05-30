FROM python:3.11-slim-bookworm

WORKDIR /app

# Без apt-get: в Docker-сборке deb.debian.org часто недоступен (VPN/фаервол).
# libsndfile поставляется внутри wheels пакета soundfile (зависимость librosa).

COPY backend/requirements.txt ./requirements.txt

# CPU-only PyTorch (~200 MB instead of ~4 GB with CUDA) — достаточно для inference без GPU
RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu \
    && sed '/^torch/d' requirements.txt > requirements.docker.txt \
    && pip install --no-cache-dir -r requirements.docker.txt

COPY backend/ .
COPY model/finetuning/datasets /model/finetuning/datasets
COPY docker/entrypoint-backend.sh /entrypoint.sh
RUN sed -i 's/\r$//' /entrypoint.sh && chmod +x /entrypoint.sh

ENV PYTHONUNBUFFERED=1 \
    HF_HOME=/root/.cache/huggingface \
    TRANSFORMERS_CACHE=/root/.cache/huggingface \
    DEV_HOST=0.0.0.0 \
    DEV_PORT=8000

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
