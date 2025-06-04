import React, { useRef, useCallback, useMemo } from 'react';
import { View, Text, SafeAreaView, Pressable, StyleSheet, useColorScheme, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Menu, User } from 'lucide-react-native';
import { ChatInputTrigger, ChatView } from '@arden/ui';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { lightColors, darkColors } from '@arden/ui/styles/colors';

export default function HomeScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const styles = getStyles(colors);
  const router = useRouter();
  const [showMenu, setShowMenu] = React.useState(false);
  const tabs = ['All', 'Notes', 'Tasks', 'Goals', 'AI'] as const;
  const [selectedTab, setSelectedTab] = React.useState<typeof tabs[number]>('All');

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['25%', '90%'], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  // Dummy static feed data
  const dummyFeed = [
    { id: '1', type: 'note', title: 'Grocery List', snippet: 'Milk, Eggs, Bread' },
    { id: '2', type: 'task', title: 'Call Mom', due: '3:00 PM' },
    { id: '3', type: 'event', title: 'Team Meeting', time: '2:00 PM', color: colors.accent1 },
    { id: '4', type: 'ai', prompt: 'Summarize my tasks for today' },
  ];
  const filteredFeed = selectedTab === 'All'
    ? dummyFeed
    : dummyFeed.filter(item => {
      if (selectedTab === 'AI') return item.type === 'ai';
      if (selectedTab === 'Notes') return item.type === 'note';
      if (selectedTab === 'Tasks') return item.type === 'task';
      if (selectedTab === 'Goals') return item.type === 'goal';
      return false;
    });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Navigation */}
        <View style={styles.topNav}>
          <Pressable style={styles.navButton}>
            <Menu size={24} color={colors.text1} />
          </Pressable>
          <Text style={styles.greeting}>Good morning, Alex</Text>
          <Pressable style={styles.navButton} onPress={() => setShowMenu(prev => !prev)}>
            <User size={24} color={colors.text1} />
          </Pressable>
        </View>
        {showMenu && (
          <View style={styles.menuDropdown}>
            <Pressable style={styles.menuItem} onPress={() => { router.push('/profile'); setShowMenu(false); }}>
              <Text style={styles.menuText}>Settings</Text>
            </Pressable>
          </View>
        )}
        {/* Chat Input Trigger */}
        <View style={styles.promptContainer}>
          <ChatInputTrigger onPress={handlePresentModalPress} placeholder="Tap to start chatting..." />
        </View>
        {/* Badge Counts */}
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeCount}>{dummyFeed.filter(i => i.type === 'note').length}</Text>
            <Text style={styles.badgeLabel}>Notes</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeCount}>{dummyFeed.filter(i => i.type === 'task').length}</Text>
            <Text style={styles.badgeLabel}>Tasks</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeCount}>{dummyFeed.filter(i => i.type === 'event').length}</Text>
            <Text style={styles.badgeLabel}>Events</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeCount}>{dummyFeed.filter(i => i.type === 'ai').length}</Text>
            <Text style={styles.badgeLabel}>AI</Text>
          </View>
        </View>
        {/* Segment Control */}
        <View style={styles.segmentControl}>
          {tabs.map(tab => (
            <Pressable
              key={tab}
              onPress={() => setSelectedTab(tab)}
              style={[
                styles.segmentTab,
                selectedTab === tab && styles.segmentTabActive,
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  selectedTab === tab && styles.segmentTextActive,
                ]}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>
        {/* Feed List */}
        <FlatList
          data={filteredFeed}
          keyExtractor={item => item.id}
          style={styles.feedList}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {item.type === 'note' && (
                <>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardSnippet}>{item.snippet}</Text>
                </>
              )}
              {item.type === 'task' && (
                <Text style={styles.cardTitle}>[ ] {item.title} — {item.due}</Text>
              )}
              {item.type === 'event' && (
                <Text style={styles.cardTitle}>{item.time} · {item.title}</Text>
              )}
              {item.type === 'ai' && (
                <TouchableOpacity style={styles.aiCard}>
                  <Text style={styles.cardSnippet}>{item.prompt}</Text>
                  <Text style={styles.applyText}>Apply</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      </View>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <ChatView />
      </BottomSheetModal>
    </SafeAreaView>
  );
}

const getStyles = (colors: typeof lightColors | typeof darkColors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  promptContainer: { marginVertical: 16, marginHorizontal: 16 }, // Adjusted margin for visual balance
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginHorizontal: 16,
  },
  navButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '500',
    color: colors.text1,
  },
  badgeContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 16 },
  badge: { alignItems: 'center' },
  badgeCount: { fontSize: 16, fontWeight: '600', color: colors.text1 },
  badgeLabel: { fontSize: 12, color: colors.text2 },
  segmentControl: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 8 },
  segmentTab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  segmentTabActive: { borderBottomColor: colors.accent1 },
  segmentText: { color: colors.text2 },
  segmentTextActive: { color: colors.text1, fontWeight: '600' },
  feedList: { flex: 1, paddingHorizontal: 16 },
  card: { padding: 12, marginBottom: 12, backgroundColor: colors.surface, borderRadius: 8 },
  cardTitle: { fontSize: 16, fontWeight: '500', color: colors.text1, marginBottom: 4 },
  cardSnippet: { fontSize: 14, color: colors.text2 },
  aiCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  applyText: { fontSize: 14, color: colors.accent1, fontWeight: '600' },
  menuDropdown: { position: 'absolute', top: 60, right: 16, backgroundColor: colors.surface, borderRadius: 8, elevation: 4 },
  menuItem: { paddingVertical: 8, paddingHorizontal: 16 },
  menuText: { color: colors.text1, fontSize: 16 },
}); 