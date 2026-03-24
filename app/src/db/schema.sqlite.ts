import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// ─── Organizations ──────────────────────────────────────
export const organizations = sqliteTable("organizations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  apiToken: text("api_token").unique(),
  defaultLanguage: text("default_language").default("lt"),
  defaultBranding: text("default_branding"),
  logoUrl: text("logo_url"),
  shareImageUrl: text("share_image_url"),
  shareTitle: text("share_title"),
  shareDescription: text("share_description"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

// ─── Users ──────────────────────────────────────────────
export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  role: text("role").notNull().default("publisher"),
  orgId: text("org_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  orgRole: text("org_role").notNull().default("member"),
  inviteToken: text("invite_token").unique(),
  inviteExpiresAt: text("invite_expires_at"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

// ─── Branding (org-scoped) ──────────────────────────────
export const branding = sqliteTable("branding", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  orgId: text("org_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  // Colors
  accentColor: text("accent_color"),
  accentHoverColor: text("accent_hover_color"),
  accentLightColor: text("accent_light_color"),
  selectionColor: text("selection_color"),
  selectionRingColor: text("selection_ring_color"),
  highlightColor: text("highlight_color"),
  correctColor: text("correct_color"),
  correctLightColor: text("correct_light_color"),
  presentColor: text("present_color"),
  absentColor: text("absent_color"),
  bgPrimaryColor: text("bg_primary_color"),
  bgSecondaryColor: text("bg_secondary_color"),
  textPrimaryColor: text("text_primary_color"),
  textSecondaryColor: text("text_secondary_color"),
  borderColor: text("border_color"),
  cellBgColor: text("cell_bg_color"),
  cellBlockedColor: text("cell_blocked_color"),
  sidebarActiveColor: text("sidebar_active_color"),
  sidebarActiveBgColor: text("sidebar_active_bg_color"),
  gridBorderColor: text("grid_border_color"),
  mainWordMarkerColor: text("main_word_marker_color"),
  // Typography
  fontSans: text("font_sans"),
  fontSerif: text("font_serif"),
  borderRadius: text("border_radius"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

// ─── Crosswords ─────────────────────────────────────────
export const crosswords = sqliteTable("crosswords", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  orgId: text("org_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("draft"),
  title: text("title").notNull(),
  difficulty: text("difficulty").default("Medium"),
  words: text("words", { mode: "json" }).$type<
    { word: string; clue: string; main_word_index?: number }[]
  >(),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  layout: text("layout", { mode: "json" }).$type<Record<string, any>>(),
  mainWord: text("main_word"),
  scheduledDate: text("scheduled_date"),
  brandingId: text("branding_id").references(() => branding.id, {
    onDelete: "set null",
  }),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

// ─── Word Games ─────────────────────────────────────────
export const wordgames = sqliteTable("wordgames", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  orgId: text("org_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("draft"),
  title: text("title").notNull(),
  word: text("word").notNull(),
  definition: text("definition"),
  maxAttempts: integer("max_attempts").default(6),
  scheduledDate: text("scheduled_date"),
  brandingId: text("branding_id").references(() => branding.id, {
    onDelete: "set null",
  }),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

// ─── Sudoku ─────────────────────────────────────────────
export const sudoku = sqliteTable("sudoku", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  orgId: text("org_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("draft"),
  title: text("title").notNull(),
  difficulty: text("difficulty").default("Medium"),
  puzzle: text("puzzle", { mode: "json" }).$type<number[][]>(),
  solution: text("solution", { mode: "json" }).$type<number[][]>(),
  scheduledDate: text("scheduled_date"),
  brandingId: text("branding_id").references(() => branding.id, {
    onDelete: "set null",
  }),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

// ─── Word Searches ──────────────────────────────────────
export const wordsearches = sqliteTable("wordsearches", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  orgId: text("org_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("draft"),
  title: text("title").notNull(),
  difficulty: text("difficulty").default("Medium"),
  words: text("words", { mode: "json" }).$type<
    { word: string; hint?: string }[]
  >(),
  grid: text("grid", { mode: "json" }).$type<string[][]>(),
  gridSize: integer("grid_size"),
  scheduledDate: text("scheduled_date"),
  brandingId: text("branding_id").references(() => branding.id, {
    onDelete: "set null",
  }),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});
