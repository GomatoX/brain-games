import path from "path"
import fs from "fs"
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3"
import type * as SqliteSchema from "./schema.sqlite"
import { backfillRow, type OldBrandingRow } from "@/lib/branding/backfill"

const isPostgres = !!process.env.DATABASE_URL

/* eslint-disable @typescript-eslint/no-require-imports */
let db: BetterSQLite3Database<typeof SqliteSchema>

if (isPostgres) {
  // ─── PostgreSQL ──────────────────────────────────────
  const { Pool } = require("pg")
  const { drizzle } = require("drizzle-orm/node-postgres")
  const { migrate } = require("drizzle-orm/node-postgres/migrator")
  const schema = require("./schema.pg")

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })

  const pgDb = drizzle(pool, { schema })

  // ─── Run Drizzle migrations (auto-create/update all tables) ──
  migrate(pgDb, {
    migrationsFolder: path.join(process.cwd(), "drizzle", "pg"),
  })
    .then(() => console.log("[migrate] ✅ PG migrations applied"))
    .then(async () => {
      // ─── Branding backfill: flat columns → JSON tokens ───────
      // Idempotent: skips rows where `tokens` is already populated.
      try {
        const tokensColCheck = await pool.query(
          "SELECT column_name FROM information_schema.columns WHERE table_name='branding' AND column_name='tokens'",
        )
        if (tokensColCheck.rowCount === 0) return

        const accentColCheck = await pool.query(
          "SELECT column_name FROM information_schema.columns WHERE table_name='branding' AND column_name='accent_color'",
        )
        if (accentColCheck.rowCount === 0) return

        const { rows } = await pool.query(
          "SELECT id, accent_color, accent_hover_color, accent_light_color, selection_color, selection_ring_color, highlight_color, correct_color, correct_light_color, present_color, absent_color, bg_primary_color, bg_secondary_color, text_primary_color, text_secondary_color, border_color, cell_bg_color, cell_blocked_color, sidebar_active_color, sidebar_active_bg_color, grid_border_color, main_word_marker_color, font_sans, font_serif, border_radius FROM branding WHERE tokens IS NULL",
        )

        if (rows.length === 0) return

        console.log(`[migrate] backfilling ${rows.length} branding rows`)

        const PLATFORM_DEFAULTS = {
          primary: process.env.PLATFORM_ACCENT || "#c25e40",
          surface: "#ffffff",
          text: "#0f172a",
        }

        const client = await pool.connect()
        try {
          await client.query("BEGIN")
          for (const row of rows) {
            const { tokens, typography, spacing, components } = backfillRow(
              row as OldBrandingRow,
              PLATFORM_DEFAULTS,
            )

            await client.query(
              "UPDATE branding SET tokens = $1::jsonb, typography = $2::jsonb, spacing = $3::jsonb, components = $4::jsonb, updated_at = now() WHERE id = $5",
              [
                JSON.stringify(tokens),
                JSON.stringify(typography),
                JSON.stringify(spacing),
                JSON.stringify(components),
                row.id,
              ],
            )
          }
          await client.query("COMMIT")
          console.log(`[migrate] ✅ backfilled ${rows.length} branding rows`)
        } catch (err) {
          await client.query("ROLLBACK")
          throw err
        } finally {
          client.release()
        }
      } catch (err) {
        console.error("[migrate] ❌ branding backfill failed:", err)
      }
    })
    .catch((err: unknown) =>
      console.error("[migrate] ❌ PG migration failed:", err),
    )

  db = pgDb
} else {
  // ─── SQLite (default) ────────────────────────────────
  const Database = require("better-sqlite3")
  const { drizzle: drizzleSqlite } = require("drizzle-orm/better-sqlite3")
  const { migrate } = require("drizzle-orm/better-sqlite3/migrator")
  const schema = require("./schema.sqlite")

  const DB_PATH =
    process.env.DATABASE_PATH || path.join(process.cwd(), "data", "brain.db")

  // Ensure directory exists
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })

  const sqlite = new Database(DB_PATH)
  sqlite.pragma("journal_mode = WAL")
  sqlite.pragma("foreign_keys = ON")

  const sqliteDb = drizzleSqlite(sqlite, { schema })

  // ─── Run Drizzle migrations (auto-create/update all tables) ──
  try {
    migrate(sqliteDb, {
      migrationsFolder: path.join(process.cwd(), "drizzle", "sqlite"),
    })
    console.log("[migrate] ✅ SQLite migrations applied")
  } catch (err) {
    console.error("[migrate] ❌ SQLite migration failed:", err)
  }

  // ─── Legacy auto-migrate: old schema → org-scoped ────────────
  // Detects if users table exists but lacks org_id column,
  // which means this is a pre-orgs database that needs migration.
  const cols = sqlite
    .pragma("table_info(users)")
    .map((c: { name: string }) => c.name)

  if (cols.includes("email") && !cols.includes("org_id")) {
    console.log(
      "[migrate] Detected pre-orgs database, running auto-migration...",
    )
    sqlite.pragma("foreign_keys = OFF")

    try {
      sqlite.exec("BEGIN TRANSACTION")

      // 1. Create organizations table (already exists from migration above)

      // 2. Create one org per existing user, copy their api_token/settings
      interface OldUser {
        id: string
        email: string
        first_name: string | null
        api_token: string | null
        default_language: string | null
        default_branding: string | null
      }

      const existingUsers = sqlite
        .prepare(
          "SELECT id, email, first_name, api_token, default_language, default_branding FROM users",
        )
        .all() as OldUser[]

      const insertOrg = sqlite.prepare(
        "INSERT INTO organizations (id, name, api_token, default_language, default_branding, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))",
      )

      const userOrgMap = new Map<string, string>()

      for (const user of existingUsers) {
        const orgId = crypto.randomUUID()
        const orgName = user.first_name?.trim()
          ? `${user.first_name}'s Organization`
          : `${user.email.split("@")[0]}'s Organization`

        insertOrg.run(
          orgId,
          orgName,
          user.api_token || null,
          user.default_language || "lt",
          user.default_branding || null,
        )

        userOrgMap.set(user.id, orgId)
        console.log(`[migrate]   → Org "${orgName}" for ${user.email}`)
      }

      // 3. Add org_id + org_role to users
      sqlite.exec("ALTER TABLE users ADD COLUMN org_id TEXT;")
      sqlite.exec(
        "ALTER TABLE users ADD COLUMN org_role TEXT NOT NULL DEFAULT 'owner';",
      )

      const updateUser = sqlite.prepare(
        "UPDATE users SET org_id = ? WHERE id = ?",
      )
      for (const [userId, orgId] of userOrgMap) {
        updateUser.run(orgId, userId)
      }

      // 4. Add org_id to branding (if it has user_id)
      const brandingCols = sqlite
        .pragma("table_info(branding)")
        .map((c: { name: string }) => c.name)
      if (
        brandingCols.includes("user_id") &&
        !brandingCols.includes("org_id")
      ) {
        sqlite.exec("ALTER TABLE branding ADD COLUMN org_id TEXT;")
        sqlite.exec(
          "UPDATE branding SET org_id = (SELECT org_id FROM users WHERE users.id = branding.user_id) WHERE org_id IS NULL;",
        )
      }

      // 5. Add org_id to game tables
      for (const table of ["crosswords", "wordgames", "sudoku"]) {
        const gameCols = sqlite
          .pragma(`table_info(${table})`)
          .map((c: { name: string }) => c.name)
        if (gameCols.length > 0 && !gameCols.includes("org_id")) {
          sqlite.exec(`ALTER TABLE ${table} ADD COLUMN org_id TEXT;`)
          sqlite.exec(
            `UPDATE ${table} SET org_id = (SELECT org_id FROM users WHERE users.id = ${table}.user_id) WHERE org_id IS NULL;`,
          )
          console.log(`[migrate]   → Added org_id to ${table}`)
        }
      }

      sqlite.exec("COMMIT")
      console.log(
        `[migrate] ✅ Migration complete — ${userOrgMap.size} org(s) created`,
      )
    } catch (err) {
      sqlite.exec("ROLLBACK")
      console.error("[migrate] ❌ Migration failed, rolled back:", err)
    }

    sqlite.pragma("foreign_keys = ON")
  }

  // ─── Legacy auto-migrate: add invite columns ─────────────────
  if (cols.includes("org_id") && !cols.includes("invite_token")) {
    console.log("[migrate] Adding invite_token + invite_expires_at columns...")
    try {
      sqlite.exec("ALTER TABLE users ADD COLUMN invite_token TEXT;")
      sqlite.exec("ALTER TABLE users ADD COLUMN invite_expires_at TEXT;")
      sqlite.exec(
        "CREATE UNIQUE INDEX IF NOT EXISTS idx_users_invite_token ON users(invite_token) WHERE invite_token IS NOT NULL;",
      )
      console.log("[migrate] ✅ invite columns added")
    } catch (err) {
      console.error("[migrate] invite columns may already exist:", err)
    }
  }

  // ─── Branding backfill: flat columns → JSON tokens ───────────
  // Idempotent: skips rows where `tokens` is already populated.
  try {
    const brandingCols = sqlite
      .pragma("table_info(branding)")
      .map((c: { name: string }) => c.name)

    if (brandingCols.includes("tokens") && brandingCols.includes("accent_color")) {
      const rows = sqlite
        .prepare(
          "SELECT id, accent_color, accent_hover_color, accent_light_color, selection_color, selection_ring_color, highlight_color, correct_color, correct_light_color, present_color, absent_color, bg_primary_color, bg_secondary_color, text_primary_color, text_secondary_color, border_color, cell_bg_color, cell_blocked_color, sidebar_active_color, sidebar_active_bg_color, grid_border_color, main_word_marker_color, font_sans, font_serif, border_radius FROM branding WHERE tokens IS NULL",
        )
        .all() as OldBrandingRow[]

      if (rows.length > 0) {
        console.log(`[migrate] backfilling ${rows.length} branding rows`)

        const PLATFORM_DEFAULTS = {
          primary: process.env.PLATFORM_ACCENT || "#c25e40",
          surface: "#ffffff",
          text: "#0f172a",
        }

        const update = sqlite.prepare(
          "UPDATE branding SET tokens = ?, typography = ?, spacing = ?, components = ?, updated_at = datetime('now') WHERE id = ?",
        )

        sqlite.exec("BEGIN TRANSACTION")
        try {
          for (const row of rows) {
            const { tokens, typography, spacing, components } = backfillRow(
              row,
              PLATFORM_DEFAULTS,
            )

            update.run(
              JSON.stringify(tokens),
              JSON.stringify(typography),
              JSON.stringify(spacing),
              JSON.stringify(components),
              row.id,
            )
          }
          sqlite.exec("COMMIT")
          console.log(`[migrate] ✅ backfilled ${rows.length} branding rows`)
        } catch (err) {
          sqlite.exec("ROLLBACK")
          throw err
        }
      }
    }
  } catch (err) {
    console.error("[migrate] ❌ branding backfill failed:", err)
  }

  db = sqliteDb
}

export { db }
export type DB = typeof db

// ─── Auto-seed default user + organization ───────────────
// Set DEFAULT_USER_EMAIL + DEFAULT_USER_PASSWORD to auto-create
// an owner account with its own organization on first startup.
const defaultEmail = process.env.DEFAULT_USER_EMAIL
const defaultPassword = process.env.DEFAULT_USER_PASSWORD

if (defaultEmail && defaultPassword) {
  ;(async () => {
    try {
      const { eq } = require("drizzle-orm")
      const bcrypt = require("bcryptjs")
      const schema = isPostgres
        ? require("./schema.pg")
        : require("./schema.sqlite")

      const [existing] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, defaultEmail))
        .limit(1)

      if (!existing) {
        // Create default organization first
        const orgId = crypto.randomUUID()
        await db.insert(schema.organizations).values({
          id: orgId,
          name: process.env.PLATFORM_NAME || "My Organization",
        })

        // Create the default user linked to the org
        const passwordHash = await bcrypt.hash(defaultPassword, 12)
        await db.insert(schema.users).values({
          email: defaultEmail,
          passwordHash,
          firstName: "Admin",
          lastName: "User",
          role: "admin",
          orgId,
          orgRole: "owner",
        })
        console.log(`[seed] Created default org + user: ${defaultEmail}`)
      } else {
        // Sync password if it changed
        const passwordMatch = await bcrypt.compare(
          defaultPassword,
          existing.passwordHash,
        )
        if (!passwordMatch) {
          const newHash = await bcrypt.hash(defaultPassword, 12)
          await db
            .update(schema.users)
            .set({ passwordHash: newHash })
            .where(eq(schema.users.id, existing.id))
          console.log(
            `[seed] Updated password for default user: ${defaultEmail}`,
          )
        }
      }
    } catch (err) {
      console.error("[seed] Failed to sync default user:", err)
    }
  })()
}
