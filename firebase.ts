import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { initializeAuth, browserLocalPersistence, getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Validate and load Firebase configuration
const requiredEnvVars = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value || value.startsWith('YOUR_'))
  .map(([key]) => key);

// Debug logging with masked sensitive data
const maskedApiKey = requiredEnvVars.apiKey ? 
  requiredEnvVars.apiKey.slice(0, 8) + '***' : 'undefined';
const maskedProjectId = requiredEnvVars.projectId ? 
  requiredEnvVars.projectId.slice(0, 8) + '***' : 'undefined';

console.log('[Firebase] Environment check:', {
  apiKey: maskedApiKey,
  authDomain: requiredEnvVars.authDomain,
  projectId: maskedProjectId,
  storageBucket: requiredEnvVars.storageBucket,
  messagingSenderId: requiredEnvVars.messagingSenderId,
  appId: requiredEnvVars.appId,
  missingVars: missingVars.length > 0 ? missingVars : 'none'
});

export const isFirebaseConfigured = missingVars.length === 0;

if (!isFirebaseConfigured) {
  console.warn('[Firebase] Missing configuration:', missingVars);
  console.warn('[Firebase] Create .env file with EXPO_PUBLIC_FIREBASE_* variables');
}

// Firebase configuration object
const firebaseConfig = {
  apiKey: requiredEnvVars.apiKey || 'YOUR_API_KEY',
  authDomain: requiredEnvVars.authDomain || 'YOUR_AUTH_DOMAIN',
  projectId: requiredEnvVars.projectId || 'YOUR_PROJECT_ID',
  storageBucket: requiredEnvVars.storageBucket || 'YOUR_STORAGE',
  messagingSenderId: requiredEnvVars.messagingSenderId || 'YOUR_SENDER',
  appId: requiredEnvVars.appId || 'YOUR_APP_ID',
};

// Initialize Firebase app
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
  
  // Initialize Auth with persistence
  try {
    initializeAuth(app, { persistence: browserLocalPersistence });
  } catch (error) {
    // Auth already initialized
    console.log('[Firebase] Auth already initialized');
  }
  
  auth = getAuth(app);
  db = getFirestore(app);
  
  console.log('[Firebase] Successfully initialized');
} catch (error) {
  console.error('[Firebase] Initialization failed:', error);
  throw new Error('Firebase initialization failed. Check your configuration.');
}

export { auth, db };
export default app;

