"""
Job match routes for creating and retrieving job matching analysis.
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.job_match_service import create_match, get_user_matches

job_bp = Blueprint('job', __name__, url_prefix='/api/job')


@job_bp.route('/match', methods=['POST'])
@jwt_required()
def create_job_match():
    """Create a new job match analysis."""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'Request body is required'}), 400
    
    resume_text = data.get('resume_text')
    job_description = data.get('job_description')
    
    if not resume_text or not job_description:
        return jsonify({'error': 'Resume text and job description are required'}), 400
    
    match, error = create_match(user_id, resume_text, job_description)
    
    if error:
        return jsonify({'error': error}), 400
    
    return jsonify({
        'id': match.id,
        'match_score': match.match_score,
        'missing_keywords': match.missing_keywords_json.get('missing_keywords', []),
        'recommendations': match.missing_keywords_json.get('recommendations', []),
        'created_at': match.created_at.isoformat()
    }), 200


@job_bp.route('/history', methods=['GET'])
@jwt_required()
def get_job_history():
    """Get user's job match history."""
    user_id = get_jwt_identity()
    
    matches = get_user_matches(user_id)
    
    return jsonify({
        'matches': [match.to_dict() for match in matches]
    }), 200
