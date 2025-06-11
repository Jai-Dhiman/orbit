// Note types
export interface Note {
  id: string
  userId: string
  title: string
  content: string
  tags: Array<string>
  archived: boolean
  favorite: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateNoteInput {
  title: string
  content: string
  tags?: Array<string>
  favorite?: boolean
}

export interface UpdateNoteInput {
  title?: string
  content?: string
  tags?: Array<string>
  favorite?: boolean
  archived?: boolean
}

export interface NotesQueryParams {
  search?: string
  archived?: boolean
  favorite?: boolean
  limit?: number
  offset?: number
}

export interface NotesResponse {
  notes: Array<Note>
}

export interface NoteResponse {
  note: Note
}

// Calendar Event types
export interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  isAllDay: boolean;
  rrule: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface CreateCalendarEventInput {
  title: string;
  description?: string;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  isAllDay?: boolean;
  rrule?: string;
}

export interface UpdateCalendarEventInput {
  title?: string;
  description?: string;
  startTime?: string; // ISO date string
  endTime?: string; // ISO date string
  isAllDay?: boolean;
  rrule?: string;
}

export interface CalendarEventQueryParams {
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  isAllDay?: boolean;
  limit?: number;
  offset?: number;
}

// Response types for calendar events
// These might be implicitly handled by Hono's RPC if client directly consumes server types.
// However, defining them explicitly can be good for clarity or if there's any transformation.
export interface CalendarEventsResponse {
  // Assuming the server directly returns an array of CalendarEvent
  events: CalendarEvent[];
}

export interface CalendarEventResponse {
  // Assuming the server directly returns a single CalendarEvent
  event: CalendarEvent;
}