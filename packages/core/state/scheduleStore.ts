import {create} from "zustand";

type ScheduleState = {
  selectedDate: string | null;
  currentView: "day" | "week" | "month";
  // events: Array<object>; // Client-side cache if needed
};

type ScheduleActions = {
  setSelectedDate: (date: string) => void;
  changeCalendarView: (view: "day" | "week" | "month") => void;
  // addLocalEvent: (event: object) => void;
};

export const useScheduleStore = create<ScheduleState & ScheduleActions>((set) => ({
  selectedDate: new Date().toISOString(),
  currentView: "week",
  // events: [],
  setSelectedDate: (date) => set({ selectedDate: date }),
  changeCalendarView: (view) => set({ currentView: view }),
  // addLocalEvent: (event) => set((state) => ({ events: [...state.events, event] })),
}));
