/**
 * Schema re-export — automatically selects SQLite or Postgres
 * based on DATABASE_URL environment variable.
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const isPostgres = !!process.env.DATABASE_URL;

// Use require() for conditional module loading since import paths must be static
const activeSchema = isPostgres
  ? require("./schema.pg")
  : require("./schema.sqlite");

export const users = activeSchema.users;
export const branding = activeSchema.branding;
export const crosswords = activeSchema.crosswords;
export const wordgames = activeSchema.wordgames;
export const sudoku = activeSchema.sudoku;
