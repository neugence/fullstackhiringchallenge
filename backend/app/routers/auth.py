from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import PyJWTError
import jwt
from typing import Optional

from app.config import settings
from app.database import get_db
from app.schemas.auth import UserCreate

 
from app.utils.security import get_password_hash, verify_password, create_access_token

router = APIRouter(prefix="/api/auth", tags=["Auth"])

# --- DEPENDENCIES ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

async def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    """Require authentication"""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_optional_user(token: Optional[str] = Depends(oauth2_scheme_optional)) -> Optional[str]:
    """Authentication optional"""
    if token is None:
        return None
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload.get("sub")
    except PyJWTError:
        return None

 
@router.post("/signup")
async def signup(user: UserCreate):
    db = get_db()
    existing_user = await db["users"].find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_password = get_password_hash(user.password)
    new_user = {"email": user.email, "password": hashed_password}
    result = await db["users"].insert_one(new_user)
    
    access_token = create_access_token(data={"sub": str(result.inserted_id)})
    return {"access_token": access_token, "email": user.email, "token_type": "bearer"}

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    db = get_db()
    user = await db["users"].find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
        
    access_token = create_access_token(data={"sub": str(user["_id"])})
    return {"access_token": access_token, "email": form_data.username, "token_type": "bearer"}