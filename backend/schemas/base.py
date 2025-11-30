from pydantic import BaseModel
from typing import List, Dict, Any

class BaseModelRead(BaseModel):
    text_to_translated: str

class TranslationResponse(BaseModel):
    original: str
    translations: List[str]

class SentenceResponse(BaseModel):
    searched_word: str
    matches: List[Dict[str, Any]]