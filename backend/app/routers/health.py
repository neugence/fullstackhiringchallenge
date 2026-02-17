from fastapi import APIRouter
from app.database import get_db

router = APIRouter() # No prefix puts it in 'default'

@router.get("/", summary="Root")
async def root():
    return {"message": "API is online"}

@router.get("/health", summary="Health Check")
async def health_check():
    # Pro Flex: Check DB connection
    db = get_db()
    try:
        await db.command("ping")
        return {"status": "healthy", "database": "connected"}
    except Exception:
        return {"status": "unhealthy", "database": "error"}