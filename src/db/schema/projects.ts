import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { clients } from "./clients";
import { users } from "./users";

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  clientId: text("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status", {
    enum: ["planning", "active", "on_hold", "completed", "cancelled"],
  })
    .notNull()
    .default("planning"),
  priority: text("priority", { enum: ["low", "medium", "high", "urgent"] })
    .notNull()
    .default("medium"),
  config: text("config", { mode: "json" }).$type<{
    budget?: {
      amount: number;
      currency: string;
      type: "fixed" | "hourly";
    };
    deliverables?: Array<{
      name: string;
      status: "pending" | "in_progress" | "completed";
    }>;
    milestones?: Array<{
      name: string;
      date: string;
      completed: boolean;
    }>;
  }>(),
  metadata: text("metadata", { mode: "json" }).$type<{
    project_type?: string;
    tech_stack?: string[];
    estimated_hours?: number;
    custom_fields?: Record<string, any>;
  }>(),
  startDate: integer("start_date", { mode: "timestamp" }),
  endDate: integer("end_date", { mode: "timestamp" }),
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

export const projectsRelations = relations(projects, ({ one }) => ({
  client: one(clients, {
    fields: [projects.clientId],
    references: [clients.id],
  }),
  createdByUser: one(users, {
    fields: [projects.createdBy],
    references: [users.id],
  }),
}));

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
