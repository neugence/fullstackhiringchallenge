"""
Configuration module for loading environment variables and application settings.
"""
from pydantic_settings import BaseSettings
from typing import Optional
from pathlib import Path

# Get the backend directory path
BACKEND_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = BACKEND_DIR / ".env"


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # MongoDB
    MONGO_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "smart_blog_editor"
    
    # JWT
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Google Gemini AI
    GEMINI_API_KEY: str
    
    # Application
    APP_NAME: str = "Smart Blog Editor API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    class Config:
        env_file = str(ENV_FILE)
        case_sensitive = True


# Global settings instance
settings = Settings()
