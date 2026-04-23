# Shared Foundation + App Primitive Migration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a top-level `shared/` directory with a unified CSS-token source consumed by both the Next.js app and the Svelte games packages, then migrate the app's `Button`, `Modal`, and `Input` primitives to use a new shared BEM-lite class layer — proving the cross-framework sharing pattern before Plan B (game library + three game migrations + new-game scaffolding).

**Architecture:** `shared/tokens.css` is a primitives → semantic → theme three-layer CSS variable file. `shared/styles/components.css` defines BEM-lite class rules (`.btn`, `.btn-primary`, `.modal`, `.input`) built on top of those tokens. Both app and games `@import` the two CSS files via relative path; the Dockerfile is extended to `COPY shared/ /shared/` into each build stage, and `dev.sh`'s watcher is extended to include `shared/**`. No new yarn workspace. The directional rule — nothing in `shared/` imports from `app/` or `games/` — is enforced by convention.

**Tech Stack:**
- App: Next.js 16, React, Tailwind v4 (config in CSS via `@theme inline`), PostCSS
- Games: Svelte 5, Vite 7
- Shared: plain CSS (custom properties + BEM-lite classes)
- Tooling: bash (`dev.sh`), multi-stage Dockerfile, yarn 1.22

**This plan covers spec phases 1 and 2 only.** Plan B (game library + migrations + scaffolding) will be written as a separate document after this one is merged.

**Reference spec:** `docs/superpowers/specs/2026-04-22-shared-ui-and-game-lib-design.md`.

---

## Zero-visual-change principle (Phase 1)

Tasks 1–7 introduce tokens and wiring but change no rendered pixels. This is achieved by:
- Adding NEW semantic token names (`--color-primary`, `--color-bg`, etc.) without removing or reassigning any existing variable (`--platform-accent`, `--rust`, `--primary`, etc.).
- No component in app or games references the new tokens until Phase 2.
- Every new token's initial value equals the current hex value in use, so if later work *does* reference them, visuals still match.

## Migration principle (Phase 2)

Each primitive migration (Button, Modal, Input) must produce **visually identical output** to the current implementation. The test is: open dev server, inspect button/modal/input before and after migration, confirm no change. Tasks include the exact before/after code so this is mechanical, not interpretive.

---

## Task 1: Create the `shared/` directory skeleton

**Files:**
- Create: `shared/README.md`
- Create: `shared/tokens.css` (empty placeholder — populated in Task 2)
- Create: `shared/styles/components.css` (empty placeholder — populated in Task 8)
- Create: `shared/styles/reset.css` (minimal)
- Create: `shared/game-lib/.gitkeep` (empty — game-lib/ populated in Plan B)

- [ ] **Step 1: Create directories**

```bash
mkdir -p shared/styles shared/game-lib
touch shared/game-lib/.gitkeep
```

- [ ] **Step 2: Write `shared/README.md`**

```markdown
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
- `games/src/app.css` imports `../../shared/tokens.css` and
  `../../shared/styles/components.css`.
- Svelte files in `games/src/` import from `../../shared/game-lib/...` directly.

## Build / deploy

- `dev.sh`'s watcher includes `shared/**`.
- The root `Dockerfile` copies `shared/` into both the games-build and
  app-build stages via `COPY shared/ /shared/`.
```

- [ ] **Step 3: Write `shared/styles/reset.css`** (minimal baseline, nothing that conflicts with either package's existing reset)

```css
/* shared/styles/reset.css
 * Minimal cross-package baseline. Kept deliberately small — both app/ and
 * games/ have their own existing resets; this file is for anything that
 * should be uniform across both.
 */

*,
*::before,
*::after {
  box-sizing: border-box;
}
```

- [ ] **Step 4: Write empty placeholder files** (`shared/tokens.css` and `shared/styles/components.css`)

```css
/* shared/tokens.css
 * Populated in Task 2.
 */
```

```css
/* shared/styles/components.css
 * Populated starting in Task 8.
 */
```

- [ ] **Step 5: Commit**

```bash
git add shared/
git commit -m "feat(shared): initialize top-level shared/ directory skeleton"
```

---

## Task 2: Populate `shared/tokens.css` with the three-layer token system

**Files:**
- Modify: `shared/tokens.css`

Tokens are arranged in three layers: (1) raw primitives, (2) semantic aliases that components reference, (3) dark-theme overrides of the semantic layer only. Dark mode is activated by `data-theme="dark"` on any ancestor — no `prefers-color-scheme` auto-detect.

Values preserve current behavior: `--color-primary` = `#c25e40` matches both the current `--platform-accent` and the games' `--primary`. Navy tokens match the app's current `navy-900`/`navy-800`.

- [ ] **Step 1: Write `shared/tokens.css`**

```css
/* shared/tokens.css
 * Single source of truth for design tokens shared between app/ and games/.
 * See shared/README.md.
 */

/* ───────────────────────────────────────────
 * Layer 1 — Primitives.
 * Raw values. NOT referenced directly by components; components reference
 * the semantic layer below.
 * ─────────────────────────────────────────── */
:root {
  /* Neutrals */
  --color-white:     #ffffff;
  --color-slate-50:  #f8fafc;
  --color-slate-100: #f1f5f9;
  --color-slate-200: #e2e8f0;
  --color-slate-300: #cbd5e1;
  --color-slate-400: #94a3b8;
  --color-slate-500: #64748b;
  --color-slate-600: #475569;
  --color-slate-700: #334155;
  --color-slate-800: #1e293b;
  --color-slate-900: #0f172a;

  /* Brand accent (rust) */
  --color-rust-50:   #fcece8;
  --color-rust-500:  #c25e40;
  --color-rust-600:  #a0492d;

  /* Navy (neutral prominent action) */
  --color-navy-800:  #1e293b;
  --color-navy-900:  #0f172a;

  /* Accent gold (word-game "present" state) */
  --color-gold-500:  #dcb162;

  /* Feedback */
  --color-green-500: #16a34a;
  --color-amber-500: #eab308;
  --color-red-500:   #ef4444;
  --color-red-600:   #dc2626;
  --color-red-700:   #b91c1c;

  /* Radii */
  --radius-sm: 4px;
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;

  /* Shadows */
  --shadow-sm:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg:
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl:
    0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 8px 10px -6px rgb(0 0 0 / 0.1);

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;

  /* Font families — values stay identical to each package's current font stack */
  --font-sans:
    "IBM Plex Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
  --font-serif: "Playfair Display", serif;
  --font-mono: "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco,
    Consolas, monospace;
}

/* ───────────────────────────────────────────
 * Layer 2 — Semantic tokens.
 * What components reference. Overridden by Layer 3 for dark mode and by
 * per-puzzle branding at runtime (Plan B).
 * ─────────────────────────────────────────── */
:root {
  /* Surface */
  --color-bg:             var(--color-white);
  --color-bg-offset:      var(--color-slate-50);
  --color-fg:             var(--color-slate-900);
  --color-fg-muted:       var(--color-slate-500);

  /* Borders */
  --color-border:         var(--color-slate-200);
  --color-border-strong:  var(--color-slate-300);

  /* Brand / accent */
  --color-primary:        var(--color-rust-500);
  --color-primary-hover:  var(--color-rust-600);
  --color-primary-muted:  var(--color-rust-50);

  /* Neutral prominent action (app's "primary" button style) */
  --color-action:         var(--color-navy-900);
  --color-action-hover:   var(--color-navy-800);

  /* Word-game states */
  --color-correct:        var(--color-primary);
  --color-present:        var(--color-gold-500);
  --color-absent:         var(--color-slate-400);

  /* Feedback */
  --color-danger:         var(--color-red-600);
  --color-danger-hover:   var(--color-red-700);
  --color-success:        var(--color-green-500);
  --color-warning:        var(--color-amber-500);

  /* Focus ring */
  --color-focus-ring:     var(--color-primary);
}

/* ───────────────────────────────────────────
 * Layer 3 — Dark theme.
 * Overrides Layer 2 only. Activated via `data-theme="dark"`.
 * ─────────────────────────────────────────── */
:root[data-theme="dark"],
[data-theme="dark"] {
  --color-bg:             var(--color-slate-900);
  --color-bg-offset:      var(--color-slate-800);
  --color-fg:             var(--color-slate-50);
  --color-fg-muted:       var(--color-slate-400);

  --color-border:         var(--color-slate-700);
  --color-border-strong:  var(--color-slate-600);

  --color-action:         var(--color-slate-50);
  --color-action-hover:   var(--color-slate-200);
}
```

- [ ] **Step 2: Verify the file parses (no build wiring yet — this just ensures the syntax is valid CSS)**

Run:
```bash
node -e "const css = require('fs').readFileSync('shared/tokens.css', 'utf8'); console.log('lines:', css.split(String.fromCharCode(10)).length); console.log('has :root:', css.includes(':root'));"
```
Expected output: shows line count > 100 and `has :root: true`.

- [ ] **Step 3: Commit**

```bash
git add shared/tokens.css
git commit -m "feat(shared): add three-layer design token system"
```

---

## Task 3: Import `shared/tokens.css` into the app

`app/src/app/globals.css` will import the shared tokens at the top, BEFORE its existing `@theme inline` block. The app's existing variables (`--platform-accent`, `--rust`, `--primary`, etc.) stay in place unchanged — they now happen to coexist with the new `--color-*` tokens. No component migration happens in this task; zero visual change expected.

**Files:**
- Modify: `app/src/app/globals.css` (insert one `@import` near the top)

- [ ] **Step 1: Edit `app/src/app/globals.css`**

At the very top of the file, ABOVE the existing `@import "tailwindcss";`, add:

```css
@import "../../../shared/tokens.css";
```

(The relative path is from `app/src/app/globals.css` → up three levels to the repo root → `shared/tokens.css`.)

The file's first four lines should now read:
```css
@import "../../../shared/tokens.css";
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));
```

Do NOT modify any other line in this file yet.

- [ ] **Step 2: Verify Next.js build still succeeds**

Run:
```bash
cd app && yarn build
```
Expected: build succeeds. If it fails with a module-resolution error about `../../../shared/tokens.css`, the relative path is wrong — confirm `shared/tokens.css` exists at the repo root.

- [ ] **Step 3: Start dev server and verify no visual regressions**

Run:
```bash
cd app && yarn dev
```
Open `http://localhost:3000/login` (or any page). Verify: page loads normally, colors unchanged, fonts unchanged. Kill dev server with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add app/src/app/globals.css
git commit -m "feat(app): import shared/tokens.css into globals"
```

---

## Task 4: Import `shared/tokens.css` into the games package

`games/src/app.css` will similarly import the shared tokens at the top. The games' existing variables stay unchanged. No component migration happens; zero visual change expected.

**Files:**
- Modify: `games/src/app.css` (insert one `@import` near the top)

- [ ] **Step 1: Edit `games/src/app.css`**

At the very top of the file, BEFORE the Google Fonts imports, add:

```css
@import "../../shared/tokens.css";
```

(The relative path is from `games/src/app.css` → up two levels to the repo root → `shared/tokens.css`.)

The file's first four lines should now read:
```css
@import "../../shared/tokens.css";
/* Rustycogs.io Design System */

/* Google Fonts */
```

Do NOT modify any other line.

- [ ] **Step 2: Verify the Vite build still succeeds**

Run:
```bash
cd games && yarn build:all
```
Expected: build succeeds. Outputs appear in `games/dist/`. If relative path resolution fails, confirm `shared/tokens.css` exists at the repo root.

- [ ] **Step 3: Start games dev server and verify no visual regressions**

Run:
```bash
cd games && yarn dev
```
Open `http://localhost:5173/`. Play a game briefly. Verify: colors unchanged, layout unchanged, fonts unchanged. Kill dev server with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add games/src/app.css
git commit -m "feat(games): import shared/tokens.css into app.css"
```

---

## Task 5: Extend `dev.sh` watcher to include `shared/**`

The watcher currently hashes all `.svelte`, `.js`, `.css` files under `games/src`. When `shared/` changes we need a games rebuild too (since games import from shared). We also want a signal for the app, but Next.js' dev server hot-reloads CSS automatically once the import chain is wired — so no app-side watcher change is needed.

**Files:**
- Modify: `dev.sh:65-80` (the `watch_games` function)

- [ ] **Step 1: Read the current `watch_games` function**

Run:
```bash
sed -n '60,85p' dev.sh
```
Confirm lines match the function shown in the plan header. The function contains one `find` command.

- [ ] **Step 2: Edit `dev.sh` to extend the watch glob**

Replace the current `find` command in `watch_games`:

```bash
CURRENT_HASH=$(find "$ROOT_DIR/games/src" -type f -name '*.svelte' -o -name '*.js' -o -name '*.css' | sort | xargs cat 2>/dev/null | shasum)
```

with:

```bash
CURRENT_HASH=$(find "$ROOT_DIR/games/src" "$ROOT_DIR/shared" -type f \( -name '*.svelte' -o -name '*.js' -o -name '*.css' \) | sort | xargs cat 2>/dev/null | shasum)
```

Two changes: (a) added `"$ROOT_DIR/shared"` to the find roots, (b) grouped the `-name` predicates in parentheses so they apply across both roots.

- [ ] **Step 3: Verify the find command works**

Run (manually, to test):
```bash
find "$PWD/games/src" "$PWD/shared" -type f \( -name '*.svelte' -o -name '*.js' -o -name '*.css' \) | sort | head -20
```
Expected: list includes files from both `games/src/` and `shared/`.

- [ ] **Step 4: Test the watcher end-to-end**

Run:
```bash
./dev.sh dev
```
In another terminal, touch a shared file:
```bash
touch shared/tokens.css
```
Wait ~5 seconds. The dev.sh output should show "Game source changed — rebuilding…". Kill dev.sh with Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add dev.sh
git commit -m "build: extend dev.sh watcher to include shared/**"
```

---

## Task 6: Update root `Dockerfile` to copy `shared/` into build stages

Both the games-build and app-build stages import from `shared/` via relative paths. In the current Dockerfile, `games-build` has `WORKDIR /games` and `COPY games/ .`, so a relative import from `games/src/app.css` to `../../shared/tokens.css` resolves to `/shared/tokens.css` — which doesn't exist yet. Same for `app-build` (WORKDIR `/app`, import path resolves to `/shared/tokens.css`). Solution: `COPY shared/ /shared/` into both stages.

**Files:**
- Modify: `Dockerfile` (two inserts — one per build stage)

- [ ] **Step 1: Edit the games-build stage**

After the existing line:
```dockerfile
COPY games/ .
```
(around line 10 of the Dockerfile), insert on the next line:
```dockerfile
COPY shared/ /shared/
```

- [ ] **Step 2: Edit the app-build stage**

After the existing line:
```dockerfile
COPY app/ .
```
(around line 27 of the Dockerfile), insert on the next line:
```dockerfile
COPY shared/ /shared/
```

- [ ] **Step 3: Verify the Dockerfile builds**

Run:
```bash
docker build -t brain-games:test -f Dockerfile .
```
Expected: build succeeds through both games-build and app-build stages. The `RUN yarn build:app && yarn build && …` step in games-build must succeed (it proves Vite resolves `../../shared/tokens.css`). The `RUN … && yarn build` in app-build must succeed (it proves Next/PostCSS resolves `../../../shared/tokens.css`).

If either build fails with a "file not found" error on `shared/tokens.css`, verify the `COPY shared/ /shared/` line is placed AFTER the respective `COPY games/ .` or `COPY app/ .` line (COPY order matters for layer caching but not for file presence; placement after is stylistically correct because it groups the shared/ copy with the source copy).

- [ ] **Step 4: Commit**

```bash
git add Dockerfile
git commit -m "build: copy shared/ into games-build and app-build Docker stages"
```

---

## Task 7: Phase 1 verification

Phase 1 is complete. Verify the full dev + production path works and nothing visible changed.

- [ ] **Step 1: Run `./dev.sh dev` and smoke-test the dashboard**

Run:
```bash
./dev.sh dev
```
Open `http://localhost:3000/` and:
- Click through landing, login, dashboard (with a test admin user if one is seeded)
- Verify: no color or layout change vs. pre-plan
- Open DevTools → Elements → `<html>` → Computed. Confirm `--color-primary` is defined and resolves to `#c25e40`.

- [ ] **Step 2: Smoke-test a game in dev**

With `./dev.sh dev` still running, in a browser open:
- `http://localhost:3000/play?type=crossword` (or use an actual puzzle id)
- Or: `http://localhost:5173/` for the standalone games dev server

Verify: game loads, colors and fonts unchanged. Open DevTools → `<html>` → Computed. Confirm `--color-primary` is defined on the page.

Kill dev server.

- [ ] **Step 3: Run the full production build**

Run:
```bash
./dev.sh build
```
Expected: build succeeds. `app/public/crossword-engine.iife.js` (and the other two) exist and have a recent mtime.

- [ ] **Step 4: Tag a checkpoint commit (optional)**

No new changes — this is a sanity task. If everything above passed, Phase 1 is done.

```bash
git log --oneline -6
```
Expected: commits from Tasks 1–6 in order; working tree clean.

---

## Task 8: Write `.btn` classes in `shared/styles/components.css`

Begins Phase 2. Defines the `.btn` class and its variants in a way that renders visually identical to the current `Button.tsx` output. Variants:

- `.btn` — base (`inline-flex`, font weight, radius, transition, disabled state)
- `.btn-primary` — navy (matches current `Button variant="primary"`)
- `.btn-secondary` — slate-100 (matches current secondary)
- `.btn-outline` — white with slate-300 border (matches current outline)
- `.btn-danger` — red (matches current danger)
- `.btn-ghost` — transparent (matches current ghost)
- `.btn--sm` / `.btn--md` — size modifiers (the current Button has two sizes)

These classes use the new semantic tokens (`--color-action`, `--color-primary`, `--color-danger`, etc.) so future theme changes cascade automatically.

**Files:**
- Modify: `shared/styles/components.css`

- [ ] **Step 1: Replace the placeholder contents of `shared/styles/components.css`**

```css
/* shared/styles/components.css
 * BEM-lite shared component classes consumed by both app/ and games/.
 * Built on top of shared/tokens.css.
 */

/* ───────────────────────────────────────────
 * Button
 * ─────────────────────────────────────────── */

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-weight: 500;
  border-radius: var(--radius-sm);
  transition: background-color 0.15s ease, color 0.15s ease,
    box-shadow 0.15s ease, border-color 0.15s ease;
  cursor: pointer;
  border: 0;
  font-family: inherit;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}

/* Sizes */
.btn--sm { font-size: 12px; padding: 4px 12px; }
.btn--md { font-size: 14px; padding: 8px 16px; }

/* Variants */
.btn-primary {
  background: var(--color-action);
  color: var(--color-white);
  box-shadow: var(--shadow-sm);
}
.btn-primary:hover:not(:disabled) {
  background: var(--color-action-hover);
}

.btn-secondary {
  background: var(--color-slate-100);
  color: var(--color-fg);
}
.btn-secondary:hover:not(:disabled) {
  background: var(--color-slate-200);
}

.btn-outline {
  background: var(--color-white);
  color: var(--color-fg);
  border: 1px solid var(--color-border-strong);
}
.btn-outline:hover:not(:disabled) {
  background: var(--color-bg-offset);
}

.btn-danger {
  background: var(--color-danger);
  color: var(--color-white);
}
.btn-danger:hover:not(:disabled) {
  background: var(--color-danger-hover);
}

.btn-ghost {
  background: transparent;
  color: var(--color-fg-muted);
}
.btn-ghost:hover:not(:disabled) {
  background: var(--color-slate-100);
  color: var(--color-fg);
}
```

- [ ] **Step 2: Wire `shared/styles/components.css` into the app**

Edit `app/src/app/globals.css`. Below the existing `@import "../../../shared/tokens.css";` line (which was added in Task 3), add:

```css
@import "../../../shared/styles/components.css";
```

The top of the file should now read:
```css
@import "../../../shared/tokens.css";
@import "../../../shared/styles/components.css";
@import "tailwindcss";
@import "tw-animate-css";
```

- [ ] **Step 3: Verify the CSS parses and builds**

Run:
```bash
cd app && yarn build
```
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add shared/styles/components.css app/src/app/globals.css
git commit -m "feat(shared): add .btn class layer and wire into app"
```

---

## Task 9: Migrate `Button.tsx` to use shared `.btn` classes

**Files:**
- Modify: `app/src/components/ui/Button.tsx` (full rewrite of className logic)

- [ ] **Step 1: Replace `Button.tsx` contents**

Full replacement (preserves the public API — same props, same children, same import paths for consumers):

```tsx
import { ReactNode } from "react"

type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "ghost"

interface ButtonProps {
  variant?: ButtonVariant
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: "button" | "submit"
  className?: string
  icon?: string
  size?: "sm" | "md"
}

const variantClass: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  outline: "btn-outline",
  danger: "btn-danger",
  ghost: "btn-ghost",
}

export const Button = ({
  variant = "primary",
  children,
  onClick,
  disabled,
  type = "button",
  className = "",
  icon,
  size = "md",
}: ButtonProps) => {
  const sizeClass = size === "sm" ? "btn--sm" : "btn--md"
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn ${variantClass[variant]} ${sizeClass} ${className}`.trim()}
    >
      {icon && (
        <span className="material-symbols-outlined text-sm">{icon}</span>
      )}
      {children}
    </button>
  )
}
```

Notes on intentional differences from the original file:
- No semicolons (per `.agents/rules/coding.md`).
- The `buttonStyles` Record was replaced by `variantClass` which maps to shared class names instead of Tailwind utility strings.
- `sizeClass` maps to `btn--sm` / `btn--md`.
- The icon `<span>` still uses Tailwind `text-sm` — that's an icon sizing concern, not a button-primitive concern, so it stays as Tailwind.
- Public API (props, exports, filename) is identical, so no consumer needs to change.

- [ ] **Step 2: Type-check and lint the app**

Run:
```bash
cd app && yarn lint
```
Expected: no errors introduced.

Run:
```bash
cd app && yarn build
```
Expected: build succeeds, no TypeScript errors.

- [ ] **Step 3: Visual verification (manual)**

Run:
```bash
./dev.sh dev
```
Open `http://localhost:3000/login`. The login page has submit buttons — confirm they render as navy with white text, same as before.

Navigate to `/dashboard/*` pages (BrandingContent, DashboardContent, TeamContent, SettingsContent, KeysContent) and confirm buttons in each variant (`primary`, `secondary`, `outline`, `danger`, `ghost`) look unchanged. The `danger` and `ghost` variants may only appear in modal contexts — open a modal on those pages to see.

Visual parity checklist:
- Primary: navy background, white text, subtle shadow, hover slightly darker navy ✓
- Secondary: pale slate background, dark text, hover slightly darker slate ✓
- Outline: white background, slate-300 border, dark text ✓
- Danger: red background, white text ✓
- Ghost: transparent background, muted text, hover pale slate ✓

Kill dev server. If any variant is visually off, re-check Task 8's CSS values against the original Tailwind classes in the old `Button.tsx` (preserved here for reference):

- Original primary: `bg-navy-900 hover:bg-navy-800 text-white shadow-sm focus:ring-2 focus:ring-offset-1 focus:ring-navy-900`
- Original secondary: `bg-slate-100 hover:bg-slate-200 text-navy-900 focus:ring-2 focus:ring-offset-1 focus:ring-slate-200`
- Original outline: `bg-white hover:bg-slate-50 border border-[#cbd5e1] text-navy-900 focus:ring-2 focus:ring-offset-1 focus:ring-slate-200`
- Original danger: `bg-red-600 hover:bg-red-700 text-white focus:ring-2 focus:ring-offset-1 focus:ring-red-500`
- Original ghost: `bg-transparent hover:bg-slate-100 text-slate-600 hover:text-navy-900`

Adjust CSS in Task 8's output to match if needed, then re-verify.

- [ ] **Step 4: Commit**

```bash
git add app/src/components/ui/Button.tsx
git commit -m "refactor(app): migrate Button to shared .btn classes"
```

---

## Task 10: Add `.modal` classes to `shared/styles/components.css`

**Files:**
- Modify: `shared/styles/components.css` (append)

- [ ] **Step 1: Append to `shared/styles/components.css`**

```css
/* ───────────────────────────────────────────
 * Modal
 * ─────────────────────────────────────────── */

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 0.4);
}

.modal-panel {
  background: var(--color-bg);
  border-radius: var(--radius-sm);
  width: 100%;
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}
.modal-panel--sm { max-width: 24rem; }  /* matches Tailwind max-w-sm */
.modal-panel--md { max-width: 28rem; }  /* matches Tailwind max-w-md */
.modal-panel--lg { max-width: 32rem; }  /* matches Tailwind max-w-lg */

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-fg);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.modal-title h1,
.modal-title h2,
.modal-title h3 {
  /* Reset UA heading font-size so the title inherits from .modal-title. */
  font: inherit;
  margin: 0;
}

.modal-close {
  padding: 0.25rem;
  color: var(--color-fg-muted);
  background: transparent;
  border: 0;
  cursor: pointer;
  transition: color 0.15s ease;
}
.modal-close:hover { color: var(--color-fg); }

.modal-body {
  flex: 1;
  overflow-y: auto;
}
```

- [ ] **Step 2: Verify app build still succeeds**

```bash
cd app && yarn build
```
Expected: success.

- [ ] **Step 3: Commit**

```bash
git add shared/styles/components.css
git commit -m "feat(shared): add .modal class layer"
```

---

## Task 11: Migrate `Modal.tsx` to use shared `.modal-*` classes

**Files:**
- Modify: `app/src/components/ui/Modal.tsx`

- [ ] **Step 1: Replace `Modal.tsx` contents**

```tsx
import { ReactNode } from "react"

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  icon?: string
  children: ReactNode
  size?: "sm" | "md" | "lg"
}

const sizeClass: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "modal-panel--sm",
  md: "modal-panel--md",
  lg: "modal-panel--lg",
}

export const Modal = ({
  open,
  onClose,
  title,
  icon,
  children,
  size = "md",
}: ModalProps) => {
  if (!open) return null

  return (
    <div className="modal-backdrop">
      <div className={`modal-panel ${sizeClass[size]}`}>
        {title && (
          <div className="modal-header">
            <div className="modal-title">
              {icon && <span className="material-symbols-outlined">{icon}</span>}
              <h2>{title}</h2>
            </div>
            <button onClick={onClose} className="modal-close">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check and build**

```bash
cd app && yarn lint && yarn build
```
Expected: success.

- [ ] **Step 3: Visual verification (manual)**

Run `./dev.sh dev`. Navigate to a page that opens a modal (e.g. `/dashboard/team` has an invite modal; `/dashboard/branding` has a settings dialog). Open the modal and verify:
- Full-screen backdrop with ~40% black overlay ✓
- White panel, centered, max-width ~28rem for default (md) ✓
- Header with icon + title, divider beneath ✓
- Close X button (muted, darker on hover) ✓
- Content area scrolls if content exceeds 90vh ✓

Kill dev server.

- [ ] **Step 4: Commit**

```bash
git add app/src/components/ui/Modal.tsx
git commit -m "refactor(app): migrate Modal to shared .modal-* classes"
```

---

## Task 12: Add `.input` and `.field-label` classes to `shared/styles/components.css`

**Files:**
- Modify: `shared/styles/components.css` (append)

- [ ] **Step 1: Append to `shared/styles/components.css`**

```css
/* ───────────────────────────────────────────
 * Input / Form field
 * ─────────────────────────────────────────── */

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-fg-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.input {
  width: 100%;
  height: 42px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border-strong);
  color: var(--color-fg);
  font-size: 15px;
  padding: 0 0.75rem;
  background: var(--color-bg);
  font-family: inherit;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.input::placeholder { color: var(--color-slate-400); }
.input:focus {
  outline: none;
  border-color: var(--color-action);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-action) 10%, transparent);
}
.input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

- [ ] **Step 2: Verify build**

```bash
cd app && yarn build
```

- [ ] **Step 3: Commit**

```bash
git add shared/styles/components.css
git commit -m "feat(shared): add .input and .field-label class layer"
```

---

## Task 13: Migrate `Input.tsx` to use shared `.input` / `.field-label` classes

**Files:**
- Modify: `app/src/components/ui/Input.tsx`

- [ ] **Step 1: Replace `Input.tsx` contents**

```tsx
import { forwardRef } from "react"

interface InputProps {
  label?: string
  id?: string
  type?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  disabled?: boolean
  required?: boolean
  minLength?: number
  className?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      id,
      type = "text",
      value,
      onChange,
      placeholder,
      disabled,
      required,
      minLength,
      className = "",
    },
    ref,
  ) => (
    <div className="field">
      {label && (
        <label className="field-label" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        minLength={minLength}
        className={`input ${className}`.trim()}
      />
    </div>
  ),
)

Input.displayName = "Input"
```

- [ ] **Step 2: Type-check and build**

```bash
cd app && yarn lint && yarn build
```
Expected: success.

- [ ] **Step 3: Visual verification (manual)**

Run `./dev.sh dev`. Navigate to pages that use inputs:
- `/login` — email, password fields
- `/dashboard/settings` — input fields with labels
- `/dashboard/branding` — branding-name input

Verify:
- 42px tall, rounded corners ✓
- Slate-300 border, darkens to navy on focus ✓
- 1px navy focus ring via `box-shadow` ✓
- Placeholder is slate-400 ✓
- Label: tiny uppercase slate-500 ✓
- Disabled: ~60% opacity ✓

Kill dev server.

- [ ] **Step 4: Commit**

```bash
git add app/src/components/ui/Input.tsx
git commit -m "refactor(app): migrate Input to shared .input/.field-label classes"
```

---

## Task 14: Final Phase 2 verification and wrap-up

- [ ] **Step 1: Full production build**

Run:
```bash
./dev.sh build
```
Expected: succeeds. Both app and games build artifacts produced.

- [ ] **Step 2: End-to-end dev smoke test**

Run `./dev.sh dev`. In a browser, click through:
- Landing page
- `/login`, `/register`
- `/dashboard/*` — all five content pages
- At least one modal
- At least one game (`/play?type=crossword` etc.)

For each, verify no visual regressions vs. pre-plan state. Kill dev server.

- [ ] **Step 3: Commit history review**

Run:
```bash
git log --oneline -16
```
Expected: clean sequence of 14 commits — one per task (with two commits for Tasks 1 and 5 if they included the step-5 commit as their only commit).

- [ ] **Step 4: Update `.agents/rules/coding.md`** with the new shared-layer rule

Append the following section to `.agents/rules/coding.md`:

```markdown
## Shared UI layer (2026-04)

A top-level `shared/` directory holds CSS tokens and BEM-lite component classes
consumed by both `app/` and `games/`. See `shared/README.md`.

**In `app/`:**
- For primitives that exist in `shared/styles/components.css` (currently `.btn`,
  `.modal`, `.input`, `.field-label`), prefer shared classes over bespoke
  Tailwind utility chains.
- Tailwind utilities remain first choice for dashboard-specific layout,
  spacing, typography, and one-off visual details.

**In `shared/`:**
- Nothing in `shared/` may import from `app/` or `games/`. `shared/` is a leaf.

**When adding a new shared class:** put the styles in
`shared/styles/components.css`, use semantic tokens (`var(--color-primary)`,
etc.) — never raw hex — and verify the class renders identically in both packages.
```

- [ ] **Step 5: Commit rule update**

```bash
git add .agents/rules/coding.md
git commit -m "docs(rules): add shared UI layer section to coding rules"
```

- [ ] **Step 6: Done**

Plan A complete. Plan B (game library, three-game migrations, new-game scaffolding) will be written as a separate plan document and should only begin after this plan's changes are merged to main.

---

## What's next

Plan B (separate document, to be written next) covers spec phases 3–5:
- Build `shared/game-lib/` modules (timer, api-client, branding, i18n, Keyboard, GameFinish, GameShell).
- Migrate `WordGame.svelte`, `CrosswordGame.svelte`, `WordSearchGame.svelte` to use the shared library.
- Create `games/src/engines/_template/` scaffold.
- Write `.claude/skills/creating-a-new-game/SKILL.md`.
- Consolidate `.agent/` and `.agents/` directories.

Plan B's abstractions may be informed by lessons learned during Plan A's adoption — in particular, the exact semantic-token vocabulary in `shared/tokens.css` may evolve as real use cases surface. That's expected and why the plans are sequenced.
