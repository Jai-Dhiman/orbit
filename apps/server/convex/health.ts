import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { query } from "./_generated/server";

/**
 * Health check endpoint to verify the Convex backend is running correctly.
 */
const healthCheck = httpAction(async () => {
  return new Response(
    JSON.stringify({
      status: "healthy",
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
});

/**
 * Query to check the health status of the backend.
 * Can be used from the frontend to verify connection.
 */
export const getHealth = query({
  args: {},
  handler: async (ctx) => {
    return {
      status: "healthy",
      timestamp: new Date().toISOString(),
    };
  },
});

// Create and export the HTTP router
const http = httpRouter();

// Map the health check to a GET endpoint
http.route({
  path: "/health",
  method: "GET",
  handler: healthCheck,
});

export default http;
