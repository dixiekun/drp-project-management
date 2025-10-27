import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { projects } from "./projects";
import { users } from "./users";

export const tasks = sqliteTable("tasks", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content", { mode: "json" }).$type<{
    blocks?: Array<{
      type: "text" | "checklist" | "file" | "link";
      value?: string;
      items?: Array<{ text: string; checked: boolean }>;
      url?: string;
      name?: string;
      size?: number;
      title?: string;
    }>;
    custom_fields?: Record<string, any>;
  }>(),
  status: text("status", {
    enum: ["todo", "in_progress", "in_review", "done", "blocked"],
  })
    .notNull()
    .default("todo"),
  priority: text("priority", { enum: ["low", "medium", "high", "urgent"] })
    .notNull()
    .default("medium"),
  category: text("category"),
  assigneeId: text("assignee_id").references(() => users.id),
  reporterId: text("reporter_id").references(() => users.id),
  tags: text("tags", { mode: "json" }).$type<string[]>(),
  timeEstimate: integer("time_estimate"),
  timeTracked: integer("time_tracked").default(0),
  position: integer("position").notNull().default(0),
  dueDate: integer("due_date", { mode: "timestamp" }),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const tasksRelations = relations(tasks, ({ one }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  assignee: one(users, {
    fields: [tasks.assigneeId],
    references: [users.id],
  }),
  reporter: one(users, {
    fields: [tasks.reporterId],
    references: [users.id],
  }),
}));

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
