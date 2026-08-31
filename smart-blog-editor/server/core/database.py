import sqlite3
from contextlib import contextmanager
from core.config import DB_FILE

@contextmanager
def get_db():
    """Context manager for managing SQLite connection lifecycle"""
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    """Initialize database tables if they do not exist"""
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS posts (
                id TEXT PRIMARY KEY,
                title TEXT,
                content TEXT,
                status TEXT,
                created_at TEXT,
                updated_at TEXT,
                author_username TEXT
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                username TEXT PRIMARY KEY,
                password_hash TEXT
            )
        ''')
        conn.commit()
