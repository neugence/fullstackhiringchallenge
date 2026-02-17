from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from typing import Optional
 
from app.schemas.post import PostUpdateSchema
from app.utils.dependencies import get_current_user, get_optional_user
from app.services.post_service import PostService

router = APIRouter(prefix="/api/posts", tags=["Posts"])

 
@router.post("/")
async def create_draft(user_id: str = Depends(get_current_user)):
    post_id = await PostService.create_draft(user_id)
    return {"_id": post_id, "message": "Draft created"}


 
@router.patch("/{post_id}")
async def update_post(
    post_id: str,
    update_data: PostUpdateSchema,
    user_id: str = Depends(get_current_user)
):
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=400, detail="Invalid ID")

    update_dict = update_data.model_dump(exclude_unset=True)
    success = await PostService.update_post(post_id, user_id, update_dict)

    if not success:
        raise HTTPException(status_code=404, detail="Post not found or unauthorized")

    return {"message": "Updated successfully"}

 
@router.get("/")
async def get_all_posts(user_id: str = Depends(get_current_user)):
    posts = await PostService.get_all_posts(user_id)
    return posts

 
@router.get("/{post_id}")
async def get_post(
    post_id: str,
    user_id: Optional[str] = Depends(get_optional_user)
):
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=400, detail="Invalid ID")

    post = await PostService.get_post(post_id, viewer_id=user_id)

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    return post

 
@router.post("/{post_id}/publish")
async def publish_post(
    post_id: str,
    user_id: str = Depends(get_current_user)
):
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=400, detail="Invalid ID")

    success = await PostService.publish_post(post_id, user_id)

    if not success:
        raise HTTPException(status_code=404, detail="Post not found or unauthorized")

    return {"status": "PUBLISHED"}

@router.delete("/{post_id}")
async def delete_post(
    post_id: str,
    user_id: str = Depends(get_current_user)
):
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=400, detail="Invalid ID")

    success = await PostService.delete_post(post_id, user_id)

    if not success:
        raise HTTPException(status_code=404, detail="Post not found or unauthorized to delete")

    return {"message": "Draft deleted successfully"}