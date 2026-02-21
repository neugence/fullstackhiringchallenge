"""
Property-based tests for API routes and endpoint protection.
Feature: ai-resume-platform, Property 4: Protected Endpoints Require Authentication
Feature: ai-resume-platform, Property 9: User Data Isolation
Feature: ai-resume-platform, Property 10: History Ordered by Recency
"""
import pytest
from hypothesis import given, strategies as st, settings, assume
from app.models.user import User
from app.models.resume_review import ResumeReview
from app.models.job_match import JobMatch
from app.extensions import db
from app.services.auth_service import register_user
import time


# Feature: ai-resume-platform, Property 4: Protected Endpoints Require Authentication
@settings(max_examples=50)
@given(endpoint=st.sampled_from([
    '/api/resume/review',
    '/api/resume/history',
    '/api/job/match',
    '/api/job/history'
]))
def test_protected_endpoints_require_authentication(client, app, endpoint):
    """
    Test that protected endpoints reject requests without valid JWT tokens.
    For any protected API endpoint (excluding /api/auth/register and /api/auth/login),
    requests without a valid JWT token should be rejected with an authentication error.
    """
    with app.app_context():
        # Attempt to access protected endpoint without token
        if endpoint in ['/api/resume/review', '/api/job/match']:
            response = client.post(endpoint, json={'test': 'data'})
        else:
            response = client.get(endpoint)
        
        # Verify request was rejected
        assert response.status_code == 401
        data = response.get_json()
        assert 'msg' in data or 'error' in data


def test_public_endpoints_accessible_without_auth(client, app):
    """Test that public endpoints are accessible without authentication."""
    with app.app_context():
        # Test register endpoint
        response = client.post('/api/auth/register', json={
            'name': 'Test User',
            'email': 'test@example.com',
            'password': 'password123'
        })
        assert response.status_code in [201, 400]  # 201 success or 400 if email exists
        
        # Test login endpoint
        response = client.post('/api/auth/login', json={
            'email': 'test@example.com',
            'password': 'password123'
        })
        assert response.status_code in [200, 401]  # 200 success or 401 if invalid


# Feature: ai-resume-platform, Property 9: User Data Isolation
@settings(max_examples=50)
@given(
    user1_name=st.text(min_size=1, max_size=50),
    user2_name=st.text(min_size=1, max_size=50),
    resume_text=st.text(min_size=10, max_size=500)
)
def test_user_data_isolation_for_reviews(app, client, user1_name, user2_name, resume_text):
    """
    Test that users can only access their own resume reviews.
    For any two different users, each user should only be able to retrieve
    their own resume reviews, never seeing data belonging to the other user.
    """
    with app.app_context():
        # Create two users
        user1, _ = register_user(user1_name, f'{user1_name}@test.com', 'password123')
        user2, _ = register_user(user2_name, f'{user2_name}@test.com', 'password123')
        
        assume(user1 is not None and user2 is not None)
        
        # Create a review for user1
        review = ResumeReview(
            user_id=user1.id,
            resume_text=resume_text,
            ai_score=75,
            feedback_json={'missing_skills': [], 'improvements': [], 'better_bullets': []}
        )
        db.session.add(review)
        db.session.commit()
        
        # Login as user2
        login_response = client.post('/api/auth/login', json={
            'email': f'{user2_name}@test.com',
            'password': 'password123'
        })
        token = login_response.get_json()['access_token']
        
        # Try to access reviews as user2
        response = client.get('/api/resume/history', headers={
            'Authorization': f'Bearer {token}'
        })
        
        # Verify user2 doesn't see user1's reviews
        data = response.get_json()
        assert response.status_code == 200
        assert len(data['reviews']) == 0  # User2 has no reviews
        
        # Clean up
        db.session.delete(review)
        db.session.delete(user1)
        db.session.delete(user2)
        db.session.commit()


@settings(max_examples=50)
@given(
    user1_name=st.text(min_size=1, max_size=50),
    user2_name=st.text(min_size=1, max_size=50),
    resume_text=st.text(min_size=10, max_size=500),
    job_text=st.text(min_size=10, max_size=500)
)
def test_user_data_isolation_for_matches(app, client, user1_name, user2_name, resume_text, job_text):
    """
    Test that users can only access their own job matches.
    For any two different users, each user should only be able to retrieve
    their own job matches, never seeing data belonging to the other user.
    """
    with app.app_context():
        # Create two users
        user1, _ = register_user(user1_name, f'{user1_name}@test.com', 'password123')
        user2, _ = register_user(user2_name, f'{user2_name}@test.com', 'password123')
        
        assume(user1 is not None and user2 is not None)
        
        # Create a match for user1
        match = JobMatch(
            user_id=user1.id,
            resume_text=resume_text,
            job_description=job_text,
            match_score=80,
            missing_keywords_json={'missing_keywords': [], 'recommendations': []}
        )
        db.session.add(match)
        db.session.commit()
        
        # Login as user2
        login_response = client.post('/api/auth/login', json={
            'email': f'{user2_name}@test.com',
            'password': 'password123'
        })
        token = login_response.get_json()['access_token']
        
        # Try to access matches as user2
        response = client.get('/api/job/history', headers={
            'Authorization': f'Bearer {token}'
        })
        
        # Verify user2 doesn't see user1's matches
        data = response.get_json()
        assert response.status_code == 200
        assert len(data['matches']) == 0  # User2 has no matches
        
        # Clean up
        db.session.delete(match)
        db.session.delete(user1)
        db.session.delete(user2)
        db.session.commit()


# Feature: ai-resume-platform, Property 10: History Ordered by Recency
@settings(max_examples=30)
@given(
    name=st.text(min_size=1, max_size=50),
    resume_texts=st.lists(st.text(min_size=10, max_size=200), min_size=3, max_size=5)
)
def test_review_history_ordered_by_recency(app, client, name, resume_texts):
    """
    Test that resume review history is ordered by creation date (most recent first).
    For any user with multiple resume reviews, retrieving their history should
    return results ordered by creation date with the most recent items first.
    """
    with app.app_context():
        # Create a user
        user, _ = register_user(name, f'{name}@test.com', 'password123')
        assume(user is not None)
        
        # Create multiple reviews with slight time delays
        review_ids = []
        for i, resume_text in enumerate(resume_texts):
            review = ResumeReview(
                user_id=user.id,
                resume_text=resume_text,
                ai_score=70 + i,
                feedback_json={'missing_skills': [], 'improvements': [], 'better_bullets': []}
            )
            db.session.add(review)
            db.session.commit()
            review_ids.append(review.id)
            time.sleep(0.01)  # Small delay to ensure different timestamps
        
        # Login and get history
        login_response = client.post('/api/auth/login', json={
            'email': f'{name}@test.com',
            'password': 'password123'
        })
        token = login_response.get_json()['access_token']
        
        response = client.get('/api/resume/history', headers={
            'Authorization': f'Bearer {token}'
        })
        
        data = response.get_json()
        reviews = data['reviews']
        
        # Verify ordering (most recent first)
        assert len(reviews) == len(resume_texts)
        for i in range(len(reviews) - 1):
            assert reviews[i]['created_at'] >= reviews[i + 1]['created_at']
        
        # Clean up
        for review_id in review_ids:
            review = ResumeReview.query.get(review_id)
            if review:
                db.session.delete(review)
        db.session.delete(user)
        db.session.commit()


def test_empty_history_returns_empty_list(app, client):
    """Test that users with no history get empty lists."""
    with app.app_context():
        # Create a user
        user, _ = register_user('NewUser', 'newuser@test.com', 'password123')
        
        # Login
        login_response = client.post('/api/auth/login', json={
            'email': 'newuser@test.com',
            'password': 'password123'
        })
        token = login_response.get_json()['access_token']
        
        # Get review history
        response = client.get('/api/resume/history', headers={
            'Authorization': f'Bearer {token}'
        })
        data = response.get_json()
        assert response.status_code == 200
        assert len(data['reviews']) == 0
        
        # Get match history
        response = client.get('/api/job/history', headers={
            'Authorization': f'Bearer {token}'
        })
        data = response.get_json()
        assert response.status_code == 200
        assert len(data['matches']) == 0
        
        # Clean up
        db.session.delete(user)
        db.session.commit()
