import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import { User } from '@/models/Models';

export default function Login() {
  const [user, setUser] = useState<User | null>(null);

  async function handleGoogleSignIn() {
    const redirect = AuthSession.makeRedirectUri({ 
        scheme: 'carbiofit',
        path: 'auth' 
    });

    const request = new AuthSession.AuthRequest({
        clientId: Constants?.manifest?.extra?.googleClientId,
        redirectUri: redirect,
        prompt: AuthSession.Prompt.SelectAccount,
    })
   
    const result = await request.promptAsync({
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    });

    if (result.type === 'success') {
      const { code } = result.params;
      const response = await fetch(
        `http://your-server-url/auth/google/callback?code=${code}`
      );
      const data = await response.json();

      if (data.isAuthenticated) {
        setUser(data.user);
      }
    }
  }

  return (
    <View>
      <Button title="Sign in with Google" onPress={handleGoogleSignIn} />
      {user && <Text>Welcome, {user.firstname}!</Text>}
    </View>
  );
}
