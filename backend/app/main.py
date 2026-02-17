import json
from typing import Any

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import Base, engine, get_db
from .models import Post
from .schemas import (
    AIGenerateRequest,
    AIGenerateResponse,
    PostCreate,
    PostResponse,
    PostUpdate,
)

Base.metadata.create_all(bind=engine)

EMPTY_EDITOR_STATE = json.dumps(
    {
        "root": {
            "children": [
                {
                    "children": [],
                    "direction": None,
                    "format": "",
                    "indent": 0,
                    "type": "paragraph",
                    "version": 1,
                }
            ],
            "direction": None,
            "format": "",
            "indent": 0,
            "type": "root",
            "version": 1,
        }
    }
)

app = FastAPI(title="Neugence Assignment API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def lexical_json_to_text(serialized_content: str) -> str:
    try:
        parsed = json.loads(serialized_content)
    except json.JSONDecodeError:
        return serialized_content

    fragments: list[str] = []

    def walk(node: dict[str, Any]) -> None:
        node_type = node.get("type")
        if node_type == "text":
            fragments.append(node.get("text", ""))
        if node_type == "math":
            fragments.append(f"[math:{node.get('latex', '')}]")
        for child in node.get("children", []):
            if isinstance(child, dict):
                walk(child)

    root = parsed.get("root", {})
    walk(root if isinstance(root, dict) else {})
    return " ".join(part for part in fragments if part).strip()


@app.get("/api/posts/", response_model=list[PostResponse])
def list_posts(db: Session = Depends(get_db)) -> list[Post]:
    return db.query(Post).order_by(Post.updated_at.desc()).all()


@app.post("/api/posts/", response_model=PostResponse)
def create_post(payload: PostCreate, db: Session = Depends(get_db)) -> Post:
    post = Post(title=payload.title, content=EMPTY_EDITOR_STATE, status="draft")
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@app.patch("/api/posts/{post_id}", response_model=PostResponse)
def update_post(post_id: int, payload: PostUpdate, db: Session = Depends(get_db)) -> Post:
    post = db.query(Post).filter(Post.id == post_id).first()
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    if payload.title is not None:
        post.title = payload.title
    if payload.content is not None:
        post.content = payload.content
    db.commit()
    db.refresh(post)
    return post


@app.post("/api/posts/{post_id}/publish", response_model=PostResponse)
def publish_post(post_id: int, db: Session = Depends(get_db)) -> Post:
    post = db.query(Post).filter(Post.id == post_id).first()
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    post.status = "published"
    db.commit()
    db.refresh(post)
    return post


@app.post("/api/ai/generate", response_model=AIGenerateResponse)
def generate_with_ai(payload: AIGenerateRequest) -> AIGenerateResponse:
    plain_text = lexical_json_to_text(payload.content)
    if not plain_text:
        return AIGenerateResponse(output="No content available to summarize.")
    clipped = plain_text[:380]
    output = f"Summary: {clipped}" if payload.task == "summary" else clipped
    return AIGenerateResponse(output=output)
