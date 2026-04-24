CREATE TABLE "branding_drafts" (
	"id" text PRIMARY KEY NOT NULL,
	"branding_id" text NOT NULL,
	"tokens" jsonb,
	"typography" jsonb,
	"spacing" jsonb,
	"components" jsonb,
	"logo_path" text,
	"logo_dark_path" text,
	"favicon_path" text,
	"background_path" text,
	"og_image_path" text,
	"custom_css_games" text,
	"updated_at" text DEFAULT now() NOT NULL,
	CONSTRAINT "branding_drafts_branding_id_unique" UNIQUE("branding_id")
);
--> statement-breakpoint
CREATE TABLE "uploaded_files" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"path" text NOT NULL,
	"mime" text NOT NULL,
	"size" integer NOT NULL,
	"sha256" text NOT NULL,
	"created_by" text NOT NULL,
	"created_at" text DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "branding" ADD COLUMN "tokens" jsonb;--> statement-breakpoint
ALTER TABLE "branding" ADD COLUMN "typography" jsonb;--> statement-breakpoint
ALTER TABLE "branding" ADD COLUMN "spacing" jsonb;--> statement-breakpoint
ALTER TABLE "branding" ADD COLUMN "components" jsonb;--> statement-breakpoint
ALTER TABLE "branding" ADD COLUMN "logo_path" text;--> statement-breakpoint
ALTER TABLE "branding" ADD COLUMN "logo_dark_path" text;--> statement-breakpoint
ALTER TABLE "branding" ADD COLUMN "favicon_path" text;--> statement-breakpoint
ALTER TABLE "branding" ADD COLUMN "background_path" text;--> statement-breakpoint
ALTER TABLE "branding" ADD COLUMN "og_image_path" text;--> statement-breakpoint
ALTER TABLE "branding" ADD COLUMN "custom_css_games" text;--> statement-breakpoint
ALTER TABLE "branding" ADD COLUMN "updated_at" text DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "use_platform_chrome" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "branding_drafts" ADD CONSTRAINT "branding_drafts_branding_id_branding_id_fk" FOREIGN KEY ("branding_id") REFERENCES "public"."branding"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uploaded_files" ADD CONSTRAINT "uploaded_files_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uploaded_files" ADD CONSTRAINT "uploaded_files_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;