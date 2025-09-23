# Interior AI Backend

A robust backend API built with Bun, Hono, and Drizzle ORM featuring advanced database connection management and error handling.

## 🚀 Quick Start

### Installation

```bash
bun install
```

### Environment Setup

Create a `.env` file with the following variables:

```env
DATABASE_URL=postgresql://username:password@host:port/database
PORT=3000
NODE_ENV=development
```

### Running the Server

```bash
# Development mode with hot reload
bun run dev

# Production mode
bun run start
```

## 🗄️ Database Features

### Connection Management

The backend includes advanced database connection management with:

- **Automatic Connection Retry**: Exponential backoff retry logic (up to 5 attempts)
- **Connection Status Tracking**: Real-time monitoring of database connection state
- **Health Checks**: Built-in health monitoring and status reporting
- **Graceful Shutdown**: Proper connection cleanup on server termination
- **Error Handling**: Comprehensive error handling with detailed logging

### Database Status States

- `connecting` - Initial connection attempt
- `connected` - Successfully connected and ready
- `disconnected` - Connection closed or not established
- `error` - Connection failed or encountered an error

### Health Check Endpoint

Monitor your database health via the `/health` endpoint:

```bash
curl http://localhost:3000/health
```

Response includes:
- Overall application health
- Database connection status
- Server uptime and memory usage
- Timestamp information

### Testing Database Connection

Run the included test script to verify database functionality:

```bash
bun test-db-connection.ts
```

## 🛠️ Database Operations

### Using the Database

```typescript
import { db } from './helper/databaseConnection';
import { usersTable } from './modals/schema';
import { eq } from 'drizzle-orm';

// Get database instance (with connection validation)
const database = db();

// Query users
const users = await database.select().from(usersTable);

// Find user by ID
const user = await database.select().from(usersTable)
  .where(eq(usersTable.betterAuthId, userId));
```

### Connection Utilities

```typescript
import { getDBStatus, healthCheck, reconnectDB } from './helper/databaseConnection';

// Check current connection status
const status = getDBStatus();

// Perform health check
const health = await healthCheck();

// Manually reconnect
await reconnectDB();
```

## 📊 Monitoring & Logging

The application provides detailed logging for database operations:

- 🔄 Connection initialization attempts
- ✅ Successful connection confirmations
- ❌ Connection failures with error details
- 🔄 Retry attempts with backoff timing
- 🔌 Graceful connection closures

## 🏗️ Architecture

- **Runtime**: Bun (fast JavaScript runtime)
- **Framework**: Hono (lightweight web framework)
- **ORM**: Drizzle ORM with PostgreSQL
- **Database**: PostgreSQL with connection pooling
- **Authentication**: Better Auth integration

## 📝 Available Scripts

```bash
# Development
bun run dev          # Start with hot reload

# Database
bun run db:generate  # Generate migrations
bun run db:migrate   # Run migrations
bun run db:push      # Push schema to database
bun run db:studio    # Open Drizzle Studio
bun run db:reset     # Reset database

# Testing
bun test-db-connection.ts  # Test database features
```

This project was created using `bun init` in bun v1.2.21. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
