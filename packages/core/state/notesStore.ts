import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { NotesQueryParams } from '../types'

interface NotesState {
  // Search and filter state
  searchQuery: string
  showArchived: boolean
  showFavorites: boolean | undefined
  
  // UI state
  selectedNoteId: string | null
  isCreating: boolean
  
  // Actions
  setSearchQuery: (query: string) => void
  setShowArchived: (show: boolean) => void
  setShowFavorites: (show: boolean | undefined) => void
  setSelectedNoteId: (id: string | null) => void
  setIsCreating: (creating: boolean) => void
  
  // Computed getters
  getQueryParams: () => NotesQueryParams
  clearFilters: () => void
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      // Initial state
      searchQuery: '',
      showArchived: false,
      showFavorites: undefined,
      selectedNoteId: null,
      isCreating: false,
      
      // Actions
      setSearchQuery: (query) => set({ searchQuery: query }),
      setShowArchived: (show) => set({ showArchived: show }),
      setShowFavorites: (show) => set({ showFavorites: show }),
      setSelectedNoteId: (id) => set({ selectedNoteId: id }),
      setIsCreating: (creating) => set({ isCreating: creating }),
      
      // Computed getters
      getQueryParams: () => {
        const state = get()
        const params: NotesQueryParams = {
          archived: state.showArchived,
        }
        
        if (state.searchQuery) {
          params.search = state.searchQuery
        }
        
        if (state.showFavorites !== undefined) {
          params.favorite = state.showFavorites
        }
        
        return params
      },
      
      clearFilters: () => set({
        searchQuery: '',
        showArchived: false,
        showFavorites: undefined,
      }),
    }),
    {
      name: 'notes-store', // Storage key
      partialize: (state) => ({
        // Only persist search and filter state, not UI state
        searchQuery: state.searchQuery,
        showArchived: state.showArchived,
        showFavorites: state.showFavorites,
      }),
    }
  )
) 