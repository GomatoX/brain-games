# 🧩 RustyCogs.io – Brain Games Platform

Interactive brain games (Crosswords, Word Guessing, Sudoku) as embeddable Web Components, with a publisher dashboard and white-label support.

## Architecture

| Service   | Stack         | Port    | Purpose                                                |
| --------- | ------------- | ------- | ------------------------------------------------------ |
| **app**   | Next.js 16    | `:3000` | Dashboard, API, auth, SQLite database                  |
| **games** | Svelte + Vite | `:5173` | Game engine – Web Components (crossword, word, sudoku) |

## Quick Start

```bash
cp .env.example .env
# Edit .env — set AUTH_SECRET at minimum

# Push DB schema & seed admin user
cd app
yarn install
yarn db:push
yarn db:seed admin@rustycogs.io yourpassword

# Start
docker compose up -d --build
```

Open `http://localhost:3000` for the dashboard.

## Environment Variables

See [`.env.example`](.env.example) for all variables. Key ones:

### Core

| Variable                   | Description                            | Default                 |
| -------------------------- | -------------------------------------- | ----------------------- |
| `AUTH_SECRET`              | NextAuth secret key                    | _required_              |
| `AUTH_URL`                 | App URL                                | `http://localhost:3000` |
| `DATABASE_PATH`            | SQLite database path                   | `./data/brain.db`       |
| `NEXT_PUBLIC_FRONTEND_URL` | Game engine URL                        | `http://localhost:5173` |
| `GOOGLE_AI_API_KEY`        | Google AI key for crossword generation | –                       |

### White-Label

| Variable                      | Description                                         | Default        |
| ----------------------------- | --------------------------------------------------- | -------------- |
| `NEXT_PUBLIC_MODE`            | `saas` (full site) or `whitelabel` (dashboard only) | `saas`         |
| `NEXT_PUBLIC_PLATFORM_NAME`   | Custom name in sidebar & title                      | `Rustycogs.io` |
| `NEXT_PUBLIC_PLATFORM_ACCENT` | Primary accent color (hex)                          | `#c25e40`      |
| `NEXT_PUBLIC_PLATFORM_LOGO`   | Custom logo path/URL                                | –              |
| `NEXT_PUBLIC_HIDE_LANDING`    | `true` → redirects `/` to `/dashboard`              | `false`        |
| `NEXT_PUBLIC_HIDE_REGISTER`   | `true` → disables self-registration                 | `false`        |

## Deploying White-Label (Dashboard + Games Only)

To deploy without the marketing landing page:

```env
NEXT_PUBLIC_MODE=whitelabel
NEXT_PUBLIC_HIDE_LANDING=true
NEXT_PUBLIC_HIDE_REGISTER=true
NEXT_PUBLIC_PLATFORM_NAME=Your Brand
NEXT_PUBLIC_PLATFORM_ACCENT=#3b82f6
```

Then build and deploy:

```bash
docker compose up -d --build
```

> **Note:** `NEXT_PUBLIC_*` vars are baked in at **build time** by Next.js. If you change them, you must rebuild: `docker compose up -d --build app`

## Embedding Games

After creating games in the dashboard, use the embed code from the **Keys** page:

```html
<!-- Crossword -->
<script src="https://games.example.com/dist/crossword-engine.iife.js"></script>
<crossword-game
  puzzle-id="latest"
  api-url="https://app.example.com"
  token="YOUR_API_TOKEN"
  lang="en"
  theme="light"
>
</crossword-game>

<!-- Word Game -->
<script src="https://games.example.com/dist/word-game.iife.js"></script>
<word-game
  puzzle-id="latest"
  api-url="https://app.example.com"
  token="YOUR_API_TOKEN"
  lang="en"
  theme="light"
>
</word-game>
```

### Web Component Props

| Prop        | Description           | Values           |
| ----------- | --------------------- | ---------------- |
| `puzzle-id` | Game ID or `"latest"` | string           |
| `api-url`   | App API URL           | URL              |
| `token`     | Publisher API token   | string           |
| `theme`     | Color scheme          | `light` / `dark` |
| `lang`      | Language              | `en` / `lt`      |

## Local Development

```bash
# App (dashboard + API)
cd app && yarn install && yarn dev

# Games (game engine)
cd games && npm install && npm run dev
```

## Database

The app uses SQLite via Drizzle ORM. Common commands:

```bash
cd app
yarn db:push      # Push schema to database
yarn db:seed      # Create admin user
yarn db:generate  # Generate migration SQL
yarn db:migrate   # Run migrations
yarn db:studio    # Open Drizzle Studio
```

## Features

- 🧩 **Crossword** – Auto-layout engine with AI word generation
- 🔤 **Word Game** – Wordle-style guessing with hints
- 🔢 **Sudoku** – Classic puzzle with difficulty levels
- 🎨 **Branding** – Custom colors, fonts, logos per publisher
- 🌐 **i18n** – English & Lithuanian
- 📦 **Web Components** – Drop-in embeds for any website
- 🏷️ **White-label** – Deploy as your own branded platform
