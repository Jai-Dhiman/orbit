import { create } from 'zustand';
import { MMKVLoader, MMKVStorage } from 'react-native-mmkv-storage';

const storage = new MMKVStorage({
  id: 'chatStore',
  encryptionKey: 'your-encryption-key', // Consider a more secure way to handle this if needed
});

const mmkvLoader = new MMKVLoader({ storage });

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
}

interface ChatState {
  messages: Message[];
  addMessage: (message: Message) => void;
  loadMessages: () => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  addMessage: (message) => {
    set((state) => ({ messages: [...state.messages, message] }));
    // Persist messages after adding
    mmkvLoader.save({ messages: get().messages });
  },
  loadMessages: async () => {
    const loadedState = await mmkvLoader.load();
    if (loadedState && loadedState.messages) {
      set({ messages: loadedState.messages });
    }
  },
}));

// Initialize by loading messages
// This is a self-invoking async function to load messages when the store is initialized.
(async () => {
  await useChatStore.getState().loadMessages();
})();
