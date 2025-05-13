import * as React from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { Button } from '../src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../src/components/ui/card';
import { Text } from '../src/components/ui/text';
import { ToggleTheme } from '../src/components/ToggleTheme';
import { useQuery } from 'convex/react';
import { api } from '../src/lib/convex';
import { FontDemo } from '../src/components/FontDemo';

export default function HomeScreen() {
  const healthStatus = useQuery(api.health.getHealth);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="p-4 mt-4">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-sans-bold text-primary-solid">Orbit</Text>
            <ToggleTheme />
          </View>

          <Text className="text-lg mb-4 font-sans text-foreground">
            Your Personal AI Assistant
          </Text>

          <Card className="mb-4 border-primary-solid border">
            <CardHeader className="bg-primary-solid">
              <CardTitle className="font-sans-medium text-white">Backend Status</CardTitle>
            </CardHeader>
            <CardContent>
              <View className="space-y-2">
                <Text>Status: {healthStatus ? healthStatus.status : 'Loading...'}</Text>
                {healthStatus && (
                  <Text>Last Updated: {healthStatus.timestamp}</Text>
                )}
              </View>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader className="bg-secondary-solid">
              <CardTitle className="font-sans-medium text-white">Font Demo</CardTitle>
            </CardHeader>
            <CardContent>
              <FontDemo />
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader className="bg-accent-solid">
              <CardTitle className="font-sans-medium text-white">Features</CardTitle>
            </CardHeader>
            <CardContent className="bg-neutral-light">
              <View className="space-y-2">
                <Text className="font-sans">• Intelligent Note-Taking</Text>
                <Text className="font-sans">• Smart Schedule Management</Text>
                <Text className="font-sans">• Emotional Support & Growth</Text>
                <Text className="font-sans">• Accountability Partner</Text>
              </View>

              <View className="mt-4">
                <Button className="bg-accent-solid">
                  Get Started
                </Button>
              </View>
            </CardContent>
          </Card>

          <View className="flex-row flex-wrap">
            <Card className="flex-1 mr-2 min-w-[150px] border-secondary-solid border">
              <CardHeader className="bg-secondary-solid">
                <CardTitle className="font-sans-medium text-white">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Text className="mb-2 font-sans">Create and organize your thoughts</Text>
                <Button variant="outline" className="border-secondary-solid text-secondary-solid">
                  Open
                </Button>
              </CardContent>
            </Card>

            <Card className="flex-1 min-w-[150px] border-primary-solid border">
              <CardHeader className="bg-primary-solid">
                <CardTitle className="font-sans-medium text-white">Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Text className="mb-2 font-sans">Manage your schedule</Text>
                <Button variant="outline" className="border-primary-solid text-primary-solid">
                  Open
                </Button>
              </CardContent>
            </Card>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 