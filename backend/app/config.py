import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    MONGODB_URL = os.getenv("MONGODB_URL")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 7 days
    FRONTEND_URL = os.getenv("FRONTEND_URL")

settings = Settings()