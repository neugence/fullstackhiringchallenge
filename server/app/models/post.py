from uuid import uuid4

class Post:
    @staticmethod
    def create(db,title="untitled"):
        post_id = str(uuid4())
        db.execute("INSERT INTO posts (id,title,content_json) VALUES (?,?,?)",(post_id,title,None))
        db.commit()
        return post_id

    @staticmethod
    def get_all(db):
        cursor = db.execute("SELECT * FROM posts ORDER BY updated_at DESC")
        return [dict(row) for row in cursor.fetchall()]

    @staticmethod
    def get_by_id(db, post_id):
        cursor = db.execute("SELECT * FROM posts WHERE id = ?", (post_id,))
        row = cursor.fetchone()
        return dict(row) if row else None

    @staticmethod
    def update(db, post_id, title=None, content_json=None):
        updates = []
        params = []
        if title is not None:
            updates.append("title = ?")
            params.append(title)
        if content_json is not None:
            updates.append("content_json = ?")
            params.append(content_json)
        
        if updates:
            updates.append("updated_at = CURRENT_TIMESTAMP")
            params.append(post_id) 
            db.execute(f"UPDATE posts SET {', '.join(updates)} WHERE id = ?", tuple(params))
            db.commit()
    
    @staticmethod
    def publish(db,post_id):
        db.execute("UPDATE posts SET status = 'published', updated_at = CURRENT_TIMESTAMP WHERE id = ?", (post_id,))
        db.commit()
