"""
ResumeReview model for storing AI-generated resume analysis results.
"""
from datetime import datetime
from app.extensions import db
from sqlalchemy.dialects.postgresql import JSON


class ResumeReview(db.Model):
    """
    ResumeReview model representing AI analysis results for resumes.
    
    Attributes:
        id: Primary key, auto-incrementing integer
        user_id: Foreign key referencing User.id
        resume_text: The full text of the resume that was analyzed
        ai_score: AI-generated score from 0-100
        feedback_json: JSON object containing missing_skills, improvements, and better_bullets
        created_at: Timestamp of review creation
    """
    __tablename__ = 'resume_reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    resume_text = db.Column(db.Text, nullable=False)
    ai_score = db.Column(db.Integer, nullable=False)
    feedback_json = db.Column(JSON, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, index=True)
    
    # Add check constraint for ai_score (0-100)
    __table_args__ = (
        db.CheckConstraint('ai_score >= 0 AND ai_score <= 100', name='check_ai_score_range'),
        db.Index('idx_user_created', 'user_id', 'created_at'),
    )
    
    def __repr__(self):
        """String representation of ResumeReview object."""
        return f'<ResumeReview {self.id} - Score: {self.ai_score}>'
    
    def to_dict(self, include_full_text=False):
        """
        Convert ResumeReview object to dictionary for JSON serialization.
        
        Args:
            include_full_text: If True, includes full resume_text; otherwise includes preview
        
        Returns:
            dict: Resume review data
        """
        result = {
            'id': self.id,
            'user_id': self.user_id,
            'score': self.ai_score,
            'feedback': self.feedback_json,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        
        if include_full_text:
            result['resume_text'] = self.resume_text
        else:
            # Include preview (first 100 characters)
            result['resume_preview'] = self.resume_text[:100] + '...' if len(self.resume_text) > 100 else self.resume_text
        
        return result
