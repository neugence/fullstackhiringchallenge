"""
Property-based tests for job match service.
Feature: ai-resume-platform, Property 8: Job Match Round-Trip Persistence
"""
import pytest
from hypothesis import given, strategies as st, settings, assume
from app.services.job_match_service import create_match, get_user_matches
from app.models.user import User
from app.extensions import db


# Feature: ai-resume-platform, Property 8: Job Match Round-Trip Persistence
@settings(max_examples=100)
@given(
    name=st.text(min_size=1, max_size=100),
    email=st.emails(),
    resume_text=st.text(min_size=10, max_size=1000),
    job_description=st.text(min_size=10, max_size=1000)
)
def test_job_match_round_trip_persistence(app, name, email, resume_text, job_description):
    """
    Test that job matches can be stored and retrieved with all data intact.
    For any job match created by a user, storing the match and then retrieving
    it should return a record with all original data intact (user_id, resume_text,
    job_description, match_score, missing_keywords_json, timestamp).
    """
    with app.app_context():
        # Create a user
        user = User(name=name, email=email, password_hash='hashed')
        db.session.add(user)
        db.session.commit()
        user_id = user.id
        
        # Create a match
        match, error = create_match(user_id, resume_text, job_description)
        
        # Skip if creation failed
        assume(match is not None)
        
        match_id = match.id
        original_score = match.match_score
        original_keywords = match.missing_keywords_json
        original_resume = match.resume_text
        original_job = match.job_description
        
        # Retrieve the match
        matches = get_user_matches(user_id)
        retrieved_match = next((m for m in matches if m.id == match_id), None)
        
        # Verify retrieval succeeded
        assert retrieved_match is not None
        
        # Verify all data is intact
        assert retrieved_match.id == match_id
        assert retrieved_match.user_id == user_id
        assert retrieved_match.resume_text == original_resume
        assert retrieved_match.job_description == original_job
        assert retrieved_match.match_score == original_score
        assert retrieved_match.missing_keywords_json == original_keywords
        assert retrieved_match.created_at is not None
        
        # Verify keywords structure
        assert 'missing_keywords' in retrieved_match.missing_keywords_json
        assert 'recommendations' in retrieved_match.missing_keywords_json
        
        # Clean up
        db.session.delete(match)
        db.session.delete(user)
        db.session.commit()


@settings(max_examples=50)
@given(
    name=st.text(min_size=1, max_size=100),
    email=st.emails(),
    matches_data=st.lists(
        st.tuples(
            st.text(min_size=10, max_size=500),
            st.text(min_size=10, max_size=500)
        ),
        min_size=2,
        max_size=5
    )
)
def test_get_user_matches_returns_all_matches(app, name, email, matches_data):
    """
    Test that get_user_matches returns all matches for a user.
    """
    with app.app_context():
        # Create a user
        user = User(name=name, email=email, password_hash='hashed')
        db.session.add(user)
        db.session.commit()
        user_id = user.id
        
        # Create multiple matches
        created_matches = []
        for resume_text, job_description in matches_data:
            match, error = create_match(user_id, resume_text, job_description)
            if match:
                created_matches.append(match)
        
        # Skip if no matches were created
        assume(len(created_matches) > 0)
        
        # Retrieve all matches
        retrieved_matches = get_user_matches(user_id)
        
        # Verify count matches
        assert len(retrieved_matches) == len(created_matches)
        
        # Verify all matches belong to the user
        for match in retrieved_matches:
            assert match.user_id == user_id
        
        # Clean up
        for match in created_matches:
            db.session.delete(match)
        db.session.delete(user)
        db.session.commit()


def test_empty_resume_text_returns_error(app):
    """Test that creating a match with empty resume text returns an error."""
    with app.app_context():
        # Create a user
        user = User(name='Test', email='test@example.com', password_hash='hashed')
        db.session.add(user)
        db.session.commit()
        
        # Attempt to create match with empty resume
        match, error = create_match(user.id, '', 'Job description')
        
        assert match is None
        assert error is not None
        assert 'resume' in error.lower() or 'empty' in error.lower()
        
        # Clean up
        db.session.delete(user)
        db.session.commit()


def test_empty_job_description_returns_error(app):
    """Test that creating a match with empty job description returns an error."""
    with app.app_context():
        # Create a user
        user = User(name='Test', email='test@example.com', password_hash='hashed')
        db.session.add(user)
        db.session.commit()
        
        # Attempt to create match with empty job description
        match, error = create_match(user.id, 'Resume text', '')
        
        assert match is None
        assert error is not None
        assert 'job' in error.lower() or 'description' in error.lower()
        
        # Clean up
        db.session.delete(user)
        db.session.commit()
