# 🧩 RustyCogs.io — Interactive Brain Games Platform

A B2B brain games platform with embeddable crosswords, word games, and sudoku. Publishers can register, manage games, and get embed codes for their websites.

## Architecture

```
brain-games/
├── backend/      → Directus CMS (API + admin panel, SQLite)
├── frontend/     → Game engines (Vite, builds Web Components for embedding)
├── landing/      → Marketing site + Publisher Dashboard (Next.js 16)
└── docker-compose.yml
```

### Why 3 separate services?

| Service      | Purpose                                     | Why separate?                                                                                                                                                    |
| ------------ | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **backend**  | Directus API, user auth, game data          | CMS is its own runtime                                                                                                                                           |
| **frontend** | Game engines (crossword, word game, sudoku) | Builds to standalone `.js` bundles that publishers embed on _any_ website via `<script>` tags. Must be served independently with permissive CORS/framing headers |
| **landing**  | Marketing website + Publisher Dashboard     | Next.js SSR app with auth, CRUD, API key management                                                                                                              |

> The **frontend** builds distributable Web Components (IIFE bundles). Merging it into the landing would break the embedding model — publishers load `crossword-engine.iife.js` on their own domains.

---

## Quick Start (Development)

```bash
# 1. Start the backend (Directus)
cd backend && yarn install && npx directus bootstrap && npx directus start

# 2. Start the game engines
cd frontend && yarn install && yarn dev

# 3. Start the landing/dashboard
cd landing && yarn install && yarn dev
```

| Service           | URL                         |
| ----------------- | --------------------------- |
| Directus Admin    | http://localhost:8055/admin |
| Game Engines      | http://localhost:5173       |
| Landing/Dashboard | http://localhost:3000       |

Default admin: `admin@example.com` / `admin123`

---

## 🚀 Deploy with Coolify

### Option A: Docker Compose (Recommended)

1. **Create a new project** in Coolify
2. **Add resource → Docker Compose** and point to your Git repo
3. **Set environment variables** in Coolify's UI:

| Variable                   | Example Value                | Description                                        |
| -------------------------- | ---------------------------- | -------------------------------------------------- |
| `VITE_API_URL`             | `https://api.rustycogs.io`   | Public URL of Directus (used by game engines)      |
| `NEXT_PUBLIC_API_URL`      | `https://api.rustycogs.io`   | Public URL of Directus (used by landing/dashboard) |
| `NEXT_PUBLIC_FRONTEND_URL` | `https://games.rustycogs.io` | Public URL of game engines                         |
| `DIRECTUS_ADMIN_TOKEN`     | `your-secret-admin-token`    | Admin static token (set on admin user in Directus) |

4. **Update `backend/.env`** for production:

```env
SECRET="generate-a-random-64-char-string"
KEY="generate-another-random-64-char-string"
ADMIN_EMAIL="your-real-admin@email.com"
ADMIN_PASSWORD="strong-password-here"
CORS_ORIGIN="https://rustycogs.io,https://games.rustycogs.io"
PUBLIC_URL="https://api.rustycogs.io"
```

5. **Configure domains** in Coolify:

| Service    | Port        | Domain               |
| ---------- | ----------- | -------------------- |
| `backend`  | 8055        | `api.rustycogs.io`   |
| `frontend` | 80 (→ 5173) | `games.rustycogs.io` |
| `landing`  | 3000        | `rustycogs.io`       |

6. **Deploy** — Coolify will build and start all 3 services

### Option B: Separate Nixpacks/Dockerfile Services

If you prefer deploying each service independently:

1. **Backend**: Add resource → Dockerfile, set Build Path to `/backend`
2. **Frontend**: Add resource → Dockerfile, set Build Path to `/frontend`, add build arg `VITE_API_URL`
3. **Landing**: Add resource → Dockerfile, set Build Path to `/landing`, add build args `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_FRONTEND_URL`, add runtime env `DIRECTUS_ADMIN_TOKEN`

---

## Post-Deploy Setup

After the first deployment, seed the Publisher role:

```bash
# SSH into the backend container or use Coolify's terminal
node seed-publisher-role.js
```

Then set the admin static token for dashboard operations:

```bash
# Log in and set a static token on the admin user
curl -X POST https://api.rustycogs.io/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@email.com","password":"your-password"}'

# Use the returned access_token to set a static token
curl -X PATCH https://api.rustycogs.io/users/me \
  -H 'Authorization: Bearer ACCESS_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"token":"your-directus-admin-token"}'
```

Set this token as `DIRECTUS_ADMIN_TOKEN` in the landing service env.

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable                 | Required | Description                            |
| ------------------------ | -------- | -------------------------------------- |
| `DB_CLIENT`              | ✅       | `sqlite3`                              |
| `DB_FILENAME`            | ✅       | `./data.db`                            |
| `SECRET`                 | ✅       | Random secret for encryption           |
| `KEY`                    | ✅       | Random key for hashing                 |
| `ADMIN_EMAIL`            | ✅       | Admin account email                    |
| `ADMIN_PASSWORD`         | ✅       | Admin account password                 |
| `CORS_ORIGIN`            | ✅       | Comma-separated allowed origins        |
| `PUBLIC_URL`             | ✅       | Public URL of Directus                 |
| `USERS_REGISTER_ENABLED` | ✅       | `true` to allow publisher registration |
| `USERS_REGISTER_ROLE`    | ✅       | Publisher role UUID                    |

### Frontend (build args)

| Variable       | Required | Description                |
| -------------- | -------- | -------------------------- |
| `VITE_API_URL` | ✅       | Public URL of Directus API |

### Landing (build args + runtime)

| Variable                   | Type      | Description                      |
| -------------------------- | --------- | -------------------------------- |
| `NEXT_PUBLIC_API_URL`      | Build arg | Public URL of Directus API       |
| `NEXT_PUBLIC_FRONTEND_URL` | Build arg | Public URL of game engines       |
| `DIRECTUS_ADMIN_TOKEN`     | Runtime   | Admin static token (server-only) |

---

## Persistent Data

The backend uses SQLite stored in a Docker volume (`directus_data`). Make sure your Coolify deployment persists this volume to avoid data loss on redeploy.

In Coolify: **Service → Backend → Storage** → Map `/app/data` to a persistent volume.
# brain-games
