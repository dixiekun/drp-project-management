import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import path from "path";
import fs from "fs";

// Determine the database path:
// - On Fly.io: use /data volume (persistent storage)
// - In development: use ./data directory
const isProduction = process.env.NODE_ENV === "production";
const dbPath = isProduction
  ? "/data/turso-replica.db"  // Fly.io mounted volume
  : path.join(process.cwd(), "data", "turso-replica.db");

// Ensure directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Use embedded replica for both dev and production (Fly.io)
const client = createClient({
  url: `file:${dbPath}`,
  syncUrl: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Sync on startup
client.sync().then(() => {
  console.log(`✓ Database synced with Turso (${dbPath})`);
}).catch((err) => {
  console.error("✗ Failed to sync database:", err);
});

export const db = drizzle(client, { schema });
export { client }; // Export raw client for raw SQL queries
