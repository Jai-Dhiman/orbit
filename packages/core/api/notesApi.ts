import { ConvexReactClient } from "convex/react";
import { api } from "../../../apps/server/convex/_generated/api";
import { Id } from "../../../apps/server/convex/_generated/dataModel";

// This is a placeholder. In a real app, the client would be initialized
// in a central place, like a context provider.
// For now, we'll assume a getClient function or direct import if simple.
// const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

// For the purpose of this subtask, we'll define functions that would
// conceptually use the convex client and its api object.
// The actual convex.query/mutation calls will be used in the hooks.

export type Note = {
  id: Id<"notes">;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateNoteArgs = {
  title: string;
  content: string;
};

export type UpdateNoteArgs = {
  id: Id<"notes">;
  title?: string;
  content?: string;
};

// Functions below are more conceptual representations of what TanStack Query
// will call via the convex api methods. Direct use of 'api' from generated
// convex code is typical in queryFn.

export const notesApi = {
  getNotes: async (convex: ConvexReactClient): Promise<Note[]> => {
    return await convex.query(api.notes.getNotes);
  },
  getNote: async (convex: ConvexReactClient, { id }: { id: Id<"notes"> }): Promise<Note | null> => {
    return await convex.query(api.notes.getNote, { id });
  },
  createNote: async (convex: ConvexReactClient, args: CreateNoteArgs): Promise<Note> => {
    return await convex.mutation(api.notes.createNote, args);
  },
  updateNote: async (convex: ConvexReactClient, args: UpdateNoteArgs): Promise<Note> => {
    return await convex.mutation(api.notes.updateNote, args);
  },
  deleteNote: async (convex: ConvexReactClient, { id }: { id: Id<"notes"> }): Promise<{ success: boolean }> => {
    return await convex.mutation(api.notes.deleteNote, { id });
  },
};
