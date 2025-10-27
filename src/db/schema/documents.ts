import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { projects } from "./projects";
import { users } from "./users";

export const documents = sqliteTable("documents", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type").notNull(), // file extension or mime type
  size: integer("size").notNull(), // file size in bytes
  url: text("url").notNull(), // storage URL or path
  content: text("content"), // extracted text content for AI context
  uploadedBy: text("uploaded_by")
    .notNull()
    .references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const documentsRelations = relations(documents, ({ one }) => ({
  project: one(projects, {
    fields: [documents.projectId],
    references: [projects.id],
  }),
  uploadedByUser: one(users, {
    fields: [documents.uploadedBy],
    references: [users.id],
  }),
}));

export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;
