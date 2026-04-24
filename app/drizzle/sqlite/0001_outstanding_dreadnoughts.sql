CREATE TABLE `branding_drafts` (
	`id` text PRIMARY KEY NOT NULL,
	`branding_id` text NOT NULL,
	`tokens` text,
	`typography` text,
	`spacing` text,
	`components` text,
	`logo_path` text,
	`logo_dark_path` text,
	`favicon_path` text,
	`background_path` text,
	`og_image_path` text,
	`custom_css_games` text,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`branding_id`) REFERENCES `branding`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `branding_drafts_branding_id_unique` ON `branding_drafts` (`branding_id`);--> statement-breakpoint
CREATE TABLE `uploaded_files` (
	`id` text PRIMARY KEY NOT NULL,
	`org_id` text NOT NULL,
	`path` text NOT NULL,
	`mime` text NOT NULL,
	`size` integer NOT NULL,
	`sha256` text NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`org_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `branding` ADD `tokens` text;--> statement-breakpoint
ALTER TABLE `branding` ADD `typography` text;--> statement-breakpoint
ALTER TABLE `branding` ADD `spacing` text;--> statement-breakpoint
ALTER TABLE `branding` ADD `components` text;--> statement-breakpoint
ALTER TABLE `branding` ADD `logo_path` text;--> statement-breakpoint
ALTER TABLE `branding` ADD `logo_dark_path` text;--> statement-breakpoint
ALTER TABLE `branding` ADD `favicon_path` text;--> statement-breakpoint
ALTER TABLE `branding` ADD `background_path` text;--> statement-breakpoint
ALTER TABLE `branding` ADD `og_image_path` text;--> statement-breakpoint
ALTER TABLE `branding` ADD `custom_css_games` text;--> statement-breakpoint
ALTER TABLE `branding` ADD `updated_at` text DEFAULT (datetime('now')) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `use_platform_chrome` integer DEFAULT false NOT NULL;