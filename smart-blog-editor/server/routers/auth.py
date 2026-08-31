from fastapi import APIRouter, HTTPException, status
from core.database import get_db
from core.security import get_password_hash, verify_password, create_access_token
from models.auth import UserCreate, UserLogin, Token

router = APIRouter(tags=["Auth"])

@router.post("/register", status_code=201)
async def register(user: UserCreate):
    hashed_pass = get_password_hash(user.password)
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("INSERT INTO users (username, password_hash) VALUES (?, ?)", 
                           (user.username, hashed_pass))
            conn.commit()
    except Exception:
        raise HTTPException(status_code=400, detail="Username already exists")
    return {"message": "User created successfully"}

@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT password_hash FROM users WHERE username = ?", (user.username,))
        row = cursor.fetchone()
    
    if not row or not verify_password(user.password, row[0]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}
