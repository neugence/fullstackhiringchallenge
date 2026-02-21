"""
Property-based tests for resume review service.
Feature: ai-resume-platform, Property 6: Resume Review Round-Trip Persistence
"""
import pytest
from hypothesis import given, strategies as st, settings, assume
from app.services.resume_service import create_review, get_user_reviews, get_review_by_id
from app.models.user import User
from app.extensions import db


# Feature: ai-resume-platform, Property 6: Resume Review Round-Trip Persistence
@settings(max_examples=100)
@given(
    name=st.text(min_size=1, max_size=100),
    email=st.emails(),
    resume_text=st.text(min_size=10, max_size=1000)
)
def test_resume_review_round_trip_persistence(app, name, email, resume_text):
    """
    Test that resume reviews can be stored and retrieved with all data intact.
    For any resume review created by a user, storing the review and then retrieving
    it should return a record with all original data intact (user_id, resume_text,
    ai_score, feedback_json, timestamp).
    """
    with app.app_context():
        # Create a user
        user = User(name=name, email=email, password_hash='hashed')
        db.session.add(user)
        db.session.commit()
        user_id = user.id
        
        # Create a review
        review, error = create_review(user_id, resume_text)
        
        # Skip if creation failed
        assume(review is not None)
        
        review_id = review.id
        original_score = review.ai_score
        original_feedback = review.feedback_json
        original_text = review.resume_text
        
        # Retrieve the review
        retrieved_review, ret_error = get_review_by_id(review_id, user_id)
        
        # Verify retrieval succeeded
        assert retrieved_review is not None
        assert ret_error is None
        
        # Verify all data is intact
        assert retrieved_review.id == review_id
        assert retrieved_review.user_id == user_id
        assert retrieved_review.resume_text == original_text
        assert retrieved_review.ai_score == original_score
        assert retrieved_review.feedback_json == original_feedback
        assert retrieved_review.created_at is not None
        
        # Verify feedback structure
        assert 'missing_skills' in retrieved_review.feedback_json
        assert 'improvements' in retrieved_review.feedback_json
        assert 'better_bullets' in retrieved_review.feedback_json
        
        # Clean up
        db.session.delete(review)
        db.session.delete(user)
        db.session.commit()


@settings(max_examples=50)
@given(
    name=st.text(min_size=1, max_size=100),
    email=st.emails(),
    resume_texts=st.lists(st.text(min_size=10, max_size=500), min_size=2, max_size=5)
)
def test_get_user_reviews_returns_all_reviews(app, name, email, resume_texts):
    """
    Test that get_user_reviews returns all reviews for a user.
    """
    with app.app_context():
        # Create a user
        user = User(name=name, email=email, password_hash='hashed')
        db.session.add(user)
        db.session.commit()
        user_id = user.id
        
        # Create multiple reviews
        created_reviews = []
        for resume_text in resume_texts:
            review, error = create_review(user_id, resume_text)
            if review:
                created_reviews.append(review)
        
        # Skip if no reviews were created
        assume(len(created_reviews) > 0)
        
        # Retrieve all reviews
        retrieved_reviews = get_user_reviews(user_id)
        
        # Verify count matches
        assert len(retrieved_reviews) == len(created_reviews)
        
        # Verify all reviews belong to the user
        for review in retrieved_reviews:
            assert review.user_id == user_id
        
        # Clean up
        for review in created_reviews:
            db.session.delete(review)
        db.session.delete(user)
        db.session.commit()


def test_empty_resume_text_returns_error(app):
    """Test that creating a review with empty resume text returns an error."""
    with app.app_context():
        # Create a user
        user = User(name='Test', email='test@example.com', password_hash='hashed')
        db.session.add(user)
        db.session.commit()
        
        # Attempt to create review with empty text
        review, error = create_review(user.id, '')
        
        assert review is None
        assert error is not None
        assert 'resume' in error.lower() or 'empty' in error.lower()
        
        # Clean up
        db.session.delete(user)
        db.session.commit()


def test_whitespace_only_resume_text_returns_error(app):
    """Test that creating a review with whitespace-only text returns an error."""
    with app.app_context():
        # Create a user
        user = User(name='Test', email='test@example.com', password_hash='hashed')
        db.session.add(user)
        db.session.commit()
        
        # Attempt to create review with whitespace only
        review, error = create_review(user.id, '   \n\t  ')
        
        assert review is None
        assert error is not None
        
        # Clean up
        db.session.delete(user)
        db.session.commit()
