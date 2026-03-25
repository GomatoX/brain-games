CREATE TABLE `branding` (
	`id` text PRIMARY KEY NOT NULL,
	`org_id` text NOT NULL,
	`name` text NOT NULL,
	`accent_color` text,
	`accent_hover_color` text,
	`accent_light_color` text,
	`selection_color` text,
	`selection_ring_color` text,
	`highlight_color` text,
	`correct_color` text,
	`correct_light_color` text,
	`present_color` text,
	`absent_color` text,
	`bg_primary_color` text,
	`bg_secondary_color` text,
	`text_primary_color` text,
	`text_secondary_color` text,
	`border_color` text,
	`cell_bg_color` text,
	`cell_blocked_color` text,
	`sidebar_active_color` text,
	`sidebar_active_bg_color` text,
	`grid_border_color` text,
	`main_word_marker_color` text,
	`font_sans` text,
	`font_serif` text,
	`border_radius` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`org_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `crosswords` (
	`id` text PRIMARY KEY NOT NULL,
	`org_id` text NOT NULL,
	`user_id` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`title` text NOT NULL,
	`difficulty` text DEFAULT 'Medium',
	`words` text,
	`layout` text,
	`main_word` text,
	`scheduled_date` text,
	`branding_id` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`org_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`branding_id`) REFERENCES `branding`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `organizations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`api_token` text,
	`default_language` text DEFAULT 'lt',
	`default_branding` text,
	`logo_url` text,
	`share_image_url` text,
	`share_title` text,
	`share_description` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_api_token_unique` ON `organizations` (`api_token`);--> statement-breakpoint
CREATE TABLE `sudoku` (
	`id` text PRIMARY KEY NOT NULL,
	`org_id` text NOT NULL,
	`user_id` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`title` text NOT NULL,
	`difficulty` text DEFAULT 'Medium',
	`puzzle` text,
	`solution` text,
	`scheduled_date` text,
	`branding_id` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`org_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`branding_id`) REFERENCES `branding`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`first_name` text,
	`last_name` text,
	`role` text DEFAULT 'publisher' NOT NULL,
	`org_id` text NOT NULL,
	`org_role` text DEFAULT 'member' NOT NULL,
	`invite_token` text,
	`invite_expires_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`org_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_invite_token_unique` ON `users` (`invite_token`);--> statement-breakpoint
CREATE TABLE `wordgames` (
	`id` text PRIMARY KEY NOT NULL,
	`org_id` text NOT NULL,
	`user_id` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`title` text NOT NULL,
	`word` text NOT NULL,
	`definition` text,
	`max_attempts` integer DEFAULT 6,
	`scheduled_date` text,
	`branding_id` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`org_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`branding_id`) REFERENCES `branding`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `wordsearches` (
	`id` text PRIMARY KEY NOT NULL,
	`org_id` text NOT NULL,
	`user_id` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`title` text NOT NULL,
	`difficulty` text DEFAULT 'Medium',
	`words` text,
	`grid` text,
	`grid_size` integer,
	`scheduled_date` text,
	`branding_id` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`org_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`branding_id`) REFERENCES `branding`(`id`) ON UPDATE no action ON DELETE set null
);
