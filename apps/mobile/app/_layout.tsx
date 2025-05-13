import type React from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { Home, FileText, Calendar } from 'lucide-react-native';
import '../global.css';
import { ConvexProvider, FontProvider } from '../src/providers';

interface TabBarIconProps {
  name: string;
  focused: boolean;
}

const TabBarIcon = ({ name, focused }: TabBarIconProps): React.JSX.Element => {
  return (
    <View className={`items-center justify-center ${focused ? 'opacity-100' : 'opacity-60'}`}>
      {name === 'index' ? (
        <Home size={24} color={focused ? '#3b82f6' : '#64748b'} />
      ) : name === 'notes' ? (
        <FileText size={24} color={focused ? '#3b82f6' : '#64748b'} />
      ) : (
        <Calendar size={24} color={focused ? '#3b82f6' : '#64748b'} />
      )}
    </View>
  );
};

export default function Layout(): JSX.Element {
  return (
    <FontProvider>
      <ConvexProvider>
        <StatusBar style="auto" />
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#3b82f6',
            tabBarInactiveTintColor: '#64748b',
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarLabel: 'Home',
              tabBarIcon: ({ focused }) => <TabBarIcon name="index" focused={focused} />,
            }}
          />
          <Tabs.Screen
            name="notes"
            options={{
              title: 'Notes',
              tabBarLabel: 'Notes',
              tabBarIcon: ({ focused }) => <TabBarIcon name="notes" focused={focused} />,
              headerShown: false,
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Calendar',
              tabBarLabel: 'Calendar',
              tabBarIcon: ({ focused }) => <TabBarIcon name="profile" focused={focused} />,
            }}
          />
        </Tabs>
      </ConvexProvider>
    </FontProvider>
  );
} 