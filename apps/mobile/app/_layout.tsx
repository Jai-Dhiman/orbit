import * as React from 'react';
import { Stack } from 'expo-router';
import { QueryProvider } from '@/src/providers';

export default function RootLayout() {
  return (
    <QueryProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
        }}
      />
    </QueryProvider>
  );
} 