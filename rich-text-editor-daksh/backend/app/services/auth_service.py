"""
Authentication service for user registration and login.
"""
from app.models.user import User
from app.extensions import db
from app.utils.password import hash_password, verify_password
from app.utils.validators import validate_email, validate_password
from flask_jwt_extended import create_access_token


def register_user(name, email, password):
    """
    Register a new user with validation and password hashing.
    
    Args:
        name (str): User's full name
        email (str): User's email address
        password (str): User's plain text password
    
    Returns:
        tuple: (user: User or None, error: str or None)
    
    Raises:
        None - returns error message instead
    
    Example:
        >>> user, error = register_user('John Doe', 'john@example.com', 'SecurePass123')
        >>> if user:
        ...     print(f"User {user.email} registered successfully")
    """
    # Validate name
    if not name or not name.strip():
        return None, "Name is required"
    
    # Validate email format
    if not validate_email(email):
        return None, "Invalid email format"
    
    # Validate password strength
    is_valid, error_msg = validate_password(password)
    if not is_valid:
        return None, error_msg
    
    # Check if email already exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return None, "Email already exists"
    
    try:
        # Hash the password
        password_hash = hash_password(password)
        
        # Create new user
        user = User(
            name=name.strip(),
            email=email.lower().strip(),
            password_hash=password_hash
        )
        
        # Save to database
        db.session.add(user)
        db.session.commit()
        
        return user, None
    
    except Exception as e:
        db.session.rollback()
        return None, f"Registration failed: {str(e)}"


def authenticate_user(email, password):
    """
    Authenticate a user and generate JWT token.
    
    Args:
        email (str): User's email address
        password (str): User's plain text password
    
    Returns:
        tuple: (token: str or None, user: User or None, error: str or None)
    
    Example:
        >>> token, user, error = authenticate_user('john@example.com', 'SecurePass123')
        >>> if token:
        ...     print(f"Authentication successful, token: {token}")
    """
    # Validate inputs
    if not email or not password:
        return None, None, "Email and password are required"
    
    # Find user by email
    user = User.query.filter_by(email=email.lower().strip()).first()
    
    if not user:
        return None, None, "Invalid credentials"
    
    # Verify password
    if not verify_password(password, user.password_hash):
        return None, None, "Invalid credentials"
    
    try:
        # Generate JWT token
        token = create_access_token(identity=user.id)
        return token, user, None
    
    except Exception as e:
        return None, None, f"Authentication failed: {str(e)}"
