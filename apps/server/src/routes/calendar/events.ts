import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { HTTPException } from 'hono/http-exception';
import { getCookie } from 'hono/cookie';
import { nanoid } from 'nanoid';

import { db } from '../../db';
import { calendarEvents } from '../../db/schema';
import { eq, and } from 'drizzle-orm';

const eventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  startTime: z.number(),
  endTime: z.number(),
  isAllDay: z.number().default(0),
  rrule: z.string().optional(),
});

const app = new Hono()
  .get('/', async (c) => {
    const userId = getCookie(c, 'user_id'); // Assuming user_id is stored in a cookie
    if (!userId) {
      throw new HTTPException(401, { message: 'Unauthorized' });
    }

    // TODO: Add filtering query params
    const events = await db.select().from(calendarEvents).where(eq(calendarEvents.userId, userId));
    return c.json(events);
  })
  .get('/:id', async (c) => {
    const userId = getCookie(c, 'user_id');
    if (!userId) {
      throw new HTTPException(401, { message: 'Unauthorized' });
    }
    const id = c.req.param('id');
    const event = await db
      .select()
      .from(calendarEvents)
      .where(and(eq(calendarEvents.id, id), eq(calendarEvents.userId, userId)));
    if (event.length === 0) {
      throw new HTTPException(404, { message: 'Event not found' });
    }
    return c.json(event[0]);
  })
  .post('/', zValidator('json', eventSchema), async (c) => {
    const userId = getCookie(c, 'user_id');
    if (!userId) {
      throw new HTTPException(401, { message: 'Unauthorized' });
    }
    const body = c.req.valid('json');
    const newEvent = {
      id: nanoid(),
      userId,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await db.insert(calendarEvents).values(newEvent);
    return c.json(newEvent, 201);
  })
  .put('/:id', zValidator('json', eventSchema), async (c) => {
    const userId = getCookie(c, 'user_id');
    if (!userId) {
      throw new HTTPException(401, { message: 'Unauthorized' });
    }
    const id = c.req.param('id');
    const body = c.req.valid('json');
    const updatedEventData = {
      ...body,
      updatedAt: new Date().toISOString(),
    };
    const result = await db
      .update(calendarEvents)
      .set(updatedEventData)
      .where(and(eq(calendarEvents.id, id), eq(calendarEvents.userId, userId)));
    if (result.rowsAffected === 0) {
      throw new HTTPException(404, { message: 'Event not found or access denied' });
    }
    // Fetch the updated event to return it
    const updatedEvent = await db
      .select()
      .from(calendarEvents)
      .where(and(eq(calendarEvents.id, id), eq(calendarEvents.userId, userId)));
    return c.json(updatedEvent[0]);
  })
  .delete('/:id', async (c) => {
    const userId = getCookie(c, 'user_id');
    if (!userId) {
      throw new HTTPException(401, { message: 'Unauthorized' });
    }
    const id = c.req.param('id');
    const result = await db
      .delete(calendarEvents)
      .where(and(eq(calendarEvents.id, id), eq(calendarEvents.userId, userId)));
    if (result.rowsAffected === 0) {
      throw new HTTPException(404, { message: 'Event not found or access denied' });
    }
    return c.json({ message: 'Event deleted successfully' });
  });

export const calendarEventsRoutes = app;
export type CalendarEventsRoutesType = typeof calendarEventsRoutes;
