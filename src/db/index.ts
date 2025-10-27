import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

// Use local SQLite for development, Turso for production
const isDevelopment = process.env.NODE_ENV === "development";

const client = createClient({
  url: isDevelopment
    ? "file:data/local.db"
    : process.env.TURSO_DATABASE_URL!,
  authToken: isDevelopment ? undefined : process.env.TURSO_AUTH_TOKEN!,
});

export const db = drizzle(client, { schema });
