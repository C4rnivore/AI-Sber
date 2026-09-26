# Запуск

- Установить [Poetry](https://python-poetry.org/docs/#installation) 2.5
- Установить зависимости **`poetry install`** (окружение создаётся в `.venv`)
- Запуск **`poetry run python main.py`**
- Тесты: **`poetry install --with dev`**, затем **`poetry run pytest`**

## Возможные ошибки:

- Failed to activate VS environment: Could not find ...\Microsoft Visual Studio\Installer\vswhere.exe
  - Скачать и установить Build Tools for VS [https://aka.ms/vs/stable/vs_BuildTools.exe]
