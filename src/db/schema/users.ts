import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  role: text("role", { enum: ["owner", "admin", "member", "viewer"] })
    .notNull()
    .default("member"),
  permissions: text("permissions", { mode: "json" }).$type<{
    can_delete_projects?: boolean;
    can_manage_billing?: boolean;
    can_invite_users?: boolean;
  }>(),
  preferences: text("preferences", { mode: "json" }).$type<{
    theme?: "light" | "dark";
    default_view?: "board" | "list" | "timeline";
    email_notifications?: boolean;
    task_reminders?: boolean;
  }>(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
