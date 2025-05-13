import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

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

// Create and export the HTTP router
const http = httpRouter();

// Map the health check to a GET endpoint
http.route({
  path: "/health",
  method: "GET",
  handler: healthCheck,
});

export default http;
