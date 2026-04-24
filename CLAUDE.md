# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Layout

Two-package monorepo, no workspace tool — each package is installed independently with **yarn 1.22**.

| Package  | Stack                     | Port   | Role                                                                        |
| -------- | ------------------------- | ------ | --------------------------------------------------------------------------- |
| `app/`   | Next.js 16, NextAuth v5, Drizzle ORM | `:3000` | Dashboard, auth, public API, DB migrations                         |
| `games/` | Svelte 5 + Vite 7         | `:5173` | Game engines compiled to Web Component IIFE bundles + a standalone SPA |

Root-level `dev.sh` is the primary developer entry point; use it rather than invoking `yarn` directly when possible.

## Common Commands

### First-time setup
```bash
./dev.sh setup          # copy .env, install deps in app/ + games/, run db:push
```

### Development
```bash
./dev.sh dev            # starts app (:3000) + games vite (:5173) AND a watcher that
                        # rebuilds game IIFE bundles on svelte/js/css changes and
                        # syncs dist/*.iife.js into app/public/ automatically
./dev.sh build          # full production build: games (all modes) → app
```

### App (`cd app`)
```bash
yarn dev                # next dev
yarn build              # next build (standalone output)
yarn lint               # eslint (next core-web-vitals + next-ts configs)
yarn test               # vitest run (only src/**/*.test.ts)
yarn test path/to/file.test.ts          # run a single test file
yarn test -t "pattern"                  # run tests matching name pattern
yarn test:watch         # vitest in watch mode
```

### Database (`cd app`)
```bash
yarn db:generate        # generates migrations for BOTH SQLite and PG — always use this, not dialect-specific variants
yarn db:push            # drizzle-kit push to SQLite (dev only)
yarn db:seed <email> <password>   # create admin user (src/db/seed.ts)
yarn db:studio          # drizzle-kit studio
```

### Games (`cd games`)
```bash
yarn dev                # vite dev server — standalone game player at :5173
yarn build:all          # builds the SPA + all three IIFE bundles
yarn build:app          # SPA only (served at /play/ by Next.js)
yarn build              # crossword IIFE only
yarn build:wordgame     # word-game IIFE only
yarn build:wordsearch   # word-search IIFE only
```

## Architecture

### Two services, one shipped image
`games/` builds three IIFE Web Component bundles (`crossword-engine`, `word-game-engine`, `word-search-engine`) **and** a Svelte SPA. The root `Dockerfile` compiles games first, then copies the IIFE bundles plus the SPA (`dist/play/`) into `app/public/` before the Next build. In production there is a single container serving both the dashboard and the game assets — `games/Dockerfile` and `games/nginx.conf` are only used for the split-service Kubernetes deployment described in `DEPLOYMENT.md`.

`dev.sh dev` simulates this by running a polling watcher that re-runs `yarn build:all` on any change under `games/src/` and copies the output into `app/public/` so the embedded Web Components stay current during development.

### Database: dual-dialect Drizzle
One codebase, two runtime modes chosen by env var:
- **SQLite** (default) — `DATABASE_PATH` points to a local file; used for dev and single-replica production.
- **PostgreSQL** — enabled automatically when `DATABASE_URL` is set.

The selection happens in `app/src/db/index.ts` (runtime `require` branches) and `app/src/db/schema.ts` (re-exports the correct schema module). Every table is defined in **both** `schema.sqlite.ts` and `schema.pg.ts` — the SQLite version is the canonical type source. See `.agents/workflows/database.md` for the step-by-step recipe for schema changes. Key rules:
- Never write raw `CREATE TABLE` SQL — always edit the Drizzle schema files.
- Always run `yarn db:generate` (both dialects), not `db:generate:sqlite` alone. Commit both `drizzle/sqlite/` and `drizzle/pg/` output.
- Migrations auto-run at startup from `db/index.ts`. That file also contains **legacy `ALTER TABLE` auto-migrations** for upgrading pre-orgs databases — do not remove them.
- SQLite runs with `journal_mode = WAL` and `foreign_keys = ON`. SQLite deployments must stay at `replicas: 1` (single writer).

### Auth & middleware
- NextAuth v5 beta (`next-auth`) with bcrypt password hashing. Session cookie is `authjs.session-token`.
- `app/src/middleware.ts` handles: IP allowlist (`ALLOWED_IPS`, skipped for `/api/*` so embeds work), white-label redirects (`HIDE_LANDING`, `HIDE_REGISTER`), and session validation for `/dashboard/*`. It calls `/api/auth/session` from the middleware to detect stale cookies and clears them.
- Public embed endpoints (`/api/public/*`) are token-authorised via the `token` prop on the Web Component, validated against the organization's `api_token` — do not add session checks there.

### Platform config: runtime vs build-time
Two distinct patterns for branding/config — **do not mix them up**:
- **Runtime** (`app/src/lib/platform.ts`): plain `process.env.PLATFORM_*` / `HIDE_*` / `ALLOWED_IPS` vars. One image, many tenants — set vars at container start, no rebuild. Use these for server components.
- **Build-time** (`NEXT_PUBLIC_*`): baked into the client bundle by Next.js. Changing these requires `docker compose up -d --build app`. Used mainly for the games frontend URL.

`getClientConfig()` in `platform.ts` is the safe way to pass platform branding into client components.

### Game embedding model
Each game is a Web Component (`<crossword-game>`, `<word-game>`, `<word-search-game>`) registered by its IIFE bundle. Props: `puzzle-id` (or `"latest"`), `api-url`, `token`, `theme`, `lang`. The same IIFE files are also loaded by the Svelte SPA at `/play` (see `games/src/App.svelte`), which reads query params (`?id=`, `?type=`, `?theme=`, `?lang=`, `?user=`, `?preview=`, `?result=`) to drive the embedded component. `next.config.ts` rewrites `/play` → `/play/index.html` so the Svelte SPA loads correctly.

Vite builds the SPA with `base: "/play/"` and the IIFE bundles with `base: "/"` — don't change these without updating the Dockerfile copy paths.

## Coding Style (from `.agents/rules/coding.md`)

- **No semicolons** in new TypeScript/JS. (The codebase is mixed — match the surrounding file.)
- Prefer `const` arrow functions over `function` declarations; type them when useful.
- Early returns over nested conditions.
- Tailwind classes for styling; avoid inline CSS and style tags.
- Event handlers named `handle*` (`handleClick`, `handleKeyDown`).
- Accessibility on interactive elements (`tabindex`, `aria-label`, keyboard handlers).

## Commit Convention

Conventional Commits (`<type>[scope]: <description>`), imperative mood, no trailing period. Types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `perf`, `test`. `feat` = MINOR, `fix` = PATCH.

## Tests

Vitest, colocated in `app/src/lib/__tests__/` (e.g. `crossword-layout-server.test.ts`, `word-search-engine.test.ts`). Only `src/**/*.test.ts` is picked up — no `.tsx` tests. Path alias `@` → `./src`. There is no test suite in `games/`.
