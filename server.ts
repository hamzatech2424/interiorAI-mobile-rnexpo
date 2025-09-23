// server.ts - Main server file with Hono
import { getDBStatus } from './helper/databaseConnection';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { auth } from './auth';
import { getApiNotFound } from './routes/api';
import { authorization } from './middleware/authorization';
import { syncUser } from './routes/users';
import { trpcServer } from '@hono/trpc-server'
import { appRouter } from './trpc/router';
import { createContext } from './trpc/trpcContext';

const app = new Hono();

// Middlewares
app.use('/api/auth/*', (c) => auth.handler(c.req.raw));

app.use('*', logger());
app.use('*', cors());

app.get('/api/user/secure-endpoint',authorization, syncUser)


// Custom endpoint configuration
app.use(
  '/api/trpc/*',
  trpcServer({
    endpoint: '/api/trpc',
    router: appRouter,
    createContext: createContext,
  })
)


// API wildcard fallback (must come last)
app.get('/api/*', getApiNotFound);

// Root route
app.get('/', (c) => {
  return c.json({
    success: true,
    data: {
      message: "API Server",
      version: "1.0.0",
      endpoints: {
        users: "/users",
        status: "/api/status"
      }
    }
  });
});

// Global error handler
app.onError((err, c) => {
  console.log('🔥 Server Error:', err);

  return c.json({
    success: false,
    error: {
      code: 500,
      message: "Internal Server Error",
      description: process.env.NODE_ENV !== "production" ? err.message : "Internal Server Error",
    },
  }, 200);
});

// 404 handler
app.notFound((c) => {
  return c.json({
    success: false,
    error: {
      code: 404,
      message: "Not Found",
      description: "The requested resource was not found",
    },
  }, 200);
});


// Startup notification
console.log('🚀 Starting server...');
console.log('📊 Database status:', getDBStatus());

export default {
  port: Number(process.env.PORT || 3000),
  development: process.env.NODE_ENV !== "production",
  fetch: app.fetch,
};
