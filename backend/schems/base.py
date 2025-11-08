from pydantic import BaseModel


class BaseModelRead(BaseModel):
    text_to_translated: str