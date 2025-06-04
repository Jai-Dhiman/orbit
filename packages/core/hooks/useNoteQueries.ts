import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ConvexReactClient, useConvex } from "convex/react";
import { api } from "../../../apps/server/convex/_generated/api";
import { Id } from "../../../apps/server/convex/_generated/dataModel";
import { Note, CreateNoteArgs, UpdateNoteArgs } from "../api/notesApi"; // Adjust path as needed

const noteQueryKeys = {
  all: ["notes"] as const,
  lists: () => [...noteQueryKeys.all, "list"] as const,
  list: (filters: string) => [...noteQueryKeys.lists(), { filters }] as const,
  details: () => [...noteQueryKeys.all, "detail"] as const,
  detail: (id: Id<"notes"> | undefined) => [...noteQueryKeys.details(), id] as const,
};

export const useGetNotes = () => {
  const convex = useConvex();
  return useQuery<Note[], Error>({
    queryKey: noteQueryKeys.lists(),
    queryFn: () => convex.query(api.notes.getNotes),
  });
};

export const useGetNote = (id: Id<"notes"> | undefined) => {
  const convex = useConvex();
  return useQuery<Note | null, Error>({
    queryKey: noteQueryKeys.detail(id),
    queryFn: () => {
      if (!id) return Promise.resolve(null); // Or throw error if id is required
      return convex.query(api.notes.getNote, { id });
    },
    enabled: !!id, // Only run query if id is available
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  const convex = useConvex();
  return useMutation<Note, Error, CreateNoteArgs>({
    mutationFn: (args) => convex.mutation(api.notes.createNote, args),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteQueryKeys.lists() });
    },
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  const convex = useConvex();
  return useMutation<Note, Error, UpdateNoteArgs>({
    mutationFn: (args) => convex.mutation(api.notes.updateNote, args),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: noteQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: noteQueryKeys.detail(data.id) });
      // Optionally, update the specific query data directly
      // queryClient.setQueryData(noteQueryKeys.detail(data.id), data);
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  const convex = useConvex();
  return useMutation<{ success: boolean }, Error, { id: Id<"notes"> }>({
    mutationFn: (args) => convex.mutation(api.notes.deleteNote, args),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: noteQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: noteQueryKeys.detail(variables.id) });
      // Remove the specific query data if it exists
      // queryClient.removeQueries({ queryKey: noteQueryKeys.detail(variables.id) });
    },
  });
};
