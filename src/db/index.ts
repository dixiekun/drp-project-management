import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import path from "path";

// Use embedded replica for faster local reads, syncs to Turso
const dbPath = path.join(process.cwd(), "data", "turso-replica.db");

const client = createClient({
  url: `file:${dbPath}`,
  syncUrl: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Sync on startup
client.sync().then(() => {
  console.log("✓ Database synced with Turso");
}).catch((err) => {
  console.error("✗ Failed to sync database:", err);
});

export const db = drizzle(client, { schema });
export { client }; // Export raw client for raw SQL queries
