from datetime import datetime

from pydantic import BaseModel


class PostCreate(BaseModel):
    title: str = "Untitled draft"


class PostUpdate(BaseModel):
    title: str | None = None
    content: str | None = None


class PostResponse(BaseModel):
    id: int
    title: str
    content: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class AIGenerateRequest(BaseModel):
    task: str = "summary"
    content: str


class AIGenerateResponse(BaseModel):
    output: str
