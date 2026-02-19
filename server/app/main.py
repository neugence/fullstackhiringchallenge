from dotenv import load_dotenv
import os
from pathlib import Path

_env_dir = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=_env_dir / ".env", override=True)
load_dotenv(override=True)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.db import init_db
from app.routes import posts, ai

app = FastAPI(
    title="Blog Editor",
    description="API for a blog editor",
    version="1.0.0"
)

_cors_origins = [
    o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",") if o.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins if _cors_origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()

app.include_router(posts.router)
app.include_router(ai.router)

@app.get("/")
def root():
    return {
        "message": "Blog Editor  is running",
        "docs": "/docs",
        "status": "healthy"
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}
