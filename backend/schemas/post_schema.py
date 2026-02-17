"""
Pydantic schemas for post-related request/response validation.
"""
from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict


class PostCreateSchema(BaseModel):
    """Schema for creating a new post."""
    
    title: Optional[str] = Field(default="Untitled", description="Post title")
    content_json: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Lexical editor state")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "title": "My New Post",
                "content_json": {}
            }
        }
    )


class PostUpdateSchema(BaseModel):
    """Schema for updating an existing post."""
    
    title: Optional[str] = Field(None, description="Post title")
    content_json: Optional[Dict[str, Any]] = Field(None, description="Lexical editor state")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "title": "Updated Title",
                "content_json": {
                    "root": {
                        "children": [
                            {
                                "children": [
                                    {
                                        "detail": 0,
                                        "format": 0,
                                        "mode": "normal",
                                        "style": "",
                                        "text": "Hello World!",
                                        "type": "text",
                                        "version": 1
                                    }
                                ],
                                "direction": "ltr",
                                "format": "",
                                "indent": 0,
                                "type": "paragraph",
                                "version": 1
                            }
                        ],
                        "direction": "ltr",
                        "format": "",
                        "indent": 0,
                        "type": "root",
                        "version": 1
                    }
                }
            }
        }
    )


class PostResponseSchema(BaseModel):
    """Schema for post data in responses."""
    
    id: str = Field(..., description="Post ID")
    user_id: str = Field(..., description="User ID who created the post")
    title: str = Field(..., description="Post title")
    content_json: Dict[str, Any] = Field(..., description="Lexical editor state")
    status: str = Field(..., description="Post status (draft or published)")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "user_id": "507f1f77bcf86cd799439012",
                "title": "My Blog Post",
                "content_json": {},
                "status": "draft",
                "created_at": "2026-02-15T10:30:00",
                "updated_at": "2026-02-15T10:30:00"
            }
        }
    )


class PostListResponseSchema(BaseModel):
    """Schema for list of posts response."""
    
    posts: list[PostResponseSchema] = Field(..., description="List of posts")
    total: int = Field(..., description="Total number of posts")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "posts": [],
                "total": 0
            }
        }
    )
