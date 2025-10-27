CREATE TABLE `clients` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`phone` text,
	`company` text,
	`website` text,
	`avatar_url` text,
	`status` text DEFAULT 'active' NOT NULL,
	`metadata` text,
	`settings` text,
	`created_by` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`size` integer NOT NULL,
	`url` text NOT NULL,
	`content` text,
	`uploaded_by` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`avatar_url` text,
	`role` text DEFAULT 'member' NOT NULL,
	`permissions` text,
	`preferences` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`client_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'planning' NOT NULL,
	`priority` text DEFAULT 'medium' NOT NULL,
	`config` text,
	`metadata` text,
	`start_date` integer,
	`end_date` integer,
	`created_by` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`content` text,
	`status` text DEFAULT 'todo' NOT NULL,
	`priority` text DEFAULT 'medium' NOT NULL,
	`category` text,
	`assignee_id` text,
	`reporter_id` text,
	`tags` text,
	`time_estimate` integer,
	`time_tracked` integer DEFAULT 0,
	`position` integer DEFAULT 0 NOT NULL,
	`due_date` integer,
	`completed_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`assignee_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`reporter_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);