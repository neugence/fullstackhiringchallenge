from pydantic import BaseModel
from typing import Optional, Any

class PostCreate(BaseModel):
    title: str
    content: Any 
    status: str = "draft"

class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[Any] = None
    status: Optional[str] = None
