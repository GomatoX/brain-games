import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

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
  apiToken: text("api_token").unique(),
  // Settings
  defaultLanguage: text("default_language").default("lt"),
  defaultBranding: text("default_branding"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

// ─── Branding (user-scoped) ─────────────────────────────
export const branding = sqliteTable("branding", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  // Colors
  accentColor: text("accent_color"),
  accentHoverColor: text("accent_hover_color"),
  accentLightColor: text("accent_light_color"),
  selectionColor: text("selection_color"),
  selectionRingColor: text("selection_ring_color"),
  highlightColor: text("highlight_color"),
  correctColor: text("correct_color"),
  presentColor: text("present_color"),
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
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("draft"),
  title: text("title").notNull(),
  difficulty: text("difficulty").default("Medium"),
  words: text("words", { mode: "json" }).$type<
    { word: string; clue: string; main_word_index?: number }[]
  >(),
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
