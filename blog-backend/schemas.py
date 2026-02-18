# schemas.py
from pydantic import BaseModel

class PostUpdate(BaseModel):
    content: str
