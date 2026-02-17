"""
Routes for blog post management.
"""
from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime
from bson import ObjectId
from typing import List

from ..schemas.post_schema import (
    PostCreateSchema,
    PostUpdateSchema,
    PostResponseSchema,
    PostListResponseSchema
)
from ..models.post_model import PostModel
from ..models.user_model import UserModel
from ..db.database import get_database
from ..dependencies.auth_dependency import get_current_user


router = APIRouter(prefix="/api/posts", tags=["Posts"])


def post_to_response(post_dict: dict) -> PostResponseSchema:
    """Convert MongoDB post document to response schema."""
    return PostResponseSchema(
        id=str(post_dict["_id"]),
        user_id=str(post_dict["user_id"]),
        title=post_dict["title"],
        content_json=post_dict["content_json"],
        status=post_dict["status"],
        created_at=post_dict["created_at"],
        updated_at=post_dict["updated_at"]
    )


@router.post("/", response_model=PostResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_post(
    post_data: PostCreateSchema,
    current_user: UserModel = Depends(get_current_user)
):
    """
    Create a new blog post (draft by default).
    
    Args:
        post_data: Post creation data
        current_user: Current authenticated user
        
    Returns:
        Newly created post information
    """
    db = get_database()
    
    # Get user_id as ObjectId
    user_object_id = ObjectId(str(current_user.id))
    
    # Create new post
    new_post = PostModel(
        user_id=user_object_id,  # type: ignore
        title=post_data.title or "Untitled",
        content_json=post_data.content_json or {},
        status="draft",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    # Insert into database
    post_dict = new_post.model_dump(by_alias=True, exclude={"id"})
    # Convert user_id back to ObjectId for MongoDB storage
    post_dict["user_id"] = user_object_id
    result = await db["posts"].insert_one(post_dict)
    
    # Fetch the created post
    created_post = await db["posts"].find_one({"_id": result.inserted_id})
    
    return post_to_response(created_post)


@router.get("/", response_model=PostListResponseSchema)
async def get_all_posts(
    current_user: UserModel = Depends(get_current_user)
):
    """
    Get all posts for the current logged-in user.
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        List of user's posts with total count
    """
    db = get_database()
    
    # Find all posts by current user
    user_id_str = str(current_user.id)
    cursor = db["posts"].find({"user_id": ObjectId(user_id_str)}).sort("updated_at", -1)
    posts = await cursor.to_list(length=None)
    
    # Convert to response schema
    post_responses = [post_to_response(post) for post in posts]
    
    return PostListResponseSchema(
        posts=post_responses,
        total=len(post_responses)
    )


@router.get("/{post_id}", response_model=PostResponseSchema)
async def get_post(
    post_id: str,
    current_user: UserModel = Depends(get_current_user)
):
    """
    Get a single post by ID (only if owned by current user).
    
    Args:
        post_id: Post ID
        current_user: Current authenticated user
        
    Returns:
        Post information
        
    Raises:
        HTTPException: 404 if post not found, 403 if not owner
    """
    db = get_database()
    
    # Validate ObjectId
    if not ObjectId.is_valid(post_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid post ID format"
        )
    
    # Find post
    post = await db["posts"].find_one({"_id": ObjectId(post_id)})
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Verify ownership
    if str(post["user_id"]) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to access this post"
        )
    
    return post_to_response(post)


@router.patch("/{post_id}", response_model=PostResponseSchema)
async def update_post(
    post_id: str,
    post_data: PostUpdateSchema,
    current_user: UserModel = Depends(get_current_user)
):
    """
    Update a post's title or content (only if owned by current user).
    
    Args:
        post_id: Post ID
        post_data: Update data
        current_user: Current authenticated user
        
    Returns:
        Updated post information
        
    Raises:
        HTTPException: 404 if post not found, 403 if not owner
    """
    db = get_database()
    
    # Validate ObjectId
    if not ObjectId.is_valid(post_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid post ID format"
        )
    
    # Find post
    post = await db["posts"].find_one({"_id": ObjectId(post_id)})
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Verify ownership
    if str(post["user_id"]) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to update this post"
        )
    
    # Build update data
    update_data: dict = {"updated_at": datetime.utcnow()}
    
    if post_data.title is not None:
        update_data["title"] = post_data.title
    
    if post_data.content_json is not None:
        update_data["content_json"] = post_data.content_json
    
    # Update post
    await db["posts"].update_one(
        {"_id": ObjectId(post_id)},
        {"$set": update_data}
    )
    
    # Fetch updated post
    updated_post = await db["posts"].find_one({"_id": ObjectId(post_id)})
    
    return post_to_response(updated_post)


@router.post("/{post_id}/publish", response_model=PostResponseSchema)
async def publish_post(
    post_id: str,
    current_user: UserModel = Depends(get_current_user)
):
    """
    Publish a post (change status to 'published').
    
    Args:
        post_id: Post ID
        current_user: Current authenticated user
        
    Returns:
        Updated post information
        
    Raises:
        HTTPException: 404 if post not found, 403 if not owner
    """
    db = get_database()
    
    # Validate ObjectId
    if not ObjectId.is_valid(post_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid post ID format"
        )
    
    # Find post
    post = await db["posts"].find_one({"_id": ObjectId(post_id)})
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Verify ownership
    if str(post["user_id"]) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to publish this post"
        )
    
    # Update to published
    await db["posts"].update_one(
        {"_id": ObjectId(post_id)},
        {"$set": {"status": "published", "updated_at": datetime.utcnow()}}
    )
    
    # Fetch updated post
    updated_post = await db["posts"].find_one({"_id": ObjectId(post_id)})
    
    return post_to_response(updated_post)
