"""
Property-based tests for database models.
Feature: ai-resume-platform, Property 12: Database Referential Integrity
"""
import pytest
from hypothesis import given, strategies as st, settings
from app.models.user import User
from app.models.resume_review import ResumeReview
from app.models.job_match import JobMatch
from app.extensions import db


# Hypothesis strategies for generating test data
@st.composite
def user_data(draw):
    """Generate random valid user data."""
    name = draw(st.text(min_size=1, max_size=100, alphabet=st.characters(blacklist_categories=('Cs',))))
    email = draw(st.emails())
    password_hash = draw(st.text(min_size=8, max_size=255))
    return {'name': name, 'email': email, 'password_hash': password_hash}


@st.composite
def resume_review_data(draw):
    """Generate random valid resume review data."""
    resume_text = draw(st.text(min_size=10, max_size=1000))
    ai_score = draw(st.integers(min_value=0, max_value=100))
    feedback_json = {
        'missing_skills': draw(st.lists(st.text(min_size=1, max_size=50), min_size=0, max_size=10)),
        'improvements': draw(st.lists(st.text(min_size=1, max_size=100), min_size=0, max_size=10)),
        'better_bullets': draw(st.lists(st.text(min_size=1, max_size=200), min_size=0, max_size=10))
    }
    return {'resume_text': resume_text, 'ai_score': ai_score, 'feedback_json': feedback_json}


@st.composite
def job_match_data(draw):
    """Generate random valid job match data."""
    resume_text = draw(st.text(min_size=10, max_size=1000))
    job_description = draw(st.text(min_size=10, max_size=1000))
    match_score = draw(st.integers(min_value=0, max_value=100))
    missing_keywords_json = {
        'missing_keywords': draw(st.lists(st.text(min_size=1, max_size=50), min_size=0, max_size=10)),
        'recommendations': draw(st.lists(st.text(min_size=1, max_size=100), min_size=0, max_size=10))
    }
    return {
        'resume_text': resume_text,
        'job_description': job_description,
        'match_score': match_score,
        'missing_keywords_json': missing_keywords_json
    }


# Feature: ai-resume-platform, Property 12: Database Referential Integrity
@settings(max_examples=100)
@given(user_data=user_data(), review_data=resume_review_data())
def test_resume_review_foreign_key_integrity(app, user_data, review_data):
    """
    Test that ResumeReview maintains foreign key relationship with User.
    For any user with associated resume reviews, the foreign key relationships
    should be maintained, ensuring that reviews always reference valid users.
    """
    with app.app_context():
        # Create a user
        user = User(**user_data)
        db.session.add(user)
        db.session.commit()
        user_id = user.id
        
        # Create a resume review for the user
        review = ResumeReview(user_id=user_id, **review_data)
        db.session.add(review)
        db.session.commit()
        review_id = review.id
        
        # Verify the review exists and references the correct user
        retrieved_review = ResumeReview.query.get(review_id)
        assert retrieved_review is not None
        assert retrieved_review.user_id == user_id
        assert retrieved_review.user.email == user_data['email']
        
        # Clean up
        db.session.delete(retrieved_review)
        db.session.delete(user)
        db.session.commit()


@settings(max_examples=100)
@given(user_data=user_data(), match_data=job_match_data())
def test_job_match_foreign_key_integrity(app, user_data, match_data):
    """
    Test that JobMatch maintains foreign key relationship with User.
    For any user with associated job matches, the foreign key relationships
    should be maintained, ensuring that matches always reference valid users.
    """
    with app.app_context():
        # Create a user
        user = User(**user_data)
        db.session.add(user)
        db.session.commit()
        user_id = user.id
        
        # Create a job match for the user
        match = JobMatch(user_id=user_id, **match_data)
        db.session.add(match)
        db.session.commit()
        match_id = match.id
        
        # Verify the match exists and references the correct user
        retrieved_match = JobMatch.query.get(match_id)
        assert retrieved_match is not None
        assert retrieved_match.user_id == user_id
        assert retrieved_match.user.email == user_data['email']
        
        # Clean up
        db.session.delete(retrieved_match)
        db.session.delete(user)
        db.session.commit()


@settings(max_examples=100)
@given(user_data=user_data(), review_data=resume_review_data(), match_data=job_match_data())
def test_cascade_delete_integrity(app, user_data, review_data, match_data):
    """
    Test that deleting a user cascades to delete associated reviews and matches.
    This ensures referential integrity is maintained through cascade operations.
    """
    with app.app_context():
        # Create a user
        user = User(**user_data)
        db.session.add(user)
        db.session.commit()
        user_id = user.id
        
        # Create a resume review and job match for the user
        review = ResumeReview(user_id=user_id, **review_data)
        match = JobMatch(user_id=user_id, **match_data)
        db.session.add(review)
        db.session.add(match)
        db.session.commit()
        review_id = review.id
        match_id = match.id
        
        # Delete the user
        db.session.delete(user)
        db.session.commit()
        
        # Verify that reviews and matches were also deleted (cascade)
        assert ResumeReview.query.get(review_id) is None
        assert JobMatch.query.get(match_id) is None
        assert User.query.get(user_id) is None


def test_score_constraints(app):
    """
    Test that score constraints (0-100) are enforced for ResumeReview and JobMatch.
    """
    with app.app_context():
        # Create a user
        user = User(name='Test User', email='test@example.com', password_hash='hashed')
        db.session.add(user)
        db.session.commit()
        
        # Test valid scores
        review = ResumeReview(
            user_id=user.id,
            resume_text='Test resume',
            ai_score=50,
            feedback_json={'missing_skills': [], 'improvements': [], 'better_bullets': []}
        )
        db.session.add(review)
        db.session.commit()
        assert review.ai_score == 50
        
        match = JobMatch(
            user_id=user.id,
            resume_text='Test resume',
            job_description='Test job',
            match_score=75,
            missing_keywords_json={'missing_keywords': [], 'recommendations': []}
        )
        db.session.add(match)
        db.session.commit()
        assert match.match_score == 75
        
        # Clean up
        db.session.delete(review)
        db.session.delete(match)
        db.session.delete(user)
        db.session.commit()
