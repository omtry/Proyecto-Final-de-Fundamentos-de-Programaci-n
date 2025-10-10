import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';

export default function SimpleLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  console.log('[SimpleLoginScreen] Component rendered');

  const handleLogin = () => {
    console.log('[SimpleLoginScreen] Login button clicked');
    Alert.alert('Login', `Email: ${email}, Password: ${password}`);
  };

  const handleGoogle = () => {
    console.log('[SimpleLoginScreen] Google button clicked');
    Alert.alert('Google', 'Google login clicked');
  };

  const handleTest = () => {
    console.log('[SimpleLoginScreen] Test button clicked');
    Alert.alert('Test', 'Test button works!');
  };

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: '#000', 
      justifyContent: 'center', 
      alignItems: 'center' 
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

          {/* Login button */}
          <Pressable
            onPress={handleLogin}
            style={({ pressed }) => ({
              height: 44,
              backgroundColor: 'white',
              borderRadius: 6,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }]
            })}
          >
            <Text style={{ color: '#0b0b0b', fontWeight: '700' }}>LOGIN</Text>
          </Pressable>

          {/* Google button */}
          <Pressable
            onPress={handleGoogle}
            style={({ pressed }) => ({
              height: 44,
              backgroundColor: '#2047d6',
              borderRadius: 6,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }]
            })}
          >
            <Text style={{ color: 'white', fontWeight: '700' }}>Continuar con Google</Text>
          </Pressable>

          {/* Test button */}
          <Pressable
            onPress={handleTest}
            style={({ pressed }) => ({
              height: 40,
              backgroundColor: '#ff6b6b',
              borderRadius: 6,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }]
            })}
          >
            <Text style={{ color: 'white', fontWeight: '700' }}>TEST BUTTON</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
