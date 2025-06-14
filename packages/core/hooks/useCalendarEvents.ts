import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCalendarEvents,
  getCalendarEvent,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from '../api/calendarEvents'; // Adjust path as necessary
import type {
  CalendarEvent,
  CreateCalendarEventInput,
  UpdateCalendarEventInput,
  CalendarEventQueryParams,
} from '../types';

// Query keys for calendar events
export const calendarEventsKeys = {
  all: ['calendarEvents'] as const,
  lists: () => [...calendarEventsKeys.all, 'list'] as const,
  list: (params?: CalendarEventQueryParams) => [...calendarEventsKeys.lists(), params] as const,
  details: () => [...calendarEventsKeys.all, 'detail'] as const,
  detail: (id: string) => [...calendarEventsKeys.details(), id] as const,
};

// Hook to get all calendar events
export function useCalendarEvents(params?: CalendarEventQueryParams) {
  return useQuery<CalendarEvent[], Error>({
    queryKey: calendarEventsKeys.list(params),
    queryFn: () => getCalendarEvents(params),
    staleTime: 1000 * 60 * 5, // Consider data stale after 5 minutes
  });
}

// Hook to get a specific calendar event
export function useCalendarEvent(id: string) {
  return useQuery<CalendarEvent, Error>({
    queryKey: calendarEventsKeys.detail(id),
    queryFn: () => getCalendarEvent(id),
    enabled: !!id, // Only run query if id is provided
  });
}

// Hook to create a calendar event
export function useCreateCalendarEvent() {
  const queryClient = useQueryClient();

  return useMutation<CalendarEvent, Error, CreateCalendarEventInput>({
    mutationFn: (input: CreateCalendarEventInput) => createCalendarEvent(input),
    onSuccess: (newEvent) => {
      // Invalidate all calendar event lists to refetch them
      queryClient.invalidateQueries({ queryKey: calendarEventsKeys.lists() });
      // Optionally, update the cache for the new event's detail
      queryClient.setQueryData(calendarEventsKeys.detail(newEvent.id), newEvent);
    },
  });
}

// Hook to update a calendar event
export function useUpdateCalendarEvent() {
  const queryClient = useQueryClient();

  return useMutation<CalendarEvent, Error, { id: string; input: UpdateCalendarEventInput }>({
    mutationFn: ({ id, input }: { id: string; input: UpdateCalendarEventInput }) =>
      updateCalendarEvent(id, input),
    onSuccess: (updatedEvent, variables) => {
      // Update the specific event in cache
      queryClient.setQueryData(calendarEventsKeys.detail(variables.id), updatedEvent);
      // Invalidate lists to ensure they're updated
      queryClient.invalidateQueries({ queryKey: calendarEventsKeys.lists() });
      // Also invalidate the specific event detail query to ensure it's fresh
      queryClient.invalidateQueries({ queryKey: calendarEventsKeys.detail(variables.id) });
    },
  });
}

// Hook to delete a calendar event
export function useDeleteCalendarEvent() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: (id: string) => deleteCalendarEvent(id),
    onSuccess: (_, id) => {
      // Remove the event from cache
      queryClient.removeQueries({ queryKey: calendarEventsKeys.detail(id) });
      // Invalidate lists to refetch them
      queryClient.invalidateQueries({ queryKey: calendarEventsKeys.lists() });
    },
  });
}
