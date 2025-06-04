import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Pressable,
  FlatList,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from 'react-native';
import { Send } from 'lucide-react-native';
import { useChatStore, Message } from '@arden/core'; // Assuming @arden/core is the alias for packages/core
import { lightColors, darkColors } from '../styles/colors';

export const ChatView: React.FC = () => {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const styles = getStyles(colors);

  const { messages, addMessage, loadMessages } = useChatStore();
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    // Messages are now loaded automatically on store initialization
    // If you still need to trigger it manually under certain conditions, you can do so here.
    // loadMessages();
  }, [loadMessages]);

  const handleSend = () => {
    if (inputText.trim().length === 0) {
      return;
    }
    const newMessage: Message = {
      id: Date.now().toString(), // Simple ID generation
      text: inputText.trim(),
      sender: 'user',
      timestamp: Date.now(),
    };
    addMessage(newMessage);
    setInputText('');
  };

  const renderMessageItem = ({ item }: { item: Message }) => (
    <View style={[styles.messageBubble, item.sender === 'user' ? styles.userMessage : styles.botMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timestampText}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} // Adjust as needed
    >
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        inverted // To show latest messages at the bottom
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor={colors.text2}
          multiline
        />
        <Pressable onPress={handleSend} style={styles.sendButton}>
          <Send size={24} color={colors.accent1} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const getStyles = (colors: typeof lightColors | typeof darkColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messageListContent: {
    paddingVertical: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120, // Allow multiline but with a max height
    backgroundColor: colors.inputBackground, // A slightly different background for input
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
    color: colors.text1,
  },
  sendButton: {
    padding: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
  },
  userMessage: {
    backgroundColor: colors.primary, // User messages in primary color
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  botMessage: {
    backgroundColor: colors.surface, // Bot messages in surface color
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    color: colors.text1, // Ensure text is readable on primary color
  },
  timestampText: {
    fontSize: 10,
    color: colors.text2, // Lighter text for timestamp
    alignSelf: 'flex-end',
    marginTop: 5,
  },
});

export default ChatView;
