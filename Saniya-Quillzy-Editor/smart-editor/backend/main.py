from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).resolve().parent / ".env")

from routes import auth, posts, drafts
from routes import ai

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(posts.router)
app.include_router(drafts.router)
app.include_router(ai.router)

