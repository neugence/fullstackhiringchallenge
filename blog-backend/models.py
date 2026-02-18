# models.py
from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime

from database import Base   # 🔥 THIS LINE WAS MISSING

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, default="")
    status = Column(String, default="draft")

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )
