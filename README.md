# 🧩 RustyCogs.io – Brain Games Platform

Interactive brain games (Crosswords, Word Guessing, Sudoku) as embeddable Web Components, with a publisher dashboard and white-label support.

## Architecture

| Service      | Stack             | Port    | Purpose                                                |
| ------------ | ----------------- | ------- | ------------------------------------------------------ |
| **backend**  | Directus (SQLite) | `:8055` | CMS API – game data, auth, branding                    |
| **frontend** | Svelte + Vite     | `:5173` | Game engine – Web Components (crossword, word, sudoku) |
| **landing**  | Next.js 15        | `:3000` | Dashboard + marketing landing page                     |

## Quick Start

```bash
cp .env.example .env
# Edit .env with your values

docker compose up -d --build
```

Open `http://localhost:3000` for the dashboard.

## Environment Variables

See [`.env.example`](.env.example) for all variables. Key ones:

### Core

| Variable                   | Description                            | Default                 |
| -------------------------- | -------------------------------------- | ----------------------- |
| `SECRET`                   | Directus secret key                    | _required_              |
| `KEY`                      | Directus key                           | _required_              |
| `ADMIN_EMAIL`              | Directus admin email                   | `admin@rustycogs.io`    |
| `ADMIN_PASSWORD`           | Directus admin password                | _required_              |
| `NEXT_PUBLIC_API_URL`      | Directus API URL                       | `http://localhost:8055` |
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

> **Note:** `NEXT_PUBLIC_*` vars are baked in at **build time** by Next.js. If you change them, you must rebuild: `docker compose up -d --build landing`

## Embedding Games

After creating games in the dashboard, use the embed code from the **Keys** page:

```html
<!-- Crossword -->
<script src="https://games.example.com/dist/crossword-engine.iife.js"></script>
<crossword-game
  puzzle-id="latest"
  api-url="https://api.example.com"
  token="YOUR_API_TOKEN"
  lang="en"
  theme="light"
>
</crossword-game>

<!-- Word Game -->
<script src="https://games.example.com/dist/word-game.iife.js"></script>
<word-game
  puzzle-id="latest"
  api-url="https://api.example.com"
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
| `api-url`   | Backend API URL       | URL              |
| `token`     | Publisher API token   | string           |
| `theme`     | Color scheme          | `light` / `dark` |
| `lang`      | Language              | `en` / `lt`      |

## Local Development

```bash
# Backend (Directus)
cd backend && npm install && npx directus start

# Frontend (game engine)
cd frontend && npm install && npm run dev

# Dashboard
cd landing && npm install && npm run dev
```

## Features

- 🧩 **Crossword** – Auto-layout engine with AI word generation
- 🔤 **Word Game** – Wordle-style guessing with hints
- 🔢 **Sudoku** – Classic puzzle with difficulty levels
- 🎨 **Branding** – Custom colors, fonts, logos per publisher
- 🌐 **i18n** – English & Lithuanian
- 📦 **Web Components** – Drop-in embeds for any website
- 🏷️ **White-label** – Deploy as your own branded platform
