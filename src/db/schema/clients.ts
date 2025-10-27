import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const clients = sqliteTable("clients", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  company: text("company"),
  website: text("website"),
  avatarUrl: text("avatar_url"),
  status: text("status", {
    enum: ["active", "inactive", "on_hold", "archived"],
  })
    .notNull()
    .default("active"),
  metadata: text("metadata", { mode: "json" }).$type<{
    industry?: string;
    company_size?: string;
    preferred_contact?: string;
    timezone?: string;
    custom_fields?: Record<string, any>;
  }>(),
  settings: text("settings", { mode: "json" }).$type<{
    portal_access?: boolean;
    allow_task_comments?: boolean;
    notification_frequency?: "daily" | "weekly" | "monthly";
  }>(),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;
