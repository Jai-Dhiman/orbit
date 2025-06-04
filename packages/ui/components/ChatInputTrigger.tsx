import React from 'react';
import { Pressable, Text, StyleSheet, View, useColorScheme } from 'react-native';
import { MessageSquare } from 'lucide-react-native'; // Or any other icon
import { lightColors, darkColors } from '../styles/colors'; // Assuming you have these

interface ChatInputTriggerProps {
  onPress: () => void;
  placeholder?: string;
}

export const ChatInputTrigger: React.FC<ChatInputTriggerProps> = ({ onPress, placeholder = "Start chatting..." }) => {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const styles = getStyles(colors);

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.iconView}>
        <MessageSquare size={20} color={colors.text2} />
      </View>
      <Text style={styles.placeholderText}>{placeholder}</Text>
    </Pressable>
  );
};

const getStyles = (colors: typeof lightColors | typeof darkColors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25, // Makes it pill-shaped
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 50, // Ensure a decent touch target size
  },
  iconView: {
    marginRight: 8,
  },
  placeholderText: {
    color: colors.text2,
    fontSize: 16,
  },
});

// Export as default or named, ensure consistency
export default ChatInputTrigger;
