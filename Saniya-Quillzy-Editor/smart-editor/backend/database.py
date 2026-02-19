from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")

client = MongoClient(MONGODB_URL)
db = client["smart_editor"]
