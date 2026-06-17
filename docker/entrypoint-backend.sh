#!/bin/sh
set -e

if [ -d "/models/mbart" ]; then
  mkdir -p /app/mbart
  cp -a /models/mbart/. /app/mbart/
fi

if [ -d "/models/ocr" ]; then
  mkdir -p /app/ocr
  cp -a /models/ocr/. /app/ocr/
fi

exec "$@"
