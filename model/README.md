# Установка

Отдельный проект Poetry, не общий с `backend/`:

```bash
poetry install
poetry run python -m finetuning.finetune
```

# 1. Основные директории

- **`finetuning/`** — основной код для обучения и файнтюнинга модели.  
  Вся логика обучения разделена на три файла:

  - **`finetuning.py`** — основной скрипт запуска обучения.  
    Проведён небольшой рефакторинг: часть функций вынесена в отдельные файлы, добавлена поддержка конфигурации через `finetune_cfg.yaml`.
  - **`preprocessor.py`** — функции для препроцессинга и очистки датасета перед обучением.
  - **`utils.py`** — вспомогательные функции (инициализация NLTK, лемматизация, утилиты и пр.).

- **`finetuning/datasets/`** — папка с исходными и аугментированными датасетами для обучения.

- **`models/`** — все сохранённые и кэшированные модели:
  - **`/core-model`** — базовая модель, используемая для дальнейших экспериментов и интеграции в проект.
  - **`/ft`** — модели, полученные после файнтюнинга.
    > ⚠️ Эта директория добавлена в `.gitignore`, чтобы не пушить в репозиторий тяжёлые файлы (несколько ГБ).
  - **`/hf`** — кэш моделей с Hugging Face.
    > ⚠️ Также игнорируется в `.gitignore`.

---

# 2. Конфигурация

Конфигурация обучения хранится в файле: **`finetuning/fintune_cfg.yaml`**

По умолчанию используется **`finetune_cfg.yaml`**, который необходимо создать на основе файла **`finetune_cfg.example.yaml`**, если его не создать, то будет ипользоваться **example** - файл.


## ⚙️ Структура конфигурационного файла `finetune_cfg.yaml`

Файл **`finetuning/finetune_cfg.yaml`** используется для управления всеми параметрами процесса обучения, токенизации и настройки LoRA.  
Он разделён на несколько логических блоков: `paths`, `training`, `tokenizer` и `lora`.  
Ниже приведено описание каждого поля.

---

### 📂 `paths`

Пути к основным директориям и файлам, используемым при обучении модели.

| Ключ | Описание | Пример |
|------|-----------|--------|
| `MODEL_ID` | Идентификатор базовой модели на Hugging Face (или путь к локальной модели) | `facebook/mbart-large-50-many-to-many-mmt` |
| `DATA_PATH` | Путь к датасету в формате `.json`, используемому для обучения | `finetuning/datasets/augmented_all.json` |
| `CACHE_DIR` | Папка для кэша моделей Hugging Face (где сохраняются загруженные веса и токенайзеры) | `models/hf/facebook/mbart-large-50-many-to-many-mmt` |
| `OUTPUT_DIR` | Папка, в которую сохраняются результаты обучения и файнтюнинга модели | `models/ft/nanai_lora-facebook/mbart-large-50-many-to-many-mmt` |

---

### 🧠 `training`

Гиперпараметры и настройки процесса обучения.

| Ключ | Описание | Пример |
|------|-----------|--------|
| `BATCH_SIZE` | Размер батча (количество примеров за одну итерацию) | `8` |
| `GRADIENT_ACCUMULATION_STEPS` | Количество шагов аккумуляции градиентов перед обновлением весов (для экономии VRAM) | `4` |
| `EPOCHS` | Количество эпох обучения | `10` |
| `LEARNING_RATE` | Начальная скорость обучения | `5e-4` |
| `EVAL_STEPS` | Частота валидации модели (через сколько шагов проводить оценку) | `1000` |
| `SAVE_STEPS` | Частота сохранения чекпоинтов | `1000` |
| `LOGGING_STEPS` | Частота логирования метрик и информации об обучении | `100` |
| `SAVE_TOTAL_LIMIT` | Максимальное количество сохраняемых чекпоинтов (старые удаляются) | `2` |
| `GENERATION_MAX_LENGTH` | Максимальная длина генерируемой последовательности при оценке | `128` |
| `GENERATION_NUM_BEAMS` | Количество лучей (beam search) при генерации | `1` |
| `LR_SCHEDULER_TYPE` | Тип планировщика скорости обучения (`linear`, `cosine`, `constant` и др.) | `"cosine"` |
| `WARMUP_STEPS` | Количество шагов прогрева перед основным обучением (LR постепенно увеличивается) | `500` |

---

### ✂️ `tokenizer`

Параметры токенизатора и препроцессинга данных.

| Ключ | Описание | Пример |
|------|-----------|--------|
| `SRC_LANG` | Код исходного языка (используется для моделей типа mBART) | `"en_XX"` |
| `TGT_LANG` | Код целевого языка (для перевода или генерации текста) | `"ru_RU"` |
| `MAX_LENGTH` | Максимальная длина токенизированной последовательности | `128` |
| `LEMMATIZE` | Флаг применения лемматизации к текстам в датасете (`true`/`false`) | `false` |

---

### 🔧 `lora`

Настройки **LoRA (Low-Rank Adaptation)** для эффективного файнтюнинга модели.

| Ключ | Описание | Пример |
|------|-----------|--------|
| `R` | Ранг матрицы адаптации LoRA (определяет размерность аппроксимации) | `8` |
| `LORA_ALPHA` | Коэффициент масштабирования LoRA | `32` |
| `TARGET_MODULES` | Список модулей модели, к которым применяется LoRA (например, `q_proj`, `v_proj`) | `["q_proj", "v_proj"]` |
| `LORA_DROPOUT` | Вероятность дропаута внутри адаптационных слоёв LoRA | `0.1` |
| `BIAS` | Параметр для управления обучением смещений (`"none"`, `"all"`, `"lora_only"`) | `"none"` |

---

### 🧩 Пример файла `finetune_cfg.yaml`

```yaml
paths:
  MODEL_ID: facebook/mbart-large-50-many-to-many-mmt
  DATA_PATH: finetuning/datasets/augmented_all.json
  CACHE_DIR: models/hf/facebook/mbart-large-50-many-to-many-mmt
  OUTPUT_DIR: models/ft/nanai_lora-facebook/mbart-large-50-many-to-many-mmt

training:
  BATCH_SIZE: 8
  GRADIENT_ACCUMULATION_STEPS: 4
  EPOCHS: 10
  LEARNING_RATE: 5e-4
  EVAL_STEPS: 1000
  SAVE_STEPS: 1000
  LOGGING_STEPS: 100
  SAVE_TOTAL_LIMIT: 2
  GENERATION_MAX_LENGTH: 128
  GENERATION_NUM_BEAMS: 1
  LR_SCHEDULER_TYPE: "cosine"
  WARMUP_STEPS: 500

tokenizer:
  SRC_LANG: "en_XX"
  TGT_LANG: "ru_RU"
  MAX_LENGTH: 128
  LEMMATIZE: false

lora:
  R: 8
  LORA_ALPHA: 32
  TARGET_MODULES: ["q_proj", "v_proj"]
  LORA_DROPOUT: 0.1
  BIAS: "none"
