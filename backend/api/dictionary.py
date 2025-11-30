import os
import json
import re
from typing import List, Dict, Optional
from fastapi import APIRouter
from api.base import NotFoundException
from schemas.base import TranslationResponse
from schemas.base import SentenceResponse

router = APIRouter(prefix="/dictionary", tags=["Dictionary"])

DICTIONARY_FILE = "../model/finetuning/datasets/all_dicts.json"
SENTENCES_FILE = "../model/finetuning/datasets/aug_17_11.json"


def load_json(file) -> List[Dict[str, str]]:
    if not os.path.exists(file):
        raise RuntimeError(f"Файл {file} не найден")
    with open(file, "r", encoding="utf-8") as f:
        data = json.load(f)

    if not isinstance(data, list):
        raise RuntimeError("JSON должен быть массивом объектов")

    return data


dictionary = load_json(DICTIONARY_FILE)
sentences = load_json(SENTENCES_FILE)

@router.get(
    "/get-word",
    response_model=TranslationResponse,
    summary="Get translation word or words by word",
)
async def word_get(
        word: str,
) -> TranslationResponse:
    word_lower = word.lower()

    translations = set()
    found = False

    for entry in dictionary:
        trans = entry.get("translation", "").lower()
        orig = entry.get("original", "").lower()

        if trans == word_lower or (trans.startswith(word_lower + " ") or trans.endswith(" " + word_lower)):
            translations.add(entry["original"])
            found = True

        if orig == word_lower:
            translations.add(entry["translation"])
            found = True

    if not found and translations:
        for entry in dictionary:
            if word_lower in entry.get("translation", "").lower():
                translations.add(entry["original"])
            if word_lower in entry.get("original", "").lower():
                translations.add(entry["translation"])

    if not translations:
        raise NotFoundException(detail="Word not found")

    return TranslationResponse(
        original=word,
        translations=translations
    )

@router.get("/sentences", response_model=SentenceResponse)
async def get_sentences(
    word: str,
):
    clean_word = word.strip()
    pattern = re.compile(rf"\b{re.escape(clean_word)}\b", re.IGNORECASE)

    matches = []
    for entry in sentences:
        text_to_search = f"{entry['original']} {entry['translation']}".lower()

        if pattern.search(text_to_search):
            matches.append({
                "original": entry["original"],
                "translation": entry["translation"]
            })

        if len(matches) >= 10:
            break

    if not matches:
        raise NotFoundException(detail="No sentences with this word were found.")

    return SentenceResponse(
        searched_word=word,
        matches=matches[:10]
    )