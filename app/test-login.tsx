import React from 'react';
import { View, Text, Pressable, Alert } from 'react-native';

export default function TestLoginScreen() {
  console.log('[TestLoginScreen] Component rendered');

  const handleTest = () => {
    console.log('[TestLoginScreen] Button clicked!');
    Alert.alert('Test', 'Button works!');
  };

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: '#000', 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: 20 
    }}>
      <Text style={{ color: 'white', fontSize: 24, marginBottom: 20 }}>
        Test Login Screen
      </Text>
      
      <Pressable
        onPress={handleTest}
        style={({ pressed }) => ({
          backgroundColor: '#ff6b6b',
          padding: 20,
          borderRadius: 10,
          opacity: pressed ? 0.7 : 1,
          transform: [{ scale: pressed ? 0.95 : 1 }]
        })}
      >
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
          TEST BUTTON
        </Text>
      </Pressable>

      <Text style={{ color: '#ccc', marginTop: 20, textAlign: 'center' }}>
        If this button works, the issue is in the main login component.
      </Text>
    </View>
  );
}
