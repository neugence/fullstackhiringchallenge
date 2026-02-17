from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

class PostRepository:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db["posts"]

    async def update_post_state(self, post_id: str, lexical_json: dict):
        result = await self.collection.update_one(
            {"_id": ObjectId(post_id)},
            {"$set": {"lexical_state": lexical_json, "status": "DRAFT"}}
        )
        return result.modified_count > 0