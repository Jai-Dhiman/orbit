import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CalendarEventQueryParams } from '../types';

export type CalendarViewMode = 'day' | 'week' | 'month' | 'agenda';

interface CalendarEventsState {
  selectedEventId: string | null;
  isCreatingEvent: boolean;
  isEditingEvent: boolean; // Added to differentiate creating new vs editing existing
  viewMode: CalendarViewMode;
  currentDate: string; // ISO date string, e.g., "2023-10-27"
  // Example filter, can be expanded
  activeFilters: CalendarEventQueryParams;

  // Actions
  setSelectedEventId: (id: string | null) => void;
  setIsCreatingEvent: (isCreating: boolean) => void;
  setIsEditingEvent: (isEditing: boolean) => void;
  setViewMode: (mode: CalendarViewMode) => void;
  setCurrentDate: (date: string) => void;
  setActiveFilters: (filters: CalendarEventQueryParams) => void;
  resetUIState: () => void; // Action to reset UI state to initial values
}

const initialState = {
  selectedEventId: null,
  isCreatingEvent: false,
  isEditingEvent: false,
  viewMode: 'month' as CalendarViewMode,
  currentDate: new Date().toISOString().split('T')[0], // Default to today
  activeFilters: {},
};

export const useCalendarEventsStore = create<CalendarEventsState>()(
  persist(
    (set) => ({
      ...initialState,
      setSelectedEventId: (id) => set({ selectedEventId: id }),
      setIsCreatingEvent: (isCreating) =>
        set({ isCreatingEvent: isCreating, isEditingEvent: false, selectedEventId: null }),
      setIsEditingEvent: (isEditing) => set({ isEditingEvent: isEditing, isCreatingEvent: false }), // if isEditing is true, selectedEventId should already be set
      setViewMode: (mode) => set({ viewMode: mode }),
      setCurrentDate: (date) => set({ currentDate: date }),
      setActiveFilters: (filters) =>
        set((state) => ({ activeFilters: { ...state.activeFilters, ...filters } })),
      resetUIState: () => set(initialState),
    }),
    {
      name: 'calendar-events-storage', // Name for localStorage key
      storage: createJSONStorage(() => localStorage), // Use localStorage
      partialize: (state) => ({
        viewMode: state.viewMode,
        currentDate: state.currentDate,
        activeFilters: state.activeFilters,
        // We typically don't want to persist transient UI state like selectedEventId or isCreatingEvent
      }),
    },
  ),
);
