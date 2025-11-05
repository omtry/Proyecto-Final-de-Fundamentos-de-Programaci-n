"""
Main Flask application for KeySpaces reservations API.
"""

from flask import Flask
from flask_cors import CORS
import logging
import os

from backend.routes.reservations import reservations_bp

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def create_app():
    """Create and configure Flask application."""
    app = Flask(__name__)
    
    # Enable CORS - allow all origins for development
    CORS(app, 
         resources={
             r"/api/*": {
                 "origins": "*",
                 "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                 "allow_headers": ["Content-Type", "Authorization"]
             }
         },
         supports_credentials=True)
    
    # Register blueprints
    app.register_blueprint(reservations_bp)
    
    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return {
            'status': 'OK',
            'message': 'Reservations API is running',
            'service': 'KeySpaces Reservations API'
        }, 200
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return {'success': False, 'message': 'Endpoint not found'}, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return {'success': False, 'message': 'Internal server error'}, 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 3003))
    
    # Check Firestore status
    try:
        from backend.src.services.firestore_service import firestore_service
        if firestore_service.db:
            logger.info("✓ Firestore is configured and ready")
        else:
            logger.warning("⚠ Firestore is not configured. Reservations will use fallback mode.")
            logger.warning("  Run 'python backend/setup_firestore.py' to configure Firestore")
    except Exception as e:
        logger.warning(f"⚠ Could not check Firestore status: {e}")
        logger.warning("  Reservations will use fallback mode")
    
    logger.info(f"Starting KeySpaces Reservations API on port {port}")
    logger.info(f"API will be available at http://localhost:{port}/api")
    app.run(host='0.0.0.0', port=port, debug=True)

