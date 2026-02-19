import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

# Use absolute path so the DB file is always found regardless of cwd.
# On Render, DATABASE_URL can be set to override (e.g. for PostgreSQL).
_database_url = os.environ.get("DATABASE_URL")

if not _database_url:
    # Default: SQLite stored next to this file
    _db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "blog.db")
    _database_url = f"sqlite:///{_db_path}"

# SQLite needs check_same_thread=False; other DBs don't need it
_connect_args = {"check_same_thread": False} if _database_url.startswith("sqlite") else {}

engine = create_engine(_database_url, connect_args=_connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    """FastAPI dependency that provides a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
