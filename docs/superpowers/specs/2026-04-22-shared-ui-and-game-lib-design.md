# Shared UI & Game Library — Design Spec

**Date:** 2026-04-22
**Status:** Draft — pending user approval
**Primary goal:** Unify the visual language between the Next.js dashboard (`app/`) and the Svelte game embeds (`games/`), eliminate duplicated game logic across the three existing engines, and prepare scaffolding so new games can be added quickly and consistently.

## Context

`brain-games` is a two-package monorepo with no workspace tool:
- `app/` — Next.js 16 + React + Tailwind v4, dashboard and public API.
- `games/` — Svelte 5 + Vite 7, three IIFE Web Component bundles (`crossword-engine`, `word-game-engine`, `word-search-engine`) plus a standalone SPA.

The primary pain point is **UI inconsistency**: the dashboard and the game embeds look like two different products. The app uses Tailwind v4 with CSS-var tokens; games use raw CSS variables with hardcoded defaults. The two design systems are disconnected.

Beneath that pain sit three secondary problems, all in scope:
1. **Duplicated game logic.** Each of the three game Svelte files is 747–1454 lines, with identical copy-pasted implementations of timer, keyboard handling, API fetch/submit, branding application, and finish-screen patterns.
2. **Branding fragmentation.** Platform accent flows via `--platform-accent` (set runtime on `<body>`). Per-puzzle branding flows via `applyBrandingFromData()` writing puzzle-specific vars to the game host. Games also have their own hardcoded `--primary`. Three mechanisms, no shared vocabulary.
3. **No scaffolding for new games.** Adding game #4 today means copy-pasting a 900-line Svelte file and trimming.

Framework unification (React everywhere or Svelte everywhere) was considered and rejected: bundle size matters for third-party embeds (Svelte ~6–10 kB runtime vs React ~45 kB), Svelte's runes suit interactive game UIs, and rewriting ~3000 lines of game logic for marginal sharing gain is not justified. Two frameworks, one shared visual layer is the correct shape.

## Non-goals

- **Framework unification.** React stays for app, Svelte stays for games.
- **App adoption of `shared/game-lib/i18n`.** Future spec; out of scope here.
- **Dockerfile cleanup** (duplicate COPY steps, split-service K8s Dockerfile review). Small follow-up PR.
- **Dual-dialect Drizzle / auth changes.** Untouched.
- **Visual-regression automation** (Chromatic, Playwright screenshots). Verification is manual.
- **Game plugin / dynamic loader system.** A Vite entry + API endpoint per game is sufficient for the current cadence.

## Architecture

A new top-level `shared/` directory sits alongside `app/` and `games/`:

```
brain-games/
├── app/                  # Next.js (unchanged location)
├── games/                # Svelte games (unchanged location)
└── shared/
    ├── tokens.css            # Single source of design tokens (three layers)
    ├── styles/
    │   ├── components.css    # .btn, .modal, .input, .keyboard-key, etc.
    │   └── reset.css         # Shared baseline
    ├── game-lib/             # Svelte-consumed only
    │   ├── timer.svelte.js
    │   ├── api-client.js
    │   ├── branding.js
    │   ├── i18n/
    │   │   ├── index.js
    │   │   └── locales/{en,lt,…}.json
    │   ├── Keyboard.svelte
    │   ├── GameFinish.svelte
    │   └── GameShell.svelte
    └── README.md
```

**Directional rule (non-negotiable):** nothing in `shared/` imports from `app/` or `games/`. `shared/` is a leaf.

**Cross-framework contract:** only CSS and tokens are shared. `shared/game-lib/` is Svelte-only; the app never imports JS from `shared/`.

**Consumption:**
- **Games** import directly via relative path: `import { createTimer } from "../../shared/game-lib/timer.svelte.js"`. `games/src/app.css` imports `shared/tokens.css` and `shared/styles/components.css`.
- **App**'s `globals.css` imports the same two CSS files. Tailwind v4's `@theme inline { … }` block re-exposes semantic tokens to Tailwind so utilities like `bg-primary` continue to work. React components use either the shared classnames (`className="btn btn-primary"`) or Tailwind utilities for dashboard-specific one-offs.

**Build / dev:**
- `dev.sh` watcher's glob extended to include `shared/**`.
- Root `Dockerfile` adjusted so both app and games build contexts can read from `shared/` (likely by running the respective `yarn build` commands from the monorepo root so the relative imports resolve, rather than copying files).
- No new workspace tool. No new `package.json`.

## Tokens & shared CSS

### `shared/tokens.css` — three layers

```css
/* Layer 1: Primitives — raw values, not referenced by components */
:root {
  --color-slate-50:  #f8fafc;  --color-slate-900: #0f172a;
  --color-rust-500:  #c25e40;  --color-rust-600:  #a84d33;
  --color-green-500: #16a34a;  --color-amber-500: #eab308;
  /* full palette, spacing scale, font sizes, radii, shadows, durations */
}

/* Layer 2: Semantic tokens — what components reference */
:root {
  --color-bg:            var(--color-slate-50);
  --color-fg:            var(--color-slate-900);
  --color-primary:       var(--color-rust-500);
  --color-primary-hover: var(--color-rust-600);
  --color-correct:       var(--color-green-500);
  --color-present:       var(--color-amber-500);
  --color-absent:        #6b7280;
}

/* Layer 3: Dark theme — overrides semantic layer only */
:root[data-theme="dark"] {
  --color-bg: var(--color-slate-900);
  --color-fg: var(--color-slate-50);
}
```

Dark mode is **strictly explicit** via `data-theme="dark"` on the element. No `prefers-color-scheme` auto-detect — third-party embeds need predictable theming controlled by the host.

### `shared/styles/components.css` — BEM-lite classes

```css
.btn { /* base */ }
.btn-primary { background: var(--color-primary); color: #fff; }
.btn-ghost { /* … */ }
.btn:focus-visible { outline: 2px solid var(--color-primary); }

.modal, .modal-backdrop, .modal-panel { /* … */ }
.input, .input:invalid { /* … */ }
.keyboard-key, .keyboard-key[data-state="correct"] { /* … */ }
```

Naming: `.block`, `.block-variant`, `.block--modifier`. Predictable, no collision with Tailwind utilities, no preprocessing.

### Branding unification

Three mechanisms collapse to one vocabulary:

1. **Platform accent.** `app/src/app/layout.tsx` stops setting `--platform-accent`; instead it sets `--color-primary` directly on `<body>`. Cascades to every consumer of the semantic token.
2. **Per-puzzle branding.** `shared/game-lib/branding.js` exposes `applyBranding(hostEl, data)` — it writes the same semantic token names (`--color-primary`, `--color-correct`, etc.) to the game's host element. Puzzle branding is simply "override these specific semantic tokens on this instance."
3. **Dark/light.** A `data-theme` attribute on the host. Web Components receive a `theme` prop that maps to this attribute.

One source of truth, three cascade layers (platform → puzzle → theme), one token vocabulary.

## Shared game library

All Svelte-only, under `shared/game-lib/`.

### `timer.svelte.js`
Reactive timer using Svelte 5 runes. Exports `createTimer()` returning an object with `seconds`, `running`, `formatted`, `start()`, `stop()`, `reset()`. Replaces the duplicated timer blocks currently in each game.

### `api-client.js`
Exports `createApiClient({ apiUrl, token, userId })` returning `fetchGame(gameType, id)`, `fetchLatest(gameType)`, `submitResult(gameType, id, result)`. Token handling, error states, and retry policy centralised.

### `branding.js`
Canonical `applyBranding(hostEl, data)` — reads the puzzle branding object and writes semantic token overrides to the host element's inline style. Replaces the existing `clientThemes.js` and all per-game branding code.

### `i18n/`
Moved from `games/src/lib/i18n.js`. Structure: `index.js` (locale store, `t()`, `setLocale()`) plus `locales/*.json`. Games import from `../../shared/game-lib/i18n`. Per-game extension via a merged `local-translations.json` at setup time. App unchanged.

### `Keyboard.svelte`
Props: `layout`, `keyStates` (per-key visual state record), `onkey`, `onbackspace`, `onenter`, `disabled`. Dispatches the same events regardless of whether input came from physical keyboard or on-screen tap — games bind `window.keydown` and forward to `onkey`. Games that don't need visual key-state pass `keyStates={}`. Crossword uses only the event dispatch (no visual keyboard), word-game uses both, word-search uses visual for touch devices.

### `GameFinish.svelte`
Svelte 5 snippet-based overlay. Props: `open`, `time`, `onplayagain`, `onshare`. Named snippets: `stats` (game-specific metrics), `actions` (optional action-button override). Default shell: congratulation, formatted time, share button, play-again CTA.

### `GameShell.svelte`
Optional top-level wrapper. Props: `title`, `lang`, `theme`, `timer`, `showLanguageSwitch`. Named snippets: `game` (required), `finish` (game-specific stats for finish overlay). All header elements are optional — no title means no header region; no timer means no timer display. Renders header → game slot → internally-managed finish overlay. Games opt in; bespoke layouts skip the shell and compose `Keyboard` / `GameFinish` directly.

### Explicit YAGNI list
- Sound/audio, tutorial modals, pause/resume
- Game plugin system or runtime game registry
- Per-game-specific grids (`CrosswordGrid`, `WordTile`, `WordSearchCell`) — game-specific by definition, stay in each engine

## Migration sequence

Five phases, each a reviewable checkpoint.

### Phase 1 — Foundation
- Create `shared/` with `tokens.css`, `styles/components.css`, empty `game-lib/` skeleton.
- Extend `dev.sh` watcher glob to include `shared/**`.
- Update root `Dockerfile` so both app and games build contexts can read from `shared/`.
- Update `app/src/app/globals.css` and `games/src/app.css` to import the shared tokens.
- **Verify:** both dev and production builds pass; no visual changes (tokens initially equal current values).

### Phase 2 — Shared CSS classes + app adoption
- Populate `shared/styles/components.css` with `.btn`, `.modal`, `.input`, core primitives.
- Migrate app's `components/ui/` primitives to consume shared classes (`Button.tsx` becomes `<button className="btn btn-primary">`).
- **Verify:** visually click through the dashboard; no regressions.

### Phase 3 — Shared game lib + word-game migration
- Build `shared/game-lib/` modules: `timer`, `api-client`, `branding`, `i18n` (moved from `games/src/lib/i18n.js`).
- Build `Keyboard.svelte`, `GameFinish.svelte`, `GameShell.svelte`.
- Migrate `WordGame.svelte` to use all of them; delete dead duplicated code.
- **Verify:** play word-game end-to-end, visual parity with previous version. Any gaps in the abstractions get fixed here before Phase 4.

### Phase 4 — Crossword migration
- Migrate `CrosswordGame.svelte` (the most complex engine).
- Expected friction: physical-keyboard-only (no on-screen visual) must match the event contract; `CelebrationOverlay` becomes `GameFinish`; `CluesSidebar` stays game-specific.
- Any shared-lib changes made here are re-verified against word-game.
- **Verify:** play crossword end-to-end, visual parity; word-game still works.

### Phase 5 — Word-search + new-game scaffolding
- Migrate `WordSearchGame.svelte`. Should be smooth if Phases 3–4 got the abstractions right.
- Create `games/src/engines/_template/` (see next section).
- Write `.claude/skills/creating-a-new-game/SKILL.md`.
- **Verify:** play word-search end-to-end; template builds and runs as a Web Component.

**Verification policy:** no automated visual-regression tooling. Human verification between phases — click through the dashboard, play each migrated game, confirm no regressions. Type-check and lint pass.

## New-game scaffolding

### `games/src/engines/_template/`

A runnable "hello game" that exercises every shared primitive:

```
games/src/engines/_template/
├── TemplateGame.svelte           # trivial "click button, win" demo
├── TemplateGameElement.svelte    # Web Component wrapper
├── template-engine.js            # IIFE entry point
├── types.ts                      # puzzle shape, result shape
└── README.md                     # renaming contract
```

If the template ever stops building, the shared lib broke — the template is the canary.

**Renaming contract** (in the template's README):
1. Rename the directory (`_template` → `<your-game>`).
2. Rename the four files (`TemplateGame` → `YourGame`, etc.).
3. Add the Vite entry in `games/vite.config.js`.
4. Add the build script in `games/package.json`.
5. Implement game logic in `YourGame.svelte`. Everything around it (timer, API, branding, finish screen) already works.
6. Register the game type with the app's public API (schema + endpoint pattern per `.agents/workflows/database.md`).

### `.claude/skills/creating-a-new-game/SKILL.md`

A rigid, step-by-step skill. Frontmatter `name: creating-a-new-game`, `description: Use when adding a new game engine to brain-games`. Five ordered steps with mandatory verification at each:

1. Copy the template
2. Add Vite + package.json entries
3. Define the puzzle schema (both dialects — see `.agents/workflows/database.md`)
4. Add the public embed endpoint
5. Implement the game mechanic

The skill's load-bearing rule: only edit `<name>/YourGame.svelte`. Do NOT reinvent timer, keyboard, finish screen, or API client — they are in `shared/game-lib/`. If a shared abstraction doesn't fit, stop and discuss before forking.

### Rules & conventions updates

- `.agents/rules/coding.md` — add a section: "In `games/`, use `shared/game-lib/` primitives before writing a timer, keyboard, API call, or finish screen. In `app/`, use `shared/styles/components.css` classes for primitives already covered there (button, modal, input)."
- `.agents/workflows/new-game.md` — human-readable copy of the skill.
- Consolidate `.agent/` and `.agents/`: move `.agent/workflows/database.md` into `.agents/workflows/`, delete the now-empty `.agent/`.

## Success criteria

After Phase 5 completes:
- One source of truth for design tokens shared between app and games (`shared/tokens.css`).
- One shared class library applied identically on both sides (`shared/styles/components.css`).
- Three existing games consume the shared game library; each `*Game.svelte` file shrinks by an estimated 200–400 lines.
- A runnable template + a Claude skill for game #4.
- Platform accent, per-puzzle branding, and dark mode all speak the same semantic-token vocabulary.
- The directional rule — `shared/` imports from neither `app/` nor `games/` — is enforced by convention and code review.

## Risks & open questions

- **Vite / Next resolving relative imports across package boundaries.** Needs verification during Phase 1. If either fails, fall back to a shallow copy step in the respective build (same mechanism `dev.sh` already uses for IIFE bundles).
- **Shared-lib abstraction fit.** Word-game migration (Phase 3) is the first real pressure test. Expect at least one round of API adjustments before Phase 4.
- **`GameShell` opinionation.** If a future game doesn't fit the shell, the spec allows it to compose `Keyboard` + `GameFinish` directly and skip the shell. The shell is a convenience, not a cage.
- **Template drift.** Because `_template/` is a real buildable entry, it prevents drift automatically — if it stops compiling, CI catches it.
