from datetime import datetime
from enum import Enum

from pydantic import BaseModel, EmailStr, Field


class PostStatus(str, Enum):
    draft = "draft"
    published = "published"


class UserSignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)


class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class PostCreateRequest(BaseModel):
    title: str = "Untitled"
    lexical_state: dict = Field(default_factory=dict)
    text_content: str = ""


class PostUpdateRequest(BaseModel):
    title: str | None = None
    lexical_state: dict | None = None
    text_content: str | None = None


class PostResponse(BaseModel):
    id: str
    title: str
    lexical_state: dict
    text_content: str
    status: PostStatus
    created_at: datetime
    updated_at: datetime


class AIGenerateRequest(BaseModel):
    mode: str = Field(pattern="^(summary|grammar)$")
    text: str = Field(min_length=1)


class AIChunkResponse(BaseModel):
    chunk: str
