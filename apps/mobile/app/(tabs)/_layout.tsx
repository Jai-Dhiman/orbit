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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createMaterialTopTabNavigator();

export default function TabsLayout() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
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
          <SafeAreaView edges={['bottom']} style={{ backgroundColor: colors.muted }}>
            <View style={[styles.bottomBar, { paddingTop: 8 }]}>
              <Pressable
                onPress={() => props.navigation.navigate('notes')}
                style={[
                  styles.iconButton,
                  props.state.index === 0 && { backgroundColor: `${colors.accent1}33`, padding: 8, borderRadius: 16 },
                ]}
              >
                <FileText size={24} color={props.state.index === 0 ? colors.accent1 : colors.text1} />
              </Pressable>
              <Pressable
                onPress={() => props.navigation.navigate('index')}
                style={[
                  styles.iconButton,
                  props.state.index === 1 && { backgroundColor: `${colors.accent1}33`, padding: 8, borderRadius: 16 },
                ]}
              >
                <Home size={24} color={props.state.index === 1 ? colors.accent1 : colors.text1} />
              </Pressable>
              <Pressable
                onPress={() => props.navigation.navigate('calendar')}
                style={[
                  styles.iconButton,
                  props.state.index === 2 && { backgroundColor: `${colors.accent1}33`, padding: 8, borderRadius: 16 },
                ]}
              >
                <Calendar size={24} color={props.state.index === 2 ? colors.accent1 : colors.text1} />
              </Pressable>
            </View>
          </SafeAreaView>
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
  iconButton: { alignItems: 'center', width: 48 },
}); 