import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all notes
export const getNotes = query({
  handler: async (ctx) => {
    const notes = await ctx.db.query("notes").collect();
    return notes.map(note => ({
      id: note._id,
      title: note.title,
      content: note.content,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    }));
  },
});

// Get a single note by ID
export const getNote = query({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    const note = await ctx.db.get(args.id);
    if (!note) {
      return null;
    }
    
    return {
      id: note._id,
      title: note.title,
      content: note.content,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    };
  },
});

// Create a new note
export const createNote = mutation({
  args: {
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const timestamp = new Date().toISOString();
    
    const noteId = await ctx.db.insert("notes", {
      title: args.title,
      content: args.content,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    
    return {
      id: noteId,
      title: args.title,
      content: args.content,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  },
});

// Update an existing note
export const updateNote = mutation({
  args: {
    id: v.id("notes"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateFields } = args;
    
    const note = await ctx.db.get(id);
    if (!note) {
      throw new Error(`Note with ID ${id} not found`);
    }
    
    const timestamp = new Date().toISOString();
    
    await ctx.db.patch(id, {
      ...updateFields,
      updatedAt: timestamp,
    });
    
    const updatedNote = await ctx.db.get(id);
    return {
      id: updatedNote._id,
      title: updatedNote.title,
      content: updatedNote.content,
      createdAt: updatedNote.createdAt,
      updatedAt: updatedNote.updatedAt,
    };
  },
});

// Delete a note
export const deleteNote = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    const note = await ctx.db.get(args.id);
    if (!note) {
      throw new Error(`Note with ID ${args.id} not found`);
    }
    
    await ctx.db.delete(args.id);
    return { success: true };
  },
}); 