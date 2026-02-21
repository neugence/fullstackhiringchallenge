"""
Property-based tests for AI service.
Feature: ai-resume-platform, Property 5: Resume Analysis Returns Structured Feedback
Feature: ai-resume-platform, Property 7: Job Match Returns Structured Results
Feature: ai-resume-platform, Property 11: AI Service Response Consistency
"""
import pytest
import os
from hypothesis import given, strategies as st, settings
from app.services.ai_service import analyze_resume, match_job, _use_openai


# Feature: ai-resume-platform, Property 5: Resume Analysis Returns Structured Feedback
@settings(max_examples=100)
@given(resume_text=st.text(min_size=10, max_size=1000))
def test_analyze_resume_returns_structured_feedback(app, resume_text):
    """
    Test that resume analysis returns all required fields with correct types.
    For any valid resume text submitted for analysis, the AI service should return
    a response containing all required fields: score (0-100), missing_skills (array),
    improvements (array), and better_bullets (array).
    """
    with app.app_context():
        result = analyze_resume(resume_text)
        
        # Verify all required fields are present
        assert 'score' in result
        assert 'missing_skills' in result
        assert 'improvements' in result
        assert 'better_bullets' in result
        
        # Verify field types
        assert isinstance(result['score'], int)
        assert isinstance(result['missing_skills'], list)
        assert isinstance(result['improvements'], list)
        assert isinstance(result['better_bullets'], list)
        
        # Verify score is in valid range
        assert 0 <= result['score'] <= 100
        
        # Verify lists contain strings
        for skill in result['missing_skills']:
            assert isinstance(skill, str)
        for improvement in result['improvements']:
            assert isinstance(improvement, str)
        for bullet in result['better_bullets']:
            assert isinstance(bullet, str)


# Feature: ai-resume-platform, Property 7: Job Match Returns Structured Results
@settings(max_examples=100)
@given(
    resume_text=st.text(min_size=10, max_size=1000),
    job_description=st.text(min_size=10, max_size=1000)
)
def test_match_job_returns_structured_results(app, resume_text, job_description):
    """
    Test that job matching returns all required fields with correct types.
    For any valid resume and job description submitted for matching, the AI service
    should return a response containing all required fields: match_score (0-100),
    missing_keywords (array), and recommendations (array).
    """
    with app.app_context():
        result = match_job(resume_text, job_description)
        
        # Verify all required fields are present
        assert 'match_score' in result
        assert 'missing_keywords' in result
        assert 'recommendations' in result
        
        # Verify field types
        assert isinstance(result['match_score'], int)
        assert isinstance(result['missing_keywords'], list)
        assert isinstance(result['recommendations'], list)
        
        # Verify score is in valid range
        assert 0 <= result['match_score'] <= 100
        
        # Verify lists contain strings
        for keyword in result['missing_keywords']:
            assert isinstance(keyword, str)
        for recommendation in result['recommendations']:
            assert isinstance(recommendation, str)


# Feature: ai-resume-platform, Property 11: AI Service Response Consistency
@settings(max_examples=50)
@given(resume_text=st.text(min_size=10, max_size=500))
def test_ai_service_response_consistency_for_resume_analysis(app, resume_text):
    """
    Test that resume analysis response structure is consistent regardless of
    whether using OpenAI API or mock service.
    For any resume analysis request, the response structure should be identical
    whether using the OpenAI API or the mock service.
    """
    with app.app_context():
        # Get result (will use mock or OpenAI depending on configuration)
        result = analyze_resume(resume_text)
        
        # Define expected structure
        expected_keys = {'score', 'missing_skills', 'improvements', 'better_bullets'}
        
        # Verify structure matches expected
        assert set(result.keys()) == expected_keys
        
        # Verify types are consistent
        assert isinstance(result['score'], int)
        assert isinstance(result['missing_skills'], list)
        assert isinstance(result['improvements'], list)
        assert isinstance(result['better_bullets'], list)
        
        # Verify score range
        assert 0 <= result['score'] <= 100


@settings(max_examples=50)
@given(
    resume_text=st.text(min_size=10, max_size=500),
    job_description=st.text(min_size=10, max_size=500)
)
def test_ai_service_response_consistency_for_job_matching(app, resume_text, job_description):
    """
    Test that job matching response structure is consistent regardless of
    whether using OpenAI API or mock service.
    For any job match request, the response structure should be identical
    whether using the OpenAI API or the mock service.
    """
    with app.app_context():
        # Get result (will use mock or OpenAI depending on configuration)
        result = match_job(resume_text, job_description)
        
        # Define expected structure
        expected_keys = {'match_score', 'missing_keywords', 'recommendations'}
        
        # Verify structure matches expected
        assert set(result.keys()) == expected_keys
        
        # Verify types are consistent
        assert isinstance(result['match_score'], int)
        assert isinstance(result['missing_keywords'], list)
        assert isinstance(result['recommendations'], list)
        
        # Verify score range
        assert 0 <= result['match_score'] <= 100


def test_use_openai_detection(app):
    """Test that _use_openai correctly detects API key configuration."""
    with app.app_context():
        # Save original value
        original_key = os.getenv('OPENAI_API_KEY')
        
        # Test with no API key
        os.environ['OPENAI_API_KEY'] = ''
        assert _use_openai() is False
        
        # Test with API key
        os.environ['OPENAI_API_KEY'] = 'sk-test-key'
        assert _use_openai() is True
        
        # Restore original value
        if original_key:
            os.environ['OPENAI_API_KEY'] = original_key
        elif 'OPENAI_API_KEY' in os.environ:
            del os.environ['OPENAI_API_KEY']


def test_mock_services_work_without_api_key(app):
    """Test that mock services work when API key is not configured."""
    with app.app_context():
        # Save and remove API key
        original_key = os.getenv('OPENAI_API_KEY')
        if 'OPENAI_API_KEY' in os.environ:
            del os.environ['OPENAI_API_KEY']
        
        # Test resume analysis
        result = analyze_resume('Test resume text')
        assert result is not None
        assert 'score' in result
        
        # Test job matching
        result = match_job('Test resume', 'Test job description')
        assert result is not None
        assert 'match_score' in result
        
        # Restore original value
        if original_key:
            os.environ['OPENAI_API_KEY'] = original_key
