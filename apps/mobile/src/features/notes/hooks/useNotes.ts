import { create } from 'zustand';
import { useQuery, useMutation } from 'convex/react';
import { api, convex } from '../../../lib/convex';
import type { Note, CreateNoteInput, UpdateNoteInput } from '../types';

interface NotesState {
  selectedNoteId: string | null;
  setSelectedNote: (id: string | null) => void;
}

const useNotesStore = create<NotesState>((set) => ({
  selectedNoteId: null,
  setSelectedNote: (id) => set({ selectedNoteId: id }),
}));

export function useNotes() {
  const notes = useQuery(api.notes.getNotes) || [];
  const createNoteMutation = useMutation(api.notes.createNote);
  const updateNoteMutation = useMutation(api.notes.updateNote);
  const deleteNoteMutation = useMutation(api.notes.deleteNote);
  
  const { selectedNoteId, setSelectedNote } = useNotesStore();
  
  const getNote = (id: string) => {
    return notes.find((note: Note) => note.id === id);
  };
  
  const createNote = async (input: CreateNoteInput) => {
    try {
      const newNote = await createNoteMutation({
        title: input.title,
        content: input.content,
      });
      return newNote as unknown as Note;
    } catch (error) {
      console.error('Failed to create note:', error);
      throw error;
    }
  };
  
  const updateNote = async (input: UpdateNoteInput) => {
    try {
      if (!input.id) {
        throw new Error('Note ID is required for updating');
      }
      
      const updatedNote = await updateNoteMutation({
        id: input.id,
        title: input.title,
        content: input.content,
      });
      
      return updatedNote as unknown as Note;
    } catch (error) {
      console.error('Failed to update note:', error);
      throw error;
    }
  };
  
  const deleteNote = async (id: string) => {
    try {
      await deleteNoteMutation({ id });
      
      if (selectedNoteId === id) {
        setSelectedNote(null);
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
      throw error;
    }
  };
  
  return {
    notes: notes as Array<Note>,
    selectedNoteId,
    setSelectedNote,
    getNote,
    createNote,
    updateNote,
    deleteNote,
  };
} 