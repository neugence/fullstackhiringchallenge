"""
Database models for Post collection.
"""
from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from bson import ObjectId
from .user_model import PyObjectId


class PostModel(BaseModel):
    """Post database model representing a blog post in MongoDB."""
    
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    user_id: PyObjectId = Field(..., description="ID of the user who created the post")
    title: str = Field(default="Untitled", description="Post title")
    content_json: Dict[str, Any] = Field(default_factory=dict, description="Lexical editor state as JSON")
    status: str = Field(default="draft", description="Post status: draft or published")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat()
        }
        json_schema_extra = {
            "example": {
                "user_id": "507f1f77bcf86cd799439011",
                "title": "My First Blog Post",
                "content_json": {
                    "root": {
                        "children": [],
                        "direction": "ltr",
                        "format": "",
                        "indent": 0,
                        "type": "root",
                        "version": 1
                    }
                },
                "status": "draft",
                "created_at": "2026-02-15T10:30:00",
                "updated_at": "2026-02-15T10:30:00"
            }
        }
