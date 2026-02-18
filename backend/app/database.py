import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import MONGODB_URL, DATABASE_NAME

client = AsyncIOMotorClient(MONGODB_URL, tlsCAFile=certifi.where())
db = client[DATABASE_NAME]


posts_collection = db["posts"]
users_collection = db["users"]


async def check_connection():
    """ping mongo to verify connection is alive"""
    await client.admin.command("ping")
    return True
