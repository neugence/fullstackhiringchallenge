"""
User model for authentication and user management.
"""
from datetime import datetime
from app.extensions import db


class User(db.Model):
    """
    User model representing registered users in the system.
    
    Attributes:
        id: Primary key, auto-incrementing integer
        name: User's full name
        email: User's email address (unique, indexed)
        password_hash: Hashed password for authentication
        created_at: Timestamp of account creation
    """
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    # Relationships
    resume_reviews = db.relationship('ResumeReview', backref='user', lazy=True, cascade='all, delete-orphan')
    job_matches = db.relationship('JobMatch', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        """String representation of User object."""
        return f'<User {self.email}>'
    
    def to_dict(self):
        """
        Convert User object to dictionary for JSON serialization.
        Excludes password_hash for security.
        
        Returns:
            dict: User data without sensitive information
        """
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
