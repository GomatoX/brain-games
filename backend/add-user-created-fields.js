/**
 * Migration script: Add `user_created` system field to all game collections.
 *
 * Usage:
 *   DIRECTUS_URL=https://api.rustycogs.io ADMIN_TOKEN=<your-admin-token> node add-user-created-fields.js
 *
 * This creates the `user_created` field on crosswords, wordgames, and sudoku
 * if it doesn't already exist.
 */

const DIRECTUS_URL = process.env.DIRECTUS_URL || "http://localhost:8055";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

if (!ADMIN_TOKEN) {
  console.error("ADMIN_TOKEN environment variable is required");
  process.exit(1);
}

const collections = ["crosswords", "wordgames", "sudoku"];

async function addUserCreatedField(collection) {
  // Check if it already exists
  const checkRes = await fetch(
    `${DIRECTUS_URL}/fields/${collection}/user_created`,
    {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    },
  );

  if (checkRes.ok) {
    console.log(`✓ ${collection} — user_created already exists, skipping`);
    return;
  }

  // Create the system field
  const res = await fetch(`${DIRECTUS_URL}/fields/${collection}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    },
    body: JSON.stringify({
      field: "user_created",
      type: "uuid",
      meta: {
        special: ["user-created"],
        interface: "select-dropdown-m2o",
        options: {
          template: "{{avatar.$thumbnail}} {{first_name}} {{last_name}}",
        },
        display: "user",
        readonly: true,
        hidden: true,
        width: "half",
      },
      schema: {
        is_nullable: true,
        foreign_key_table: "directus_users",
        foreign_key_column: "id",
      },
    }),
  });

  if (res.ok) {
    console.log(`✓ ${collection} — user_created field added`);
  } else {
    const err = await res.text().catch(() => res.statusText);
    console.error(`✗ ${collection} — failed: ${err}`);
  }
}

(async () => {
  console.log(`Adding user_created fields to: ${collections.join(", ")}`);
  console.log(`Directus URL: ${DIRECTUS_URL}\n`);

  for (const collection of collections) {
    await addUserCreatedField(collection);
  }

  console.log("\nDone!");
})();
