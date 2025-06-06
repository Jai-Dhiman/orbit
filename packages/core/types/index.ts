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