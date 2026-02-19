from fastapi import FastAPI
from pydantic import BaseModel
import sqlite3
from fastapi.middleware.cors import CORSMiddleware

# FastAPI app
app = FastAPI()

# Enable CORS (important for frontend connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
conn = sqlite3.connect("blog.db", check_same_thread=False)
cursor = conn.cursor()

# Create table if not exists
cursor.execute("""
CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT,
    status TEXT DEFAULT 'draft'
)
""")

conn.commit()


# Request model
class Post(BaseModel):
    content: str


# Test route
@app.get("/")
def home():
    return {"message": "Backend working successfully"}


# Auto save route
@app.post("/save")
def save_post(post: Post):
    cursor.execute(
        "INSERT INTO posts (content, status) VALUES (?, ?)",
        (post.content, "draft")
    )
    conn.commit()
    return {"message": "Post saved successfully"}


# Publish route
@app.post("/publish")
def publish_post(post: Post):
    cursor.execute(
        "INSERT INTO posts (content, status) VALUES (?, ?)",
        (post.content, "published")
    )
    conn.commit()
    return {"message": "Post published successfully"}


# Get all posts
@app.get("/posts")
def get_posts():
    cursor.execute("SELECT * FROM posts ORDER BY id DESC")
    posts = cursor.fetchall()

    result = []
    for post in posts:
        result.append({
            "id": post[0],
            "content": post[1],
            "status": post[2]
        })

    return result