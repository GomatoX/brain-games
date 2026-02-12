/**
 * Migration script: Add `user_created` system field to all game collections.
 *
 * Usage:
 *   DIRECTUS_URL=https://api.rustycogs.io ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=admin123 node add-user-created-fields.js
 *
 * This creates the `user_created` field on crosswords, wordgames, and sudoku
 * if it doesn't already exist.
 */

const DIRECTUS_URL = process.env.DIRECTUS_URL || "http://localhost:8055";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    "ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required",
  );
  process.exit(1);
}

async function getAccessToken() {
  const res = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText);
    throw new Error(`Login failed: ${err}`);
  }

  const { data } = await res.json();
  return data.access_token;
}

let ADMIN_TOKEN;

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

  try {
    console.log(`Logging in as ${ADMIN_EMAIL}...`);
    ADMIN_TOKEN = await getAccessToken();
    console.log("✓ Logged in successfully\n");
  } catch (err) {
    console.error(`✗ ${err.message}`);
    process.exit(1);
  }

  for (const collection of collections) {
    await addUserCreatedField(collection);
  }

  console.log("\nDone!");
})();
