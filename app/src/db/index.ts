import path from "path";
import fs from "fs";

const isPostgres = !!process.env.DATABASE_URL;

/* eslint-disable @typescript-eslint/no-require-imports */
let db: any;

if (isPostgres) {
  // ─── PostgreSQL ──────────────────────────────────────
  const { Pool } = require("pg");
  const { drizzle } = require("drizzle-orm/node-postgres");
  const schema = require("./schema.pg");

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  // Auto-create tables
  pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      role TEXT NOT NULL DEFAULT 'publisher',
      api_token TEXT UNIQUE,
      default_language TEXT DEFAULT 'lt',
      default_branding TEXT,
      created_at TEXT NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS branding (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      accent_color TEXT,
      accent_hover_color TEXT,
      accent_light_color TEXT,
      selection_color TEXT,
      selection_ring_color TEXT,
      highlight_color TEXT,
      correct_color TEXT,
      present_color TEXT,
      bg_primary_color TEXT,
      bg_secondary_color TEXT,
      text_primary_color TEXT,
      text_secondary_color TEXT,
      border_color TEXT,
      cell_bg_color TEXT,
      cell_blocked_color TEXT,
      sidebar_active_color TEXT,
      sidebar_active_bg_color TEXT,
      grid_border_color TEXT,
      font_sans TEXT,
      font_serif TEXT,
      border_radius TEXT,
      created_at TEXT NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS crosswords (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'draft',
      title TEXT NOT NULL,
      difficulty TEXT DEFAULT 'Medium',
      words JSONB,
      main_word TEXT,
      scheduled_date TEXT,
      branding_id TEXT REFERENCES branding(id) ON DELETE SET NULL,
      created_at TEXT NOT NULL DEFAULT now(),
      updated_at TEXT NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS wordgames (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'draft',
      title TEXT NOT NULL,
      word TEXT NOT NULL,
      definition TEXT,
      max_attempts INTEGER DEFAULT 6,
      scheduled_date TEXT,
      branding_id TEXT REFERENCES branding(id) ON DELETE SET NULL,
      created_at TEXT NOT NULL DEFAULT now(),
      updated_at TEXT NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS sudoku (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'draft',
      title TEXT NOT NULL,
      difficulty TEXT DEFAULT 'Medium',
      puzzle JSONB,
      solution JSONB,
      scheduled_date TEXT,
      branding_id TEXT REFERENCES branding(id) ON DELETE SET NULL,
      created_at TEXT NOT NULL DEFAULT now(),
      updated_at TEXT NOT NULL DEFAULT now()
    );
  `);

  db = drizzle(pool, { schema });
} else {
  // ─── SQLite (default) ────────────────────────────────
  const Database = require("better-sqlite3");
  const { drizzle: drizzleSqlite } = require("drizzle-orm/better-sqlite3");
  const schema = require("./schema.sqlite");

  const DB_PATH =
    process.env.DATABASE_PATH || path.join(process.cwd(), "data", "brain.db");

  // Ensure directory exists
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

  const sqlite = new Database(DB_PATH);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");

  // Auto-create tables
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      role TEXT NOT NULL DEFAULT 'publisher',
      api_token TEXT UNIQUE,
      default_language TEXT DEFAULT 'lt',
      default_branding TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS branding (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      accent_color TEXT,
      accent_hover_color TEXT,
      accent_light_color TEXT,
      selection_color TEXT,
      selection_ring_color TEXT,
      highlight_color TEXT,
      correct_color TEXT,
      present_color TEXT,
      bg_primary_color TEXT,
      bg_secondary_color TEXT,
      text_primary_color TEXT,
      text_secondary_color TEXT,
      border_color TEXT,
      cell_bg_color TEXT,
      cell_blocked_color TEXT,
      sidebar_active_color TEXT,
      sidebar_active_bg_color TEXT,
      grid_border_color TEXT,
      font_sans TEXT,
      font_serif TEXT,
      border_radius TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS crosswords (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'draft',
      title TEXT NOT NULL,
      difficulty TEXT DEFAULT 'Medium',
      words TEXT,
      main_word TEXT,
      scheduled_date TEXT,
      branding_id TEXT REFERENCES branding(id) ON DELETE SET NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS wordgames (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'draft',
      title TEXT NOT NULL,
      word TEXT NOT NULL,
      definition TEXT,
      max_attempts INTEGER DEFAULT 6,
      scheduled_date TEXT,
      branding_id TEXT REFERENCES branding(id) ON DELETE SET NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sudoku (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'draft',
      title TEXT NOT NULL,
      difficulty TEXT DEFAULT 'Medium',
      puzzle TEXT,
      solution TEXT,
      scheduled_date TEXT,
      branding_id TEXT REFERENCES branding(id) ON DELETE SET NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  db = drizzleSqlite(sqlite, { schema });
}

export { db };
export type DB = typeof db;

// ─── Auto-seed default user ──────────────────────────────
// Set DEFAULT_USER_EMAIL + DEFAULT_USER_PASSWORD to auto-create
// a publisher account on first startup (useful for whitelabel).
const defaultEmail = process.env.DEFAULT_USER_EMAIL;
const defaultPassword = process.env.DEFAULT_USER_PASSWORD;

if (defaultEmail && defaultPassword) {
  (async () => {
    try {
      const { eq } = require("drizzle-orm");
      const bcrypt = require("bcryptjs");
      const schema = isPostgres
        ? require("./schema.pg")
        : require("./schema.sqlite");

      const [existing] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, defaultEmail))
        .limit(1);

      if (!existing) {
        const passwordHash = await bcrypt.hash(defaultPassword, 12);
        await db.insert(schema.users).values({
          email: defaultEmail,
          passwordHash,
          firstName: "Admin",
          lastName: "User",
          role: "admin",
        });
        console.log(`[seed] Created default user: ${defaultEmail}`);
      }
    } catch (err) {
      console.error("[seed] Failed to create default user:", err);
    }
  })();
}
