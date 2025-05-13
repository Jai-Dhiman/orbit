import { create } from 'zustand';
import type { Note, CreateNoteInput, UpdateNoteInput } from '../types';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../lib/convex';
import type { Id } from '../../../../../../../apps/server/convex/_generated/dataModel';

// Placeholder initial data
const initialNotes: Array<Note> = [
  {
    id: '1',
    title: 'Welcome to Orbit',
    content: 'This is your first note. Start organizing your thoughts here.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Ideas for projects',
    content: 'List of project ideas and resources.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface NotesState {
  notes: Array<Note>;
  selectedNoteId: string | null;
  
  // Actions
  getNotes: () => Array<Note>;
  getNote: (id: string) => Note | undefined;
  createNote: (input: CreateNoteInput) => Promise<Note>;
  updateNote: (input: UpdateNoteInput) => Promise<Note | undefined>;
  deleteNote: (id: string) => Promise<void>;
  setSelectedNote: (id: string | null) => void;
  
  // Sync with backend
  fetchNotes: () => Promise<void>;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: initialNotes,
  selectedNoteId: null,
  
  getNotes: () => get().notes,
  
  getNote: (id) => get().notes.find(note => note.id === id),
  
  createNote: async (input) => {
    const createNoteMutation = useMutation(api.notes.createNote);
    
    try {
      const newNote = await createNoteMutation({
        title: input.title,
        content: input.content,
      });
      
      set(state => ({
        notes: [...state.notes, newNote]
      }));
      
      return newNote;
    } catch (error) {
      console.error('Failed to create note:', error);
      throw error;
    }
  },
  
  updateNote: async (input) => {
    const updateNoteMutation = useMutation(api.notes.updateNote);
    
    try {
      if (!input.id) {
        throw new Error('Note ID is required for updating');
      }
      
      const convexId = input.id as Id<'notes'>;
      const updatedNote = await updateNoteMutation({
        id: convexId,
        title: input.title,
        content: input.content,
      });
      
      set(state => ({
        notes: state.notes.map(note => 
          note.id === input.id ? updatedNote : note
        )
      }));
      
      return updatedNote;
    } catch (error) {
      console.error('Failed to update note:', error);
      throw error;
    }
  },
  
  deleteNote: async (id) => {
    const deleteNoteMutation = useMutation(api.notes.deleteNote);
    
    try {
      const convexId = id as Id<'notes'>;
      await deleteNoteMutation({ id: convexId });
      
      set(state => ({
        notes: state.notes.filter(note => note.id !== id),
        selectedNoteId: state.selectedNoteId === id ? null : state.selectedNoteId,
      }));
    } catch (error) {
      console.error('Failed to delete note:', error);
      throw error;
    }
  },
  
  setSelectedNote: (id) => {
    set({ selectedNoteId: id });
  },
  
  fetchNotes: async () => {
    const getNotesQuery = useQuery(api.notes.getNotes);
    
    try {
      if (getNotesQuery) {
        set({ notes: getNotesQuery });
      }
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      throw error;
    }
  },
})); 