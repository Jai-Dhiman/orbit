import * as React from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { Button } from '../src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../src/components/ui/card';
import { Text } from '../src/components/ui/text';
import { ToggleTheme } from '../src/components/ToggleTheme';
import { useQuery } from 'convex/react';
import { api } from '../src/lib/convex';

export default function HomeScreen() {
  const healthStatus = useQuery(api.health.getHealth);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="p-4 mt-4">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold">Orbit</Text>
            <ToggleTheme />
          </View>

          <Text className="text-lg mb-4">
            Your Personal AI Assistant
          </Text>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Backend Status</CardTitle>
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
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <View className="space-y-2">
                <Text>• Intelligent Note-Taking</Text>
                <Text>• Smart Schedule Management</Text>
                <Text>• Emotional Support & Growth</Text>
                <Text>• Accountability Partner</Text>
              </View>

              <View className="mt-4">
                <Button>
                  Get Started
                </Button>
              </View>
            </CardContent>
          </Card>

          <View className="flex-row flex-wrap">
            <Card className="flex-1 mr-2 min-w-[150px]">
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Text className="mb-2">Create and organize your thoughts</Text>
                <Button variant="outline" size="sm">
                  Open
                </Button>
              </CardContent>
            </Card>

            <Card className="flex-1 min-w-[150px]">
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Text className="mb-2">Manage your schedule</Text>
                <Button variant="outline" size="sm">
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