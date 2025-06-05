import type { Context } from 'hono';

export const errorHandler = (err: Error, c: Context) => {
  console.error(`[ERROR] ${err.message}`, err);

  return c.json(
    {
      error: c.env.ENV === 'production' ? 'Internal Server Error' : err.message,
    },
    500,
  );
};
