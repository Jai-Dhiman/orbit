import {create} from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { zustandMMKVStorage } from "../lib/mmkv"; // Adjust path if needed

type UIState = {
  isLoading: boolean;
  error: string | null;
  theme: "light" | "dark";
  isSidebarOpen: boolean;
  activeSheet: string | null;
  sheetParams: Record<string, any> | null;
};

type UIActions = {
  setLoading: (loading: boolean) => void;
  setError: (message: string | null) => void;
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
  toggleSidebar: () => void;
  openSheet: (sheetName: string, params?: Record<string, any>) => void;
  closeSheet: () => void;
};

export const useUIStore = create<UIState & UIActions>()(
  persist(
    (set, get) => ({
      isLoading: false,
      error: null,
      theme: "light", // Default theme
      isSidebarOpen: false,
      activeSheet: null,
      sheetParams: null,
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (message) => set({ error: message }),
      toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      openSheet: (sheetName, params) => set({ activeSheet: sheetName, sheetParams: params || null }),
      closeSheet: () => set({ activeSheet: null, sheetParams: null }),
    }),
    {
      name: "ui-store-storage", // Unique name for MMKV
      storage: createJSONStorage(() => zustandMMKVStorage),
      partialize: (state) => ({ theme: state.theme }), // Only persist the theme
    }
  )
);
