from typing import Literal

class TranslatorConfig:
    def __init__(self, hugging_face_token:str, model_id: str,  cache_dir: str, lora_dir: str, filenames: list[str], target_language: Literal["russian", "nanai"] = "russian",):
        self.hugging_face_token = hugging_face_token
        self.model_id = model_id
        self.cache_dir = cache_dir
        self.lora_dir = lora_dir
        self.filenames = filenames
        self.target_language = target_language