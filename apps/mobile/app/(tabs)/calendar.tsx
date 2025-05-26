import * as React from 'react';
import { View, Text, SafeAreaView, Pressable, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { lightColors, darkColors } from '@arden/ui/styles/colors';

export default function CalendarScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const styles = getStyles(colors);

  const weekDays = [
    { label: 'Mon', date: '12' },
    { label: 'Tue', date: '13' },
    { label: 'Wed', date: '14' },
    { label: 'Thu', date: '15' },
    { label: 'Fri', date: '16' },
    { label: 'Sat', date: '17' },
    { label: 'Sun', date: '18' },
  ];
  const hours = Array.from({ length: 24 }, (_, i) => ({ hour: i, label: `${i}:00` }));

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.navButton}>
          <ChevronLeft size={24} color={colors.text1} />
        </Pressable>
        <Text style={styles.monthText}>May 2025</Text>
        <Pressable style={styles.navButton}>
          <ChevronRight size={24} color={colors.text1} />
        </Pressable>
      </View>

      {/* Week View */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.weekContainer}
        contentContainerStyle={styles.weekContent}
      >
        {weekDays.map((day) => (
          <View key={day.date} style={styles.day}>
            <Text style={styles.dayDate}>{day.date}</Text>
            <Text style={styles.dayLabel}>{day.label}</Text>
            <View style={styles.dot} />
          </View>
        ))}
      </ScrollView>

      {/* Day Slots */}
      <ScrollView style={styles.slotsContainer}>
        {hours.map(slot => (
          <View key={slot.label} style={styles.slot}>
            <Text style={styles.slotTime}>{slot.label}</Text>
            {slot.hour === 14 && (
              <View style={styles.event}>
                <Text style={styles.eventText}>Team Meeting</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors: typeof lightColors) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
    navButton: { padding: 8 },
    monthText: { fontSize: 20, fontWeight: '500', color: colors.text1 },
    weekContainer: { height: 80 },
    weekContent: { paddingHorizontal: 16, alignItems: 'center' },
    day: { width: 60, alignItems: 'center' },
    dayDate: { fontSize: 16, fontWeight: '500', color: colors.text1 },
    dayLabel: { fontSize: 12, color: colors.text2 },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent1, marginTop: 4 },
    slotsContainer: { flex: 1 },
    slot: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderColor: colors.border },
    slotTime: { width: 50, color: colors.text2 },
    event: { flex: 1, backgroundColor: `${colors.accent1}33`, padding: 8, borderRadius: 4 },
    eventText: { color: colors.text1, fontWeight: '500' },
  }); 