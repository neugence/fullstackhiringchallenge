from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

class Database:
    client: AsyncIOMotorClient = None
    db = None

    @classmethod
    def connect_db(cls):
        cls.client = AsyncIOMotorClient(settings.MONGODB_URL)
        cls.db = cls.client.smart_editor_db

    @classmethod
    def close_db(cls):
        if cls.client is not None:
            cls.client.close()

db_instance = Database()

def get_db():
    return db_instance.db