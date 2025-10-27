CREATE TABLE `chat_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`user_id` text NOT NULL,
	`role` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
