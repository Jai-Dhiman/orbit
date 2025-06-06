import { Hono } from 'hono'
import type { Bindings } from '@/types'
import { createD1Client } from '@/db'
import * as schema from '@/db/schema' 
import notesRoutes from './notes'
import healthRoutes from './health'

// Create API router with proper typing
const apiRouter = new Hono<{
  Bindings: Bindings
}>()

// Chain all routes together for proper RPC type inference
const apiRoutes = apiRouter
  // Test endpoint to create a user (for development only)
  .post(
    '/test/user',
    async (c) => {
      try {
        const dbInstance = createD1Client(c.env)
        const userId = 'user-1'
        const now = new Date().toISOString()

        await dbInstance
          .insert(schema.users)
          .values({
            id: userId,
            email: 'test@example.com',
            name: 'Test User',
            emailVerified: 1,
            createdAt: now,
            updatedAt: now,
          })
          .execute()

        return c.json({ message: 'Test user created', userId }, 201)
      } catch (error) {
        console.error('Error creating test user:', error)
        return c.json(
          { error: 'Failed to create test user' },
          500
        )
      }
    }
  )
  // Mount feature routes
  .route('/health', healthRoutes)
  .route('/notes', notesRoutes)

// Export the complete API type for RPC client
export type ApiRoutes = typeof apiRoutes

export default apiRoutes 