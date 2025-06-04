import {create} from "zustand";

// Define more specific types for ConversationEntry if available
type ConversationEntry = { role: "user" | "assistant" | "system"; content: string; timestamp: string; };

type InteractionState = {
  isListening: boolean;
  isProcessing: boolean;
  conversationHistory: Array<ConversationEntry>;
  currentIntent: string | null;
};

type InteractionActions = {
  startListening: () => void;
  stopListening: () => void;
  setProcessing: (processing: boolean) => void;
  addToConversation: (entry: ConversationEntry) => void;
  setCurrentIntent: (intent: string | null) => void;
  clearConversation: () => void;
};

export const useInteractionStore = create<InteractionState & InteractionActions>((set) => ({
  isListening: false,
  isProcessing: false,
  conversationHistory: [],
  currentIntent: null,
  startListening: () => set({ isListening: true }),
  stopListening: () => set({ isListening: false }),
  setProcessing: (processing) => set({ isProcessing: processing }),
  addToConversation: (entry) => set((state) => ({ conversationHistory: [...state.conversationHistory, entry] })),
  setCurrentIntent: (intent) => set({ currentIntent: intent }),
  clearConversation: () => set({ conversationHistory: [], currentIntent: null }),
}));
