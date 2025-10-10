import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, Platform, ActivityIndicator } from 'react-native';
import { Link, Redirect } from 'expo-router';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { isFirebaseConfigured } from '@/firebase';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, (user) => setAuthed(!!user));
  }, []);

  // Debug Firebase configuration
  console.log('[LoginScreen] Firebase configured:', isFirebaseConfigured);
  console.log('[LoginScreen] Busy state:', busy);

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

  const handleEmailLogin = async () => {
    console.log('[Login] handleEmailLogin called');
    
    if (!isFirebaseConfigured) {
      console.warn('[Login] Firebase not configured');
      Alert.alert('Configuración requerida', 'Agrega tus claves de Firebase en .env');
      return;
    }
    
    if (!email || !password) {
      console.warn('[Login] Missing email or password');
      Alert.alert('Campos requeridos', 'Ingresa email y contraseña.');
      return;
    }
    
    console.log('[Login] Starting email login process');
    setBusy(true);
    
    try {
      const auth = getAuth();
      console.log('[Login] Attempting Firebase auth');
      await signInWithEmailAndPassword(auth, email.trim(), password);
      console.log('[Login] Firebase auth successful');
      
      await saveIfFirstLogin();
      console.log('[Login] User profile saved');
      
      Alert.alert('Éxito', 'Inicio de sesión correcto.');
    } catch (e: any) {
      console.error('[Login] Email login error:', e);
      Alert.alert('Error de autenticación', e.message);
    } finally {
      setBusy(false);
      console.log('[Login] Email login process completed');
    }
  };

  const handleGoogle = async () => {
    console.log('[Login] handleGoogle called');
    
    if (!isFirebaseConfigured) {
      console.warn('[Login] Firebase not configured for Google');
      Alert.alert('Configuración requerida', 'Agrega tus claves de Firebase en .env');
      return;
    }
    
    console.log('[Login] Starting Google login process');
    setBusy(true);
    
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      
      if (Platform.OS === 'web') {
        console.log('[Login] Using web Google sign-in');
        const result = await signInWithPopup(auth, provider);
        console.log('[Login] Google popup successful', result.user?.email);
      } else {
        console.warn('[Login] Native Google sign-in not implemented');
        throw new Error('Google sign-in nativo no configurado');
      }
      
      await saveIfFirstLogin();
      console.log('[Login] Google user profile saved');
      
      Alert.alert('Éxito', 'Inicio de sesión con Google correcto.');
    } catch (e: any) {
      console.error('[Login] Google login error:', e);
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
      console.log('[Login] Google login process completed');
    }
  };

  if (authed) return <Redirect href="/(tabs)" />;

  return (
    <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
        <View style={{ backgroundColor: '#2047d6', height: '40%', width: '100%', borderBottomLeftRadius: 300, borderBottomRightRadius: 300, alignSelf: 'center' }} />
        <View style={{ position: 'absolute', bottom: -120, left: -80, width: 400, height: 400, borderRadius: 200, backgroundColor: '#2047d6', opacity: 0.9 }} />
        <View style={{ position: 'absolute', right: 0, top: '25%', width: 260, height: 360, backgroundColor: '#2047d6', borderTopLeftRadius: 180, borderBottomLeftRadius: 180 }} />
      </View>

      <View style={{ width: 360, padding: 24, backgroundColor: '#0b0b0b', borderRadius: 12 }}>
        <Text style={{ color: 'white', textAlign: 'center', marginBottom: 8 }}>El espacio reservado al alcance de tus manos</Text>
        <Text style={{ color: '#3477FF', fontSize: 72, fontWeight: '800', textAlign: 'center', marginBottom: 24 }}>BK</Text>

        <View style={{ gap: 12 }}>
          <View style={{ borderWidth: 1, borderColor: '#2e2e2e', borderRadius: 6, paddingHorizontal: 12, height: 44, justifyContent: 'center', backgroundColor: '#0b0b0b' }}>
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
          <View style={{ borderWidth: 1, borderColor: '#2e2e2e', borderRadius: 6, paddingHorizontal: 12, height: 44, justifyContent: 'center', backgroundColor: '#0b0b0b' }}>
            <TextInput
              placeholder="PASSWORD"
              placeholderTextColor="#8a8a8a"
              style={{ color: 'white' }}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <Pressable 
            onPress={() => {
              console.log('[LoginScreen] LOGIN button pressed');
              handleEmailLogin();
            }}
            disabled={busy}
            style={({ pressed }) => ({
              height: 44, 
              backgroundColor: busy ? '#e5e5e5' : 'white', 
              borderRadius: 6, 
              alignItems: 'center', 
              justifyContent: 'center', 
              opacity: busy ? 0.6 : (pressed ? 0.8 : 1),
              transform: [{ scale: pressed ? 0.98 : 1 }]
            })}
          >
            {busy ? (
              <ActivityIndicator color="#0b0b0b" />
            ) : (
              <Text style={{ color: '#0b0b0b', fontWeight: '700' }}>LOGIN</Text>
            )}
          </Pressable>

          <Pressable 
            onPress={() => {
              console.log('[LoginScreen] GOOGLE button pressed');
              handleGoogle();
            }}
            disabled={busy}
            style={({ pressed }) => ({
              height: 44, 
              backgroundColor: '#2047d6', 
              borderRadius: 6, 
              alignItems: 'center', 
              justifyContent: 'center', 
              opacity: busy ? 0.6 : (pressed ? 0.8 : 1),
              transform: [{ scale: pressed ? 0.98 : 1 }]
            })}
          >
            {busy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: 'white', fontWeight: '700' }}>Continuar con Google</Text>
            )}
          </Pressable>

          <Pressable 
            onPress={() => {
              console.log('[LoginScreen] Forgot password pressed');
              Alert.alert('Recuperar contraseña', 'Funcionalidad de recuperación de contraseña no implementada aún.');
            }}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
              padding: 8
            })}
          >
            <Text style={{ color: '#cfcfcf', textAlign: 'center', marginTop: 8 }}>Forgot password?</Text>
          </Pressable>
        </View>
        {/* Test button to verify events work */}
        <Pressable 
          onPress={() => {
            console.log('[LoginScreen] TEST button pressed - events are working!');
            Alert.alert('Test', 'Los eventos funcionan correctamente!');
          }}
          style={({ pressed }) => ({
            height: 40,
            backgroundColor: '#ff6b6b',
            borderRadius: 6,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 12,
            opacity: pressed ? 0.8 : 1
          })}
        >
          <Text style={{ color: 'white', fontWeight: '700' }}>TEST BUTTON</Text>
        </Pressable>

        {!isFirebaseConfigured && (
          <Text style={{ color: '#ffb703', textAlign: 'center', marginTop: 12 }}>
            Falta configurar Firebase (.env). Puedes probar la UI pero no el login.
          </Text>
        )}
      </View>
    </View>
  );
}


