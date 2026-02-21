"""
Job match service for creating and retrieving job matching analysis results.
"""
from app.models.job_match import JobMatch
from app.extensions import db
from app.services.ai_service import match_job
from app.utils.validators import validate_resume_text, validate_job_description


def create_match(user_id, resume_text, job_description):
    """Create a new job match by analyzing resume against job description."""
    # Validate inputs
    is_valid, error_msg = validate_resume_text(resume_text)
    if not is_valid:
        return None, error_msg
    
    is_valid, error_msg = validate_job_description(job_description)
    if not is_valid:
        return None, error_msg
    
    try:
        # Get AI analysis
        analysis = match_job(resume_text, job_description)
        
        # Create missing keywords JSON
        missing_keywords_json = {
            'missing_keywords': analysis.get('missing_keywords', []),
            'recommendations': analysis.get('recommendations', [])
        }
        
        # Create match record
        job_match = JobMatch(
            user_id=user_id,
            resume_text=resume_text.strip(),
            job_description=job_description.strip(),
            match_score=analysis.get('match_score', 0),
            missing_keywords_json=missing_keywords_json
        )
        
        db.session.add(job_match)
        db.session.commit()
        
        return job_match, None
    
    except Exception as e:
        db.session.rollback()
        return None, f"Failed to create match: {str(e)}"


def get_user_matches(user_id, limit=None):
    """Retrieve all job matches for a specific user, ordered by most recent first."""
    try:
        query = JobMatch.query.filter_by(user_id=user_id).order_by(JobMatch.created_at.desc())
        
        if limit:
            query = query.limit(limit)
        
        return query.all()
    
    except Exception as e:
        print(f"Error retrieving matches: {str(e)}")
        return []
