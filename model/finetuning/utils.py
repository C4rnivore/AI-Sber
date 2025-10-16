import nltk
import yaml
import pymorphy3
from finetuning.preprocessor import preprocess_nanai_text, smart_preprocess_russian_text

def init_nltk():
    try:
        nltk.data.find('tokenizers/punkt')
        nltk.data.find('tokenizers/punkt_tab')
        nltk.data.find('wordnet')
        nltk.data.find('omw-1.4')
    except LookupError:
        nltk.download('punkt')
        nltk.download('punkt_tab')
        nltk.download('wordnet')
        nltk.download('omw-1.4')

def load_config(config_path):
    try:
        config = yaml.safe_load(open(config_path))
    except Exception as e:
        print(f"[Warning] Failed to load config file, using example config...")
        config = yaml.safe_load(open("finetuning/finetune_cfg.example.yaml"))
    return config

morph_analyzer_ru = pymorphy3.MorphAnalyzer()  # для русского
def lemmatize_dataset(batch):
    processed_batch = {"original": [], "translation": []}

    for orig, trans in zip(batch["original"], batch["translation"]):
        # Нанайский - полная лемматизация
        processed_orig = preprocess_nanai_text(orig)
        # Русский - частичная лемматизация (50%)
        processed_trans = smart_preprocess_russian_text(trans, lemmatize_ratio=0.5)

        processed_batch["original"].append(processed_orig)
        processed_batch["translation"].append(processed_trans)

    return processed_batch
