/**
 * Seed the database with an initial admin user.
 *
 * Usage: npx tsx src/db/seed.ts
 * Or:    yarn db:seed
 */
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { users } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";

const DB_PATH =
  process.env.DATABASE_PATH || path.join(process.cwd(), "data", "brain.db");
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const sqlite = new Database(DB_PATH);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

const db = drizzle(sqlite);

async function seed() {
  const email = process.argv[2] || "admin@rustycogs.io";
  const password = process.argv[3] || "admin123";

  // Check if user exists
  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    console.log(`User ${email} already exists (id: ${existing.id})`);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const [user] = await db
    .insert(users)
    .values({
      email,
      passwordHash,
      firstName: "Admin",
      lastName: "User",
      role: "admin",
    })
    .returning();

  console.log(`Created admin user: ${user.email} (id: ${user.id})`);
  console.log(`Password: ${password}`);
  console.log(`\nChange the password after first login!`);
}

seed()
  .catch(console.error)
  .finally(() => sqlite.close());
