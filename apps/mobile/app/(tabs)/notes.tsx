import * as React from 'react';
import { View, Text, StyleSheet, SectionList, Pressable, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FileText } from 'lucide-react-native';
import { lightColors, darkColors } from '@arden/ui/styles/colors';

export default function NotesScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const styles = getStyles(colors);

  const sections = [
    {
      title: 'This Week',
      data: [
        { id: '1', title: 'Shopping List', snippet: 'Eggs, Milk, Bread' },
        { id: '2', title: 'Project Plan', snippet: 'Outline features for Arden app' },
      ],
    },
    {
      title: 'Last Week',
      data: [
        { id: '3', title: 'Meeting Notes', snippet: 'Discuss Q2 roadmap' },
        { id: '4', title: 'Ideas', snippet: 'AI journaling feature' },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <FileText size={24} color={colors.text1} />
        <Text style={styles.headerTitle}>Notes</Text>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSnippet}>{item.snippet}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const getStyles = (colors: typeof lightColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text1,
      marginLeft: 8,
    },
    sectionHeader: {
      fontSize: 18,
      fontWeight: '500',
      color: colors.text2,
      marginTop: 16,
      marginHorizontal: 16,
    },
    card: {
      backgroundColor: colors.surface,
      padding: 12,
      marginHorizontal: 16,
      marginTop: 8,
      borderRadius: 8,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text1,
    },
    cardSnippet: {
      fontSize: 14,
      color: colors.text2,
      marginTop: 4,
    },
    listContent: {
      paddingBottom: 100,
    },
  }); 