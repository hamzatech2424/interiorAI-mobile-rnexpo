import postgres from 'postgres';
export declare enum DBStatus {
    CONNECTING = "connecting",
    CONNECTED = "connected",
    DISCONNECTED = "disconnected",
    ERROR = "error"
}
export declare const db: import("drizzle-orm/postgres-js").PostgresJsDatabase<Record<string, unknown>> & {
    $client: postgres.Sql<{}>;
};
export declare const getDBStatus: () => DBStatus;
export declare const reconnectDB: () => Promise<void>;
export declare const closeDB: () => Promise<void>;
