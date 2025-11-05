"""
Firestore Service
Handles Firestore database connection and operations.
"""

import firebase_admin
from firebase_admin import credentials, firestore
import os
import logging
from functools import wraps

logger = logging.getLogger(__name__)

class FirestoreService:
    _instance = None
    _db = None
    _initialized = False
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(FirestoreService, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        if not self._initialized:
            self._initialize_firestore()
            FirestoreService._initialized = True
    
    def _initialize_firestore(self):
        """Initialize Firebase Admin SDK and Firestore."""
        try:
            # Check if Firebase Admin is already initialized
            if not firebase_admin._apps:
                # Try to use service account key file first
                service_account_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
                
                if service_account_path and os.path.exists(service_account_path):
                    cred = credentials.Certificate(service_account_path)
                    firebase_admin.initialize_app(cred)
                    logger.info(f"Firestore initialized with service account: {service_account_path}")
                else:
                    # Try to use project ID from environment (for emulator or default credentials)
                    project_id = os.getenv('FIREBASE_PROJECT_ID') or os.getenv('GOOGLE_CLOUD_PROJECT')
                    
                    # Default to keyspaces project if available
                    if not project_id:
                        project_id = 'keyspaces-2b692'  # Default project from frontend config
                    
                    try:
                        firebase_admin.initialize_app(project_id=project_id)
                        logger.info(f"Firestore initialized with project ID: {project_id}")
                    except Exception as e:
                        logger.warning(f"Could not initialize with project ID {project_id}: {e}")
                        # Try with default credentials
                        try:
                            firebase_admin.initialize_app()
                            logger.info("Firestore initialized with default credentials")
                        except Exception as e2:
                            logger.error(f"Could not initialize Firestore: {e2}")
                            raise
            
            self._db = firestore.client()
            logger.info("Firestore client created successfully")
            
        except Exception as e:
            logger.error(f"Error initializing Firestore: {str(e)}", exc_info=True)
            # Don't raise - allow the app to continue but log the error
            logger.warning("Firestore initialization failed, API will use fallback mode")
            self._db = None
    
    @property
    def db(self):
        """Get Firestore database client."""
        if self._db is None:
            self._initialize_firestore()
        return self._db
    

# Global instance
firestore_service = FirestoreService()

