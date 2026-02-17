from pydantic import BaseModel

class AIRequest(BaseModel):
    text: str

class AIGenerateRequest(BaseModel):
    text: str
    action: str