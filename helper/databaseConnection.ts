import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";

// Database connection status
export enum DBStatus {
  CONNECTING = "connecting",
  CONNECTED = "connected",
  DISCONNECTED = "disconnected",
  ERROR = "error",
}

class DatabaseConnection {
  private pool: Pool | null = null;
  private db: ReturnType<typeof drizzle> | null = null;
  private status: DBStatus = DBStatus.DISCONNECTED;
  private retryCount = 0;
  private maxRetries = 5;
  private retryDelay = 1000; // 1 second

  constructor() {
    this.initializeConnection();
  }

  private async initializeConnection() {
    try {
      this.status = DBStatus.CONNECTING;
      console.log("🔄 Initializing database connection...");

      const connectionString = process.env.DATABASE_URL;

      if (!connectionString) {
        throw new Error("DATABASE_URL environment variable is not set");
      }

      this.pool = new Pool({
        connectionString,
        max: 20, // Maximum number of connections
        idleTimeoutMillis: 20000,
        connectionTimeoutMillis: 60000,
      });

      this.db = drizzle(this.pool);

      // Test the connection
      await this.testConnection();

      this.status = DBStatus.CONNECTED;
      this.retryCount = 0;
      console.log("✅ Database connected successfully!");
    } catch (error) {
      this.status = DBStatus.ERROR;
      console.error("❌ Database connection failed:", error);

      if (this.retryCount < this.maxRetries) {
        await this.retryConnection();
      } else {
        console.error(
          "💀 Max retry attempts reached. Database connection failed permanently."
        );
      }
    }
  }

  private async testConnection() {
    if (!this.db || !this.pool) {
      throw new Error("Database instance not initialized");
    }

    // Simple query to test connection
    await this.pool.query("SELECT 1 as test");
  }

  private async retryConnection() {
    this.retryCount++;
    const delay = this.retryDelay * Math.pow(2, this.retryCount - 1); // Exponential backoff

    console.log(
      `🔄 Retrying database connection (attempt ${this.retryCount}/${this.maxRetries}) in ${delay}ms...`
    );

    setTimeout(() => {
      this.initializeConnection();
    }, delay);
  }

  public getDb() {
    if (!this.db) {
      throw new Error("Database is not connected. Please check your connection.");
    }
    return this.db;
  }

  public getStatus() {
    return this.status;
  }

  public async reconnect() {
    console.log("🔄 Manually reconnecting to database...");
    this.retryCount = 0;
    await this.initializeConnection();
  }

  public async close() {
    try {
      if (this.pool) {
        await this.pool.end();
        console.log("🔌 Database connection closed");
      }
      this.status = DBStatus.DISCONNECTED;
    } catch (error) {
      console.error("Error closing database connection:", error);
    }
  }
}

// Create singleton instance
const dbConnection = new DatabaseConnection();

// Export the database instance and utilities
export const db = dbConnection.getDb();
export const getDBStatus = () => dbConnection.getStatus();
export const reconnectDB = () => dbConnection.reconnect();
export const closeDB = () => dbConnection.close();

// Graceful shutdown handling
let didShutdown = false;

// Prevent multiple listener registrations
if (!(global as any).__DB_SHUTDOWN_REGISTERED__) {
  (global as any).__DB_SHUTDOWN_REGISTERED__ = true;

  const gracefulShutdown = async (signal?: string) => {
    if (didShutdown) return; // ✅ Prevent duplicate runs
    didShutdown = true;

    try {
      if (signal) {
        console.log(`\n🛑 Received ${signal}. Closing database connection...`);
      } else {
        console.log(`\n🛑 Shutting down. Closing database connection...`);
      }
      await closeDB();
      console.log("🔌 Database connection closed");
    } catch (error) {
      console.error("Error during shutdown:", error);
    } finally {
      process.exit(0);
    }
  };

  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("exit", () => gracefulShutdown("exit"));

  process.on("uncaughtException", (err) => {
    console.error("💥 Uncaught Exception:", err);
    gracefulShutdown("uncaughtException");
  });

  process.on("unhandledRejection", (reason) => {
    console.error("💥 Unhandled Rejection:", reason);
    gracefulShutdown("unhandledRejection");
  });
}
