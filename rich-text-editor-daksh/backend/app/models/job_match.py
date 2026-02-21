"""
JobMatch model for storing AI-generated job matching analysis results.
"""
from datetime import datetime
from app.extensions import db
from sqlalchemy.dialects.postgresql import JSON


class JobMatch(db.Model):
    """
    JobMatch model representing AI analysis results for resume-job matching.
    
    Attributes:
        id: Primary key, auto-incrementing integer
        user_id: Foreign key referencing User.id
        resume_text: The full text of the resume
        job_description: The full text of the job description
        match_score: AI-generated match score from 0-100
        missing_keywords_json: JSON object containing missing_keywords and recommendations
        created_at: Timestamp of match creation
    """
    __tablename__ = 'job_matches'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    resume_text = db.Column(db.Text, nullable=False)
    job_description = db.Column(db.Text, nullable=False)
    match_score = db.Column(db.Integer, nullable=False)
    missing_keywords_json = db.Column(JSON, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, index=True)
    
    # Add check constraint for match_score (0-100)
    __table_args__ = (
        db.CheckConstraint('match_score >= 0 AND match_score <= 100', name='check_match_score_range'),
        db.Index('idx_user_match_created', 'user_id', 'created_at'),
    )
    
    def __repr__(self):
        """String representation of JobMatch object."""
        return f'<JobMatch {self.id} - Score: {self.match_score}>'
    
    def to_dict(self, include_full_text=False):
        """
        Convert JobMatch object to dictionary for JSON serialization.
        
        Args:
            include_full_text: If True, includes full texts; otherwise includes previews
        
        Returns:
            dict: Job match data
        """
        result = {
            'id': self.id,
            'user_id': self.user_id,
            'match_score': self.match_score,
            'missing_keywords': self.missing_keywords_json.get('missing_keywords', []),
            'recommendations': self.missing_keywords_json.get('recommendations', []),
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        
        if include_full_text:
            result['resume_text'] = self.resume_text
            result['job_description'] = self.job_description
        else:
            # Include previews (first 100 characters)
            result['resume_preview'] = self.resume_text[:100] + '...' if len(self.resume_text) > 100 else self.resume_text
            result['job_preview'] = self.job_description[:100] + '...' if len(self.job_description) > 100 else self.job_description
        
        return result
