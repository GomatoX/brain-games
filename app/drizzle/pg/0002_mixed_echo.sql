CREATE TABLE "play_events" (
	"id" text PRIMARY KEY NOT NULL,
	"game_type" text NOT NULL,
	"game_id" text NOT NULL,
	"session_hash" text NOT NULL,
	"played_at" text DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "crosswords" ADD COLUMN "plays" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "timezone" text DEFAULT 'Europe/Vilnius';--> statement-breakpoint
ALTER TABLE "sudoku" ADD COLUMN "plays" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "wordgames" ADD COLUMN "plays" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "wordsearches" ADD COLUMN "plays" integer DEFAULT 0 NOT NULL;