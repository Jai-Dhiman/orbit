import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

// Initialize MMKV storage
const storage = new MMKV({
  id: 'auth-storage',
});

// Zustand middleware for MMKV (ensure this is not duplicated if already present)
const mmkvStorage: StateStorage = {
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name, value) => {
    storage.set(name, value);
  },
  removeItem: (name) => {
    storage.delete(name);
  },
};

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8787'; // Ensure this is defined

export interface AuthUser {
  id: string;
  email: string | null;
  name: string | null;
  picture: string | null;
  profileExists?: boolean;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at: number; // Unix timestamp in milliseconds
}

interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean; // General loading for login/logout/refresh
  error: string | null;
  isAuthenticated: boolean;
  isNewUser?: boolean;
  isRefreshingToken: boolean; // Specific loading state for token refresh
}

interface AuthActions {
  setUserAndSession: (user: AuthUser, session: AuthSession, isNewUser?: boolean) => void;
  clearAuth: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  getAccessToken: () => string | null; // Will be enhanced
  getRefreshToken: () => string | null;
  refreshAccessToken: () => Promise<string | null>; // New action
}

const initialState: AuthState = {
  user: null,
  session: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isNewUser: undefined,
  isRefreshingToken: false,
};

const loadPersistedState = (): Partial<AuthState> => {
  try {
    const persistedUser = storage.getString('auth.user');
    const persistedSession = storage.getString('auth.session');
    const persistedIsNewUser = storage.getString('auth.isNewUser');

    if (persistedUser && persistedSession) {
      const user = JSON.parse(persistedUser) as AuthUser;
      const session = JSON.parse(persistedSession) as AuthSession;
      if (session.expires_at > Date.now()) {
        return {
          user,
          session,
          isAuthenticated: true,
          isNewUser: persistedIsNewUser ? JSON.parse(persistedIsNewUser) : undefined,
        };
      } else {
        storage.delete('auth.user');
        storage.delete('auth.session');
        storage.delete('auth.isNewUser');
      }
    }
  } catch (e) {
    console.error("Failed to load persisted auth state:", e);
    storage.delete('auth.user');
    storage.delete('auth.session');
    storage.delete('auth.isNewUser');
  }
  return {};
};


export const useAuthStore = create<AuthState & AuthActions>()(
  (set, get) => ({
    ...initialState,
    ...loadPersistedState(),

    setUserAndSession: (user, session, isNewUser) => {
      set({
        user,
        session,
        isAuthenticated: true,
        isLoading: false,
        isRefreshingToken: false, // Reset refresh flag
        error: null,
        isNewUser
      });
      storage.set('auth.user', JSON.stringify(user));
      storage.set('auth.session', JSON.stringify(session));
      if (isNewUser !== undefined) {
        storage.set('auth.isNewUser', JSON.stringify(isNewUser));
      } else {
        storage.delete('auth.isNewUser');
      }
    },
    clearAuth: () => {
      set({ ...initialState, isAuthenticated: false, user: null, session: null });
      storage.delete('auth.user');
      storage.delete('auth.session');
      storage.delete('auth.isNewUser');
    },
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error, isLoading: false, isRefreshingToken: false }),

    getAccessToken: () => {
      const { session, isAuthenticated } = get();
      if (isAuthenticated && session && session.expires_at > Date.now()) {
        return session.access_token;
      }
      // Do not attempt refresh here directly to avoid loops.
      // API client should call refreshAccessToken.
      return null;
    },

    getRefreshToken: () => {
      const { session, isAuthenticated } = get();
      return isAuthenticated && session ? session.refresh_token : null;
    },

    refreshAccessToken: async () => {
      const { session, isRefreshingToken, isAuthenticated } = get();

      if (!isAuthenticated || !session?.refresh_token) {
        // console.log("Refresh: Not authenticated or no refresh token.");
        if (isAuthenticated) get().clearAuth(); // If was authenticated but no refresh token, clear auth
        return null;
      }

      if (isRefreshingToken) {
        // console.log("Refresh: Already refreshing, wait for it to complete.");
        // Simple busy wait, or could implement a promise queue for concurrent requests
        return new Promise((resolve) => {
          const unsubscribe = useAuthStore.subscribe(state => {
            if (!state.isRefreshingToken) {
              unsubscribe();
              resolve(state.session?.access_token ?? null);
            }
          });
        });
      }

      set({ isRefreshingToken: true, isLoading: true, error: null });

      try {
        // console.log("Refresh: Attempting to refresh token.");
        const response = await fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: session.refresh_token }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to refresh token');
        }

        // The server should return new user object and session object.
        // Assuming data format: { user: AuthUser, session: AuthSession, profileExists: boolean }
        // The server's /auth/refresh endpoint returns:
        // { session: { access_token, refresh_token, expires_at }, user: { id, email, name, picture }, profileExists }

        const refreshedUser: AuthUser = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          picture: data.user.picture,
          profileExists: data.profileExists, // Make sure server sends this
        };

        const refreshedSession: AuthSession = {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token, // Server should issue a new refresh token
          expires_at: data.session.expires_at,
        };

        get().setUserAndSession(refreshedUser, refreshedSession, get().isNewUser); // Preserve isNewUser status
        // console.log("Refresh: Token refreshed successfully.");
        set({ isRefreshingToken: false, isLoading: false });
        return refreshedSession.access_token;

      } catch (err: any) {
        console.error("Refresh: Token refresh failed:", err.message);
        get().setError(`Refresh failed: ${err.message}`); // This also sets isLoading and isRefreshingToken to false
        get().clearAuth(); // Critical: If refresh fails, logout user
        return null;
      }
    },
  })
);
