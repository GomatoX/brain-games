CREATE TABLE "branding" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"name" text NOT NULL,
	"accent_color" text,
	"accent_hover_color" text,
	"accent_light_color" text,
	"selection_color" text,
	"selection_ring_color" text,
	"highlight_color" text,
	"correct_color" text,
	"correct_light_color" text,
	"present_color" text,
	"absent_color" text,
	"bg_primary_color" text,
	"bg_secondary_color" text,
	"text_primary_color" text,
	"text_secondary_color" text,
	"border_color" text,
	"cell_bg_color" text,
	"cell_blocked_color" text,
	"sidebar_active_color" text,
	"sidebar_active_bg_color" text,
	"grid_border_color" text,
	"main_word_marker_color" text,
	"font_sans" text,
	"font_serif" text,
	"border_radius" text,
	"created_at" text DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "crosswords" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"user_id" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"title" text NOT NULL,
	"difficulty" text DEFAULT 'Medium',
	"words" jsonb,
	"layout" jsonb,
	"main_word" text,
	"scheduled_date" text,
	"branding_id" text,
	"created_at" text DEFAULT now() NOT NULL,
	"updated_at" text DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"api_token" text,
	"default_language" text DEFAULT 'lt',
	"default_branding" text,
	"logo_url" text,
	"share_image_url" text,
	"share_title" text,
	"share_description" text,
	"created_at" text DEFAULT now() NOT NULL,
	CONSTRAINT "organizations_api_token_unique" UNIQUE("api_token")
);
--> statement-breakpoint
CREATE TABLE "sudoku" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"user_id" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"title" text NOT NULL,
	"difficulty" text DEFAULT 'Medium',
	"puzzle" jsonb,
	"solution" jsonb,
	"scheduled_date" text,
	"branding_id" text,
	"created_at" text DEFAULT now() NOT NULL,
	"updated_at" text DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"role" text DEFAULT 'publisher' NOT NULL,
	"org_id" text NOT NULL,
	"org_role" text DEFAULT 'member' NOT NULL,
	"invite_token" text,
	"invite_expires_at" text,
	"created_at" text DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_invite_token_unique" UNIQUE("invite_token")
);
--> statement-breakpoint
CREATE TABLE "wordgames" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"user_id" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"title" text NOT NULL,
	"word" text NOT NULL,
	"definition" text,
	"max_attempts" integer DEFAULT 6,
	"scheduled_date" text,
	"branding_id" text,
	"created_at" text DEFAULT now() NOT NULL,
	"updated_at" text DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wordsearches" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"user_id" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"title" text NOT NULL,
	"difficulty" text DEFAULT 'Medium',
	"words" jsonb,
	"grid" jsonb,
	"grid_size" integer,
	"scheduled_date" text,
	"branding_id" text,
	"created_at" text DEFAULT now() NOT NULL,
	"updated_at" text DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "branding" ADD CONSTRAINT "branding_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crosswords" ADD CONSTRAINT "crosswords_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crosswords" ADD CONSTRAINT "crosswords_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crosswords" ADD CONSTRAINT "crosswords_branding_id_branding_id_fk" FOREIGN KEY ("branding_id") REFERENCES "public"."branding"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sudoku" ADD CONSTRAINT "sudoku_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sudoku" ADD CONSTRAINT "sudoku_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sudoku" ADD CONSTRAINT "sudoku_branding_id_branding_id_fk" FOREIGN KEY ("branding_id") REFERENCES "public"."branding"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wordgames" ADD CONSTRAINT "wordgames_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wordgames" ADD CONSTRAINT "wordgames_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wordgames" ADD CONSTRAINT "wordgames_branding_id_branding_id_fk" FOREIGN KEY ("branding_id") REFERENCES "public"."branding"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wordsearches" ADD CONSTRAINT "wordsearches_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wordsearches" ADD CONSTRAINT "wordsearches_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wordsearches" ADD CONSTRAINT "wordsearches_branding_id_branding_id_fk" FOREIGN KEY ("branding_id") REFERENCES "public"."branding"("id") ON DELETE set null ON UPDATE no action;