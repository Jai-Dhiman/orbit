import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { errorHandler } from "@/middleware/errorHandler";
import { authMiddleware } from "@/middleware/auth";
import type { Bindings, Variables } from "@/types";
import healthRoutes from "@/routes/health";
import authRouter from "@/routes/auth";

const app = new Hono<{
  Bindings: Bindings;
  Variables: Variables;
}>();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: ['*'],
    allowHeaders: ["Content-Type", "Authorization", "sentry-trace", "baggage"],
    allowMethods: ["POST", "GET", "OPTIONS", "DELETE", "PUT"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

// Public routes
app.route("/", healthRoutes);
app.route("/auth", authRouter);

// Protected routes (add more as needed)
app.use("/api/*", authMiddleware);

app.onError(errorHandler);

export default {
  fetch: app.fetch,
};