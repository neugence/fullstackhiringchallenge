from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
import uuid

app = FastAPI()

# In-memory storage (temporary)
posts_db = {}

class Post(BaseModel):
    title: str
    content: str
    status: str = "draft"

@app.get("/")
def root():
    return {"message": "Smart Blog API Running 🚀"}

# Create Post
@app.post("/api/posts/")
def create_post(post: Post):
    post_id = str(uuid.uuid4())
    posts_db[post_id] = {
        "id": post_id,
        "title": post.title,
        "content": post.content,
        "status": post.status,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    return posts_db[post_id]

# Update Post
@app.patch("/api/posts/{post_id}")
def update_post(post_id: str, post: Post):
    if post_id not in posts_db:
        return {"error": "Post not found"}

    posts_db[post_id]["content"] = post.content
    posts_db[post_id]["updated_at"] = datetime.utcnow()

    return posts_db[post_id]

# Publish Post
@app.post("/api/posts/{post_id}/publish")
def publish_post(post_id: str):
    if post_id not in posts_db:
        return {"error": "Post not found"}

    posts_db[post_id]["status"] = "published"
    posts_db[post_id]["updated_at"] = datetime.utcnow()

    return posts_db[post_id]
