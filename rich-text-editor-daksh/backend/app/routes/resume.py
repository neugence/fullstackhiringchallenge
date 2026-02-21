"""
Resume review routes for creating and retrieving resume analysis.
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.resume_service import create_review, get_user_reviews

resume_bp = Blueprint('resume', __name__, url_prefix='/api/resume')


@resume_bp.route('/review', methods=['POST'])
@jwt_required()
def create_resume_review():
    """Create a new resume review."""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'Request body is required'}), 400
    
    resume_text = data.get('resume_text')
    
    if not resume_text:
        return jsonify({'error': 'Resume text is required'}), 400
    
    review, error = create_review(user_id, resume_text)
    
    if error:
        return jsonify({'error': error}), 400
    
    return jsonify({
        'id': review.id,
        'score': review.ai_score,
        'feedback': review.feedback_json,
        'created_at': review.created_at.isoformat()
    }), 200


@resume_bp.route('/history', methods=['GET'])
@jwt_required()
def get_resume_history():
    """Get user's resume review history."""
    user_id = get_jwt_identity()
    
    reviews = get_user_reviews(user_id)
    
    return jsonify({
        'reviews': [review.to_dict() for review in reviews]
    }), 200
