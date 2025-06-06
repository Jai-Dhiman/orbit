import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import type { Bindings } from '@/types'
import { createD1Client } from '@/db'
import * as schema from '@/db/schema'
import { eq, desc, and, like, or } from 'drizzle-orm'

// Create notes router with proper typing
const notesRouter = new Hono<{
  Bindings: Bindings
}>()

// Validation schemas for notes
const createNoteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().min(1, 'Content is required'),
  tags: z.array(z.string()).optional().default([]),
  favorite: z.boolean().optional().default(false),
})

const updateNoteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  tags: z.array(z.string()).optional(),
  favorite: z.boolean().optional(),
  archived: z.boolean().optional(),
})

const notesQuerySchema = z.object({
  search: z.string().optional(),
  archived: z.coerce.boolean().optional().default(false),
  favorite: z.coerce.boolean().optional(),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  offset: z.coerce.number().min(0).optional().default(0),
})

// Notes routes
const notesRoutes = notesRouter
  // Get all notes for a user
  .get(
    '/',
    zValidator('query', notesQuerySchema),
    async (c) => {
      try {
        const { search, archived, favorite, limit, offset } = c.req.valid('query')
        const dbInstance = createD1Client(c.env)
        
        // For now, using a hardcoded user ID (in production, get from auth middleware)
        const userId = 'user-1'
        
        let query = dbInstance
          .select()
          .from(schema.notes)
          .where(
            and(
              eq(schema.notes.userId, userId),
              eq(schema.notes.archived, archived ? 1 : 0),
              favorite !== undefined ? eq(schema.notes.favorite, favorite ? 1 : 0) : undefined
            )
          )
          .orderBy(desc(schema.notes.updatedAt))
          .limit(limit)
          .offset(offset)

        // Add search functionality
        if (search) {
          query = dbInstance
            .select()
            .from(schema.notes)
            .where(
              and(
                eq(schema.notes.userId, userId),
                eq(schema.notes.archived, archived ? 1 : 0),
                favorite !== undefined ? eq(schema.notes.favorite, favorite ? 1 : 0) : undefined,
                or(
                  like(schema.notes.title, `%${search}%`),
                  like(schema.notes.content, `%${search}%`)
                )
              )
            )
            .orderBy(desc(schema.notes.updatedAt))
            .limit(limit)
            .offset(offset)
        }

        const notes = await query.execute()
        
        // Parse tags from JSON strings
        const parsedNotes = notes.map(note => ({
          ...note,
          tags: note.tags ? JSON.parse(note.tags) : [],
          archived: Boolean(note.archived),
          favorite: Boolean(note.favorite)
        }))

        return c.json({ notes: parsedNotes }, 200)
      } catch (error) {
        console.error('Error fetching notes:', error)
        return c.json(
          { error: 'Failed to fetch notes' },
          500
        )
      }
    }
  )
  // Get a specific note
  .get(
    '/:id',
    zValidator(
      'param',
      z.object({
        id: z.string(),
      })
    ),
    async (c) => {
      try {
        const { id } = c.req.valid('param')
        const dbInstance = createD1Client(c.env)
        
        // For now, using a hardcoded user ID (in production, get from auth middleware)
        const userId = 'user-1'
        
        const [note] = await dbInstance
          .select()
          .from(schema.notes)
          .where(
            and(
              eq(schema.notes.id, id),
              eq(schema.notes.userId, userId)
            )
          )
          .limit(1)
          .execute()

        if (!note) {
          return c.json({ error: 'Note not found' }, 404)
        }

        const parsedNote = {
          ...note,
          tags: note.tags ? JSON.parse(note.tags) : [],
          archived: Boolean(note.archived),
          favorite: Boolean(note.favorite)
        }

        return c.json({ note: parsedNote }, 200)
      } catch (error) {
        console.error('Error fetching note:', error)
        return c.json(
          { error: 'Failed to fetch note' },
          500
        )
      }
    }
  )
  // Create a new note
  .post(
    '/',
    zValidator('json', createNoteSchema),
    async (c) => {
      try {
        const { title, content, tags, favorite } = c.req.valid('json')
        const dbInstance = createD1Client(c.env)
        
        // For now, using a hardcoded user ID (in production, get from auth middleware)
        const userId = 'user-1'
        const noteId = crypto.randomUUID()
        const now = new Date().toISOString()

        await dbInstance
          .insert(schema.notes)
          .values({
            id: noteId,
            userId,
            title,
            content,
            tags: JSON.stringify(tags),
            favorite: favorite ? 1 : 0,
            archived: 0,
            createdAt: now,
            updatedAt: now,
          })
          .execute()

        // Query the created note
        const [newNote] = await dbInstance
          .select()
          .from(schema.notes)
          .where(eq(schema.notes.id, noteId))
          .limit(1)
          .execute()

        if (!newNote) {
          throw new Error('Failed to create note')
        }

        const parsedNote = {
          ...newNote,
          tags: newNote.tags ? JSON.parse(newNote.tags) : [],
          archived: Boolean(newNote.archived),
          favorite: Boolean(newNote.favorite)
        }

        return c.json({ note: parsedNote }, 201)
      } catch (error) {
        console.error('Error creating note:', error)
        return c.json(
          { error: 'Failed to create note' },
          500
        )
      }
    }
  )
  // Update a note
  .put(
    '/:id',
    zValidator('param', z.object({ id: z.string() })),
    zValidator('json', updateNoteSchema),
    async (c) => {
      try {
        const { id } = c.req.valid('param')
        const updates = c.req.valid('json')
        const dbInstance = createD1Client(c.env)
        
        // For now, using a hardcoded user ID (in production, get from auth middleware)
        const userId = 'user-1'

        // Check if note exists and belongs to user
        const [existingNote] = await dbInstance
          .select()
          .from(schema.notes)
          .where(
            and(
              eq(schema.notes.id, id),
              eq(schema.notes.userId, userId)
            )
          )
          .limit(1)
          .execute()

        if (!existingNote) {
          return c.json({ error: 'Note not found' }, 404)
        }

        // Build update object
        const updateData: any = {
          updatedAt: new Date().toISOString()
        }

        if (updates.title !== undefined) updateData.title = updates.title
        if (updates.content !== undefined) updateData.content = updates.content
        if (updates.tags !== undefined) updateData.tags = JSON.stringify(updates.tags)
        if (updates.favorite !== undefined) updateData.favorite = updates.favorite ? 1 : 0
        if (updates.archived !== undefined) updateData.archived = updates.archived ? 1 : 0

        await dbInstance
          .update(schema.notes)
          .set(updateData)
          .where(eq(schema.notes.id, id))
          .execute()

        // Query the updated note
        const [updatedNote] = await dbInstance
          .select()
          .from(schema.notes)
          .where(eq(schema.notes.id, id))
          .limit(1)
          .execute()

        if (!updatedNote) {
          throw new Error('Failed to update note')
        }

        const parsedNote = {
          ...updatedNote,
          tags: updatedNote.tags ? JSON.parse(updatedNote.tags) : [],
          archived: Boolean(updatedNote.archived),
          favorite: Boolean(updatedNote.favorite)
        }

        return c.json({ note: parsedNote }, 200)
      } catch (error) {
        console.error('Error updating note:', error)
        return c.json(
          { error: 'Failed to update note' },
          500
        )
      }
    }
  )
  // Delete a note
  .delete(
    '/:id',
    zValidator('param', z.object({ id: z.string() })),
    async (c) => {
      try {
        const { id } = c.req.valid('param')
        const dbInstance = createD1Client(c.env)
        
        // For now, using a hardcoded user ID (in production, get from auth middleware)
        const userId = 'user-1'

        // Check if note exists and belongs to user
        const [existingNote] = await dbInstance
          .select()
          .from(schema.notes)
          .where(
            and(
              eq(schema.notes.id, id),
              eq(schema.notes.userId, userId)
            )
          )
          .limit(1)
          .execute()

        if (!existingNote) {
          return c.json({ error: 'Note not found' }, 404)
        }

        await dbInstance
          .delete(schema.notes)
          .where(eq(schema.notes.id, id))
          .execute()

        return c.json({ message: 'Note deleted successfully' }, 200)
      } catch (error) {
        console.error('Error deleting note:', error)
        return c.json(
          { error: 'Failed to delete note' },
          500
        )
      }
    }
  )

export type NotesRoutes = typeof notesRoutes

export default notesRoutes 