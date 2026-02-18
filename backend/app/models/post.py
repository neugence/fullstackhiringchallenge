from pydantic import BaseModel, Field
from typing import Optional, Any
from datetime import datetime
from enum import Enum


class PostStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"


# what client sends when creating a post
class PostCreate(BaseModel):
    title: str = Field(default="Untitled")
    content: Optional[Any] = None  # lexical JSON state


# what client sends when updating a post (all fields optional)
class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[Any] = None  # lexical JSON state


# what we return to the client
class PostResponse(BaseModel):
    id: str
    title: str
    content: Optional[Any] = None
    status: PostStatus = PostStatus.DRAFT
    author_id: str = ""
    author_name: str = ""
    created_at: datetime
    updated_at: datetime


# used when listing posts (no full content needed)
class PostListItem(BaseModel):
    id: str
    title: str
    status: PostStatus
    author_name: str = ""
    created_at: datetime
    updated_at: datetime
