"""
Authentication routes for user registration and login.
"""
from flask import Blueprint, request, jsonify
from app.services.auth_service import register_user, authenticate_user

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user."""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'Request body is required'}), 400
    
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    
    if not all([name, email, password]):
        return jsonify({'error': 'Name, email, and password are required'}), 400
    
    user, error = register_user(name, email, password)
    
    if error:
        return jsonify({'error': error}), 400
    
    return jsonify({
        'message': 'User registered successfully',
        'user': user.to_dict()
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    """Authenticate user and return JWT token."""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'Request body is required'}), 400
    
    email = data.get('email')
    password = data.get('password')
    
    if not all([email, password]):
        return jsonify({'error': 'Email and password are required'}), 400
    
    token, user, error = authenticate_user(email, password)
    
    if error:
        return jsonify({'error': error}), 401
    
    return jsonify({
        'access_token': token,
        'user': user.to_dict()
    }), 200
