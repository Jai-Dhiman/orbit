import type React from 'react';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'WorkSans-Thin': require('../../assets/fonts/WorkSans-Thin.ttf'),
          'WorkSans-ExtraLight': require('../../assets/fonts/WorkSans-ExtraLight.ttf'),
          'WorkSans-Light': require('../../assets/fonts/WorkSans-Light.ttf'),
          'WorkSans-Regular': require('../../assets/fonts/WorkSans-Regular.ttf'),
          'WorkSans-Medium': require('../../assets/fonts/WorkSans-Medium.ttf'),
          'WorkSans-SemiBold': require('../../assets/fonts/WorkSans-SemiBold.ttf'),
          'WorkSans-Bold': require('../../assets/fonts/WorkSans-Bold.ttf'),
          'WorkSans-ExtraBold': require('../../assets/fonts/WorkSans-ExtraBold.ttf'),
          'WorkSans-Black': require('../../assets/fonts/WorkSans-Black.ttf'),
        });
      } catch (error) {
        console.error('Error loading fonts:', error);
      } finally {
        setFontsLoaded(true);
      }
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      {children}
    </View>
  );
} 