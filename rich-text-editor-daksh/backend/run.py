"""
Application entry point for running the Flask development server.
"""
from app.main import create_app
from app.database import init_db

# Create Flask application
app = create_app()

# Initialize database tables
init_db(app)

if __name__ == '__main__':
    print("Starting AI Resume Platform Backend on http://localhost:5000")
    print("API endpoints available at /api/*")
    app.run(host='0.0.0.0', port=5000, debug=True)
