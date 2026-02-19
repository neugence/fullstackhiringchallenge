"""
Database Configuration and Operations
Handles MongoDB/SQLite connection and CRUD operations for blog posts
"""
import os
import uuid
from datetime import datetime
from typing import List, Optional
from pymongo import MongoClient
import motor.motor_asyncio

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "smart_blog_editor")

# For SQLite (alternative)
SQLITE_DB_PATH = os.getenv("SQLITE_DB_PATH", "./blog_database.db")


class Database:
    """Database operations handler"""
    
    def __init__(self):
        self.client = None
        self.db = None
        self.posts_collection = None
        self._connect()
    
    def _connect(self):
        """Connect to MongoDB"""
        try:
            self.client = motor.motor_asyncio.AsyncIOMotorClient(DATABASE_URL)
            self.db = self.client[DATABASE_NAME]
            self.posts_collection = self.db.posts
            print(f"Connected to MongoDB: {DATABASE_NAME}")
        except Exception as e:
            print(f"MongoDB connection failed: {e}")
            print("Falling back to in-memory storage")
            self._init_in_memory_storage()
    
    def _init_in_memory_storage(self):
        """Initialize in-memory storage as fallback"""
        self.posts = {}
        self.db = None
        self.posts_collection = None
    
    async def get_posts(self, skip: int = 0, limit: int = 10) -> List[dict]:
        """Get all posts with pagination"""
        if self.posts_collection:
            cursor = self.posts_collection.find().skip(skip).limit(limit)
            posts = await cursor.to_list(length=limit)
            return [self._serialize_post(post) for post in posts]
        else:
            # In-memory fallback
            posts = list(self.posts.values())[skip:skip+limit]
            return posts
    
    async def get_post(self, post_id: str) -> Optional[dict]:
        """Get a single post by ID"""
        if self.posts_collection:
            post = await self.posts_collection.find_one({"id": post_id})
            return self._serialize_post(post) if post else None
        else:
            # In-memory fallback
            return self.posts.get(post_id)
    
    async def create_post(self, post_data: dict) -> dict:
        """Create a new post"""
        post_id = f"post_{uuid.uuid4().hex[:8]}"
        now = datetime.utcnow()
        
        post = {
            "id": post_id,
            "title": post_data.get("title"),
            "content": post_data.get("content", ""),
            "excerpt": post_data.get("excerpt"),
            "tags": post_data.get("tags", []),
            "status": post_data.get("status", "draft"),
            "created_at": now,
            "updated_at": now,
            "author_id": post_data.get("author_id"),
        }
        
        if self.posts_collection:
            await self.posts_collection.insert_one(post)
        else:
            self.posts[post_id] = post
        
        return self._serialize_post(post)
    
    async def update_post(self, post_id: str, update_data: dict) -> Optional[dict]:
        """Update an existing post"""
        update_data["updated_at"] = datetime.utcnow()
        
        # Remove None values
        update_data = {k: v for k, v in update_data.items() if v is not None}
        
        if self.posts_collection:
            result = await self.posts_collection.find_one_and_update(
                {"id": post_id},
                {"$set": update_data},
                return_document=True
            )
            return self._serialize_post(result) if result else None
        else:
            # In-memory fallback
            if post_id in self.posts:
                self.posts[post_id].update(update_data)
                return self._serialize_post(self.posts[post_id])
            return None
    
    async def delete_post(self, post_id: str) -> bool:
        """Delete a post"""
        if self.posts_collection:
            result = await self.posts_collection.delete_one({"id": post_id})
            return result.deleted_count > 0
        else:
            # In-memory fallback
            if post_id in self.posts:
                del self.posts[post_id]
                return True
            return False
    
    def _serialize_post(self, post: dict) -> dict:
        """Serialize post for JSON response"""
        if not post:
            return None
        
        serialized = post.copy()
        if "created_at" in serialized:
            serialized["created_at"] = serialized["created_at"].isoformat()
        if "updated_at" in serialized:
            serialized["updated_at"] = serialized["updated_at"].isoformat()
        
        # Remove MongoDB internal fields
        serialized.pop("_id", None)
        
        return serialized
    
    async def close(self):
        """Close database connection"""
        if self.client:
            self.client.close()


# Database instance
db = Database()
