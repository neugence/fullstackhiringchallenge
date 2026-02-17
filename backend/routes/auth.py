"""
Authentication routes for user registration and login.
"""
from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime
from ..schemas.user_schema import (
    UserRegisterSchema,
    UserLoginSchema,
    TokenSchema,
    UserResponseSchema,
    MessageSchema
)
from ..models.user_model import UserModel
from ..core.security import hash_password, verify_password, create_access_token
from ..db.database import get_database
from ..dependencies.auth_dependency import get_current_user


router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponseSchema, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegisterSchema):
    """
    Register a new user account.
    
    Args:
        user_data: User registration data (email and password)
        
    Returns:
        Newly created user information
        
    Raises:
        HTTPException: If email already exists
    """
    db = get_database()
    
    # Check if user already exists
    existing_user = await db["users"].find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_pwd = hash_password(user_data.password)
    new_user = UserModel(
        email=user_data.email,
        hashed_password=hashed_pwd,
        created_at=datetime.utcnow(),
        is_active=True
    )
    
    # Insert into database
    user_dict = new_user.model_dump(by_alias=True, exclude={"id"})
    result = await db["users"].insert_one(user_dict)
    
    # Return user data
    return UserResponseSchema(
        id=str(result.inserted_id),
        email=new_user.email,
        created_at=new_user.created_at,
        is_active=new_user.is_active
    )


@router.post("/login", response_model=TokenSchema)
async def login(user_credentials: UserLoginSchema):
    """
    Login and receive a JWT access token.
    
    Args:
        user_credentials: User login credentials (email and password)
        
    Returns:
        JWT access token
        
    Raises:
        HTTPException: If credentials are invalid
    """
    db = get_database()
    
    # Find user by email
    user_dict = await db["users"].find_one({"email": user_credentials.email})
    if not user_dict:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = UserModel(**user_dict)
    
    # Verify password
    if not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user.email})
    
    return TokenSchema(access_token=access_token, token_type="bearer")


@router.get("/protected", response_model=MessageSchema)
async def protected_route(current_user: UserModel = Depends(get_current_user)):
    """
    Protected test route that requires authentication.
    
    Args:
        current_user: Current authenticated user (injected by dependency)
        
    Returns:
        Welcome message with user email
    """
    return MessageSchema(
        message=f"Hello {current_user.email}! This is a protected route."
    )
