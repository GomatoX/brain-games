CREATE TABLE `play_events` (
	`id` text PRIMARY KEY NOT NULL,
	`game_type` text NOT NULL,
	`game_id` text NOT NULL,
	`session_hash` text NOT NULL,
	`played_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
ALTER TABLE `crosswords` ADD `plays` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `sudoku` ADD `plays` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `wordgames` ADD `plays` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `wordsearches` ADD `plays` integer DEFAULT 0 NOT NULL;