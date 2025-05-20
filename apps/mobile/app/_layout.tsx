import * as React from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
  return (
    <>
      <StatusBar style="auto" />
      <Tabs>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarLabel: 'Home',
          }}
        />
        <Tabs.Screen
          name="page2"
          options={{
            title: 'Page 2',
            tabBarLabel: 'Page 2',
          }}
        />
      </Tabs>
    </>
  );
} 