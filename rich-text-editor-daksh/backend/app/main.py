"""
Flask application factory and configuration.
"""
from flask import Flask, jsonify
from app.config import get_config
from app.extensions import init_extensions
from app.routes.auth import auth_bp
from app.routes.resume import resume_bp
from app.routes.job import job_bp


def create_app():
    """
    Application factory for creating Flask app instance.
    
    Returns:
        Flask: Configured Flask application
    """
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(get_config())
    
    # Initialize extensions
    init_extensions(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(resume_bp)
    app.register_blueprint(job_bp)
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Resource not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    @app.route('/api/health', methods=['GET'])
    def health_check():
        """Health check endpoint."""
        return jsonify({'status': 'healthy'}), 200
    
    return app
