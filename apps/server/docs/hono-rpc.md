# Hono RPC Server

This server is set up with Hono RPC for type-safe API communication between client and server.

## Getting Started

### Development
```bash
bun run dev
```

### Deploy
```bash
bun run deploy
```

## Hono RPC Setup

### Server Side

The server exports type-safe API routes that can be consumed by RPC clients. The main structure is:

- `/apps/server/src/routes/api.ts` - Main RPC API routes
- `/apps/server/src/index.ts` - Main server file that exports AppType

### Key Features

1. **Type-safe endpoints** with Zod validation
2. **Proper error handling** with explicit status codes
3. **Chainable route structure** for RPC type inference

### Available Endpoints

#### GET `/api/health`
Health check endpoint that validates database connectivity.

```typescript
// Response
{
  status: 'ok' | 'degraded',
  timestamp: string,
  database: 'connected' | 'error',
  dbCheck?: string,
  error?: string
}
```

#### GET `/api/greeting?name=<string>`
Simple greeting endpoint with optional query parameter.

```typescript
// Query params
{ name?: string } // defaults to 'World'

// Response
{
  message: string,
  timestamp: string
}
```

#### POST `/api/echo`
Echo endpoint that returns the sent message with metadata.

```typescript
// Request body
{
  message: string,
  metadata?: Record<string, string>
}

// Response
{
  echo: string,
  metadata: Record<string, string>,
  timestamp: string
}
```

#### GET `/api/users/:id`
User lookup endpoint with path parameters.

```typescript
// Path params
{ id: string }

// Response (200)
{
  id: string,
  name: string,
  email: string
}

// Response (404)
{
  error: string
}
```

## RPC Client Usage

### In a monorepo setup:

```typescript
import { hc } from 'hono/client'
import type { AppType } from '@/server/src/index'

const client = hc<AppType>('http://localhost:8787')

// Type-safe API calls
const healthRes = await client.api.health.$get()
const greetingRes = await client.api.greeting.$get({ 
  query: { name: 'Arden' } 
})
const echoRes = await client.api.echo.$post({ 
  json: { message: 'Hello!' } 
})
const userRes = await client.api.users[':id'].$get({ 
  param: { id: '1' } 
})
```

### In a separate frontend project:

1. Export the server types from your server package
2. Install the server package as a dependency
3. Import the AppType and use with hc()

```typescript
import { hc } from 'hono/client'
import type { AppType } from 'your-server-package'

const client = hc<AppType>('https://your-api-domain.com')
```

## Best Practices

1. **Always use explicit status codes** in c.json() responses
2. **Chain routes properly** for RPC type inference
3. **Use Zod validators** for request validation
4. **Export route types** from individual route files
5. **Export main AppType** from index.ts

## Testing the RPC API

You can test the endpoints using the development server:

```bash
# Health check
curl http://localhost:8787/api/health

# Greeting
curl "http://localhost:8787/api/greeting?name=Arden"

# Echo
curl -X POST http://localhost:8787/api/echo \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello RPC!", "metadata": {"source": "test"}}'

# User lookup
curl http://localhost:8787/api/users/1
curl http://localhost:8787/api/users/999  # 404 example
```

## Integration with React/Next.js

For React applications, combine with TanStack Query for powerful data fetching:

```typescript
import { useQuery } from '@tanstack/react-query'
import { hc } from 'hono/client'
import type { AppType } from '@/server'

const client = hc<AppType>('/api')

function HealthCheck() {
  const { data, isLoading } = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const res = await client.api.health.$get()
      return res.json()
    }
  })

  if (isLoading) return <div>Checking health...</div>
  
  return <div>Status: {data?.status}</div>
}
```

## Next Steps

1. Add authentication middleware to protected routes
2. Implement database operations in the API endpoints
3. Add more complex validation schemas
4. Set up error handling and logging
5. Add rate limiting and security headers 