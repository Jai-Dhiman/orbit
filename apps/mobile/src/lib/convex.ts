import { ConvexReactClient } from "convex/react";

// For now, we'll use a type assertion for the API until the generated types are available
// This will be replaced by the actual generated API types after running the Convex dev server
type NotesAPI = {
  notes: {
    getNotes: any;
    getNote: any;
    createNote: any;
    updateNote: any;
    deleteNote: any;
  };
  health: {
    getHealth: any;
  };
};

// Create a new ConvexReactClient instance
export const convex = new ConvexReactClient("https://colorful-ox-590.convex.cloud" as string);

// Export a type-asserted API for use in our app
export const api = { 
  notes: {
    getNotes: "notes:getNotes",
    getNote: "notes:getNote",
    createNote: "notes:createNote", 
    updateNote: "notes:updateNote",
    deleteNote: "notes:deleteNote"
  },
  health: {
    getHealth: "health:getHealth"
  }
} as unknown as NotesAPI; 