"""
Input validation utilities for the application.
"""
import re


def validate_email(email):
    """
    Validate email format using regex.
    
    Args:
        email (str): Email address to validate
    
    Returns:
        bool: True if email is valid, False otherwise
    
    Example:
        >>> validate_email('user@example.com')
        True
        >>> validate_email('invalid-email')
        False
    """
    if not email or not isinstance(email, str):
        return False
    
    # Basic email regex pattern
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_password(password):
    """
    Validate password strength.
    Password must be at least 8 characters long.
    
    Args:
        password (str): Password to validate
    
    Returns:
        tuple: (is_valid: bool, error_message: str or None)
    
    Example:
        >>> validate_password('SecurePass123')
        (True, None)
        >>> validate_password('short')
        (False, 'Password must be at least 8 characters long')
    """
    if not password or not isinstance(password, str):
        return False, "Password is required"
    
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    return True, None


def validate_resume_text(text):
    """
    Validate resume text input.
    Resume text must not be empty or only whitespace.
    
    Args:
        text (str): Resume text to validate
    
    Returns:
        tuple: (is_valid: bool, error_message: str or None)
    
    Example:
        >>> validate_resume_text('Software Engineer with 5 years experience')
        (True, None)
        >>> validate_resume_text('   ')
        (False, 'Resume text cannot be empty')
    """
    if not text or not isinstance(text, str):
        return False, "Resume text is required"
    
    if not text.strip():
        return False, "Resume text cannot be empty"
    
    return True, None


def validate_job_description(text):
    """
    Validate job description text input.
    Job description must not be empty or only whitespace.
    
    Args:
        text (str): Job description to validate
    
    Returns:
        tuple: (is_valid: bool, error_message: str or None)
    
    Example:
        >>> validate_job_description('Looking for Senior Software Engineer')
        (True, None)
        >>> validate_job_description('')
        (False, 'Job description is required')
    """
    if not text or not isinstance(text, str):
        return False, "Job description is required"
    
    if not text.strip():
        return False, "Job description cannot be empty"
    
    return True, None
