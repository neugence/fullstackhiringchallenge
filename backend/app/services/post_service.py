from datetime import datetime
from typing import List, Optional
from bson import ObjectId
from ..database import get_database
from ..models.post import PostCreate, PostUpdate, PostInDB

class PostService:
    @property
    def collection(self):
        return get_database().posts

    async def create_post(self, post: PostCreate) -> PostInDB:
        """Create a new post"""
        post_dict = post.model_dump()
        post_dict["created_at"] = datetime.utcnow()
        post_dict["updated_at"] = datetime.utcnow()
        post_dict["published_at"] = None
        
        result = await self.collection.insert_one(post_dict)
        created_post = await self.collection.find_one({"_id": result.inserted_id})
        return PostInDB(**created_post)

    async def get_posts(self, status: Optional[str] = None) -> List[PostInDB]:
        """Get all posts, optionally filtered by status"""
        query = {}
        if status:
            query["status"] = status
        
        cursor = self.collection.find(query).sort("updated_at", -1)
        posts = await cursor.to_list(length=100)
        return [PostInDB(**post) for post in posts]

    async def get_post(self, post_id: str) -> Optional[PostInDB]:
        """Get a single post by ID"""
        if not ObjectId.is_valid(post_id):
            return None
        
        post = await self.collection.find_one({"_id": ObjectId(post_id)})
        if post:
            return PostInDB(**post)
        return None

    async def update_post(self, post_id: str, post_update: PostUpdate) -> Optional[PostInDB]:
        """Update a post"""
        if not ObjectId.is_valid(post_id):
            return None
        
        update_data = {k: v for k, v in post_update.model_dump().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        # Convert Lexical JSON to HTML (simplified)
        if "content" in update_data and update_data["content"]:
            update_data["content_html"] = self._lexical_to_html(update_data["content"])
        
        result = await self.collection.find_one_and_update(
            {"_id": ObjectId(post_id)},
            {"$set": update_data},
            return_document=True
        )
        
        if result:
            return PostInDB(**result)
        return None

    async def delete_post(self, post_id: str) -> bool:
        """Delete a post"""
        if not ObjectId.is_valid(post_id):
            return False
        
        result = await self.collection.delete_one({"_id": ObjectId(post_id)})
        return result.deleted_count > 0

    async def publish_post(self, post_id: str) -> Optional[PostInDB]:
        """Publish a post"""
        if not ObjectId.is_valid(post_id):
            return None
        
        result = await self.collection.find_one_and_update(
            {"_id": ObjectId(post_id)},
            {
                "$set": {
                    "status": "published",
                    "published_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
            },
            return_document=True
        )
        
        if result:
            return PostInDB(**result)
        return None

    def _lexical_to_html(self, content: dict) -> str:
        """Convert Lexical JSON to HTML (simplified version)"""
        # This is a simplified converter. In production, you'd want a more robust solution
        try:
            if not content or "root" not in content:
                return ""
            
            html_parts = []
            root = content.get("root", {})
            children = root.get("children", [])
            
            for node in children:
                html_parts.append(self._node_to_html(node))
            
            return "".join(html_parts)
        except Exception as e:
            print(f"Error converting Lexical to HTML: {e}")
            return ""

    def _node_to_html(self, node: dict) -> str:
        """Convert a single Lexical node to HTML"""
        node_type = node.get("type", "")
        
        if node_type == "paragraph":
            children_html = self._children_to_html(node.get("children", []))
            return f"<p>{children_html}</p>"
        
        elif node_type == "heading":
            tag = node.get("tag", "h1")
            children_html = self._children_to_html(node.get("children", []))
            return f"<{tag}>{children_html}</{tag}>"
        
        elif node_type == "list":
            tag = node.get("tag", "ul")
            children_html = "".join([self._node_to_html(child) for child in node.get("children", [])])
            return f"<{tag}>{children_html}</{tag}>"
        
        elif node_type == "listitem":
            children_html = "".join([self._node_to_html(child) for child in node.get("children", [])])
            return f"<li>{children_html}</li>"
        
        elif node_type == "text":
            text = node.get("text", "")
            format_flags = node.get("format", 0)
            
            # Apply formatting
            if format_flags & 1:  # Bold
                text = f"<strong>{text}</strong>"
            if format_flags & 2:  # Italic
                text = f"<em>{text}</em>"
            if format_flags & 8:  # Underline
                text = f"<u>{text}</u>"
            
            return text
        
        return ""

    def _children_to_html(self, children: list) -> str:
        """Convert children nodes to HTML"""
        return "".join([self._node_to_html(child) for child in children])

post_service = PostService()
