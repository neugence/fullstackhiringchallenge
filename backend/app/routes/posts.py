from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from ..models.post import PostCreate, PostUpdate, PostResponse
from ..services.post_service import post_service

router = APIRouter(prefix="/api/posts", tags=["posts"])

@router.post("/", response_model=PostResponse, status_code=201)
async def create_post(post: PostCreate):
    """Create a new post"""
    try:
        created_post = await post_service.create_post(post)
        return created_post
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[PostResponse])
async def get_posts(status: Optional[str] = Query(None, regex="^(draft|published)$")):
    """Get all posts, optionally filtered by status"""
    try:
        posts = await post_service.get_posts(status=status)
        return posts
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{post_id}", response_model=PostResponse)
async def get_post(post_id: str):
    """Get a single post by ID"""
    post = await post_service.get_post(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.patch("/{post_id}", response_model=PostResponse)
async def update_post(post_id: str, post_update: PostUpdate):
    """Update a post (used for auto-save)"""
    post = await post_service.update_post(post_id, post_update)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.post("/{post_id}/publish", response_model=PostResponse)
async def publish_post(post_id: str):
    """Publish a post"""
    post = await post_service.publish_post(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.delete("/{post_id}")
async def delete_post(post_id: str):
    """Delete a post"""
    success = await post_service.delete_post(post_id)
    if not success:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"message": "Post deleted successfully"}
