# main.py
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import os

from database import engine, SessionLocal, Base
import models
from schemas import PostUpdate

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS (allow all for demo / deployment)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# GET post (reload)
@app.get("/api/posts/{post_id}")
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    return post


# CREATE draft
@app.post("/api/posts")
def create_post(db: Session = Depends(get_db)):
    new_post = models.Post()
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post


# UPDATE content (auto-save)
@app.patch("/api/posts/{post_id}")
def update_post(
    post_id: int,
    payload: PostUpdate,
    db: Session = Depends(get_db)
):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    post.content = payload.content
    post.updated_at = datetime.utcnow()
    db.commit()

    return {"message": "Updated successfully"}


# PUBLISH post
@app.post("/api/posts/{post_id}/publish")
def publish_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    post.status = "published"
    post.updated_at = datetime.utcnow()
    db.commit()

    return {"message": "Post published"}


# For deployment safety (Render / others)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8000)),
    )
