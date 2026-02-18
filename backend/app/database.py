from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings

class Database:
    client: AsyncIOMotorClient = None
    
db = Database()

async def connect_to_mongo():
    """Connect to MongoDB"""
    db.client = AsyncIOMotorClient(settings.mongodb_url)
    print(f"Connected to MongoDB at {settings.mongodb_url}")

async def close_mongo_connection():
    """Close MongoDB connection"""
    db.client.close()
    print("Closed MongoDB connection")

def get_database():
    """Get database instance"""
    return db.client[settings.database_name]
