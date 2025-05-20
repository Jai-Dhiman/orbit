import * as React from 'react';
import { View, Text, SafeAreaView, StatusBar, StyleSheet, ScrollView } from 'react-native';

export default function Page2Screen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.backButton} />
        <Text style={styles.headerTitle}>Notes</Text>
        <View style={styles.searchIcon} />
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>A</Text>
        </View>
      </View>

      {/* Note Input Area */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputPlaceholder}>Write me a note about...</Text>
        <View style={styles.sendIcon} />
      </View>

      {/* Notes List */}
      <ScrollView style={styles.notesContainer}>
        {/* This Week Section */}
        <Text style={styles.sectionTitle}>This Week</Text>
        <View style={styles.noteCard}>
          <Text style={styles.noteText}>Shopping List</Text>
          <View style={styles.moreIcon} />
        </View>
        <View style={styles.noteCard}>
          <Text style={styles.noteText}>Workout Plan</Text>
          <View style={styles.moreIcon} />
        </View>

        {/* Last Week Section */}
        <Text style={styles.sectionTitle}>Last Week</Text>
        <View style={styles.noteCard}>
          <Text style={styles.noteText}>Note #3</Text>
          <View style={styles.moreIcon} />
        </View>
        <View style={styles.noteCard}>
          <Text style={styles.noteText}>Note #4</Text>
          <View style={styles.moreIcon} />
        </View>
        <View style={styles.noteCard}>
          <Text style={styles.noteText}>Note #5</Text>
          <View style={styles.moreIcon} />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <View style={styles.navIcon} />
        <View style={styles.navIcon} />
        <View style={styles.navIconCenter} />
        <View style={styles.navIcon} />
        <View style={styles.navIcon} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F7F2',
    borderRadius: 30,
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: 25,
    height: 50,
  },
  backButton: {
    width: 35,
    height: 35,
    borderWidth: 2,
    borderColor: '#4A4238',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '500',
    color: '#4A4238',
    marginLeft: 30,
  },
  searchIcon: {
    width: 32,
    height: 32,
    borderWidth: 2,
    borderColor: '#4A4238',
    marginLeft: 'auto',
    marginRight: 30,
  },
  avatarContainer: {
    width: 35,
    height: 35,
    borderRadius: 999,
    backgroundColor: '#7D6E83',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '400',
  },
  inputContainer: {
    width: '85%',
    height: 100,
    marginTop: 40,
    marginHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputPlaceholder: {
    color: '#7D7468',
    fontSize: 24,
    fontWeight: '400',
  },
  sendIcon: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderColor: '#7D6E83',
  },
  notesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: '#7D7468',
    marginVertical: 16,
    marginLeft: 22,
  },
  noteCard: {
    height: 56,
    backgroundColor: '#FFFCF5',
    borderRadius: 30,
    marginBottom: 10,
    paddingHorizontal: 17,
    paddingVertical: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: 'rgba(174, 174, 174, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E8E2D6',
  },
  noteText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A4238',
  },
  moreIcon: {
    width: 2,
    height: 16,
    backgroundColor: '#4A4238',
    marginRight: 10,
  },
  bottomNav: {
    height: 70,
    width: '100%',
    backgroundColor: '#F1EDE4',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#E8E2D6',
  },
  navIcon: {
    width: 36,
    height: 36,
    borderWidth: 2,
    borderColor: '#4A4238',
  },
  navIconCenter: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: '#4A4238',
    borderRadius: 25,
  },
}); 