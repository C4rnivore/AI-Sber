import json
import string

NANAI_FILE_PATH = 'test_nan.txt'
RUSSIAN_FILE_PATH = 'test_rus.txt'
OUTPUT_FILE_PATH = '1992_Кеста_partial.json'


def clean_text(text):
    # Убираем пунктуацию и скобки, но оставляем дефис
    punctuation = string.punctuation.replace('-', '') + '«»„“""()[]{}'
    translator = str.maketrans('', '', punctuation)
    text = text.translate(translator)
    # Убираем табы и лишние пробелы, приводим к нижнему регистру
    return text.replace('\t', ' ').lower().strip()

# Читаем и очищаем файлы
with open(NANAI_FILE_PATH, 'r', encoding='utf-8') as f:
    nanai_lines = [clean_text(line) for line in f if line.strip() and line.strip() not in ['***', '---']]

with open(RUSSIAN_FILE_PATH, 'r', encoding='utf-8') as f:
    russian_lines = [clean_text(line) for line in f if line.strip() and line.strip() not in ['***', '---']]

# Убираем пустые строки после очистки
nanai_lines = [line for line in nanai_lines if line]
russian_lines = [line for line in russian_lines if line]

# Проверяем количество строк
if len(nanai_lines) != len(russian_lines):
    print(f"ВНИМАНИЕ: разное количество строк! Нанайских: {len(nanai_lines)}, Русских: {len(russian_lines)}")
    min_len = min(len(nanai_lines), len(russian_lines))
    nanai_lines = nanai_lines[:min_len]
    russian_lines = russian_lines[:min_len]

# Создаем JSON
dataset = []
for i in range(len(nanai_lines)):
    dataset.append({
        "original": nanai_lines[i],
        "translation": russian_lines[i]
    })

# Сохраняем
with open(OUTPUT_FILE_PATH, 'w', encoding='utf-8') as f:
    json.dump(dataset, f, ensure_ascii=False, indent=2)

seen = set()
dataset_unique = []
for item in dataset:
    pair = (item['original'], item['translation'])
    if pair not in seen:
        seen.add(pair)
        dataset_unique.append(item)

dataset = dataset_unique

print(f"✅ Готово! Создано {len(dataset)} пар")
print("Файл: dictionary.json")