"""
Password hashing and verification utilities using bcrypt.
"""
from app.extensions import bcrypt


def hash_password(password):
    """
    Hash a plain text password using bcrypt.
    
    Args:
        password (str): Plain text password to hash
    
    Returns:
        str: Hashed password
    
    Example:
        >>> hashed = hash_password('mypassword123')
        >>> isinstance(hashed, str)
        True
    """
    if not password:
        raise ValueError("Password cannot be empty")
    
    # Generate password hash using bcrypt
    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    return password_hash


def verify_password(password, password_hash):
    """
    Verify a plain text password against a hashed password.
    
    Args:
        password (str): Plain text password to verify
        password_hash (str): Hashed password to compare against
    
    Returns:
        bool: True if password matches, False otherwise
    
    Example:
        >>> hashed = hash_password('mypassword123')
        >>> verify_password('mypassword123', hashed)
        True
        >>> verify_password('wrongpassword', hashed)
        False
    """
    if not password or not password_hash:
        return False
    
    # Check password using bcrypt
    return bcrypt.check_password_hash(password_hash, password)
