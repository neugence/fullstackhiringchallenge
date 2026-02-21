"""
Property-based tests for password hashing utilities.
Feature: ai-resume-platform, Property 1: User Registration Creates Valid Accounts
"""
import pytest
from hypothesis import given, strategies as st, settings
from app.utils.password import hash_password, verify_password


# Feature: ai-resume-platform, Property 1: User Registration Creates Valid Accounts
@settings(max_examples=100)
@given(password=st.text(min_size=1, max_size=100))
def test_password_hashing_creates_different_hash(app, password):
    """
    Test that hashing a password creates a hash different from the original password.
    For any valid password, the hashed version should not equal the original.
    
    This validates that passwords are properly hashed and not stored in plain text.
    """
    with app.app_context():
        hashed = hash_password(password)
        
        # Verify hash is different from original password
        assert hashed != password
        
        # Verify hash is a non-empty string
        assert isinstance(hashed, str)
        assert len(hashed) > 0


@settings(max_examples=100)
@given(password=st.text(min_size=1, max_size=100))
def test_password_verification_succeeds_with_correct_password(app, password):
    """
    Test that password verification succeeds when given the correct password.
    For any password, hashing it and then verifying with the same password should succeed.
    """
    with app.app_context():
        hashed = hash_password(password)
        
        # Verify that the original password matches the hash
        assert verify_password(password, hashed) is True


@settings(max_examples=100)
@given(password=st.text(min_size=1, max_size=100), wrong_password=st.text(min_size=1, max_size=100))
def test_password_verification_fails_with_wrong_password(app, password, wrong_password):
    """
    Test that password verification fails when given an incorrect password.
    For any two different passwords, verification should fail.
    """
    # Skip if passwords happen to be the same
    if password == wrong_password:
        return
    
    with app.app_context():
        hashed = hash_password(password)
        
        # Verify that a different password does not match the hash
        assert verify_password(wrong_password, hashed) is False


@settings(max_examples=100)
@given(password=st.text(min_size=1, max_size=100))
def test_same_password_produces_different_hashes(app, password):
    """
    Test that hashing the same password multiple times produces different hashes.
    This is due to bcrypt's salt mechanism, which ensures rainbow table attacks are ineffective.
    """
    with app.app_context():
        hash1 = hash_password(password)
        hash2 = hash_password(password)
        
        # Hashes should be different due to different salts
        assert hash1 != hash2
        
        # But both should verify correctly
        assert verify_password(password, hash1) is True
        assert verify_password(password, hash2) is True


def test_empty_password_raises_error(app):
    """Test that attempting to hash an empty password raises an error."""
    with app.app_context():
        with pytest.raises(ValueError):
            hash_password('')


def test_verify_with_empty_inputs_returns_false(app):
    """Test that verification with empty inputs returns False."""
    with app.app_context():
        assert verify_password('', 'somehash') is False
        assert verify_password('password', '') is False
        assert verify_password('', '') is False
