from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PostCreate(BaseModel):
    """Schema for creating a new post/draft."""

    title: Optional[str] = "Untitled"
    content: Optional[str] = "{}"


class PostUpdate(BaseModel):
    """Schema for updating (auto-saving) a post."""

    title: Optional[str] = None
    content: Optional[str] = None


class PostResponse(BaseModel):
    """Schema for post API responses."""

    id: int
    title: str
    content: str
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AISummarizeRequest(BaseModel):
    """Schema for AI summarize request."""

    text: str


class AISummarizeResponse(BaseModel):
    """Schema for AI summarize response."""

    summary: str
