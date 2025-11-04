import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, ActivityIndicator } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { isFirebaseConfigured } from '@/firebase';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [busy, setBusy] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, (user) => setAuthed(!!user));
  }, []);

  console.log('[RegisterScreen] Component rendered');

  const saveUserData = async (user: any) => {
    const db = getFirestore();
    const ref = doc(db, 'users', user.uid);
    await setDoc(ref, {
      uid: user.uid,
      email: user.email,
      displayName: displayName || user.displayName || '',
      createdAt: new Date().toISOString(),
    });
  };

  const handleEmailRegister = async () => {
    console.log('[Register] handleEmailRegister called');
    
    if (!isFirebaseConfigured) {
      console.warn('[Register] Firebase not configured');
      Alert.alert('Configuración requerida', 'Agrega tus claves de Firebase en .env');
      return;
    }
    
    if (!email || !password || !displayName) {
      console.warn('[Register] Missing required fields');
      Alert.alert('Campos requeridos', 'Ingresa nombre, email y contraseña.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    
    console.log('[Register] Starting email registration process');
    setBusy(true);
    
    try {
      const auth = getAuth();
      console.log('[Register] Attempting Firebase registration');
      const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
      console.log('[Register] Firebase registration successful');
      
      await saveUserData(result.user);
      console.log('[Register] User profile saved');
      
      Alert.alert('Éxito', 'Cuenta creada correctamente.');
      
      // Redirect to frontend website
      window.location.href = 'http://localhost:3000/';
    } catch (e: any) {
      console.error('[Register] Email registration error:', e);
      let errorMessage = e.message;
      
      if (e.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email ya está registrado.';
      } else if (e.code === 'auth/weak-password') {
        errorMessage = 'La contraseña es muy débil.';
      } else if (e.code === 'auth/invalid-email') {
        errorMessage = 'El email no es válido.';
      }
      
      Alert.alert('Error de registro', errorMessage);
    } finally {
      setBusy(false);
      console.log('[Register] Email registration process completed');
    }
  };

  const handleGoogle = async () => {
    console.log('[Register] handleGoogle called');
    
    if (!isFirebaseConfigured) {
      console.warn('[Register] Firebase not configured for Google');
      Alert.alert('Configuración requerida', 'Agrega tus claves de Firebase en .env');
      return;
    }
    
    console.log('[Register] Starting Google registration process');
    setBusy(true);
    
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      
      console.log('[Register] Using web Google sign-in');
      const result = await signInWithPopup(auth, provider);
      console.log('[Register] Google popup successful', result.user?.email);
      
      await saveUserData(result.user);
      console.log('[Register] Google user profile saved');
      
      Alert.alert('Éxito', 'Registro con Google correcto.');
      
      // Redirect to frontend website
      window.location.href = 'http://localhost:3000/';
    } catch (e: any) {
      console.error('[Register] Google registration error:', e);
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
      console.log('[Register] Google registration process completed');
    }
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

      {/* Registration card */}
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
          {/* Name input */}
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
              placeholder="NOMBRE COMPLETO"
              placeholderTextColor="#8a8a8a"
              style={{ color: 'white' }}
              autoCapitalize="words"
              value={displayName}
              onChangeText={setDisplayName}
            />
          </View>

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
              placeholder="EMAIL"
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
              placeholder="CONTRASEÑA"
              placeholderTextColor="#8a8a8a"
              style={{ color: 'white' }}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Confirm Password input */}
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
              placeholder="CONFIRMAR CONTRASEÑA"
              placeholderTextColor="#8a8a8a"
              style={{ color: 'white' }}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          {/* HTML Native Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={handleEmailRegister}
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
              {busy ? 'Creando cuenta...' : 'CREAR CUENTA'}
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
          </div>

          <Text style={{ 
            color: '#cfcfcf', 
            textAlign: 'center', 
            marginTop: 8,
            fontSize: 14
          }}>
            ¿Ya tienes cuenta?{' '}
            <Text 
              style={{ color: '#3477FF', textDecorationLine: 'underline' }}
              onPress={() => window.location.href = '/html-login'}
            >
              Inicia sesión
            </Text>
          </Text>
        </View>

        {!isFirebaseConfigured && (
          <Text style={{ color: '#ffb703', textAlign: 'center', marginTop: 12 }}>
            Falta configurar Firebase (.env). Puedes probar la UI pero no el registro.
          </Text>
        )}
      </View>
    </View>
  );
}
