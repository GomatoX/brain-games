#!/usr/bin/env node

/**
 * Setup script for creating the "crossword_results" collection in Directus.
 *
 * This creates:
 * 1. The crossword_results collection with fields:
 *    - id (uuid, auto)
 *    - crossword_id (m2o → crosswords)
 *    - completion_time (integer, seconds)
 *    - date_created (timestamp, auto)
 * 2. Public permissions for create + read (anyone can submit and view results)
 *
 * Usage:
 *   DIRECTUS_URL=http://localhost:8055 \
 *   DIRECTUS_TOKEN=<admin-token> \
 *   node setup-crossword-results.js
 */

const DIRECTUS_URL = process.env.DIRECTUS_URL || "http://localhost:8055";
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

if (!DIRECTUS_TOKEN) {
  console.error(
    "❌  DIRECTUS_TOKEN env var is required (use an admin static token)",
  );
  process.exit(1);
}

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${DIRECTUS_TOKEN}`,
};

async function api(method, path, body) {
  const url = `${DIRECTUS_URL}${path}`;
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(url, opts);
  const text = await res.text();

  if (!res.ok) {
    if (res.status === 400 && text.includes("already exists")) {
      console.log(`   ⚠ Already exists, skipping: ${path}`);
      return null;
    }
    throw new Error(`${method} ${path} → ${res.status}: ${text}`);
  }

  return text ? JSON.parse(text) : null;
}

async function main() {
  console.log("🔧 Setting up crossword_results collection...\n");

  // 1. Create collection
  console.log("1️⃣  Creating crossword_results collection...");
  await api("POST", "/collections", {
    collection: "crossword_results",
    meta: {
      collection: "crossword_results",
      icon: "leaderboard",
      note: "Stores crossword completion results for sharing and leaderboards",
      color: "#22c55e",
      display_template: "{{crossword_id}} — {{completion_time}}s",
      sort: 5,
    },
    schema: {},
    fields: [
      {
        field: "id",
        type: "uuid",
        meta: {
          interface: "input",
          readonly: true,
          hidden: true,
          special: ["uuid"],
        },
        schema: {
          is_primary_key: true,
          has_auto_increment: false,
        },
      },
    ],
  });
  console.log("   ✅ Collection created");

  // 2. Add crossword_id field (M2O relation to crosswords)
  console.log("2️⃣  Adding crossword_id field...");
  await api("POST", "/fields/crossword_results", {
    field: "crossword_id",
    type: "uuid",
    meta: {
      interface: "select-dropdown-m2o",
      display: "related-values",
      display_options: { template: "{{title}}" },
      note: "Which crossword puzzle was completed",
      special: ["m2o"],
      required: true,
    },
    schema: {
      is_nullable: false,
      foreign_key_table: "crosswords",
      foreign_key_column: "id",
    },
  });
  console.log("   ✅ crossword_id field added");

  // 3. Add relation
  console.log("3️⃣  Creating M2O relation...");
  await api("POST", "/relations", {
    collection: "crossword_results",
    field: "crossword_id",
    related_collection: "crosswords",
    meta: {
      one_field: null,
      sort_field: null,
      one_deselect_action: "nullify",
    },
    schema: {
      on_delete: "CASCADE",
    },
  });
  console.log("   ✅ Relation created");

  // 4. Add completion_time field
  console.log("4️⃣  Adding completion_time field...");
  await api("POST", "/fields/crossword_results", {
    field: "completion_time",
    type: "integer",
    meta: {
      interface: "input",
      display: "raw",
      note: "Completion time in seconds",
      required: true,
    },
    schema: {
      is_nullable: false,
      numeric_precision: 10,
      numeric_scale: 0,
    },
  });
  console.log("   ✅ completion_time field added");

  // 5. Add date_created field
  console.log("5️⃣  Adding date_created field...");
  await api("POST", "/fields/crossword_results", {
    field: "date_created",
    type: "timestamp",
    meta: {
      interface: "datetime",
      display: "datetime",
      readonly: true,
      hidden: true,
      special: ["date-created"],
      note: "When the result was submitted",
    },
    schema: {
      is_nullable: true,
    },
  });
  console.log("   ✅ date_created field added");

  // 6. Set public permissions — Create + Read
  console.log("6️⃣  Setting public permissions...");

  // Public CREATE
  await api("POST", "/permissions", {
    role: null, // null = public role
    collection: "crossword_results",
    action: "create",
    fields: ["crossword_id", "completion_time"],
    permissions: {},
    validation: {},
  });
  console.log("   ✅ Public CREATE permission set");

  // Public READ
  await api("POST", "/permissions", {
    role: null,
    collection: "crossword_results",
    action: "read",
    fields: ["*"],
    permissions: {},
    validation: {},
  });
  console.log("   ✅ Public READ permission set");

  console.log("\n🎉 crossword_results collection is ready!");
  console.log("   Users can now share their results via shareable links.");
}

main().catch((err) => {
  console.error("❌ Setup failed:", err.message);
  process.exit(1);
});
