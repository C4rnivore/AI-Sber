import json
import string

FILE_PATH = '2009_text1.txt'
OUTPUT_FILE_PATH = '2009_text1_dictionary.json'

def clean_text(text):
    # Убираем пунктуацию и скобки, но оставляем дефис
    punctuation = string.punctuation.replace('-', '') + '«»„“""()[]{}'
    translator = str.maketrans('', '', punctuation)
    text = text.translate(translator)
    # Убираем табы и лишние пробелы, приводим к нижнему регистру
    return text.replace('\t', ' ').lower().strip()

with open(FILE_PATH, 'r', encoding='utf-8') as f:
    lines = [clean_text(line) for line in f if line.strip()]

dataset = []
for i in range(0, len(lines)-1, 2):  # шаг 2: нанайский->русский
    if lines[i] and lines[i+1]:  # если обе строки не пустые
        dataset.append({
            "original": lines[i],
            "translation": lines[i+1]
        })

# Убираем дубликаты
seen = set()
dataset_unique = []
for item in dataset:
    pair = (item['original'], item['translation'])
    if pair not in seen:
        seen.add(pair)
        dataset_unique.append(item)

with open(OUTPUT_FILE_PATH, 'w', encoding='utf-8') as f:
    json.dump(dataset_unique, f, ensure_ascii=False, indent=2)

print(f"Создано {len(dataset_unique)} уникальных пар")