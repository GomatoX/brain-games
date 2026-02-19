import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";
import fs from "fs";

const DB_PATH =
  process.env.DATABASE_PATH || path.join(process.cwd(), "data", "brain.db");

// Ensure directory exists
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const sqlite = new Database(DB_PATH);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

// Auto-create tables if they don't exist
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

export const db = drizzle(sqlite, { schema });
export type DB = typeof db;
