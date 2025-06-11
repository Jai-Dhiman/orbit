import { hc } from 'hono/client';
// Assume AppType will be available from the server package eventually
// For now, we might need to use a placeholder or be careful with types.
// import type { ApiRoutes as AppType } from '../../../apps/server/src/routes/api'; // Adjust path as needed

// Placeholder for AppType if the actual import causes issues during this step
type AppType = any;

import type {
  CalendarEvent,
  CalendarEventsResponse,
  CalendarEventResponse,
  CalendarEventQueryParams,
  CreateCalendarEventInput,
  UpdateCalendarEventInput,
} from '../types';

// Define a base URL for the API. This might come from an environment variable in a real app.
const BASE_URL = '/api'; // Adjust if your server is hosted elsewhere or has a different prefix

const client = hc<AppType>(BASE_URL);

// Function definitions

export const getCalendarEvents = async (params?: CalendarEventQueryParams): Promise<CalendarEvent[]> => {
  // Assuming the server returns an array of events directly, matching CalendarEvent[]
  // If it returns { events: CalendarEvent[] }, then use Promise<CalendarEventsResponse>
  // and adapt the return: `return (await res.json()).events;`
  const res = await client.calendar.events.$get({ query: params });
  if (!res.ok) throw new Error(`Failed to fetch events: ${res.status}`);
  return await res.json();
};

export const getCalendarEvent = async (id: string): Promise<CalendarEvent> => {
  // Assuming server returns a single event object directly, matching CalendarEvent
  // If it returns { event: CalendarEvent }, then use Promise<CalendarEventResponse>
  // and adapt the return: `return (await res.json()).event;`
  const res = await client.calendar.events[':id'].$get({ param: { id } });
  if (!res.ok) throw new Error(`Failed to fetch event ${id}: ${res.status}`);
  return await res.json();
};

export const createCalendarEvent = async (input: CreateCalendarEventInput): Promise<CalendarEvent> => {
  // Assuming server returns the created event object directly
  const res = await client.calendar.events.$post({ json: input });
  if (!res.ok) throw new Error(`Failed to create event: ${res.status}`);
  return await res.json();
};

export const updateCalendarEvent = async (id: string, input: UpdateCalendarEventInput): Promise<CalendarEvent> => {
  // Assuming server returns the updated event object directly
  const res = await client.calendar.events[':id'].$put({ param: { id }, json: input });
  if (!res.ok) throw new Error(`Failed to update event ${id}: ${res.status}`);
  return await res.json();
};

export const deleteCalendarEvent = async (id: string): Promise<{ message: string }> => {
  // Assuming server returns a simple message object e.g. { message: "Event deleted successfully" }
  const res = await client.calendar.events[':id'].$delete({ param: { id } });
  if (!res.ok) throw new Error(`Failed to delete event ${id}: ${res.status}`);
  return await res.json();
};
