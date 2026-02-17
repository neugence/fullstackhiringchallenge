"""
Pydantic schemas for request/response validation.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict


class UserRegisterSchema(BaseModel):
    """Schema for user registration request."""
    
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., min_length=8, description="User password (min 8 characters)")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "email": "user@example.com",
                "password": "strongpassword123"
            }
        }
    )


class UserLoginSchema(BaseModel):
    """Schema for user login request."""
    
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., description="User password")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "email": "user@example.com",
                "password": "strongpassword123"
            }
        }
    )


class TokenSchema(BaseModel):
    """Schema for JWT token response."""
    
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer"
            }
        }
    )


class UserResponseSchema(BaseModel):
    """Schema for user data in responses."""
    
    id: str = Field(..., description="User ID")
    email: EmailStr = Field(..., description="User email address")
    created_at: datetime = Field(..., description="Account creation timestamp")
    is_active: bool = Field(..., description="Account active status")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "email": "user@example.com",
                "created_at": "2026-02-15T10:30:00",
                "is_active": True
            }
        }
    )


class MessageSchema(BaseModel):
    """Schema for simple message responses."""
    
    message: str = Field(..., description="Response message")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "message": "Operation completed successfully"
            }
        }
    )
