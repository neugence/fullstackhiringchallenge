import uuid
import json
from datetime import datetime
from core.database import get_db
from models.post import PostCreate, PostUpdate

def db_create_post(post: PostCreate, author: str) -> dict:
    new_id = str(uuid.uuid4())
    timestamp = datetime.utcnow().isoformat()
    content_str = json.dumps(post.content) 
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO posts (id, title, content, status, created_at, updated_at, author_username) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (new_id, post.title, content_str, post.status, timestamp, timestamp, author)
        )
        conn.commit()
        
    return {"id": new_id, "message": "Draft created"}

def db_get_posts() -> list:
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM posts ORDER BY updated_at DESC")
        rows = cursor.fetchall()
        
        results = []
        for row in rows:
            post_dict = dict(row)
            post_dict["_id"] = post_dict.pop("id") 
            try:
                post_dict["content"] = json.loads(post_dict["content"])
            except:
                post_dict["content"] = {}
            results.append(post_dict)
            
        return results

def db_update_post(post_id: str, post: PostUpdate) -> bool:
    timestamp = datetime.utcnow().isoformat()
    update_fields = []
    values = []
    
    if post.title is not None:
        update_fields.append("title = ?")
        values.append(post.title)
    if post.content is not None:
        update_fields.append("content = ?")
        values.append(json.dumps(post.content))
    if post.status is not None:
        update_fields.append("status = ?")
        values.append(post.status)
        
    if not update_fields:
        return True
        
    update_fields.append("updated_at = ?")
    values.append(timestamp)
    values.append(post_id) 
    
    with get_db() as conn:
        cursor = conn.cursor()
        sql = f"UPDATE posts SET {', '.join(update_fields)} WHERE id = ?"
        cursor.execute(sql, tuple(values))
        if cursor.rowcount == 0:
            return False
        conn.commit()
        return True

def db_delete_post(post_id: str) -> bool:
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM posts WHERE id = ?", (post_id,))
        if cursor.rowcount == 0:
            return False
        conn.commit()
        return True
