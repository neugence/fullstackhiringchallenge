"""
Pytest configuration and fixtures for testing.
"""
import pytest
from app.main import create_app
from app.extensions import db
from app.models.user import User
from app.models.resume_review import ResumeReview
from app.models.job_match import JobMatch


@pytest.fixture(scope='function')
def app():
    """Create and configure a test Flask application instance."""
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['JWT_SECRET_KEY'] = 'test-secret-key'
    
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture(scope='function')
def client(app):
    """Create a test client for the Flask application."""
    return app.test_client()


@pytest.fixture(scope='function')
def db_session(app):
    """Create a database session for testing."""
    with app.app_context():
        yield db.session
