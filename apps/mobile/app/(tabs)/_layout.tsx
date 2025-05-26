import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import { Pressable, StyleSheet, View } from 'react-native';
import { Home, Calendar, FileText } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors } from '@arden/ui/styles/colors';
import NotesScreen from './notes';
import HomeScreen from './index';
import CalendarScreen from './calendar';

const Tab = createMaterialTopTabNavigator();

export default function TabsLayout() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const navigation = useNavigation<any>();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Tab.Navigator
        initialRouteName="index"
        tabBarPosition="bottom"
        screenOptions={{
          swipeEnabled: true,
          tabBarShowLabel: false,
          tabBarIndicatorStyle: { height: 0 },
          tabBarStyle: { height: 0 },
        }}
        tabBar={props => (
          <View style={[styles.bottomBar, { backgroundColor: colors.muted }]}>
            <Pressable onPress={() => props.navigation.navigate('notes')} style={styles.iconButton}>
              <FileText size={24} color={colors.text1} />
            </Pressable>
            <Pressable onPress={() => props.navigation.navigate('index')} style={styles.iconButton}>
              <Home size={24} color={colors.text1} />
            </Pressable>
            <Pressable onPress={() => props.navigation.navigate('calendar')} style={styles.iconButton}>
              <Calendar size={24} color={colors.text1} />
            </Pressable>
          </View>
        )}
      >
        <Tab.Screen name="notes" component={NotesScreen} options={{ tabBarShowLabel: false }} />
        <Tab.Screen name="index" component={HomeScreen} options={{ tabBarShowLabel: false }} />
        <Tab.Screen name="calendar" component={CalendarScreen} options={{ tabBarShowLabel: false }} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: { height: 64, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  iconButton: { flex: 1, alignItems: 'center' },
}); 