# shared/

Cross-framework shared code for `brain-games`. Consumed by both `app/` (Next.js)
and `games/` (Svelte).

## Directional rule

**Nothing in `shared/` may import from `app/` or `games/`.** This directory is a
leaf. Enforced by convention and code review.

## Contents

- `tokens.css` — single source of truth for CSS design tokens (colors, spacing,
  fonts, radii, shadows). Three layers: primitives, semantic, theme overrides.
- `styles/components.css` — BEM-lite CSS classes (`.btn`, `.modal`, `.input`,
  etc.) used by both packages.
- `styles/reset.css` — minimal cross-package baseline.
- `game-lib/` — **Svelte-only** reusable modules and components (timer,
  api-client, branding, i18n, Keyboard, GameFinish, GameShell). Populated by
  Plan B. Not consumed by `app/`.

## Consumption

- `app/src/app/globals.css` imports `../../../shared/tokens.css` and
  `../../../shared/styles/components.css`. Tailwind v4's `@theme inline` block
  re-exposes selected semantic tokens so utilities like `bg-primary` work.
- `games/src/app.css` imports `../../shared/tokens.css`. The
  `../../shared/styles/components.css` import is deferred to Plan B, when
  Svelte game components begin consuming shared classes.
- Svelte files in `games/src/` will import from `../../shared/game-lib/...`
  directly (Plan B).

## Build / deploy

- `dev.sh`'s watcher includes `shared/**`.
- The root `Dockerfile` copies `shared/` into both the games-build and
  app-build stages via `COPY shared/ /shared/`.
