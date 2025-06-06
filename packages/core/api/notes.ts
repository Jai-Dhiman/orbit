import type { 
  Note, 
  CreateNoteInput, 
  UpdateNoteInput, 
  NotesQueryParams, 
  NotesResponse, 
  NoteResponse 
} from '../types'

// Base API URL - this would come from environment in a real app
const API_BASE_URL = 'http://localhost:8787/api'

// Helper function to make API requests
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }

  return response.json()
}

// Notes API functions
export const notesApi = {
  // Get all notes
  getNotes: async (params?: NotesQueryParams): Promise<NotesResponse> => {
    const queryParams = new URLSearchParams()
    
    if (params) {
      if (params.search) queryParams.append('search', params.search)
      if (params.archived !== undefined) queryParams.append('archived', String(params.archived))
      if (params.favorite !== undefined) queryParams.append('favorite', String(params.favorite))
      if (params.limit) queryParams.append('limit', String(params.limit))
      if (params.offset) queryParams.append('offset', String(params.offset))
    }

    const queryString = queryParams.toString()
    const endpoint = `/notes${queryString ? `?${queryString}` : ''}`
    
    return apiRequest<NotesResponse>(endpoint)
  },

  // Get a specific note
  getNote: async (id: string): Promise<NoteResponse> => {
    return apiRequest<NoteResponse>(`/notes/${id}`)
  },

  // Create a new note
  createNote: async (input: CreateNoteInput): Promise<NoteResponse> => {
    return apiRequest<NoteResponse>('/notes', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },

  // Update a note
  updateNote: async (id: string, input: UpdateNoteInput): Promise<NoteResponse> => {
    return apiRequest<NoteResponse>(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    })
  },

  // Delete a note
  deleteNote: async (id: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/notes/${id}`, {
      method: 'DELETE',
    })
  },
} 