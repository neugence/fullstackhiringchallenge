"""
Property-based tests for authentication service.
Feature: ai-resume-platform, Property 2: Invalid Registration Data Returns Errors
Feature: ai-resume-platform, Property 3: Valid Authentication Returns JWT Token
"""
import pytest
from hypothesis import given, strategies as st, settings, assume
from app.services.auth_service import register_user, authenticate_user
from app.models.user import User
from app.extensions import db
import jwt as pyjwt


# Strategies for generating test data
@st.composite
def invalid_email(draw):
    """Generate invalid email addresses."""
    return draw(st.one_of(
        st.just(''),  # Empty string
        st.just('notanemail'),  # No @ symbol
        st.just('@example.com'),  # Missing local part
        st.just('user@'),  # Missing domain
        st.just('user @example.com'),  # Space in email
        st.text(min_size=1, max_size=50, alphabet=st.characters(blacklist_characters='@'))  # No @ symbol
    ))


@st.composite
def weak_password(draw):
    """Generate weak passwords (less than 8 characters)."""
    return draw(st.text(min_size=0, max_size=7))


# Feature: ai-resume-platform, Property 2: Invalid Registration Data Returns Errors
@settings(max_examples=100)
@given(name=st.text(min_size=1, max_size=100), email=invalid_email(), password=st.text(min_size=8, max_size=100))
def test_invalid_email_returns_error(app, name, email, password):
    """
    Test that registration with invalid email format returns an error.
    For any invalid email, registration should be rejected with appropriate error message.
    """
    with app.app_context():
        user, error = register_user(name, email, password)
        
        # Verify registration failed
        assert user is None
        assert error is not None
        assert 'email' in error.lower() or 'invalid' in error.lower()


@settings(max_examples=100)
@given(name=st.text(min_size=1, max_size=100), email=st.emails(), password=weak_password())
def test_weak_password_returns_error(app, name, email, password):
    """
    Test that registration with weak password returns an error.
    For any password less than 8 characters, registration should be rejected.
    """
    with app.app_context():
        user, error = register_user(name, email, password)
        
        # Verify registration failed
        assert user is None
        assert error is not None
        assert 'password' in error.lower()


@settings(max_examples=100)
@given(email=st.emails(), password=st.text(min_size=8, max_size=100))
def test_missing_name_returns_error(app, email, password):
    """
    Test that registration with missing or empty name returns an error.
    """
    with app.app_context():
        # Test with empty string
        user, error = register_user('', email, password)
        assert user is None
        assert error is not None
        assert 'name' in error.lower()
        
        # Test with whitespace only
        user, error = register_user('   ', email, password)
        assert user is None
        assert error is not None


@settings(max_examples=50)
@given(name=st.text(min_size=1, max_size=100), email=st.emails(), password=st.text(min_size=8, max_size=100))
def test_duplicate_email_returns_error(app, name, email, password):
    """
    Test that attempting to register with an existing email returns an error.
    """
    with app.app_context():
        # Register first user
        user1, error1 = register_user(name, email, password)
        
        # Skip if first registration failed for other reasons
        assume(user1 is not None)
        
        # Attempt to register second user with same email
        user2, error2 = register_user(name + '2', email, password + '2')
        
        # Verify second registration failed
        assert user2 is None
        assert error2 is not None
        assert 'email' in error2.lower() and 'exists' in error2.lower()
        
        # Clean up
        db.session.delete(user1)
        db.session.commit()


# Feature: ai-resume-platform, Property 3: Valid Authentication Returns JWT Token
@settings(max_examples=100)
@given(name=st.text(min_size=1, max_size=100), email=st.emails(), password=st.text(min_size=8, max_size=100))
def test_valid_authentication_returns_jwt_token(app, name, email, password):
    """
    Test that authentication with valid credentials returns a JWT token.
    For any registered user with correct credentials, authentication should return
    a valid JWT token that can be decoded to reveal the user's identity.
    """
    with app.app_context():
        # Register a user
        user, reg_error = register_user(name, email, password)
        
        # Skip if registration failed
        assume(user is not None)
        
        # Authenticate the user
        token, auth_user, auth_error = authenticate_user(email, password)
        
        # Verify authentication succeeded
        assert token is not None
        assert auth_user is not None
        assert auth_error is None
        assert auth_user.id == user.id
        
        # Verify token is a valid JWT
        assert isinstance(token, str)
        assert len(token) > 0
        
        # Decode token to verify it contains user identity
        decoded = pyjwt.decode(token, options={"verify_signature": False})
        assert 'sub' in decoded  # 'sub' is the standard JWT claim for subject (user id)
        assert decoded['sub'] == user.id
        
        # Clean up
        db.session.delete(user)
        db.session.commit()


@settings(max_examples=100)
@given(name=st.text(min_size=1, max_size=100), email=st.emails(), 
       password=st.text(min_size=8, max_size=100), 
       wrong_password=st.text(min_size=8, max_size=100))
def test_invalid_credentials_returns_error(app, name, email, password, wrong_password):
    """
    Test that authentication with invalid credentials returns an error.
    """
    # Skip if passwords are the same
    assume(password != wrong_password)
    
    with app.app_context():
        # Register a user
        user, reg_error = register_user(name, email, password)
        
        # Skip if registration failed
        assume(user is not None)
        
        # Attempt authentication with wrong password
        token, auth_user, auth_error = authenticate_user(email, wrong_password)
        
        # Verify authentication failed
        assert token is None
        assert auth_user is None
        assert auth_error is not None
        assert 'invalid' in auth_error.lower() or 'credentials' in auth_error.lower()
        
        # Clean up
        db.session.delete(user)
        db.session.commit()


def test_authentication_with_nonexistent_user_returns_error(app):
    """Test that authentication with non-existent email returns an error."""
    with app.app_context():
        token, user, error = authenticate_user('nonexistent@example.com', 'password123')
        
        assert token is None
        assert user is None
        assert error is not None
        assert 'invalid' in error.lower() or 'credentials' in error.lower()
