"""
MongoDB database connection and client management using Motor (async driver).
"""
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import Optional
from ..core.config import settings


class Database:
    """MongoDB database client manager."""
    
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None


# Global database instance
database = Database()


async def connect_to_mongo():
    """
    Connect to MongoDB and initialize the database client.
    Should be called on application startup.
    """
    try:
        database.client = AsyncIOMotorClient(settings.MONGO_URI)
        database.db = database.client[settings.DATABASE_NAME]
        
        # Test connection
        await database.client.admin.command('ping')
        print(f"✅ Connected to MongoDB: {settings.DATABASE_NAME}")
        
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        raise e


async def close_mongo_connection():
    """
    Close MongoDB connection.
    Should be called on application shutdown.
    """
    if database.client:
        database.client.close()
        print("✅ MongoDB connection closed")


def get_database() -> AsyncIOMotorDatabase:
    """
    Get the database instance.
    
    Returns:
        AsyncIOMotorDatabase instance
    """
    return database.db
