import path from "path";
import fs from "fs";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import type * as SqliteSchema from "./schema.sqlite";

const isPostgres = !!process.env.DATABASE_URL;

/* eslint-disable @typescript-eslint/no-require-imports */
let db: BetterSQLite3Database<typeof SqliteSchema>;

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
    CREATE TABLE IF NOT EXISTS organizations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      api_token TEXT UNIQUE,
      logo_url TEXT,
      share_image_url TEXT,
      share_title TEXT,
      share_description TEXT,
      default_language TEXT DEFAULT 'lt',
      default_branding TEXT,
      created_at TEXT NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      role TEXT NOT NULL DEFAULT 'publisher',
      org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      org_role TEXT NOT NULL DEFAULT 'member',
      invite_token TEXT UNIQUE,
      invite_expires_at TEXT,
      created_at TEXT NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS branding (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      accent_color TEXT,
      accent_hover_color TEXT,
      accent_light_color TEXT,
      selection_color TEXT,
      selection_ring_color TEXT,
      highlight_color TEXT,
      correct_color TEXT,
      correct_light_color TEXT,
      present_color TEXT,
      absent_color TEXT,
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
      main_word_marker_color TEXT,
      font_sans TEXT,
      font_serif TEXT,
      border_radius TEXT,
      created_at TEXT NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS crosswords (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'draft',
      title TEXT NOT NULL,
      difficulty TEXT DEFAULT 'Medium',
      words JSONB,
      layout JSONB,
      main_word TEXT,
      scheduled_date TEXT,
      branding_id TEXT REFERENCES branding(id) ON DELETE SET NULL,
      created_at TEXT NOT NULL DEFAULT now(),
      updated_at TEXT NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS wordgames (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
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
      org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
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

  // TODO: PG auto-migration for orgs (similar to SQLite below)

  // Auto-migrate PG: add share columns
  pool.query(`
    ALTER TABLE organizations ADD COLUMN IF NOT EXISTS share_image_url TEXT;
    ALTER TABLE organizations ADD COLUMN IF NOT EXISTS share_title TEXT;
    ALTER TABLE organizations ADD COLUMN IF NOT EXISTS share_description TEXT;
  `).catch(() => {})

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

  // ─── Auto-create tables (for fresh databases) ─────────
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS organizations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      api_token TEXT UNIQUE,
      logo_url TEXT,
      default_language TEXT DEFAULT 'lt',
      default_branding TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      role TEXT NOT NULL DEFAULT 'publisher',
      org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      org_role TEXT NOT NULL DEFAULT 'member',
      invite_token TEXT UNIQUE,
      invite_expires_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS branding (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      accent_color TEXT,
      accent_hover_color TEXT,
      accent_light_color TEXT,
      selection_color TEXT,
      selection_ring_color TEXT,
      highlight_color TEXT,
      correct_color TEXT,
      correct_light_color TEXT,
      present_color TEXT,
      absent_color TEXT,
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
      main_word_marker_color TEXT,
      font_sans TEXT,
      font_serif TEXT,
      border_radius TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS crosswords (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'draft',
      title TEXT NOT NULL,
      difficulty TEXT DEFAULT 'Medium',
      words TEXT,
      layout TEXT,
      main_word TEXT,
      scheduled_date TEXT,
      branding_id TEXT REFERENCES branding(id) ON DELETE SET NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS wordgames (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
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
      org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
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

  // ─── Auto-migrate: add share columns to organizations ──
  const orgColsCheck = sqlite
    .pragma("table_info(organizations)")
    .map((c: { name: string }) => c.name)
  const shareColumns = ["share_image_url", "share_title", "share_description"]
  for (const col of shareColumns) {
    if (orgColsCheck.length > 0 && !orgColsCheck.includes(col)) {
      try {
        sqlite.exec(`ALTER TABLE organizations ADD COLUMN ${col} TEXT;`)
        console.log(`[migrate] ✅ Added ${col} to organizations`)
      } catch (err) {
        console.error(`[migrate] ${col} may already exist:`, err)
      }
    }
  }

  // ─── Auto-migrate: old schema → org-scoped ────────────
  // Detects if users table exists but lacks org_id column,
  // which means this is a pre-orgs database that needs migration.
  const cols = sqlite
    .pragma("table_info(users)")
    .map((c: { name: string }) => c.name);

  if (cols.includes("email") && !cols.includes("org_id")) {
    console.log(
      "[migrate] Detected pre-orgs database, running auto-migration...",
    );
    sqlite.pragma("foreign_keys = OFF");

    try {
      sqlite.exec("BEGIN TRANSACTION");

      // 1. Create organizations table (already exists from IF NOT EXISTS above)

      // 2. Create one org per existing user, copy their api_token/settings
      interface OldUser {
        id: string;
        email: string;
        first_name: string | null;
        api_token: string | null;
        default_language: string | null;
        default_branding: string | null;
      }

      const existingUsers = sqlite
        .prepare(
          "SELECT id, email, first_name, api_token, default_language, default_branding FROM users",
        )
        .all() as OldUser[];

      const insertOrg = sqlite.prepare(
        "INSERT INTO organizations (id, name, api_token, default_language, default_branding, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))",
      );

      const userOrgMap = new Map<string, string>();

      for (const user of existingUsers) {
        const orgId = crypto.randomUUID();
        const orgName = user.first_name?.trim()
          ? `${user.first_name}'s Organization`
          : `${user.email.split("@")[0]}'s Organization`;

        insertOrg.run(
          orgId,
          orgName,
          user.api_token || null,
          user.default_language || "lt",
          user.default_branding || null,
        );

        userOrgMap.set(user.id, orgId);
        console.log(`[migrate]   → Org "${orgName}" for ${user.email}`);
      }

      // 3. Add org_id + org_role to users
      sqlite.exec("ALTER TABLE users ADD COLUMN org_id TEXT;");
      sqlite.exec(
        "ALTER TABLE users ADD COLUMN org_role TEXT NOT NULL DEFAULT 'owner';",
      );

      const updateUser = sqlite.prepare(
        "UPDATE users SET org_id = ? WHERE id = ?",
      );
      for (const [userId, orgId] of userOrgMap) {
        updateUser.run(orgId, userId);
      }

      // 4. Add org_id to branding (if it has user_id)
      const brandingCols = sqlite
        .pragma("table_info(branding)")
        .map((c: { name: string }) => c.name);
      if (
        brandingCols.includes("user_id") &&
        !brandingCols.includes("org_id")
      ) {
        sqlite.exec("ALTER TABLE branding ADD COLUMN org_id TEXT;");
        sqlite.exec(
          "UPDATE branding SET org_id = (SELECT org_id FROM users WHERE users.id = branding.user_id) WHERE org_id IS NULL;",
        );
      }

      // 5. Add org_id to game tables
      for (const table of ["crosswords", "wordgames", "sudoku"]) {
        const gameCols = sqlite
          .pragma(`table_info(${table})`)
          .map((c: { name: string }) => c.name);
        if (gameCols.length > 0 && !gameCols.includes("org_id")) {
          sqlite.exec(`ALTER TABLE ${table} ADD COLUMN org_id TEXT;`);
          sqlite.exec(
            `UPDATE ${table} SET org_id = (SELECT org_id FROM users WHERE users.id = ${table}.user_id) WHERE org_id IS NULL;`,
          );
          console.log(`[migrate]   → Added org_id to ${table}`);
        }
      }

      sqlite.exec("COMMIT");
      console.log(
        `[migrate] ✅ Migration complete — ${userOrgMap.size} org(s) created`,
      );
    } catch (err) {
      sqlite.exec("ROLLBACK");
      console.error("[migrate] ❌ Migration failed, rolled back:", err);
    }

    sqlite.pragma("foreign_keys = ON");
  }

  // ─── Auto-migrate: add invite columns ─────────────────
  if (cols.includes("org_id") && !cols.includes("invite_token")) {
    console.log("[migrate] Adding invite_token + invite_expires_at columns...");
    try {
      // SQLite cannot ALTER TABLE ADD COLUMN with UNIQUE constraint,
      // so we add the column first, then create a unique index.
      sqlite.exec("ALTER TABLE users ADD COLUMN invite_token TEXT;");
      sqlite.exec("ALTER TABLE users ADD COLUMN invite_expires_at TEXT;");
      sqlite.exec(
        "CREATE UNIQUE INDEX IF NOT EXISTS idx_users_invite_token ON users(invite_token) WHERE invite_token IS NOT NULL;",
      );
      console.log("[migrate] ✅ invite columns added");
    } catch (err) {
      console.error("[migrate] invite columns may already exist:", err);
    }
  }

  // ─── Auto-migrate: add logo_url to organizations ──────
  const orgCols = sqlite
    .pragma("table_info(organizations)")
    .map((c: { name: string }) => c.name);
  if (!orgCols.includes("logo_url")) {
    console.log("[migrate] Adding logo_url column to organizations...");
    try {
      sqlite.exec("ALTER TABLE organizations ADD COLUMN logo_url TEXT;");
      console.log("[migrate] ✅ logo_url column added");
    } catch (err) {
      console.error("[migrate] logo_url may already exist:", err);
    }
  }

  // ─── Auto-migrate: add new branding columns ───────────
  const brandCols = sqlite
    .pragma("table_info(branding)")
    .map((c: { name: string }) => c.name);
  const newBrandingCols = [
    "correct_light_color",
    "absent_color",
    "main_word_marker_color",
  ];
  for (const col of newBrandingCols) {
    if (brandCols.length > 0 && !brandCols.includes(col)) {
      try {
        sqlite.exec(`ALTER TABLE branding ADD COLUMN ${col} TEXT;`);
        console.log(`[migrate] ✅ Added ${col} to branding`);
      } catch (err) {
        console.error(`[migrate] ${col} may already exist:`, err);
      }
    }
  }

  // ─── Auto-migrate: add layout column to crosswords ────
  const cwCols = sqlite
    .pragma("table_info(crosswords)")
    .map((c: { name: string }) => c.name);
  if (cwCols.length > 0 && !cwCols.includes("layout")) {
    try {
      sqlite.exec("ALTER TABLE crosswords ADD COLUMN layout TEXT;");
      console.log("[migrate] ✅ Added layout column to crosswords");
    } catch (err) {
      console.error("[migrate] layout column may already exist:", err);
    }
  }

  db = drizzleSqlite(sqlite, { schema });
}

export { db };
export type DB = typeof db;

// ─── Auto-seed default user + organization ───────────────
// Set DEFAULT_USER_EMAIL + DEFAULT_USER_PASSWORD to auto-create
// an owner account with its own organization on first startup.
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
        // Create default organization first
        const orgId = crypto.randomUUID();
        await db.insert(schema.organizations).values({
          id: orgId,
          name: process.env.PLATFORM_NAME || "My Organization",
        });

        // Create the default user linked to the org
        const passwordHash = await bcrypt.hash(defaultPassword, 12);
        await db.insert(schema.users).values({
          email: defaultEmail,
          passwordHash,
          firstName: "Admin",
          lastName: "User",
          role: "admin",
          orgId,
          orgRole: "owner",
        });
        console.log(`[seed] Created default org + user: ${defaultEmail}`);
      } else {
        // Sync password if it changed
        const passwordMatch = await bcrypt.compare(
          defaultPassword,
          existing.passwordHash,
        );
        if (!passwordMatch) {
          const newHash = await bcrypt.hash(defaultPassword, 12);
          await db
            .update(schema.users)
            .set({ passwordHash: newHash })
            .where(eq(schema.users.id, existing.id));
          console.log(
            `[seed] Updated password for default user: ${defaultEmail}`,
          );
        }
      }
    } catch (err) {
      console.error("[seed] Failed to sync default user:", err);
    }
  })();
}
