from fastapi import APIRouter, Depends, HTTPException, status
from core.security import get_current_user
from models.post import PostCreate, PostUpdate
from services.post_service import (
    db_create_post, 
    db_get_posts, 
    db_update_post, 
    db_delete_post
)

router = APIRouter(prefix="/api/posts", tags=["Posts"])

@router.post("/", status_code=201)
async def create_post(post: PostCreate, current_user: str = Depends(get_current_user)):
    return db_create_post(post, current_user)

@router.get("/")
async def get_posts():
    return db_get_posts()

@router.patch("/{id}")
async def update_post(id: str, post: PostUpdate, current_user: str = Depends(get_current_user)):
    success = db_update_post(id, post)
    if not success:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"message": "Post updated successfully"}

@router.delete("/{id}")
async def delete_post(id: str, current_user: str = Depends(get_current_user)):
    success = db_delete_post(id)
    if not success:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"message": "Post deleted successfully"}
