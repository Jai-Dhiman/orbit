import 'react-native-gesture-handler';
import * as React from 'react';

import { Slot } from 'expo-router';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

export default function RootLayout() {
  return (
    <BottomSheetModalProvider>
      <Slot />
    </BottomSheetModalProvider>
  );
} 