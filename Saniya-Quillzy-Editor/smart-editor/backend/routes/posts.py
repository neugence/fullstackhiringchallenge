from fastapi import APIRouter, HTTPException, Depends
from database import db
from bson import ObjectId
from datetime import datetime
from routes.auth import get_current_user

router = APIRouter(prefix="/api/posts")


@router.post("/")
def create_post(body: dict = None, current_user: dict = Depends(get_current_user)):
    """Create a new draft post linked to the authenticated user."""
    post = {
        "content": body.get("content", "") if body else "",
        "plain_text": body.get("plain_text", "") if body else "",
        "title": body.get("title", "Untitled") if body else "Untitled",
        "word_count": body.get("word_count", 0) if body else 0,
        "status": "draft",
        "user_email": current_user["email"],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    result = db.posts.insert_one(post)
    return {"_id": str(result.inserted_id), "message": "Draft created"}


@router.patch("/{post_id}")
def update_post(post_id: str, body: dict, current_user: dict = Depends(get_current_user)):
    """Update content of an existing post (Auto-save hits this)."""
    try:
        # Verify the post belongs to this user
        post = db.posts.find_one({"_id": ObjectId(post_id), "user_email": current_user["email"]})
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")

        update_data = {
            "updated_at": datetime.utcnow()
        }
        if "content" in body:
            update_data["content"] = body["content"]
        if "plain_text" in body:
            update_data["plain_text"] = body["plain_text"]
        if "title" in body:
            update_data["title"] = body["title"]
        if "word_count" in body:
            update_data["word_count"] = body["word_count"]

        db.posts.update_one(
            {"_id": ObjectId(post_id)},
            {"$set": update_data}
        )

        return {
            "_id": post_id,
            "message": "Updated",
            "saved_at": datetime.utcnow().isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{post_id}/publish")
def publish_post(post_id: str, current_user: dict = Depends(get_current_user)):
    """Change post status from draft to published."""
    try:
        post = db.posts.find_one({"_id": ObjectId(post_id), "user_email": current_user["email"]})
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")

        if post.get("status") == "published":
            return {"_id": post_id, "message": "Already published", "status": "published"}

        db.posts.update_one(
            {"_id": ObjectId(post_id)},
            {"$set": {
                "status": "published",
                "published_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }}
        )
        return {
            "_id": post_id,
            "message": "Post published successfully",
            "status": "published",
            "published_at": datetime.utcnow().isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/")
def list_posts(current_user: dict = Depends(get_current_user)):
    """List all posts for the logged-in user, sorted by most recently updated."""
    posts = list(
        db.posts.find({"user_email": current_user["email"]})
        .sort("updated_at", -1)
        .limit(20)
    )
    for p in posts:
        p["_id"] = str(p["_id"])
    return posts


@router.get("/{post_id}")
def get_post(post_id: str, current_user: dict = Depends(get_current_user)):
    """Get a specific post by ID (must belong to the user)."""
    try:
        post = db.posts.find_one({"_id": ObjectId(post_id), "user_email": current_user["email"]})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post ID")

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    post["_id"] = str(post["_id"])
    return post
