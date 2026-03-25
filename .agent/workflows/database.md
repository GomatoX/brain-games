---
description: How to add or modify database tables in the brain-games platform
---

# Database Schema Changes

This project uses **Drizzle ORM** with dual-dialect support (SQLite for local dev, PostgreSQL for production). All table definitions live in Drizzle schema files — **never write raw `CREATE TABLE` SQL manually**.

## Steps to Add/Modify a Table

### 1. Update BOTH schema files

Every table must be defined in **both** schema files:
- `app/src/db/schema.sqlite.ts` — SQLite version (uses `text()` with `mode: "json"` for JSON columns)
- `app/src/db/schema.pg.ts` — PostgreSQL version (uses `jsonb()` for JSON columns)

### 2. Export from the barrel file

Add the new table export to `app/src/db/schema.ts`:
```ts
export const myNewTable = activeSchema.myNewTable
```

### 3. Generate migrations for BOTH dialects

// turbo
```bash
cd app && npm run db:generate
```

This runs `drizzle-kit generate` for both SQLite and PG configs, creating migration SQL files in:
- `drizzle/sqlite/` — SQLite migrations
- `drizzle/pg/` — PostgreSQL migrations

**These migration files MUST be committed to git.** They are run automatically at startup via `migrate()` in `db/index.ts`.

### 4. Verify locally

// turbo
```bash
cd app && rm -f data/brain.db && npm run dev
```

Check the console for `[migrate] ✅ SQLite migrations applied`. The app should start without errors.

### 5. Run tests

// turbo
```bash
cd app && npm run test
```

## Important Rules

- **Single source of truth**: The Drizzle schema files (`schema.sqlite.ts`, `schema.pg.ts`) are the canonical definition. Never manually write `CREATE TABLE` SQL.
- **Always generate for both dialects**: Use `npm run db:generate` (not `db:generate:sqlite` alone).
- **Migrations are incremental**: Each `drizzle-kit generate` creates a new SQL file for only what changed. Don't edit existing migration files.
- **Legacy migrations**: `db/index.ts` still has legacy `ALTER TABLE` blocks for upgrading very old databases. Don't remove these.
