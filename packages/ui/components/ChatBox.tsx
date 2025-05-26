import type { FC } from 'react';
import { View, TextInput, StyleSheet, Pressable, Text, useColorScheme } from 'react-native';
import { Send, ChevronDown } from 'lucide-react-native';
import { lightColors, darkColors } from '../styles/colors';

export type ChatBoxProps = {
  models: Array<string>;
  selectedModel: string;
  onModelChange: (model: string) => void;
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
};

export const ChatBox: FC<ChatBoxProps> = ({
  models,
  selectedModel,
  onModelChange,
  value,
  onChangeText,
  onSend,
}) => {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;

  return (
    <View style={[styles.container, { borderColor: colors.border, backgroundColor: colors.surface }]}>
      <TextInput
        style={[styles.input, { color: colors.text1 }]}
        placeholder="Make a Note, Set a reminder, or ask a question..."
        placeholderTextColor={colors.muted}
        value={value}
        onChangeText={onChangeText}
        multiline
      />
      <View style={styles.footer}>
        <Pressable onPress={() => {/* open model selection */ }} style={styles.modelSelect}>
          <Text style={[styles.modelText, { color: colors.text2 }]}>{selectedModel}</Text>
          <ChevronDown color={colors.text2} size={16} />
        </Pressable>
        <Pressable onPress={onSend} style={styles.sendButton}>
          <Send color={colors.accent1} size={24} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 96,
    borderWidth: 5,
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  footer: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modelSelect: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modelText: {
    marginRight: 4,
    fontSize: 14,
  },
  sendButton: {},
}); 