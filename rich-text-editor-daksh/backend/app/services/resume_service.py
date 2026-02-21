"""
Resume review service for creating and retrieving resume analysis results.
"""
from app.models.resume_review import ResumeReview
from app.extensions import db
from app.services.ai_service import analyze_resume
from app.utils.validators import validate_resume_text


def create_review(user_id, resume_text):
    """
    Create a new resume review by analyzing the resume with AI and storing the result.
    
    Args:
        user_id (int): ID of the user creating the review
        resume_text (str): Full text of the resume to analyze
    
    Returns:
        tuple: (review: ResumeReview or None, error: str or None)
    
    Example:
        >>> review, error = create_review(1, 'Software Engineer with 5 years...')
        >>> if review:
        ...     print(f"Review created with score: {review.ai_score}")
    """
    # Validate resume text
    is_valid, error_msg = validate_resume_text(resume_text)
    if not is_valid:
        return None, error_msg
    
    try:
        # Get AI analysis
        analysis = analyze_resume(resume_text)
        
        # Create feedback JSON
        feedback_json = {
            'missing_skills': analysis.get('missing_skills', []),
            'improvements': analysis.get('improvements', []),
            'better_bullets': analysis.get('better_bullets', [])
        }
        
        # Create review record
        review = ResumeReview(
            user_id=user_id,
            resume_text=resume_text.strip(),
            ai_score=analysis.get('score', 0),
            feedback_json=feedback_json
        )
        
        # Save to database
        db.session.add(review)
        db.session.commit()
        
        return review, None
    
    except Exception as e:
        db.session.rollback()
        return None, f"Failed to create review: {str(e)}"


def get_user_reviews(user_id, limit=None):
    """
    Retrieve all resume reviews for a specific user, ordered by most recent first.
    
    Args:
        user_id (int): ID of the user whose reviews to retrieve
        limit (int, optional): Maximum number of reviews to return
    
    Returns:
        list: List of ResumeReview objects ordered by created_at DESC
    
    Example:
        >>> reviews = get_user_reviews(1, limit=10)
        >>> for review in reviews:
        ...     print(f"Score: {review.ai_score}, Date: {review.created_at}")
    """
    try:
        query = ResumeReview.query.filter_by(user_id=user_id).order_by(ResumeReview.created_at.desc())
        
        if limit:
            query = query.limit(limit)
        
        return query.all()
    
    except Exception as e:
        print(f"Error retrieving reviews: {str(e)}")
        return []


def get_review_by_id(review_id, user_id):
    """
    Retrieve a specific resume review by ID, ensuring it belongs to the user.
    
    Args:
        review_id (int): ID of the review to retrieve
        user_id (int): ID of the user (for authorization check)
    
    Returns:
        tuple: (review: ResumeReview or None, error: str or None)
    
    Example:
        >>> review, error = get_review_by_id(1, 1)
        >>> if review:
        ...     print(f"Review score: {review.ai_score}")
    """
    try:
        review = ResumeReview.query.filter_by(id=review_id, user_id=user_id).first()
        
        if not review:
            return None, "Review not found or access denied"
        
        return review, None
    
    except Exception as e:
        return None, f"Error retrieving review: {str(e)}"
