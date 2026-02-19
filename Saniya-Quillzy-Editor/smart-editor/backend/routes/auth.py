from fastapi import APIRouter, HTTPException, Depends, Header
from database import db
import bcrypt
from jose import jwt, JWTError
from datetime import datetime, timedelta
import os

router = APIRouter(prefix="/api/auth")

SECRET = os.getenv("JWT_SECRET", "quillzy_smart_editor_jwt_secret_2024")


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))


def get_current_user(authorization: str = Header(None)):
    """Extract and verify JWT token from Authorization header."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET, algorithms=["HS256"])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"email": email}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


@router.post("/signup")
def signup(user: dict):
    """Register a new user."""
    email = user.get("email", "").strip().lower()
    password = user.get("password", "")
    name = user.get("name", "")

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password required")

    # Check for duplicate email
    if db.users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(password)
    db.users.insert_one({
        "email": email,
        "name": name,
        "password": hashed,
        "created_at": datetime.utcnow()
    })

    # Auto-login: return token immediately after signup
    token = jwt.encode(
        {"sub": email, "exp": datetime.utcnow() + timedelta(hours=24)},
        SECRET,
        algorithm="HS256",
    )
    return {"access_token": token, "email": email, "name": name, "message": "Account created successfully"}


@router.post("/login")
def login(user: dict):
    """Authenticate user and return JWT token."""
    email = user.get("email", "").strip().lower()
    password = user.get("password", "")

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password required")

    db_user = db.users.find_one({"email": email})
    if not db_user or not verify_password(password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    token = jwt.encode(
        {"sub": email, "exp": datetime.utcnow() + timedelta(hours=24)},
        SECRET,
        algorithm="HS256",
    )
    return {
        "access_token": token,
        "email": email,
        "name": db_user.get("name", ""),
    }


@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    """Verify token and return current user info."""
    db_user = db.users.find_one({"email": current_user["email"]})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "email": db_user["email"],
        "name": db_user.get("name", ""),
    }
