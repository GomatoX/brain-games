# Shared Game-Lib Foundations + WordGame Migration — Implementation Plan (Plan B1)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the Svelte-only `shared/game-lib/` directory with three foundational modules (`i18n`, `branding`, `api-client`) and migrate `WordGame.svelte` to consume them. These modules are the subset of the design spec's Phase 3 that `WordGame` actually validates — timer, on-screen keyboard, and finish-screen abstractions are deferred to Plan B2 where Crossword and WordSearch will pressure-test them.

**Architecture:** Move the two existing generic modules (`games/src/lib/i18n.js` → `shared/game-lib/i18n/`, `games/src/lib/clientThemes.js` → `shared/game-lib/branding.js`) to the shared location and update all three games' import paths (`WordGame.svelte`, `CrosswordGame.svelte`, `WordSearchGame.svelte`). Add a new small `shared/game-lib/api-client.js` that encapsulates the "GET `/api/public/games?type=X&id=Y` with optional Bearer token" pattern plus the public-config fetch. Migrate only `WordGame.svelte` to consume it. Public CSS-variable vocabulary used by `applyBranding` stays unchanged in this plan (existing games' scoped CSS still references `--accent`, `--correct`, etc.) — aligning branding field names with the new `shared/tokens.css` vocabulary is explicitly out of scope and belongs in Plan B2 or later.

**Tech Stack:**
- Games: Svelte 5 + Vite 7 (IIFE + SPA builds)
- Modules: plain ES modules, Svelte stores (`writable`, `derived`)
- JSON locales imported via Vite's native JSON support

**This plan covers spec Phase 3 *in part*.** Plan B2 (Crossword + WordSearch migrations, new-game template/skill, `.agent`/`.agents` consolidation, plus the timer/Keyboard/GameFinish/GameShell Svelte components) will be written as a separate document after this one is merged.

**Reference documents:**
- Spec: `docs/superpowers/specs/2026-04-22-shared-ui-and-game-lib-design.md`
- Plan A (shipped): `docs/superpowers/plans/2026-04-22-shared-foundation-and-app-migration.md`

---

## Scope-deferred decisions (recorded once, not repeated)

1. **Timer, Keyboard, GameFinish, GameShell are NOT built in this plan.** `WordGame` has none of them; building speculative abstractions against zero consumers violates YAGNI. Plan B2 constructs each one alongside the specific game that drives its design.

2. **Branding field map (`accent_color` → `--accent`, `correct_color` → `--correct`, etc.) is preserved verbatim** when `clientThemes.js` moves to `shared/game-lib/branding.js`. Games' existing internal CSS depends on those variable names. Re-aligning puzzle-branding field names to the new semantic tokens (`--color-primary`, `--color-correct`) is a separate concern — do it when (a) the game's internal CSS is migrated to shared tokens anyway, and (b) we're prepared to coordinate the schema change across the app's branding-edit UI.

3. **WordGame does not submit results to the server.** The API client exposes only `fetchGame` and `fetchPublicConfig` — `submitResult` is added in Plan B2 when a game that actually submits drives the design.

4. **Branch:** create `feat/shared-game-lib` from fresh `main` (which already contains Plan A's merge `6c0e93f`). All commits below land on that branch.

---

## Pre-task setup

- [ ] **Set up branch**

Run:
```bash
cd /home/mindaugas/projects/brain-games
git checkout main
git pull --ff-only origin main
git checkout -b feat/shared-game-lib
```
Expected: branch `feat/shared-game-lib` tracks off `main` at `6c0e93f` (or later if main has advanced).

- [ ] **Commit the plan document**

Run:
```bash
git add docs/superpowers/plans/2026-04-23-shared-game-lib-foundations.md
git commit -m "docs: add Plan B1 for shared game-lib foundations"
```

---

## File Structure

Files created / moved / modified, grouped by responsibility:

**Created in `shared/game-lib/`:**
- `shared/game-lib/i18n/index.js` — re-export from moved `i18n.js` (locale store + `t` derived store)
- `shared/game-lib/i18n/locales/en.json` — moved from `games/src/locales/en.json`
- `shared/game-lib/i18n/locales/lt.json` — moved from `games/src/locales/lt.json`
- `shared/game-lib/branding.js` — moved verbatim from `games/src/lib/clientThemes.js`
- `shared/game-lib/api-client.js` — new thin wrapper around `fetch`

**Deleted / removed:**
- `games/src/lib/i18n.js` (moved to shared)
- `games/src/lib/clientThemes.js` (moved to shared)
- `games/src/locales/en.json` (moved to shared)
- `games/src/locales/lt.json` (moved to shared)

**Import-path updates (imports only — no logic changes):**
- `games/src/lib/WordGame.svelte` (2 import lines + API-call refactor in Task 4)
- `games/src/lib/CrosswordGame.svelte` (2 import lines only)
- `games/src/lib/WordSearchGame.svelte` (2 import lines only)

This plan deliberately touches all three game files, but only `WordGame.svelte` is refactored beyond import-path updates. Crossword and WordSearch remain functionally identical — this is a foundation-laying plan, not a games rewrite.

---

## Verification policy

As with Plan A, there is no automated visual-regression tooling. Each task includes:
- `yarn build:all` in `games/` (confirms Vite can resolve the new relative paths)
- `yarn build` in `app/` (confirms nothing upstream broke)
- For tasks that change behavior: `./dev.sh dev` and manual browser smoke-test of the affected game(s)

Type-check passes are implicit from the Vite build. Lint passes are confirmed at the end.

---

## Task 1: Move `i18n.js` + locales to `shared/game-lib/i18n/`

Moves the existing module (25 lines) and both locale JSON files. The module's logic is unchanged. All three games' imports are updated.

**Files:**
- Create: `shared/game-lib/i18n/index.js`
- Create: `shared/game-lib/i18n/locales/en.json`
- Create: `shared/game-lib/i18n/locales/lt.json`
- Delete: `games/src/lib/i18n.js`
- Delete: `games/src/locales/en.json`
- Delete: `games/src/locales/lt.json`
- Modify: `games/src/lib/WordGame.svelte:3` (import path)
- Modify: `games/src/lib/CrosswordGame.svelte` (import path — find line with `from "./i18n.js"`)
- Modify: `games/src/lib/WordSearchGame.svelte` (import path — same)

- [ ] **Step 1: Create the new `shared/game-lib/i18n/` directory and move the locale JSONs**

Run:
```bash
cd /home/mindaugas/projects/brain-games
mkdir -p shared/game-lib/i18n/locales
git mv games/src/locales/en.json shared/game-lib/i18n/locales/en.json
git mv games/src/locales/lt.json shared/game-lib/i18n/locales/lt.json
```
Expected: both files moved (tracked in git). `games/src/locales/` still exists but is empty.

- [ ] **Step 2: Move `i18n.js` to `shared/game-lib/i18n/index.js` and fix its relative import paths for the locale files**

The original relative path from `games/src/lib/i18n.js` was `../locales/en.json` / `../locales/lt.json` (up from `lib/` to `src/`, into `locales/`). After the move, the new file is at `shared/game-lib/i18n/index.js` and the locales are at `shared/game-lib/i18n/locales/` — so the relative path becomes `./locales/en.json` / `./locales/lt.json`.

Run:
```bash
git mv games/src/lib/i18n.js shared/game-lib/i18n/index.js
```

Edit `shared/game-lib/i18n/index.js` so the complete content is:

```javascript
import { writable, derived } from "svelte/store";
import en from "./locales/en.json";
import lt from "./locales/lt.json";

const translations = { en, lt };

export const locale = writable("lt");

export const t = derived(locale, ($locale) => {
  const dict = translations[$locale] || translations.lt;

  /**
   * Resolve a dotted key like "crossword.across"
   * from the active locale dictionary.
   */
  return function translate(key) {
    const parts = key.split(".");
    let value = dict;
    for (const part of parts) {
      value = value?.[part];
    }
    return typeof value === "string" ? value : key;
  };
});
```

Only the two `import` lines at the top change; everything below is identical to the original.

- [ ] **Step 3: Update `WordGame.svelte` import (line 3 of that file)**

Open `games/src/lib/WordGame.svelte`. Replace:
```javascript
import { locale, t } from "./i18n.js";
```
with:
```javascript
import { locale, t } from "../../../shared/game-lib/i18n/index.js";
```
(The relative path is: from `games/src/lib/` up to the monorepo root, then down into `shared/game-lib/i18n/`.)

- [ ] **Step 4: Update `CrosswordGame.svelte` import**

Open `games/src/lib/CrosswordGame.svelte`. Search for `from "./i18n.js"` — there should be exactly one hit. Replace the ENTIRE matching import line to import from the new shared path:
```javascript
import { locale, t } from "../../../shared/game-lib/i18n/index.js";
```
Preserve the set of imported names exactly as they are in the file (don't drop names if the file also imports something else from `i18n.js`).

- [ ] **Step 5: Update `WordSearchGame.svelte` import**

Open `games/src/lib/WordSearchGame.svelte`. Same as Step 4 — replace the single `from "./i18n.js"` line to:
```javascript
import { locale, t } from "../../../shared/game-lib/i18n/index.js";
```
Preserve the imported-names list from the original line.

- [ ] **Step 6: Remove the now-empty `games/src/locales/` directory**

Run:
```bash
rmdir games/src/locales
```
Expected: directory gone. If `rmdir` fails because the directory is non-empty, something was missed — stop and investigate before continuing.

- [ ] **Step 7: Build games to verify**

Run:
```bash
cd games && yarn build:all
```
Expected: Vite succeeds for all three modes (`lib`, `wordgame`, `wordsearch`). JSON imports resolve. No "could not resolve" errors.

- [ ] **Step 8: Commit**

```bash
cd /home/mindaugas/projects/brain-games
git add shared/game-lib/i18n games/src/lib/WordGame.svelte games/src/lib/CrosswordGame.svelte games/src/lib/WordSearchGame.svelte
git commit -m "refactor(games): move i18n to shared/game-lib/"
```

---

## Task 2: Move `clientThemes.js` to `shared/game-lib/branding.js`

Moves the 97-line module verbatim. Only the filename/location changes; no API change. Updates the three games' imports.

**Files:**
- Create: `shared/game-lib/branding.js` (via `git mv`)
- Delete: `games/src/lib/clientThemes.js`
- Modify: `games/src/lib/WordGame.svelte` (import line, currently `import { applyBrandingFromData } from "./clientThemes.js";`)
- Modify: `games/src/lib/CrosswordGame.svelte` (find `from "./clientThemes.js"`)
- Modify: `games/src/lib/WordSearchGame.svelte` (find `from "./clientThemes.js"`)

- [ ] **Step 1: Move the file**

Run:
```bash
cd /home/mindaugas/projects/brain-games
git mv games/src/lib/clientThemes.js shared/game-lib/branding.js
```
Expected: file moved. `shared/game-lib/branding.js` exists; `games/src/lib/clientThemes.js` gone.

- [ ] **Step 2: Update `WordGame.svelte` import**

Replace:
```javascript
import { applyBrandingFromData } from "./clientThemes.js";
```
with:
```javascript
import { applyBrandingFromData } from "../../../shared/game-lib/branding.js";
```

- [ ] **Step 3: Update `CrosswordGame.svelte` import**

Find the `from "./clientThemes.js"` line and replace its `from` target with `from "../../../shared/game-lib/branding.js"`. Preserve the set of imported names.

- [ ] **Step 4: Update `WordSearchGame.svelte` import**

Same as Step 3 for `WordSearchGame.svelte`.

- [ ] **Step 5: Build games to verify**

Run:
```bash
cd games && yarn build:all
```
Expected: all three builds succeed.

- [ ] **Step 6: Commit**

```bash
cd /home/mindaugas/projects/brain-games
git add shared/game-lib/branding.js games/src/lib/WordGame.svelte games/src/lib/CrosswordGame.svelte games/src/lib/WordSearchGame.svelte
git commit -m "refactor(games): move clientThemes to shared/game-lib/branding.js"
```

---

## Task 3: Add `shared/game-lib/api-client.js`

Creates a thin module that encapsulates the "fetch a public-games endpoint with optional Bearer token" pattern. Scoped to what `WordGame` actually uses: `fetchGame(type, id)` and `fetchPublicConfig()`. `submitResult` and `fetchLatest` are deliberately omitted — add them in Plan B2 when a real consumer exists.

**Files:**
- Create: `shared/game-lib/api-client.js`

- [ ] **Step 1: Write `shared/game-lib/api-client.js`**

Full content:

```javascript
/**
 * API client for game embeds.
 *
 * Produces a small object with the HTTP calls a game engine needs.
 * Centralises Bearer-token construction and error handling so every
 * game uses the same pattern.
 *
 * @param {object} opts
 * @param {string} opts.apiUrl - Base URL of the dashboard/API (no trailing slash).
 * @param {string} [opts.token] - Optional public API token. When present it's
 *   sent as `Authorization: Bearer <token>` on authenticated endpoints.
 */
export function createApiClient({ apiUrl, token } = {}) {
  if (!apiUrl) {
    throw new Error("createApiClient: apiUrl is required");
  }

  const authHeaders = () => (token ? { Authorization: `Bearer ${token}` } : {});

  /**
   * Fetch a single game/puzzle by type and id.
   * GET {apiUrl}/api/public/games?type={type}&id={id}
   *
   * @param {string} type - Game type, e.g. "wordgames" or "crosswords".
   * @param {string} id - Game id or "latest".
   * @returns {Promise<object>} Parsed JSON body.
   * @throws Error with `status` property on non-2xx responses.
   */
  const fetchGame = async (type, id) => {
    const url = `${apiUrl}/api/public/games?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}`;
    const response = await fetch(url, { headers: { ...authHeaders() } });
    if (!response.ok) {
      const err = new Error(`fetchGame failed: ${response.status} ${response.statusText}`);
      err.status = response.status;
      throw err;
    }
    return response.json();
  };

  /**
   * Fetch the public platform config (no auth required).
   * GET {apiUrl}/api/public/config
   */
  const fetchPublicConfig = async () => {
    const response = await fetch(`${apiUrl}/api/public/config`);
    if (!response.ok) {
      const err = new Error(`fetchPublicConfig failed: ${response.status}`);
      err.status = response.status;
      throw err;
    }
    return response.json();
  };

  return { fetchGame, fetchPublicConfig };
}
```

- [ ] **Step 2: Sanity-check the file is valid JS**

Run:
```bash
node --check shared/game-lib/api-client.js
```
Expected: no output and exit code 0 (syntax valid).

- [ ] **Step 3: Commit**

```bash
git add shared/game-lib/api-client.js
git commit -m "feat(shared): add api-client with fetchGame and fetchPublicConfig"
```

---

## Task 4: Migrate `WordGame.svelte` fetch calls to the shared API client

Replaces the inline `fetch(...)` calls in `WordGame.svelte` with `createApiClient(...)` — two sites: the public-config fetch (around line 60) and the game fetch (around lines 74–97). Behaviour is identical; the code path is shorter.

**Files:**
- Modify: `games/src/lib/WordGame.svelte`

- [ ] **Step 1: Add the import**

At the top of `<script>` in `games/src/lib/WordGame.svelte`, add (after the existing imports):
```javascript
import { createApiClient } from "../../../shared/game-lib/api-client.js";
```
The import list should now look like:
```javascript
import { onMount } from "svelte";
import { applyBrandingFromData } from "../../../shared/game-lib/branding.js";
import { locale, t } from "../../../shared/game-lib/i18n/index.js";
import { createApiClient } from "../../../shared/game-lib/api-client.js";
```

- [ ] **Step 2: Replace the public-config fetch (currently around line 60)**

Find the block that fetches `/api/public/config` — original pattern:
```javascript
const response = await fetch(`${apiUrl}/api/public/config`);
if (response.ok) {
  const config = await response.json();
  // ... existing body
}
```

Replace just the fetch + `if (response.ok)` + `const config = await response.json();` portion with a single `await client.fetchPublicConfig()` call. The new shape:

```javascript
try {
  const config = await client.fetchPublicConfig();
  // ... existing body that uses `config`, unchanged
} catch (err) {
  // Public-config fetch is best-effort; keep the same silent-fallback
  // behaviour that the original had when response.ok was false.
  console.warn("Public config fetch failed:", err);
}
```

The existing body that mutates `platformName`, `platformUrl`, etc. from `config` stays exactly as it was. Only the fetch mechanics change.

- [ ] **Step 3: Add a `client` declaration near the other top-level state**

In the `<script>` body, after the existing prop/state declarations (somewhere around line 20, before `fetchGame`), add:
```javascript
const client = createApiClient({ apiUrl, token });
```

Note the variable name `client` shadows the existing `client` prop (line 7: `export let client = ""`). Rename the local variable to `api` to avoid the shadow:
```javascript
const api = createApiClient({ apiUrl, token });
```
Use `api` in Step 4 (not `client`).

- [ ] **Step 4: Replace the game fetch (currently lines 74–97)**

The original block:
```javascript
const headers = token ? { Authorization: `Bearer ${token}` } : {};
const response = await fetch(
  `${apiUrl}/api/public/games?type=wordgames&id=${gameId}`,
  { headers }
);
if (!response.ok) {
  error = `Failed to load game: ${response.status}`;
  loading = false;
  return;
}
const data = await response.json();
game = data;
// ... rest (applyBrandingFromData call, etc.)
```

Replace with:
```javascript
let data;
try {
  data = await api.fetchGame("wordgames", gameId);
} catch (err) {
  error = `Failed to load game: ${err.status ?? "unknown"}`;
  loading = false;
  return;
}
game = data;
// ... rest (applyBrandingFromData call, etc.) unchanged
```

- [ ] **Step 5: Re-reference `api` in both steps**

Confirm that the only fetch-related references in the file now are:
- `api.fetchPublicConfig()`
- `api.fetchGame("wordgames", gameId)`

Search the file for `fetch(` — there should be zero remaining direct `fetch(` calls in the `<script>` block.

- [ ] **Step 6: Build and smoke-test**

Run:
```bash
cd games && yarn build:all
```
Expected: all three builds succeed, no new warnings introduced.

Then start dev server:
```bash
cd /home/mindaugas/projects/brain-games && ./dev.sh dev
```
Open `http://localhost:5173/?type=wordgame&id=<some-valid-wordgame-id>` (or load WordGame via the dashboard preview). Verify:
- Game loads, letters can be typed, feedback appears correctly
- Public config fetch still populates `platformName` / `platformUrl`
- Branding is still applied (colors match the puzzle's branding)

Kill dev server.

- [ ] **Step 7: Commit**

```bash
git add games/src/lib/WordGame.svelte
git commit -m "refactor(games): migrate WordGame to shared api-client"
```

---

## Task 5: Final verification

Sanity pass over the whole branch before review.

- [ ] **Step 1: Run full monorepo build**

Run:
```bash
cd /home/mindaugas/projects/brain-games && ./dev.sh build
```
Expected: succeeds, all three IIFE bundles plus the SPA written to `games/dist/`, synced into `app/public/`, and the Next.js build completes.

- [ ] **Step 2: Lint app (unchanged — baseline check)**

```bash
cd app && yarn lint 2>&1 | grep -E "WordGame|branding|api-client|i18n" | head
```
Expected: no matches (the migration doesn't touch app/).

- [ ] **Step 3: Review branch diff**

```bash
cd /home/mindaugas/projects/brain-games
git log main..HEAD --oneline
git diff main..HEAD --stat
```
Expected: 5 commits (plan doc + Tasks 1–4) and a diff that affects `shared/game-lib/` (created), `games/src/lib/WordGame.svelte` (real changes), `games/src/lib/CrosswordGame.svelte` (import path only), `games/src/lib/WordSearchGame.svelte` (import path only), and the removed `games/src/lib/i18n.js`, `games/src/lib/clientThemes.js`, `games/src/locales/*.json`.

- [ ] **Step 4: Confirm the deleted files are gone**

Run:
```bash
test ! -e games/src/lib/i18n.js && \
test ! -e games/src/lib/clientThemes.js && \
test ! -d games/src/locales && \
echo "cleanup ok"
```
Expected output: `cleanup ok`.

No commit in this task.

---

## Task 6: Final whole-branch code review

Dispatch a subagent code reviewer over the entire branch diff.

- [ ] **Step 1: Dispatch the code reviewer**

Use the `superpowers:code-reviewer` subagent type with:
- BASE SHA: tip of `main` at the start of this plan (capture with `git merge-base main HEAD` before dispatching)
- HEAD SHA: tip of `feat/shared-game-lib`
- Spec reference: `docs/superpowers/specs/2026-04-22-shared-ui-and-game-lib-design.md` (Phase 3 sub-section)
- Plan reference: this document

Ask the reviewer to check specifically:
- Directional rule — `shared/game-lib/` does not import from `app/` or `games/`.
- Import path correctness — all three games resolve the new shared modules.
- API client surface is the minimum needed; no speculative methods added.
- `WordGame.svelte` retains public-API behaviour (props, exported component shape, attribute names on the Web Component wrapper).
- No dead imports, no stray `fetch(` calls remaining in `WordGame.svelte`.
- Branding field map in `branding.js` is unchanged (byte-for-byte same as the old `clientThemes.js`).

Fix any issues the reviewer raises as new commits on the branch before merging.

---

## Success criteria

After Task 6 approval:
- `shared/game-lib/` contains `i18n/`, `branding.js`, `api-client.js` — three foundational modules with no cross-framework coupling (Svelte-only).
- All three game engines (`word-game-engine`, `crossword-engine`, `word-search-engine`) build cleanly and render identically to their pre-plan behaviour.
- `WordGame.svelte` has no direct `fetch(` calls; all HTTP goes through the shared client.
- `games/src/lib/` no longer contains `i18n.js` or `clientThemes.js`; `games/src/locales/` is gone.
- The directional rule (spec invariant) still holds — verified by code review.
- Branch `feat/shared-game-lib` is ready for PR + merge.

## Out of scope — deferred to Plan B2

- `shared/game-lib/timer.svelte.js` (Crossword and WordSearch have real timers; build against them)
- `shared/game-lib/Keyboard.svelte` (WordSearch has an on-screen keyboard; Crossword uses physical-only)
- `shared/game-lib/GameFinish.svelte` (Crossword has `CelebrationOverlay.svelte` — that's the model)
- `shared/game-lib/GameShell.svelte` (design this LAST, once the parts it wraps exist)
- `api-client.submitResult` and `api-client.fetchLatest` (add when a migrated game needs them)
- `games/src/engines/_template/` scaffold
- `.claude/skills/creating-a-new-game/SKILL.md`
- `.agent/` → `.agents/` consolidation
- Migrating `CrosswordGame.svelte` and `WordSearchGame.svelte` (both still import from the shared paths introduced here; their gameplay logic is untouched until Plan B2)
- Aligning puzzle-branding field names with `shared/tokens.css` semantic tokens

## Rollback

If anything in Tasks 1–4 breaks a game in a way that isn't immediately debuggable:
- Each task is one commit; `git revert <sha>` undoes one step cleanly.
- The whole branch discards via `git checkout main && git branch -D feat/shared-game-lib` — `main` is untouched during execution.
- Because moves use `git mv`, reverting them restores the original file at the original path with history intact.
