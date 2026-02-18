from datetime import datetime

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, Response, status
from pymongo.database import Database

from ..database import get_db
from ..deps import get_current_user
from ..schemas import PostCreateRequest, PostResponse, PostStatus, PostUpdateRequest

router = APIRouter(prefix="/api/posts", tags=["posts"])


def to_post_response(post: dict) -> PostResponse:
    return PostResponse(
        id=str(post["_id"]),
        title=post["title"],
        lexical_state=post.get("lexical_state", {}),
        text_content=post.get("text_content", ""),
        status=post["status"],
        created_at=post["created_at"],
        updated_at=post["updated_at"],
    )


@router.post("/", response_model=PostResponse)
def create_post(
    payload: PostCreateRequest,
    db: Database = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    now = datetime.utcnow()
    post = {
        "title": payload.title,
        "lexical_state": payload.lexical_state,
        "text_content": payload.text_content,
        "status": PostStatus.draft.value,
        "created_at": now,
        "updated_at": now,
        "user_id": user["_id"],
    }
    result = db.posts.insert_one(post)
    post["_id"] = result.inserted_id
    return to_post_response(post)


@router.get("/", response_model=list[PostResponse])
def list_posts(
    db: Database = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    posts = db.posts.find({"user_id": user["_id"]}).sort("updated_at", -1)
    return [to_post_response(post) for post in posts]


@router.patch("/{post_id}", response_model=PostResponse)
def update_post(
    post_id: str,
    payload: PostUpdateRequest,
    db: Database = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    try:
        post_object_id = ObjectId(post_id)
    except (InvalidId, TypeError) as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found") from exc

    post = db.posts.find_one({"_id": post_object_id, "user_id": user["_id"]})
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    updates: dict = {"updated_at": datetime.utcnow()}
    if payload.title is not None:
        updates["title"] = payload.title
    if payload.lexical_state is not None:
        updates["lexical_state"] = payload.lexical_state
    if payload.text_content is not None:
        updates["text_content"] = payload.text_content

    db.posts.update_one({"_id": post_object_id}, {"$set": updates})
    post = db.posts.find_one({"_id": post_object_id})
    return to_post_response(post)


@router.post("/{post_id}/publish", response_model=PostResponse)
def publish_post(
    post_id: str,
    db: Database = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    try:
        post_object_id = ObjectId(post_id)
    except (InvalidId, TypeError) as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found") from exc

    post = db.posts.find_one({"_id": post_object_id, "user_id": user["_id"]})
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    db.posts.update_one(
        {"_id": post_object_id},
        {"$set": {"status": PostStatus.published.value, "updated_at": datetime.utcnow()}},
    )
    post = db.posts.find_one({"_id": post_object_id})
    return to_post_response(post)


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: str,
    db: Database = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    try:
        post_object_id = ObjectId(post_id)
    except (InvalidId, TypeError) as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found") from exc

    result = db.posts.delete_one({"_id": post_object_id, "user_id": user["_id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    return Response(status_code=status.HTTP_204_NO_CONTENT)
