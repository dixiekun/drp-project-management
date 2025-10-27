# Database Schema

## Overview

The database is designed with flexibility in mind, using JSON fields for custom content and metadata. This approach mimics modern headless CMS systems, allowing for adaptable workflows without schema migrations.

## Core Tables

### 1. Users

Stores user accounts and team members.

```typescript
users {
  id: string (uuid, primary key)
  email: string (unique, not null)
  name: string
  avatar_url: string
  role: enum ('owner', 'admin', 'member', 'viewer')
  permissions: json // Custom permission overrides
  preferences: json // UI settings, notifications, etc.
  created_at: timestamp
  updated_at: timestamp
}
```

**JSON Structure Examples:**

```json
// permissions
{
  "can_delete_projects": true,
  "can_manage_billing": false,
  "can_invite_users": true
}

// preferences
{
  "theme": "light",
  "default_view": "board",
  "email_notifications": true,
  "task_reminders": true
}
```

---

### 2. Clients

Stores client information with flexible metadata.

```typescript
clients {
  id: string (uuid, primary key)
  name: string (not null)
  email: string
  phone: string
  company: string
  website: string
  avatar_url: string
  status: enum ('active', 'inactive', 'on_hold', 'archived')
  metadata: json // Custom fields
  settings: json // Client-specific settings
  created_by: string (foreign key -> users.id)
  created_at: timestamp
  updated_at: timestamp
}
```

**JSON Structure Examples:**

```json
// metadata
{
  "industry": "E-commerce",
  "company_size": "10-50",
  "preferred_contact": "email",
  "timezone": "America/New_York",
  "custom_fields": {
    "contract_value": 15000,
    "referral_source": "LinkedIn"
  }
}

// settings
{
  "portal_access": true,
  "allow_task_comments": false,
  "notification_frequency": "weekly"
}
```

---

### 3. Projects

Projects belong to clients and contain tasks.

```typescript
projects {
  id: string (uuid, primary key)
  client_id: string (foreign key -> clients.id)
  name: string (not null)
  description: text
  status: enum ('planning', 'active', 'on_hold', 'completed', 'cancelled')
  priority: enum ('low', 'medium', 'high', 'urgent')
  config: json // Project settings
  metadata: json // Custom fields
  start_date: date
  end_date: date
  created_by: string (foreign key -> users.id)
  created_at: timestamp
  updated_at: timestamp
}
```

**JSON Structure Examples:**

```json
// config
{
  "budget": {
    "amount": 10000,
    "currency": "USD",
    "type": "fixed"
  },
  "deliverables": [
    { "name": "Wireframes", "status": "completed" },
    { "name": "Design mockups", "status": "in_progress" },
    { "name": "Final website", "status": "pending" }
  ],
  "milestones": [
    { "name": "Discovery complete", "date": "2025-11-01", "completed": true },
    { "name": "Design approved", "date": "2025-11-15", "completed": false }
  ]
}

// metadata
{
  "project_type": "website_redesign",
  "tech_stack": ["Next.js", "TailwindCSS"],
  "estimated_hours": 120,
  "custom_fields": {
    "seo_required": true,
    "hosting_provider": "Vercel"
  }
}
```

---

### 4. Tasks

Individual work items within projects.

```typescript
tasks {
  id: string (uuid, primary key)
  project_id: string (foreign key -> projects.id)
  title: string (not null)
  description: text
  content: json // Rich content with blocks
  status: enum ('todo', 'in_progress', 'in_review', 'done', 'blocked')
  priority: enum ('low', 'medium', 'high', 'urgent')
  category: string // 'design', 'frontend', 'content', 'seo', 'media'
  assignee_id: string (foreign key -> users.id)
  reporter_id: string (foreign key -> users.id)
  tags: json // Array of tags
  time_estimate: integer // Minutes
  time_tracked: integer // Minutes
  position: integer // For ordering in Kanban
  due_date: timestamp
  completed_at: timestamp
  created_at: timestamp
  updated_at: timestamp
}
```

**JSON Structure Examples:**

```json
// content (rich, structured content)
{
  "blocks": [
    {
      "type": "text",
      "value": "Design a modern, responsive homepage with hero section"
    },
    {
      "type": "checklist",
      "items": [
        { "text": "Mobile version", "checked": true },
        { "text": "Tablet version", "checked": false },
        { "text": "Desktop version", "checked": false }
      ]
    },
    {
      "type": "file",
      "url": "https://...",
      "name": "design_mockup_v2.fig",
      "size": 2048000
    },
    {
      "type": "link",
      "url": "https://dribbble.com/...",
      "title": "Design inspiration"
    }
  ],
  "custom_fields": {
    "design_tool": "Figma",
    "requires_client_approval": true,
    "revision_count": 2
  }
}

// tags
["ui/ux", "high-priority", "client-review"]
```

---

### 5. Task Comments

Comments and activity on tasks.

```typescript
task_comments {
  id: string (uuid, primary key)
  task_id: string (foreign key -> tasks.id)
  user_id: string (foreign key -> users.id)
  content: json // Rich text with mentions
  type: enum ('comment', 'status_change', 'assignment', 'system')
  created_at: timestamp
  updated_at: timestamp
}
```

**JSON Structure Examples:**

```json
// content
{
  "text": "Updated the design based on client feedback @john",
  "mentions": ["user_id_123"],
  "attachments": [
    {
      "type": "image",
      "url": "https://...",
      "name": "updated_design.png"
    }
  ]
}
```

---

### 6. Time Entries

Track time spent on tasks.

```typescript
time_entries {
  id: string (uuid, primary key)
  task_id: string (foreign key -> tasks.id)
  user_id: string (foreign key -> users.id)
  duration: integer // Minutes
  description: text
  metadata: json // Billable status, rate, etc.
  start_time: timestamp
  end_time: timestamp
  created_at: timestamp
}
```

**JSON Structure Examples:**

```json
// metadata
{
  "billable": true,
  "hourly_rate": 100,
  "category": "design"
}
```

---

### 7. Custom Fields

Define reusable custom field configurations.

```typescript
custom_fields {
  id: string (uuid, primary key)
  entity_type: enum ('client', 'project', 'task')
  name: string (not null)
  type: enum ('text', 'number', 'date', 'select', 'multiselect', 'boolean', 'url')
  field_config: json // Validation, options, etc.
  created_by: string (foreign key -> users.id)
  created_at: timestamp
}
```

**JSON Structure Examples:**

```json
// field_config for select type
{
  "options": ["WordPress", "Next.js", "Shopify", "Custom"],
  "required": true,
  "default": "Next.js"
}

// field_config for number type
{
  "min": 0,
  "max": 100000,
  "currency": "USD",
  "required": false
}
```

---

### 8. Templates

Reusable project and task templates.

```typescript
templates {
  id: string (uuid, primary key)
  name: string (not null)
  type: enum ('project', 'task')
  description: text
  structure: json // Template configuration
  created_by: string (foreign key -> users.id)
  created_at: timestamp
  updated_at: timestamp
}
```

**JSON Structure Examples:**

```json
// structure for project template
{
  "default_config": {
    "budget": { "amount": 5000, "type": "fixed" }
  },
  "default_tasks": [
    {
      "title": "Initial consultation",
      "category": "planning",
      "time_estimate": 120
    },
    {
      "title": "Wireframe design",
      "category": "design",
      "time_estimate": 480
    }
  ]
}
```

---

## Relationships

```
users (1) ─┬─→ (many) clients (created_by)
           ├─→ (many) projects (created_by)
           ├─→ (many) tasks (assignee_id)
           ├─→ (many) task_comments
           └─→ (many) time_entries

clients (1) ──→ (many) projects

projects (1) ──→ (many) tasks

tasks (1) ─┬─→ (many) task_comments
           └─→ (many) time_entries
```

## Indexes

Key indexes for performance:

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);

-- Clients
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_created_by ON clients(created_by);

-- Projects
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_by ON projects(created_by);

-- Tasks
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX idx_tasks_category ON tasks(category);
CREATE INDEX idx_tasks_position ON tasks(position);

-- Task Comments
CREATE INDEX idx_comments_task_id ON task_comments(task_id);

-- Time Entries
CREATE INDEX idx_time_entries_task_id ON time_entries(task_id);
CREATE INDEX idx_time_entries_user_id ON time_entries(user_id);
```

## Drizzle Schema Example

```typescript
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const tasks = sqliteTable('tasks', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => projects.id),
  title: text('title').notNull(),
  description: text('description'),
  content: text('content', { mode: 'json' }), // JSON column
  status: text('status').notNull(),
  priority: text('priority'),
  category: text('category'),
  assigneeId: text('assignee_id').references(() => users.id),
  tags: text('tags', { mode: 'json' }),
  timeEstimate: integer('time_estimate'),
  timeTracked: integer('time_tracked'),
  position: integer('position'),
  dueDate: integer('due_date', { mode: 'timestamp' }),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});
```
