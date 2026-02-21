"""
Database initialization and management module.
Provides functions for creating tables and managing database state.
"""
from app.extensions import db


def init_db(app):
    """
    Initialize the database with the application context.
    Creates all tables defined in models.
    
    Args:
        app: Flask application instance
    """
    with app.app_context():
        # Import models to ensure they are registered with SQLAlchemy
        from app.models.user import User
        from app.models.resume_review import ResumeReview
        from app.models.job_match import JobMatch
        
        # Create all tables
        db.create_all()
        print("Database tables created successfully!")


def drop_db(app):
    """
    Drop all database tables.
    WARNING: This will delete all data!
    
    Args:
        app: Flask application instance
    """
    with app.app_context():
        db.drop_all()
        print("Database tables dropped!")


def reset_db(app):
    """
    Reset the database by dropping and recreating all tables.
    WARNING: This will delete all data!
    
    Args:
        app: Flask application instance
    """
    drop_db(app)
    init_db(app)
