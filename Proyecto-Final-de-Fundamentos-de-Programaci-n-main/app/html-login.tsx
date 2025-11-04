import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, ActivityIndicator } from 'react-native';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { isFirebaseConfigured } from '@/firebase';

export default function HtmlLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, (user) => setAuthed(!!user));
  }, []);

  console.log('[HtmlLoginScreen] Component rendered');

  const saveIfFirstLogin = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;
    const db = getFirestore();
    const ref = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName ?? '',
        createdAt: new Date().toISOString(),
      });
    }
  };

  const handleLogin = async () => {
    console.log('[HtmlLoginScreen] Login button clicked');
    
    if (!isFirebaseConfigured) {
      console.warn('[HtmlLoginScreen] Firebase not configured');
      Alert.alert('Configuración requerida', 'Agrega tus claves de Firebase en .env');
      return;
    }
    
    if (!email || !password) {
      console.warn('[HtmlLoginScreen] Missing email or password');
      Alert.alert('Campos requeridos', 'Ingresa email y contraseña.');
      return;
    }
    
    console.log('[HtmlLoginScreen] Starting email login process');
    setBusy(true);
    
    try {
      const auth = getAuth();
      console.log('[HtmlLoginScreen] Attempting Firebase auth');
      await signInWithEmailAndPassword(auth, email.trim(), password);
      console.log('[HtmlLoginScreen] Firebase auth successful');
      
      await saveIfFirstLogin();
      console.log('[HtmlLoginScreen] User profile saved');
      
      // Redirect to frontend website
      window.location.href = 'http://localhost:3000/';
    } catch (e: any) {
      console.error('[HtmlLoginScreen] Email login error:', e);
      Alert.alert('Error de autenticación', e.message);
    } finally {
      setBusy(false);
      console.log('[HtmlLoginScreen] Email login process completed');
    }
  };

  const handleGoogle = async () => {
    console.log('[HtmlLoginScreen] Google button clicked');
    
    if (!isFirebaseConfigured) {
      console.warn('[HtmlLoginScreen] Firebase not configured for Google');
      Alert.alert('Configuración requerida', 'Agrega tus claves de Firebase en .env');
      return;
    }
    
    console.log('[HtmlLoginScreen] Starting Google login process');
    setBusy(true);
    
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      
      console.log('[HtmlLoginScreen] Using web Google sign-in');
      const result = await signInWithPopup(auth, provider);
      console.log('[HtmlLoginScreen] Google popup successful', result.user?.email);
      
      await saveIfFirstLogin();
      console.log('[HtmlLoginScreen] Google user profile saved');
      
      // Redirect to frontend website
      window.location.href = 'http://localhost:3000/';
    } catch (e: any) {
      console.error('[HtmlLoginScreen] Google login error:', e);
      let errorMessage = e.message;
      
      // Handle specific Google auth errors
      if (e.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Popup cerrado por el usuario';
      } else if (e.code === 'auth/popup-blocked') {
        errorMessage = 'Popup bloqueado por el navegador. Permite popups para este sitio.';
      } else if (e.code === 'auth/unauthorized-domain') {
        errorMessage = 'Dominio no autorizado. Agrega localhost a dominios autorizados en Firebase.';
      }
      
      Alert.alert('Error Google', errorMessage);
    } finally {
      setBusy(false);
      console.log('[HtmlLoginScreen] Google login process completed');
    }
  };

  const handleTest = () => {
    console.log('[HtmlLoginScreen] Test button clicked');
    alert('Test button works!');
  };

  // Redirect if already authenticated
  if (authed) {
    window.location.href = 'http://localhost:3000/';
    return null;
  }

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: '#000', 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: 20 
    }}>
      {/* Background shapes */}
      <View style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        overflow: 'hidden' 
      }}>
        <View style={{ 
          backgroundColor: '#2047d6', 
          height: '40%', 
          width: '100%', 
          borderBottomLeftRadius: 300, 
          borderBottomRightRadius: 300, 
          alignSelf: 'center' 
        }} />
      </View>

      {/* Login card */}
      <View style={{ 
        width: 360, 
        padding: 24, 
        backgroundColor: '#0b0b0b', 
        borderRadius: 12 
      }}>
        <Text style={{ 
          color: 'white', 
          textAlign: 'center', 
          marginBottom: 8 
        }}>
          El espacio reservado al alcance de tus manos
        </Text>
        <Text style={{ 
          color: '#3477FF', 
          fontSize: 72, 
          fontWeight: '800', 
          textAlign: 'center', 
          marginBottom: 24 
        }}>
          BK
        </Text>

        <View style={{ gap: 12 }}>
          {/* Email input */}
          <View style={{ 
            borderWidth: 1, 
            borderColor: '#2e2e2e', 
            borderRadius: 6, 
            paddingHorizontal: 12, 
            height: 44, 
            justifyContent: 'center', 
            backgroundColor: '#0b0b0b' 
          }}>
            <TextInput
              placeholder="USERNAME"
              placeholderTextColor="#8a8a8a"
              style={{ color: 'white' }}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password input */}
          <View style={{ 
            borderWidth: 1, 
            borderColor: '#2e2e2e', 
            borderRadius: 6, 
            paddingHorizontal: 12, 
            height: 44, 
            justifyContent: 'center', 
            backgroundColor: '#0b0b0b' 
          }}>
            <TextInput
              placeholder="PASSWORD"
              placeholderTextColor="#8a8a8a"
              style={{ color: 'white' }}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* HTML Native Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={handleLogin}
              disabled={busy}
              style={{
                height: '44px',
                backgroundColor: busy ? '#e5e5e5' : 'white',
                borderRadius: '6px',
                border: 'none',
                color: '#0b0b0b',
                fontWeight: '700',
                cursor: busy ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                opacity: busy ? 0.6 : 1
              }}
            >
              {busy ? 'Iniciando sesión...' : 'LOGIN'}
            </button>

            <button
              onClick={handleGoogle}
              disabled={busy}
              style={{
                height: '44px',
                backgroundColor: '#2047d6',
                borderRadius: '6px',
                border: 'none',
                color: 'white',
                fontWeight: '700',
                cursor: busy ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                opacity: busy ? 0.6 : 1
              }}
            >
              {busy ? 'Conectando...' : 'Continuar con Google'}
            </button>

            <button
              onClick={handleTest}
              style={{
                height: '40px',
                backgroundColor: '#ff6b6b',
                borderRadius: '6px',
                border: 'none',
                color: 'white',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              TEST BUTTON
            </button>
          </div>
        </View>
      </View>
    </View>
  );
}
