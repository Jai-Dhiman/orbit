import * as React from 'react';
import { Pressable } from 'react-native';
import { useColorScheme } from '../lib/useColorScheme';
import { MoonStar, Sun } from 'lucide-react-native';
import { cn } from '../lib/utils';

interface ToggleThemeProps {
  className?: string;
}

export function ToggleTheme({ className }: ToggleThemeProps) {
  const { isDarkColorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Pressable
      className={cn('p-2', className)}
      onPress={toggleColorScheme}
      accessibilityRole="button"
      accessibilityLabel={isDarkColorScheme ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {isDarkColorScheme ? (
        <Sun size={24} color="white" />
      ) : (
        <MoonStar size={24} color="black" />
      )}
    </Pressable>
  );
} 