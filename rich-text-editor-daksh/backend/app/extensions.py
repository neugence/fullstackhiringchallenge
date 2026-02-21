"""
Flask extensions initialization module.
Extensions are initialized here and then imported by the application factory.
"""
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS

# Initialize extensions
# These will be initialized with the app in the application factory
db = SQLAlchemy()
jwt = JWTManager()
bcrypt = Bcrypt()
cors = CORS()


def init_extensions(app):
    """
    Initialize Flask extensions with the application instance.
    
    Args:
        app: Flask application instance
    """
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})
