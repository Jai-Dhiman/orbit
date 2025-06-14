import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import { useAuthStore } from 'packages/core/src/state/authStore';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, Prompt } from 'expo-auth-session';
import {
  useRouter, // Or useNavigation if not on Expo Router v3+
} from 'expo-router';
import { colors } from 'packages/ui/styles/colors'; // Assuming colors are exported from here

// Ensure web platform has a redirect URI for Expo Auth Session
WebBrowser.maybeCompleteAuthSession();

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8787'; // Ensure this is set in your .env

export default function LoginScreen() {
  const { setUserAndSession, isLoading, setLoading, setError, isAuthenticated, user } =
    useAuthStore();
  const router = useRouter();

  // State for each provider's auth request
  const [googleAuthRequest, googleResponse, googlePromptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '', // Ensure this is set in your .env
      redirectUri: makeRedirectUri({
        scheme: process.env.EXPO_PUBLIC_APP_SCHEME, // e.g. 'my-app'
        path: 'login/callback/google', // Needs to match server and app config
      }),
      scopes: ['openid', 'profile', 'email'],
      prompt: Prompt.SelectAccount, // Or Consent
    },
    {
      authorizationEndpoint: `${API_URL}/auth/oauth/google/url`, // Server endpoint to get the auth URL
    },
  );

  // TODO: Add Apple Auth Request if needed, Apple Sign In has a different flow usually
  // For Apple, typically use `expo-apple-authentication` which provides a native UI
  // const [appleAuthRequest, appleResponse, applePromptAsync] = useAuthRequest(...)

  useEffect(() => {
    if (isAuthenticated && user) {
      // If user is already authenticated (e.g. from persisted state), redirect them
      // Check if profile setup is needed
      if (user.profileExists === false || useAuthStore.getState().isNewUser) {
        router.replace('/profile'); // Or your profile setup screen
      } else {
        router.replace('/(tabs)'); // Or your main app screen
      }
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    const handleAuthResponse = async (response: any, provider: 'google' | 'apple') => {
      if (response?.type === 'success') {
        setLoading(true);
        const { code } = response.params;

        try {
          const redirectUri = makeRedirectUri({
            scheme: process.env.EXPO_PUBLIC_APP_SCHEME,
            path: `login/callback/${provider}`,
          });

          const tokenResponse = await fetch(`${API_URL}/auth/oauth/callback`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              code,
              provider,
              redirect_uri: redirectUri, // Server needs this to verify
            }),
          });

          const data = await tokenResponse.json();

          if (!tokenResponse.ok) {
            throw new Error(data.error || `Failed to authenticate with ${provider}`);
          }

          setUserAndSession(data.user, data.session, data.isNewUser);

          // Navigation is handled by the first useEffect now
          // if (data.user.profileExists === false || data.isNewUser) {
          //   router.replace('/profile');
          // } else {
          //   router.replace('/(tabs)');
          // }
        } catch (err: any) {
          console.error(`Login error (${provider}):`, err);
          setError(err.message || 'An unknown error occurred');
          Alert.alert('Login Failed', err.message || `Could not sign in with ${provider}.`);
        } finally {
          setLoading(false);
        }
      } else if (response?.type === 'error') {
        console.error('OAuth Error:', response.error);
        setError(response.error?.message || 'OAuth failed');
        Alert.alert('Login Cancelled', `Login with ${provider} was cancelled or failed.`);
      } else if (response?.type === 'cancel' || response?.type === 'dismiss') {
        // User cancelled the login process
        Alert.alert('Login Cancelled', `Login with ${provider} was cancelled.`);
      }
    };

    if (googleResponse) {
      handleAuthResponse(googleResponse, 'google');
    }
    // if (appleResponse) {
    //   handleAuthResponse(appleResponse, 'apple');
    // }
  }, [googleResponse, /*appleResponse,*/ setUserAndSession, setLoading, setError, router]);

  if (isLoading || (isAuthenticated && user)) {
    // Show loading indicator also if redirecting
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Arden</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Sign in with Google"
          onPress={() => {
            if (googleAuthRequest) {
              googlePromptAsync();
            } else {
              Alert.alert('Error', 'Google login is not available at the moment.');
            }
          }}
          disabled={!googleAuthRequest || isLoading}
          color={colors.primary} // Example color
        />
      </View>

      {/*
      // Placeholder for Apple Sign In - this requires `expo-apple-authentication`
      // and has a different UX flow (native button)
      {Platform.OS === 'ios' && (
        <View style={styles.buttonContainer}>
          <Button
            title="Sign in with Apple"
            onPress={() => Alert.alert("Apple Sign In", "Apple Sign In coming soon!")}
            // onPress={() => applePromptAsync()} // This would be different for Apple
            disabled={isLoading} // !appleAuthRequest || isLoading
            color={colors.secondary} // Example color
          />
        </View>
      )}
      */}

      {useAuthStore.getState().error && ( // Access error directly from store if needed for display
        <Text style={styles.errorText}>Error: {useAuthStore.getState().error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background, // Example color
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.text, // Example color
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 40,
    color: colors.textSecondary, // Example color
  },
  buttonContainer: {
    marginVertical: 10,
    width: '80%',
  },
  errorText: {
    marginTop: 20,
    color: colors.danger, // Example color
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: colors.primary,
  },
});

// Important: For deep linking to work with Expo Go and development builds,
// you need to configure the scheme in your app.json:
// "scheme": "your-app-scheme"
// And ensure your OAuth provider redirect URIs are correctly configured.
// For Google, it would be something like: `your-app-scheme:/login/callback/google`
// For Apple, it would be something like: `your-app-scheme:/login/callback/apple` (though Apple setup is more complex)

// Also, ensure required environment variables are available:
// EXPO_PUBLIC_GOOGLE_CLIENT_ID (get this from Google Cloud Console)
// EXPO_PUBLIC_API_URL (your backend URL)
// EXPO_PUBLIC_APP_SCHEME (your app's custom URL scheme)
