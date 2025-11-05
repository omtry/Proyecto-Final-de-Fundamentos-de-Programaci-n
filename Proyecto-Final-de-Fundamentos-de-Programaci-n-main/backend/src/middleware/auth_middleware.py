"""
Authentication Middleware
Handles authentication for protected routes.
"""

from functools import wraps
from flask import request, jsonify
import logging

logger = logging.getLogger(__name__)

def require_auth(f):
    """
    Decorator to require authentication.
    Currently accepts Authorization header with Bearer token or userId in request body.
    In production, validate Firebase ID token.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Get auth token from header
        auth_header = request.headers.get('Authorization')
        
        # For now, we'll accept userId in request body or header
        # In production, validate Firebase ID token from Authorization header
        data = request.get_json() if request.is_json else {}
        user_id = data.get('userId')
        
        if not auth_header and not user_id:
            return jsonify({
                'success': False,
                'message': 'Authentication required'
            }), 401
        
        # If Authorization header exists, extract token
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            # TODO: Validate Firebase ID token
            # For now, we'll use userId from request body
            pass
        
        # Attach user info to request context
        request.user_id = user_id
        
        return f(*args, **kwargs)
    
    return decorated_function


