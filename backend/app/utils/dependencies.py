from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import PyJWTError
import jwt
from typing import Optional
from app.config import settings
from fastapi import Depends
from app.config import settings
from motor.motor_asyncio import AsyncIOMotorClient
from app.database import get_db
 

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

async def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_optional_user(token: Optional[str] = Depends(oauth2_scheme_optional)) -> Optional[str]:
    if token is None:
        return None
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload.get("sub")
    except PyJWTError:
        return None