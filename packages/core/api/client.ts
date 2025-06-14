import { hc } from 'hono/client';

// For now, we'll use the development URL.
// In production, this should come from environment configuration
const API_BASE_URL = 'http://localhost:8787';

// We'll need to import the AppType from the server once it's available
// For now, we'll define a basic client type that matches the health endpoint
type HealthResponse = {
  status: 'ok' | 'degraded';
  timestamp: string;
  database: 'connected' | 'error';
  dbCheck?: string;
  error?: string;
};

// Create the base API client
export const apiClient = hc(API_BASE_URL);

// Health check function
export const healthApi = {
  check: async (): Promise<HealthResponse> => {
    const response = await fetch(`${API_BASE_URL}/`);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }
    return response.json();
  },
};

// Helper function to handle API errors consistently
export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}
