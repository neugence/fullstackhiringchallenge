from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.database import Database

from ..database import get_db
from ..schemas import AuthResponse, UserLoginRequest, UserSignupRequest
from ..security import create_access_token, get_password_hash, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/signup", response_model=AuthResponse)
def signup(payload: UserSignupRequest, db: Database = Depends(get_db)):
    existing = db.users.find_one({"email": payload.email})
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")

    result = db.users.insert_one(
        {
            "email": payload.email,
            "password_hash": get_password_hash(payload.password),
            "created_at": datetime.utcnow(),
        }
    )

    return AuthResponse(access_token=create_access_token(str(result.inserted_id)))


@router.post("/login", response_model=AuthResponse)
def login(payload: UserLoginRequest, db: Database = Depends(get_db)):
    user = db.users.find_one({"email": payload.email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    return AuthResponse(access_token=create_access_token(str(user["_id"])))
