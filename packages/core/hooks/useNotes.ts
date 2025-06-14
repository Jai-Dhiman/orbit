import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesApi } from '../api';
import type { Note, CreateNoteInput, UpdateNoteInput, NotesQueryParams } from '../types';

// Query keys for notes
export const notesKeys = {
  all: ['notes'] as const,
  lists: () => [...notesKeys.all, 'list'] as const,
  list: (params?: NotesQueryParams) => [...notesKeys.lists(), params] as const,
  details: () => [...notesKeys.all, 'detail'] as const,
  detail: (id: string) => [...notesKeys.details(), id] as const,
};

// Hook to get all notes
export function useNotes(params?: NotesQueryParams) {
  return useQuery({
    queryKey: notesKeys.list(params),
    queryFn: () => notesApi.getNotes(params),
    staleTime: 1000 * 60 * 5, // Consider data stale after 5 minutes
  });
}

// Hook to get a specific note
export function useNote(id: string) {
  return useQuery({
    queryKey: notesKeys.detail(id),
    queryFn: () => notesApi.getNote(id),
    enabled: !!id, // Only run query if id is provided
  });
}

// Hook to create a note
export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateNoteInput) => notesApi.createNote(input),
    onSuccess: () => {
      // Invalidate all notes lists to refetch them
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
    },
  });
}

// Hook to update a note
export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateNoteInput }) =>
      notesApi.updateNote(id, input),
    onSuccess: (data, variables) => {
      // Update the specific note in cache
      queryClient.setQueryData(notesKeys.detail(variables.id), data);
      // Invalidate lists to ensure they're updated
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
    },
  });
}

// Hook to delete a note
export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notesApi.deleteNote(id),
    onSuccess: (_, id) => {
      // Remove the note from cache
      queryClient.removeQueries({ queryKey: notesKeys.detail(id) });
      // Invalidate lists to refetch them
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
    },
  });
}

// Hook for optimistic updates when toggling favorite
export function useToggleNoteFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, favorite }: { id: string; favorite: boolean }) =>
      notesApi.updateNote(id, { favorite }),

    // Optimistically update the UI before the server responds
    onMutate: async ({ id, favorite }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: notesKeys.detail(id) });

      // Snapshot the previous value
      const previousNote = queryClient.getQueryData(notesKeys.detail(id));

      // Optimistically update the cache
      queryClient.setQueryData(notesKeys.detail(id), (old: any) =>
        old ? { ...old, note: { ...old.note, favorite } } : old,
      );

      return { previousNote };
    },

    // On error, rollback to previous value
    onError: (err, { id }, context) => {
      if (context?.previousNote) {
        queryClient.setQueryData(notesKeys.detail(id), context.previousNote);
      }
    },

    // Always refetch after error or success
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: notesKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
    },
  });
}
