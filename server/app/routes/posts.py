from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.database.db import get_db
from app.models.post import Post

router = APIRouter(prefix="/api/posts", tags=["posts"])

class createPostRequest(BaseModel):
    title : Optional[str] ="untitled"

class updatePostRequest(BaseModel):
    title: Optional[str] = None
    content_json : Optional[str] = None


@router.get("")
def get_all_posts():
    db = get_db()
    posts = Post.get_all(db)
    db.close()
    return posts

@router.post("")
def create_post(request:createPostRequest):
    db = get_db()
    post_id = Post.create(db,request.title)
    post = Post.get_by_id(db,post_id)
    db.close()
    return post

@router.get("/{post_id}")
def get_post(post_id:str):
    db = get_db()
    post = Post.get_by_id(db,post_id)
    db.close()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.patch("/{post_id}")
def update_post(post_id:str,request:updatePostRequest):
    db = get_db()
    post = Post.get_by_id(db,post_id)

    if not post:
        db.close()
        raise HTTPException(status_code=404, detail="Post not found")
    Post.update(db,post_id,request.title,request.content_json)
    update_post = Post.get_by_id(db,post_id)
    db.close()
    return update_post

@router.post("/{post_id}/publish")
def publish_post(post_id: str):
    db = get_db()
    post = Post.get_by_id(db, post_id)
    
    if not post:
        db.close()
        raise HTTPException(status_code=404, detail="Post not found")
    
    Post.publish(db, post_id)
    updated_post = Post.get_by_id(db, post_id)
    db.close()
    return updated_post
