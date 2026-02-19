from pydantic import BaseModel, Field
from typing import Optional, Any
from datetime import datetime

class PostModel(BaseModel):
    title: str = "Initial Draft"
    content: Any  # This stores the Lexical JSON state
    status: str = "draft"  # draft | published
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

class UpdatePostModel(BaseModel):
    content: Optional[Any] = None
    title: Optional[str] = None
    status: Optional[str] = None
    updated_at: datetime = Field(default_factory=datetime.now)