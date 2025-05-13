import * as React from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { Button } from '../src/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../src/components/ui/card';
import { Text } from '../src/components/ui/text';
import { Tooltip, TooltipContent, TooltipTrigger } from '../src/components/ui/tooltip';
import { ToggleTheme } from '../src/components/ToggleTheme';
import { useColorScheme } from '../src/lib/useColorScheme';
import { Info } from 'lucide-react-native';

export default function ProfileScreen() {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="p-4 mt-4">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold">Profile</Text>
            <ToggleTheme />
          </View>

          <Card className="mb-4">
            <CardHeader>
              <View className="flex-row items-center">
                <CardTitle>React Native Reusables</CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <Info
                      size={16}
                      className="ml-2"
                      color={isDarkColorScheme ? "white" : "black"}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <Text className="text-sm">Universal shadcn/ui for React Native</Text>
                  </TooltipContent>
                </Tooltip>
              </View>
              <CardDescription>A shadcn/ui implementation for React Native</CardDescription>
            </CardHeader>
            <CardContent>
              <Text className="mb-4">
                These components are powered by React Native Reusables, a universal shadcn/ui implementation for React Native.
              </Text>
            </CardContent>
            <CardFooter>
              <Button
                variant="default"
                className="mr-2"
                onPress={() => { }}
              >
                Primary
              </Button>
              <Button
                variant="outline"
                onPress={() => { }}
              >
                Secondary
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Component Variants</CardTitle>
              <CardDescription>Try out different button variants</CardDescription>
            </CardHeader>
            <CardContent>
              <View className="flex-row flex-wrap gap-2 mb-4">
                <Button
                  variant="default"
                  size="sm"
                  onPress={() => { }}
                >
                  Default
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onPress={() => { }}
                >
                  Destructive
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onPress={() => { }}
                >
                  Outline
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onPress={() => { }}
                >
                  Secondary
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={() => { }}
                >
                  Ghost
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  onPress={() => { }}
                >
                  Link
                </Button>
              </View>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 