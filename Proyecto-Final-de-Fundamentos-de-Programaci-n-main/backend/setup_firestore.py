"""
Setup script to help configure Firestore for the backend.
This script will guide you through setting up Firebase Admin SDK credentials.
"""

import os
import json

def setup_firestore():
    print("=" * 60)
    print("Firestore Setup for KeySpaces Reservations API")
    print("=" * 60)
    print()
    
    print("To use Firestore, you need Firebase Admin SDK credentials.")
    print("You have two options:")
    print()
    print("1. Service Account Key (Recommended for local development)")
    print("   - Go to Firebase Console > Project Settings > Service Accounts")
    print("   - Click 'Generate New Private Key'")
    print("   - Save the JSON file")
    print()
    print("2. Application Default Credentials (For GCP/Cloud environments)")
    print("   - Use 'gcloud auth application-default login'")
    print()
    
    choice = input("Do you have a service account key file? (y/n): ").strip().lower()
    
    if choice == 'y':
        key_path = input("Enter the path to your service account key JSON file: ").strip()
        
        if not os.path.exists(key_path):
            print(f"Error: File not found at {key_path}")
            return
        
        # Set environment variable
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = os.path.abspath(key_path)
        
        # Try to read project ID from the file
        try:
            with open(key_path, 'r') as f:
                key_data = json.load(f)
                project_id = key_data.get('project_id')
                if project_id:
                    print(f"✓ Found project ID: {project_id}")
                    os.environ['FIREBASE_PROJECT_ID'] = project_id
        except Exception as e:
            print(f"Warning: Could not read project ID from key file: {e}")
        
        print(f"\n✓ Environment variable set: GOOGLE_APPLICATION_CREDENTIALS={os.path.abspath(key_path)}")
        print("\nTo make this permanent, add to your .env file or set in your shell:")
        print(f"export GOOGLE_APPLICATION_CREDENTIALS={os.path.abspath(key_path)}")
    else:
        project_id = input("Enter your Firebase Project ID (e.g., keyspaces-2b692): ").strip()
        if project_id:
            os.environ['FIREBASE_PROJECT_ID'] = project_id
            print(f"\n✓ Project ID set: {project_id}")
            print("\nNote: You'll need to configure Application Default Credentials")
            print("or set GOOGLE_APPLICATION_CREDENTIALS for this to work.")
    
    print("\n" + "=" * 60)
    print("Setup complete!")
    print("=" * 60)
    print("\nYou can now test the connection by running:")
    print("  python -c \"from backend.src.services.firestore_service import firestore_service; print('Firestore:', 'OK' if firestore_service.db else 'NOT CONFIGURED')\"")

if __name__ == '__main__':
    setup_firestore()


