from bson import ObjectId
from datetime import datetime
from typing import Optional
from fastapi import HTTPException
from app.database import get_db

class PostService:
    @staticmethod
    async def create_draft(user_id: str) -> str:
        db = get_db()
        
        valid_initial_state = {
            "root": {
                "children": [
                    {
                        "children": [],
                        "direction": None,
                        "format": "",
                        "indent": 0,
                        "type": "paragraph",
                        "version": 1
                    }
                ],
                "direction": None,
                "format": "",
                "indent": 0,
                "type": "root",
                "version": 1
            }
        }

        new_post = {
            "title": "Untitled Draft",
            "lexical_state": valid_initial_state,  
            "status": "DRAFT",
            "user_id": user_id,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        result = await db["posts"].insert_one(new_post)
        return str(result.inserted_id)

    @staticmethod
    async def update_post(post_id: str, user_id: str, update_dict: dict) -> bool:
        db = get_db()
        update_dict["updated_at"] = datetime.utcnow()
        result = await db["posts"].update_one(
            {"_id": ObjectId(post_id), "user_id": user_id},
            {"$set": update_dict}
        )
        return result.matched_count > 0

    @staticmethod
    async def get_all_posts(user_id: str) -> list:
        db = get_db()
        posts = []
        async for post in db["posts"].find({"user_id": user_id}):
            posts.append({
                "_id": str(post["_id"]),
                "title": post.get("title", "Untitled Draft"),
                "content": post.get("lexical_state", {}), 
                "status": post.get("status", "DRAFT"),
                "updated_at": post.get("updated_at", datetime.utcnow().isoformat())
            })
        return posts

    @staticmethod
    async def get_post(post_id: str, viewer_id: Optional[str] = None) -> Optional[dict]:
        db = get_db()
        post = await db["posts"].find_one({"_id": ObjectId(post_id)})

        if not post:
            return None
            
        is_owner = (viewer_id is not None) and (post.get("user_id") == viewer_id)
        is_published = post.get("status") == "PUBLISHED"

        if not is_published and not is_owner:
             raise HTTPException(status_code=403, detail="This document is private.")

        author_name = "Anonymous"
        author_email = ""
        
        author = await db["users"].find_one({"_id": ObjectId(post["user_id"])})
        if author:
            author_email = author.get("email", "")
            author_name = author_email.split('@')[0] 

        return {
            "_id": str(post["_id"]),
            "title": post.get("title", "Untitled Draft"),
            "lexical_state": post.get("lexical_state", {}),
            "status": post.get("status", "DRAFT"),
            "is_owner": is_owner,
            "author_name": author_name,
            "author_email": author_email,
            "updated_at": post.get("updated_at").isoformat() if post.get("updated_at") else None
        }
    @staticmethod
    async def publish_post(post_id: str, user_id: str) -> bool:
        db = get_db()
        result = await db["posts"].update_one(
            {"_id": ObjectId(post_id), "user_id": user_id},
            {"$set": {"status": "PUBLISHED", "updated_at": datetime.utcnow()}}
        )
        return result.matched_count > 0
    @staticmethod
    async def delete_post(post_id: str, user_id: str) -> bool:
        db = get_db()
        
        result = await db["posts"].delete_one({
            "_id": ObjectId(post_id),
            "user_id": user_id   
        })
        
        return result.deleted_count > 0