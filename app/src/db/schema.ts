/**
 * Schema re-export — automatically selects SQLite or Postgres
 * based on DATABASE_URL environment variable.
 *
 * Re-exports typed references from the SQLite schema (used as
 * the canonical type). At runtime the correct driver-specific
 * tables are loaded, but TypeScript sees consistent types.
 */

/* eslint-disable @typescript-eslint/no-require-imports */
import type * as SqliteSchema from "./schema.sqlite";

const isPostgres = !!process.env.DATABASE_URL;

const activeSchema: typeof SqliteSchema = isPostgres
  ? require("./schema.pg")
  : require("./schema.sqlite");

export const organizations = activeSchema.organizations;
export const users = activeSchema.users;
export const branding = activeSchema.branding;
export const crosswords = activeSchema.crosswords;
export const wordgames = activeSchema.wordgames;
export const sudoku = activeSchema.sudoku;
