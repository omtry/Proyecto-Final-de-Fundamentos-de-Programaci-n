import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';

export default function HtmlLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  console.log('[HtmlLoginScreen] Component rendered');

  const handleLogin = () => {
    console.log('[HtmlLoginScreen] Login button clicked');
    alert(`Login: ${email}, ${password}`);
  };

  const handleGoogle = () => {
    console.log('[HtmlLoginScreen] Google button clicked');
    alert('Google login clicked');
  };

  const handleTest = () => {
    console.log('[HtmlLoginScreen] Test button clicked');
    alert('Test button works!');
  };

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
              style={{
                height: '44px',
                backgroundColor: 'white',
                borderRadius: '6px',
                border: 'none',
                color: '#0b0b0b',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              LOGIN
            </button>

            <button
              onClick={handleGoogle}
              style={{
                height: '44px',
                backgroundColor: '#2047d6',
                borderRadius: '6px',
                border: 'none',
                color: 'white',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Continuar con Google
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
