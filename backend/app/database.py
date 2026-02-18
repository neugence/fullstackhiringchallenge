import os

from dotenv import load_dotenv
from pymongo import ASCENDING, DESCENDING, MongoClient
from pymongo.database import Database

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "smart_blog_editor")

client = MongoClient(MONGODB_URI)
db = client[MONGODB_DB_NAME]


def ensure_indexes(database: Database) -> None:
    database.users.create_index([("email", ASCENDING)], unique=True)
    database.posts.create_index([("user_id", ASCENDING), ("updated_at", DESCENDING)])


def get_db():
    yield db
