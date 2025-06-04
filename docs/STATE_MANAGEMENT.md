# State Management Reference

This document outlines the Zustand stores used in the Arden project for client-side state management.

## Guiding Principles

-   **Separation of Concerns**: Server state is managed by TanStack Query, while client-side UI state and ephemeral data are handled by Zustand.
-   **Minimalism**: Stores should only hold essential state.
-   **Feature-Oriented**: Stores are organized around features where appropriate, with a central UI store for global concerns.
-   **Persistence**: MMKV will be used for persisting relevant state slices like user preferences or theme settings.

## Stores Overview

### 1. Note Store (`noteStore.ts`)

Manages state related to note-taking activities.

**State:**

*   `currentNoteId: string | null`: The ID of the currently active or selected note. Used for detail views or editing.
*   `searchTerm: string`: The current search term entered by the user for filtering notes.
*   `filterStatus: string`: The current filter applied to the notes list (e.g., 'all', 'favorites', 'archived'). (Extensibility for future).
*   `isEditing: boolean`: Flag to indicate if a note is currently being edited.

**Actions:**

*   `setCurrentNoteId(id: string | null): void`: Sets the active note.
*   `setSearchTerm(term: string): void`: Updates the search term.
*   `setFilterStatus(status: string): void`: Sets the note filter.
*   `setIsEditing(editing: boolean): void`: Sets the editing state.
*   `clearNoteSelection(): void`: Resets `currentNoteId` and `isEditing`.

**Flow Diagram: Selecting and Editing a Note**

```mermaid
graph TD
    A[User selects a note] --> B{Is note already being edited?};
    B -- No --> C[Call setCurrentNoteId(noteId)];
    C --> D[Call setIsEditing(true)];
    D --> E[UI displays note content in edit mode];
    B -- Yes --> F[No action or show warning];

    G[User saves changes] --> H[Call TanStack Query mutation to save];
    H -- Success --> I[Call setIsEditing(false)];
    I --> J[Optionally call clearNoteSelection()];

    K[User cancels editing] --> L[Call setIsEditing(false)];
    L --> M[Optionally call clearNoteSelection()];
end
```

### 2. UI Store (`uiStore.ts`)

Manages global UI state.

**State:**

*   `isLoading: boolean`: Global loading indicator for non-TanStack Query operations (e.g., initial app load, complex client-side processing).
*   `error: string | null`: Global error message for non-TanStack Query errors.
*   `theme: 'light' | 'dark'`: The current application theme. (To be persisted with MMKV).
*   `isSidebarOpen: boolean`: State for a global sidebar/drawer (anticipating web/tablet UI).
*   `activeSheet: string | null`: Identifier for any currently active bottom sheet or modal.
*   `sheetParams: Record<string, any> | null`: Parameters to pass to the active sheet.


**Actions:**

*   `setLoading(loading: boolean): void`: Sets the global loading state.
*   `setError(message: string | null): void`: Sets or clears the global error message.
*   `toggleTheme(): void`: Switches between 'light' and 'dark' themes.
*   `setTheme(theme: 'light' | 'dark'): void`: Explicitly sets the theme.
*   `toggleSidebar(): void`: Toggles the sidebar visibility.
*   `openSheet(sheetName: string, params?: Record<string, any>): void`: Opens a sheet/modal.
*   `closeSheet(): void`: Closes the currently active sheet/modal.


**Flow Diagram: Theme Toggle**

```mermaid
graph TD
    A[User clicks theme toggle button] --> B[Call toggleTheme()];
    B --> C{Current theme is 'light'?};
    C -- Yes --> D[Set theme to 'dark'];
    C -- No --> E[Set theme to 'light'];
    D --> F[Persist theme to MMKV];
    E --> F;
    F --> G[UI updates with new theme];
end
```

### 3. User Store (`userStore.ts`)

Manages user authentication state and preferences.

**State:**

*   `user: object | null`: Information about the authenticated user (e.g., ID, name, email). Null if not authenticated.
*   `authToken: string | null`: The authentication token for the user.
*   `isAuthenticated: boolean`: Derived state, true if user and authToken are present.
*   `preferences: object`: User-specific preferences (e.g., `{ notificationsEnabled: true, defaultCalendarView: 'week' }`). (To be persisted with MMKV).

**Actions:**

*   `setUser(userData: object | null, token: string | null): void`: Sets user data and token upon login.
*   `logoutUser(): void`: Clears user data and token upon logout.
*   `setPreferences(prefs: object): void`: Updates user preferences.
*   `updatePreference(key: string, value: any): void`: Updates a single preference.

**Flow Diagram: User Login**

```mermaid
graph TD
    A[User submits login credentials] --> B[Call backend authentication];
    B -- Success --> C[Backend returns user data and token];
    C --> D[Call setUser(userData, token)];
    D --> E[Persist relevant parts of user data/prefs to MMKV];
    E --> F[Set isAuthenticated to true];
    F --> G[Navigate to authenticated part of the app];
    B -- Failure --> H[Display error message];
end
```

### 4. Schedule Store (`scheduleStore.ts`) - Anticipated

Manages state for calendar and scheduling features. (Placeholder for future development)

**State:**

*   `selectedDate: string | null`: ISO string of the currently selected date on the calendar.
*   `currentView: 'day' | 'week' | 'month'`: The current view mode of the calendar.
*   `events: Array<object>`: Client-side cache or temporary store for events, if needed beyond TanStack Query.

**Actions:**

*   `setSelectedDate(date: string): void`
*   `changeCalendarView(view: 'day' | 'week' | 'month'): void`
*   `addLocalEvent(event: object): void` (for temporary, non-synced events if applicable)

### 5. Interaction Store (`interactionStore.ts`) - Anticipated

Manages state related to ongoing user interactions, especially conversational ones.

**State:**

*   `isListening: boolean`: Whether the app is actively listening for voice input.
*   `isProcessing: boolean`: Whether an AI response is being processed.
*   `conversationHistory: Array<object>`: Short-term history of the current interaction session.
*   `currentIntent: string | null`: The detected intent from user input.

**Actions:**

*   `startListening(): void`
*   `stopListening(): void`
*   `setProcessing(processing: boolean): void`
*   `addToConversation(entry: object): void`
*   `setCurrentIntent(intent: string | null): void`
*   `clearConversation(): void`

## Persistence with MMKV

MMKV will be integrated into Zustand stores using middleware for persisting state that needs to survive app restarts. Examples include:
-   `uiStore`: `theme`
-   `userStore`: `preferences`, potentially `user` and `authToken` (encrypted)

This will be handled within each store's definition using Zustand's persistence middleware.
