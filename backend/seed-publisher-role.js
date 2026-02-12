#!/usr/bin/env node

/**
 * Seed script for creating a "Publisher" role in Directus.
 *
 * This script:
 * 1. Adds user_created fields to crosswords, wordgames, and sudoku collections
 * 2. Creates a "Publisher" role
 * 3. Sets permissions so publishers can only manage their own games
 * 4. Enables API token generation for publishers
 *
 * Usage:
 *   DIRECTUS_URL=http://localhost:8055 \
 *   DIRECTUS_TOKEN=<admin-token> \
 *   node seed-publisher-role.js
 */

const DIRECTUS_URL = process.env.DIRECTUS_URL || "http://localhost:8055";
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

if (!DIRECTUS_TOKEN) {
  console.error(
    "❌  DIRECTUS_TOKEN env var is required (use an admin static token)",
  );
  console.error(
    "   You can generate one in Directus: Settings → Users → Admin → Token",
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
    // If it's a duplicate error, that's OK — field/role already exists
    if (res.status === 400 && text.includes("already exists")) {
      console.log(`   ⚠ Already exists, skipping: ${path}`);
      return null;
    }
    throw new Error(`${method} ${path} → ${res.status}: ${text}`);
  }

  return text ? JSON.parse(text) : null;
}

// ─── Step 1: Add user_created fields ──────────────────────────────

async function addUserCreatedField(collection) {
  console.log(`📝 Adding user_created field to ${collection}...`);
  try {
    await api("POST", `/fields/${collection}`, {
      field: "user_created",
      type: "uuid",
      meta: {
        special: ["user-created"],
        interface: "select-dropdown-m2o",
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
    });
    console.log(`   ✅ user_created field added to ${collection}`);
  } catch (err) {
    if (err.message.includes("already exists")) {
      console.log(`   ⚠ user_created already exists on ${collection}`);
    } else {
      throw err;
    }
  }
}

// ─── Step 2: Create Publisher role + policy ────────────────────────

async function createPublisherRole() {
  console.log("\n🔑 Creating Publisher role...");

  // 2a. Create the role
  let roleId;
  try {
    const res = await api("POST", "/roles", {
      name: "Publisher",
      icon: "supervised_user_circle",
      description:
        "Publishers can manage their own games and generate API tokens",
    });
    roleId = res?.data?.id;
    console.log(`   ✅ Publisher role created: ${roleId}`);
  } catch (err) {
    if (err.message.includes("already exists")) {
      console.log("   ⚠ Publisher role already exists, looking it up...");
      const roles = await api("GET", "/roles?filter[name][_eq]=Publisher");
      roleId = roles?.data?.[0]?.id;
      console.log(`   ✅ Found existing Publisher role: ${roleId}`);
    } else {
      throw err;
    }
  }

  // 2b. Create a policy for publisher access
  console.log("\n📋 Creating Publisher policy...");
  let policyId;
  try {
    const res = await api("POST", "/policies", {
      name: "Publisher Access",
      icon: "verified_user",
      description: "Full CRUD on own games, read/update own profile",
      app_access: true,
      admin_access: false,
    });
    policyId = res?.data?.id;
    console.log(`   ✅ Publisher policy created: ${policyId}`);
  } catch (err) {
    if (err.message.includes("already exists")) {
      console.log("   ⚠ Policy already exists, looking it up...");
      const policies = await api(
        "GET",
        "/policies?filter[name][_eq]=Publisher Access",
      );
      policyId = policies?.data?.[0]?.id;
      console.log(`   ✅ Found existing policy: ${policyId}`);
    } else {
      throw err;
    }
  }

  // 2c. Link the policy to the role via directus_access
  console.log("\n🔗 Linking policy to role...");
  try {
    await api("POST", "/access", {
      role: roleId,
      policy: policyId,
    });
    console.log("   ✅ Policy linked to Publisher role");
  } catch (err) {
    if (
      err.message.includes("already exists") ||
      err.message.includes("Unique constraint")
    ) {
      console.log("   ⚠ Policy already linked to role");
    } else {
      console.log(`   ⚠ Link: ${err.message}`);
    }
  }

  return { roleId, policyId };
}

// ─── Step 3: Set permissions ──────────────────────────────────────

async function setPermissions(policyId) {
  console.log("\n🔒 Setting permissions for Publisher policy...");

  const collections = ["crosswords", "wordgames", "sudoku"];
  const actions = ["create", "read", "update", "delete"];

  for (const collection of collections) {
    for (const action of actions) {
      const permission = {
        policy: policyId,
        collection,
        action,
        fields: ["*"],
      };

      // Scope read/update/delete to own items only
      if (action !== "create") {
        permission.permissions = {
          user_created: { _eq: "$CURRENT_USER" },
        };
      }

      // On create, auto-set user_created
      if (action === "create") {
        permission.presets = {
          user_created: "$CURRENT_USER",
        };
      }

      // Update validation: can't change ownership
      if (action === "update") {
        permission.validation = {
          user_created: { _eq: "$CURRENT_USER" },
        };
      }

      try {
        await api("POST", "/permissions", permission);
        console.log(
          `   ✅ ${collection}: ${action} (own items${action === "create" ? " + auto-assign owner" : ""})`,
        );
      } catch (err) {
        console.log(`   ⚠ ${collection}:${action} — ${err.message}`);
      }
    }
  }

  // Allow publishers to read their own user profile
  try {
    await api("POST", "/permissions", {
      policy: policyId,
      collection: "directus_users",
      action: "read",
      fields: ["id", "first_name", "last_name", "email", "avatar", "token"],
      permissions: { id: { _eq: "$CURRENT_USER" } },
    });
    console.log("   ✅ directus_users: read own profile");
  } catch (err) {
    console.log(`   ⚠ directus_users:read — ${err.message}`);
  }

  // Allow publishers to update their own token
  try {
    await api("POST", "/permissions", {
      policy: policyId,
      collection: "directus_users",
      action: "update",
      fields: ["first_name", "last_name", "token"],
      permissions: { id: { _eq: "$CURRENT_USER" } },
    });
    console.log("   ✅ directus_users: update own profile/token");
  } catch (err) {
    console.log(`   ⚠ directus_users:update — ${err.message}`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 Seeding Publisher role for Rustycogs.io\n");
  console.log(`   Directus URL: ${DIRECTUS_URL}\n`);

  // Step 1: Add user_created fields
  for (const collection of ["crosswords", "wordgames", "sudoku"]) {
    await addUserCreatedField(collection);
  }

  // Step 2: Create role + policy
  const { roleId, policyId } = await createPublisherRole();
  if (!roleId || !policyId) {
    console.error("❌ Could not create or find Publisher role/policy");
    process.exit(1);
  }

  // Step 3: Set permissions on the policy
  await setPermissions(policyId);

  console.log("\n✅ Done! Publisher role is ready.");
  console.log(`\n📋 Publisher Role ID: ${roleId}`);
  console.log(
    "   Set USERS_REGISTER_ROLE in backend/.env to this ID for self-registration.",
  );
  console.log("\n📋 Next steps:");
  console.log("   1. Go to Directus Admin → Settings → Registration");
  console.log(
    '   2. Enable "Public Registration" and set default role to "Publisher"',
  );
  console.log("   3. Or create publisher users manually in Settings → Users");
  console.log(
    "\n   Publishers can then log in, create games, and generate API tokens.",
  );
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
