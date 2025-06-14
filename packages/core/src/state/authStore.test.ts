import { useAuthStore, type AuthUser, type AuthSession } from './authStore';
import { MMKV } from 'react-native-mmkv';

// Mock MMKV
jest.mock('react-native-mmkv');

const mockUser: AuthUser = {
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  picture: 'http://example.com/pic.jpg',
  profileExists: true,
};

const mockSession: AuthSession = {
  access_token: 'fake-access-token',
  refresh_token: 'fake-refresh-token',
  expires_at: Date.now() + 3600 * 1000, // Expires in 1 hour
};

const expiredSession: AuthSession = {
  access_token: 'expired-access-token',
  refresh_token: 'expired-refresh-token',
  expires_at: Date.now() - 3600 * 1000, // Expired 1 hour ago
};

// Mock fetch for refreshAccessToken
global.fetch = jest.fn();

describe('useAuthStore', () => {
  let mmkvInstance: MMKV;

  beforeEach(() => {
    // Define initial state explicitly for test resets
    const initialTestState = {
      user: null,
      session: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      isNewUser: undefined,
      isRefreshingToken: false,
    };
    // Reset store to initial state before each test
    // The `true` flag replaces the entire state object.
    useAuthStore.setState(initialTestState, true);

    // Clear all MMKV mocks and reset mock implementation for MMKV
    (MMKV as jest.MockedClass<typeof MMKV>).mockClear();

    // Create a new mock instance for each test and make sure methods are spies
    mmkvInstance = new MMKV(); // This will use the mock constructor
    // If MMKV methods are not automatically jest.fn() by the top-level mock, spy them here:
    // e.g., mmkvInstance.getString = jest.fn(); (if not already done by jest.mock)
    // mmkvInstance.set = jest.fn();
    // mmkvInstance.delete = jest.fn();
    // The default jest.mock behavior for a class usually makes methods jest.fn()

    (MMKV as jest.MockedClass<typeof MMKV>).mockImplementation(() => mmkvInstance);

    // Reset fetch mock
    (fetch as jest.Mock).mockClear();
  });

  it('should initialize with default state', () => {
    const { user, session, isAuthenticated, isLoading, error, isRefreshingToken } =
      useAuthStore.getState();
    expect(user).toBeNull();
    expect(session).toBeNull();
    expect(isAuthenticated).toBe(false);
    expect(isLoading).toBe(false);
    expect(error).toBeNull();
    expect(isRefreshingToken).toBe(false);
  });

  it('setUserAndSession should update state and persist to MMKV', () => {
    useAuthStore.getState().setUserAndSession(mockUser, mockSession, false);

    const { user, session, isAuthenticated, isNewUser } = useAuthStore.getState();
    expect(user).toEqual(mockUser);
    expect(session).toEqual(mockSession);
    expect(isAuthenticated).toBe(true);
    expect(isNewUser).toBe(false);

    expect(mmkvInstance.set).toHaveBeenCalledWith('auth.user', JSON.stringify(mockUser));
    expect(mmkvInstance.set).toHaveBeenCalledWith('auth.session', JSON.stringify(mockSession));
    expect(mmkvInstance.set).toHaveBeenCalledWith('auth.isNewUser', JSON.stringify(false));
  });

  it('clearAuth should reset state and remove from MMKV', () => {
    // First, set some auth data
    useAuthStore.getState().setUserAndSession(mockUser, mockSession, false);

    // Then, clear it
    useAuthStore.getState().clearAuth();

    const { user, session, isAuthenticated } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(session).toBeNull();
    expect(isAuthenticated).toBe(false);

    expect(mmkvInstance.delete).toHaveBeenCalledWith('auth.user');
    expect(mmkvInstance.delete).toHaveBeenCalledWith('auth.session');
    expect(mmkvInstance.delete).toHaveBeenCalledWith('auth.isNewUser');
  });

  it('getAccessToken should return token if valid', () => {
    useAuthStore.getState().setUserAndSession(mockUser, mockSession);
    const token = useAuthStore.getState().getAccessToken();
    expect(token).toBe(mockSession.access_token);
  });

  it('getAccessToken should return null if session is expired', () => {
    useAuthStore.getState().setUserAndSession(mockUser, expiredSession);
    const token = useAuthStore.getState().getAccessToken();
    expect(token).toBeNull();
  });

  it('getAccessToken should return null if not authenticated', () => {
    const token = useAuthStore.getState().getAccessToken();
    expect(token).toBeNull();
  });

  it('getRefreshToken should return refresh token if authenticated', () => {
    useAuthStore.getState().setUserAndSession(mockUser, mockSession);
    const refreshToken = useAuthStore.getState().getRefreshToken();
    expect(refreshToken).toBe(mockSession.refresh_token);
  });

  it('getRefreshToken should return null if not authenticated', () => {
    const refreshToken = useAuthStore.getState().getRefreshToken();
    expect(refreshToken).toBeNull();
  });

  describe('refreshAccessToken', () => {
    it('should successfully refresh token and update store', async () => {
      const newAccessToken = 'new-fake-access-token';
      const newRefreshToken = 'new-fake-refresh-token';
      const newExpiresAt = Date.now() + 7200 * 1000; // 2 hours
      const refreshedServerUser = { ...mockUser, name: 'Refreshed Test User' };
      const refreshedServerSession = {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        expires_at: newExpiresAt,
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          user: refreshedServerUser,
          session: refreshedServerSession,
          profileExists: refreshedServerUser.profileExists,
        }),
      });

      useAuthStore.getState().setUserAndSession(mockUser, mockSession); // Initial login
      const accessToken = await useAuthStore.getState().refreshAccessToken();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/refresh'),
        expect.any(Object),
      );
      expect(accessToken).toBe(newAccessToken);

      const state = useAuthStore.getState();
      expect(state.user).toEqual(refreshedServerUser);
      expect(state.session?.access_token).toBe(newAccessToken);
      expect(state.session?.refresh_token).toBe(newRefreshToken);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isRefreshingToken).toBe(false);
      expect(state.isLoading).toBe(false); // isLoading should also be reset

      // Check MMKV persistence
      expect(mmkvInstance.set).toHaveBeenCalledWith(
        'auth.user',
        JSON.stringify(refreshedServerUser),
      );
      expect(mmkvInstance.set).toHaveBeenCalledWith(
        'auth.session',
        JSON.stringify(expect.objectContaining({ access_token: newAccessToken })),
      );
    });

    it('should clear auth if refresh token fails', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Invalid refresh token' }),
      });

      useAuthStore.getState().setUserAndSession(mockUser, mockSession); // Initial login
      const accessToken = await useAuthStore.getState().refreshAccessToken();

      expect(accessToken).toBeNull();
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.session).toBeNull();
      expect(state.error).toContain('Refresh failed');
      expect(state.isRefreshingToken).toBe(false);
      expect(state.isLoading).toBe(false);

      expect(mmkvInstance.delete).toHaveBeenCalledWith('auth.user');
      expect(mmkvInstance.delete).toHaveBeenCalledWith('auth.session');
    });

    it('should return null and clear auth if no refresh token is available', async () => {
      useAuthStore.getState().setUserAndSession(mockUser, { ...mockSession, refresh_token: '' }); // No refresh token
      const accessToken = await useAuthStore.getState().refreshAccessToken();

      expect(accessToken).toBeNull();
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false); // Should be cleared
      expect(fetch).not.toHaveBeenCalled();
    });

    it('should handle concurrent refresh calls by waiting', async () => {
      const newAccessToken = 'concurrent-access-token';
      (fetch as jest.Mock).mockImplementationOnce(
        () =>
          new Promise(
            (resolve) =>
              setTimeout(
                () =>
                  resolve({
                    ok: true,
                    json: async () => ({
                      user: mockUser,
                      session: { ...mockSession, access_token: newAccessToken },
                      profileExists: mockUser.profileExists,
                    }),
                  }),
                100,
              ), // First call is slow
          ),
      );

      useAuthStore.getState().setUserAndSession(mockUser, mockSession);

      const promise1 = useAuthStore.getState().refreshAccessToken();
      const promise2 = useAuthStore.getState().refreshAccessToken(); // This should wait for promise1

      const [token1, token2] = await Promise.all([promise1, promise2]);

      expect(fetch).toHaveBeenCalledTimes(1); // Should only fetch once
      expect(token1).toBe(newAccessToken);
      expect(token2).toBe(newAccessToken);
      expect(useAuthStore.getState().session?.access_token).toBe(newAccessToken);
    });
  });
});

// Persistence tests that require jest.resetModules()
// These are more complex and test the initial load behavior.
describe('useAuthStore - Persistence', () => {
  beforeEach(() => {
    jest.resetModules(); // Crucial: Reset modules to re-evaluate authStore.ts and re-run create()
    // Fetch mock clear if it's used by any initial logic (not typical for Zustand create)
    // (fetch as jest.Mock).mockClear();
  });

  it('should load persisted state from MMKV if valid and not expired on store creation', () => {
    // Configure MMKV mock *before* dynamic import of the store for this test
    const mmkvGetMock = jest.fn((key: string) => {
      if (key === 'auth.user') return JSON.stringify(mockUser);
      if (key === 'auth.session') return JSON.stringify(mockSession); // Not expired
      if (key === 'auth.isNewUser') return JSON.stringify(false);
      return null;
    });
    const mmkvSetMock = jest.fn();
    const mmkvDeleteMock = jest.fn();

    // Use jest.doMock to set up the mock for MMKV *before* the module is imported
    jest.doMock('react-native-mmkv', () => ({
      __esModule: true, // Important for ES Modules
      MMKV: jest.fn().mockImplementation(() => ({
        getString: mmkvGetMock,
        set: mmkvSetMock,
        delete: mmkvDeleteMock,
      })),
    }));

    const { useAuthStore: freshAuthStore } = require('./authStore'); // Dynamically import store

    const state = freshAuthStore.getState();
    expect(mmkvGetMock).toHaveBeenCalledWith('auth.user');
    expect(mmkvGetMock).toHaveBeenCalledWith('auth.session');
    expect(state.user).toEqual(mockUser);
    expect(state.session).toEqual(mockSession);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isNewUser).toBe(false);
  });

  it('should not load persisted state if session is expired on store creation', () => {
    const mmkvGetMock = jest.fn((key: string) => {
      if (key === 'auth.user') return JSON.stringify(mockUser);
      if (key === 'auth.session') return JSON.stringify(expiredSession); // Expired
      return null;
    });
    const mmkvSetMock = jest.fn();
    const mmkvDeleteMock = jest.fn();

    jest.doMock('react-native-mmkv', () => ({
      __esModule: true,
      MMKV: jest.fn().mockImplementation(() => ({
        getString: mmkvGetMock,
        set: mmkvSetMock,
        delete: mmkvDeleteMock,
      })),
    }));

    const { useAuthStore: freshAuthStore } = require('./authStore'); // Dynamically import

    const state = freshAuthStore.getState();
    // Check that MMKV was queried for user and session
    expect(mmkvGetMock).toHaveBeenCalledWith('auth.user');
    expect(mmkvGetMock).toHaveBeenCalledWith('auth.session');
    // Check that expired data was deleted
    expect(mmkvDeleteMock).toHaveBeenCalledWith('auth.user');
    expect(mmkvDeleteMock).toHaveBeenCalledWith('auth.session');
    expect(mmkvDeleteMock).toHaveBeenCalledWith('auth.isNewUser');
    // Check that state reflects non-authentication
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.session).toBeNull();
  });
});
