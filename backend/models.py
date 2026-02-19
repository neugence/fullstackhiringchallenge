import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Enum as SAEnum
import enum
from database import Base


class PostStatus(str, enum.Enum):
    DRAFT = "draft"
    PUBLISHED = "published"


class Post(Base):
    """Blog post model.

    Content is stored as serialized Lexical JSON, preserving the full editor
    state including all nodes, formatting, tables, and math expressions.
    This enables lossless round-trip editing without any HTML conversion.
    """

    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(500), default="Untitled", nullable=False)
    content = Column(Text, default="{}", nullable=False)  # Lexical JSON
    status = Column(
        SAEnum(PostStatus), default=PostStatus.DRAFT, nullable=False
    )
    created_at = Column(
        DateTime,
        default=lambda: datetime.datetime.now(datetime.timezone.utc),
        nullable=False,
    )
    updated_at = Column(
        DateTime,
        default=lambda: datetime.datetime.now(datetime.timezone.utc),
        onupdate=lambda: datetime.datetime.now(datetime.timezone.utc),
        nullable=False,
    )
