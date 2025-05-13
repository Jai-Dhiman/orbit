import type React from 'react';
import { View, Text, ScrollView } from 'react-native';

export function FontDemo(): React.JSX.Element {
  return (
    <ScrollView>
      <Text className="text-xl font-sans-medium mb-6 text-primary-solid">Work Sans Font Demo</Text>

      <View className="space-y-6">
        <View className="space-y-4">
          <View>
            <Text className="text-xs text-gray-500">Default Font (Regular)</Text>
            <Text className="font-sans text-lg">The quick brown fox jumps over the lazy dog</Text>
          </View>

          <View>
            <Text className="text-xs text-gray-500">Light</Text>
            <Text className="font-sans-light text-lg">The quick brown fox jumps over the lazy dog</Text>
          </View>

          <View>
            <Text className="text-xs text-gray-500">Extra Light</Text>
            <Text className="font-sans-extralight text-lg">The quick brown fox jumps over the lazy dog</Text>
          </View>

          <View>
            <Text className="text-xs text-gray-500">Bold</Text>
            <Text className="font-sans-bold text-lg">The quick brown fox jumps over the lazy dog</Text>
          </View>

          <View>
            <Text className="text-xs text-gray-500">Medium</Text>
            <Text className="font-sans-medium text-lg">The quick brown fox jumps over the lazy dog</Text>
          </View>
        </View>

        <View className="mt-6 space-y-4">
          <Text className="text-lg font-sans-bold">Theme Colors</Text>

          <View className="space-y-3">
            <View className="rounded-md overflow-hidden">
              <View className="bg-primary-solid p-4">
                <Text className="text-white font-sans">Primary: Deep Space Blue (#1E2A45)</Text>
              </View>
            </View>

            <View className="rounded-md overflow-hidden">
              <View className="bg-secondary-solid p-4">
                <Text className="text-white font-sans">Secondary: Soft Teal (#35B6B4)</Text>
              </View>
            </View>

            <View className="rounded-md overflow-hidden">
              <View className="bg-accent-solid p-4">
                <Text className="text-white font-sans">Accent: Warm Coral (#FF6B6B)</Text>
              </View>
            </View>

            <View className="space-y-1">
              <View className="rounded-md overflow-hidden">
                <View className="bg-neutral-white p-4 border border-gray-200">
                  <Text className="text-primary-solid font-sans">Neutral: White (#FFFFFF)</Text>
                </View>
              </View>

              <View className="rounded-md overflow-hidden">
                <View className="bg-neutral-light p-4">
                  <Text className="text-primary-solid font-sans">Neutral: Light Gray (#F5F7FA)</Text>
                </View>
              </View>

              <View className="rounded-md overflow-hidden">
                <View className="bg-neutral-gray p-4">
                  <Text className="text-primary-solid font-sans">Neutral: Gray (#DDE2E5)</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
} 