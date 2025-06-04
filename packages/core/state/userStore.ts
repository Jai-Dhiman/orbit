import {create} from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { zustandMMKVStorage } from "../lib/mmkv"; // Adjust path if needed

// Define more specific types for User and Preferences if available
type User = Record<string, any> | null;
type Preferences = Record<string, any>;

type UserState = {
  user: User;
  authToken: string | null;
  preferences: Preferences;
  isAuthenticated: () => boolean; // Getter function
};

type UserActions = {
  setUser: (userData: User, token: string | null) => void;
  logoutUser: () => void;
  setPreferences: (prefs: Preferences) => void;
  updatePreference: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
};

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set, get) => ({
      user: null,
      authToken: null,
      preferences: { notificationsEnabled: true, defaultCalendarView: "week" }, // Default preferences
      isAuthenticated: () => !!get().user && !!get().authToken,
      setUser: (userData, token) => set({ user: userData, authToken: token }),
      logoutUser: () => set({ user: null, authToken: null }), // Consider clearing preferences too or handle separately
      setPreferences: (prefs) => set((state) => ({ preferences: { ...state.preferences, ...prefs } })),
      updatePreference: (key, value) => set((state) => ({
        preferences: { ...state.preferences, [key]: value },
      })),
    }),
    {
      name: "user-store-storage", // Unique name for MMKV
      storage: createJSONStorage(() => zustandMMKVStorage),
      partialize: (state) => ({
        user: state.user, // Persist user
        authToken: state.authToken, // Persist token (ensure encryption if sensitive)
        preferences: state.preferences // Persist preferences
      }),
    }
  )
);
