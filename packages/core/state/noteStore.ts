import {create} from "zustand";

type NoteState = {
  currentNoteId: string | null;
  searchTerm: string;
  filterStatus: string; // e.g., 'all', 'favorites', 'archived'
  isEditing: boolean;
};

type NoteActions = {
  setCurrentNoteId: (id: string | null) => void;
  setSearchTerm: (term: string) => void;
  setFilterStatus: (status: string) => void;
  setIsEditing: (editing: boolean) => void;
  clearNoteSelection: () => void;
};

export const useNoteStore = create<NoteState & NoteActions>((set) => ({
  currentNoteId: null,
  searchTerm: "",
  filterStatus: "all",
  isEditing: false,
  setCurrentNoteId: (id) => set({ currentNoteId: id }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setIsEditing: (editing) => set({ isEditing: editing }),
  clearNoteSelection: () => set({ currentNoteId: null, isEditing: false }),
}));
