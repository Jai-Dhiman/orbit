import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme'; // Assuming this is a local hook
import QueryProvider from '../src/providers/QueryProvider';
import FontProvider from '../src/providers/FontProvider';
import { useAuthStore } from 'packages/core/src/state/authStore'; // Import the auth store

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function AuthNavigator() {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, isLoading, user, isNewUser } = useAuthStore();

  useEffect(() => {
    // Ensure that navigation is ready and auth state is not loading
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)'; // e.g. a group for login/signup screens
    const inAppGroup = segments[0] === '(tabs)';  // e.g. your main app tabs

    if (isAuthenticated) {
      // If authenticated:
      // If profile doesn't exist or is a new user, redirect to profile setup.
      // This check might be more robust if `profileExists` is consistently updated.
      if (user?.profileExists === false || isNewUser) {
        router.replace('/profile');
      }
      // If in auth group (e.g. on login page) or at root, redirect to main app.
      else if (inAuthGroup || segments.length === 0 || segments[0] === 'login') {
        router.replace('/(tabs)');
      }
      // Otherwise, stay where they are (already in an authenticated part of the app)
    } else {
      // If not authenticated and not already on the login screen (or any other auth screen):
      // Redirect to login.
      if (segments[0] !== 'login' && !inAuthGroup) {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading, user, isNewUser, segments, router]);

  // While loading auth state or if not loaded fonts yet, show nothing or a splash screen component
  // The main loading check for fonts is handled in RootLayout anw.
  // if (isLoading) return null; // Or a loading spinner

  // This Stack will define navigation based on authentication state handled by the useEffect hook.
  // We define all possible screens here. Expo Router's layout system will handle rendering
  // the correct one based on the URL, and our hook will handle redirection.
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
      {/* You could add an (auth) group here if you had more auth screens like signup/forgot-password */}
      {/* <Stack.Screen name="(auth)" options={{ headerShown: false }} /> */}
    </Stack>
  );
}


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loadedFonts] = useFonts({ // Renamed to avoid conflict if 'loaded' is used elsewhere
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    // Add other fonts if any
  });
  const { isLoading: authIsLoading, isAuthenticated } = useAuthStore(); // Get auth loading state

  useEffect(() => {
    if (loadedFonts && !authIsLoading) { // Hide splash only when fonts AND auth state are ready
      SplashScreen.hideAsync();
    }
  }, [loadedFonts, authIsLoading]);

  if (!loadedFonts || authIsLoading) { // Show splash/null until fonts and auth state are loaded
    return null; // Or a custom splash screen component
  }

  return (
    <QueryProvider>
      <FontProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <AuthNavigator />
        </ThemeProvider>
      </FontProvider>
    </QueryProvider>
  );
}
