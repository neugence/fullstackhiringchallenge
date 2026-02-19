import urllib.parse
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from models import PostModel, UpdatePostModel
from bson import ObjectId
import datetime

# 1. Properly escape the username and password
# This removes the "Username and password must be escaped" error
raw_user = "gudurimanasa0_db_user"
raw_pass = "Manu1718"

safe_user = urllib.parse.quote_plus(raw_user)
safe_pass = urllib.parse.quote_plus(raw_pass)

# 2. Construct the URL (Note: No < > brackets here!)
MONGO_URL = f"mongodb+srv://{safe_user}:{safe_pass}@cluster0.icatg8n.mongodb.net/smart_blog_db?retryWrites=true&w=majority"

app = FastAPI()

# 3. Import AI Service after app is created to avoid circular import issues
try:
    import ai_service
    app.include_router(ai_service.router)
except ImportError:
    print("AI Service file not found, skipping AI routes...")

# 4. Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 5. MongoDB Connection
client = AsyncIOMotorClient(MONGO_URL)
db = client.smart_blog_db

# --- ROUTES ---

@app.post("/api/posts/", status_code=201)
async def create_post():
    new_post = {
        "title": "Initial Draft",
        "content": {"root": {"children": [], "type": "root", "version": 1}},
        "status": "draft",
        "created_at": datetime.datetime.now(),
        "updated_at": datetime.datetime.now()
    }
    result = await db.posts.insert_one(new_post)
    return {"id": str(result.inserted_id), "title": new_post["title"]}

@app.patch("/api/posts/{post_id}")
async def update_post(post_id: str, payload: UpdatePostModel = Body(...)):
    if post_id == "post_123":
        return {"message": "Skipping mock ID"}
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    
    update_data = {k: v for k, v in payload.dict().items() if v is not None}
    update_data["updated_at"] = datetime.datetime.now()
    
    result = await db.posts.update_one(
        {"_id": ObjectId(post_id)}, 
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    
    return {"message": "Auto-saved successfully"}

@app.get("/api/posts/")
async def get_all_drafts():
    posts = []
    cursor = db.posts.find().sort("updated_at", -1)
    async for document in cursor:
        document["id"] = str(document["_id"])
        del document["_id"]
        posts.append(document)
    return posts