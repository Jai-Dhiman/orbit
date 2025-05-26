import * as React from 'react';
import { SafeAreaView, View, Text, Image, StyleSheet, Pressable, useColorScheme } from 'react-native';
import { lightColors, darkColors } from '@arden/ui/styles/colors';
import { ChevronRight } from 'lucide-react-native';

export default function ProfileScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const styles = getStyles(colors);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Avatar & Info */}
      <View style={styles.avatarSection}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Alex Johnson</Text>
        <Text style={styles.email}>alex.johnson@example.com</Text>
      </View>

      {/* Options List */}
      <View style={styles.options}>
        {['Account Settings', 'Notifications', 'Privacy & Security', 'Help & Feedback'].map(option => (
          <Pressable key={option} style={styles.optionRow}>
            <Text style={styles.optionText}>{option}</Text>
            <ChevronRight size={20} color={colors.text2} />
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const getStyles = (colors: typeof lightColors) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    header: { padding: 16 },
    headerTitle: { fontSize: 20, fontWeight: '600', color: colors.text1 },
    avatarSection: { alignItems: 'center', marginTop: 32 },
    avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.muted },
    name: { fontSize: 18, fontWeight: '500', color: colors.text1, marginTop: 16 },
    email: { fontSize: 14, color: colors.text2, marginTop: 4 },
    options: { marginTop: 32 },
    optionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderColor: colors.border },
    optionText: { fontSize: 16, color: colors.text1 },
  }); 