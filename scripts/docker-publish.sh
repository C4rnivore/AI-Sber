#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

if [[ -z "${DOCKERHUB_USERNAME:-}" ]]; then
  DOCKERHUB_USERNAME="$(docker info 2>/dev/null | awk -F': ' '/Username:/ {print $2; exit}')"
fi

if [[ -z "${DOCKERHUB_USERNAME:-}" ]] && command -v docker-credential-desktop >/dev/null 2>&1; then
  DOCKERHUB_USERNAME="$(
    echo "https://index.docker.io/v1/" \
      | docker-credential-desktop get 2>/dev/null \
      | python3 -c "import sys,json; print(json.load(sys.stdin).get('Username',''))" 2>/dev/null \
      || true
  )"
fi

if [[ -z "${DOCKERHUB_USERNAME:-}" ]]; then
  echo "Укажите логин Docker Hub одним из способов:"
  echo "  export DOCKERHUB_USERNAME=ваш-логин"
  echo "  echo 'DOCKERHUB_USERNAME=ваш-логин' >> .env"
  echo "  docker login   # скрипт подхватит Username автоматически"
  exit 1
fi

echo "Docker Hub: ${DOCKERHUB_USERNAME}"

echo "Сборка образов..."
docker compose build

echo "Тегирование и публикация на Docker Hub..."
for service in backend frontend models; do
  docker tag "ai-sber-${service}" "${DOCKERHUB_USERNAME}/ai-sber-${service}:latest"
  docker push "${DOCKERHUB_USERNAME}/ai-sber-${service}:latest"
done

echo "Готово. Образы доступны:"
echo "  ${DOCKERHUB_USERNAME}/ai-sber-backend:latest"
echo "  ${DOCKERHUB_USERNAME}/ai-sber-frontend:latest"
echo "  ${DOCKERHUB_USERNAME}/ai-sber-models:latest"
