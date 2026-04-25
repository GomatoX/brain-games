# Branding Stylability Fix and Per-Token Hints — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the bug where Advanced-section overrides in the dashboard branding editor do not propagate to embedded games, and add hover-to-highlight + tooltip hints so users can see which token controls which visible element.

**Architecture:** Three concerns kept independent: (1) game CSS stops re-declaring the same custom properties at deeper levels of the DOM — defaults move from `.light-theme` blocks to inline `var(--x, fallback)` use sites, with paired `.dark-theme <selector>` rules carrying the dark fallback; (2) a new token registry holds id, label, description, group, and CSS vars in one place, with `FIELD_MAP` derived from it for back-compat; (3) the dashboard lifts a `hoveredToken` state to the editor root, and `BrandingPreviewPane` injects a scoped `<style>` selecting `[data-brand-token=X]` markers on game elements.

**Tech Stack:** Next.js 16, React 19, Vitest, Svelte 5 + Vite 7. No new dependencies.

**Reference spec:** `docs/superpowers/specs/2026-04-25-branding-stylability-and-hints-design.md`

---

## File Structure

**New files:**
- `app/src/lib/branding/token-registry.ts` — single source of truth for token definitions
- `app/src/lib/__tests__/branding-token-registry.test.ts` — registry shape + closure-over-derive tests
- `app/src/lib/__tests__/branding-field-map-compat.test.ts` — regression guard for the resolve pipeline

**Modified files:**
- `app/src/lib/branding/field-map.ts` — re-export `FIELD_MAP` from registry
- `app/src/components/branding/BrandingEditor.tsx` — lift `hoveredToken` state
- `app/src/components/branding/BrandingPreviewPane.tsx` — accept and inject hover style
- `app/src/components/branding/sections/AdvancedSection.tsx` — read registry, add hover/tooltip
- `games/src/lib/crossword/CrosswordGame.svelte` — strip token vars, add use-site fallbacks, add `data-brand-token` markers
- `games/src/lib/crossword/CrosswordGrid.svelte` — `data-brand-token` markers on cells
- `games/src/lib/crossword/ClueBanner.svelte` — `data-brand-token="highlight"`, dark-mode pair
- `games/src/lib/WordSearchGame.svelte` — strip token vars, fallbacks, markers
- `games/src/lib/WordGame.svelte` — strip dark-theme vars, fallbacks, markers
- `games/src/lib/SudokuGame.svelte` — strip token vars, fallbacks, markers

---

## Phase 1 — Bug Fix: Stop Games From Re-Declaring CSS Variables

This phase is independently shippable. After Phase 1, today's Advanced overrides actually work.

The pattern is identical for every file: for every CSS custom property that the dashboard's branding pipeline produces (the right-hand side of `FIELD_MAP` in `app/src/lib/branding/field-map.ts`), remove the declaration from any `.light-theme` / `.dark-theme` / container-level block, and instead supply it as a use-site fallback `var(--name, <previous-light-value>)`. Where the previous `.dark-theme` value differed, add a paired rule `.dark-theme <selector> { property: var(--name, <previous-dark-value>) }`.

**Branded-pipeline CSS variables** (these are the ones to remove/fallback — derived from `FIELD_MAP` today):

```
--primary, --accent
--primary-hover, --accent-hover
--primary-light, --accent-light
--primary-foreground
--surface, --bg-primary
--surface-elevated, --bg-secondary
--surface-muted
--text, --text-primary
--text-muted, --text-secondary
--border, --border-color
--correct, --correct-light
--present, --absent
--selection, --cell-selected, --cell-selected-bg
--selection-ring, --cell-selected-ring
--highlight, --cell-highlighted, --cell-related
--cell-bg
--cell-blocked
--grid-border
--main-word-marker
--sidebar-active, --sidebar-active-bg
```

Anything else (e.g. `--cell-conflict`, `--shadow-card`, `--correct-hover`) is **not** in the branded pipeline today; leave those alone.

### Task 1.1: Fix `CrosswordGame.svelte`

**Files:**
- Modify: `games/src/lib/crossword/CrosswordGame.svelte` (lines 1185-1219, plus rules referencing the variables)

- [ ] **Step 1: Find every use site of the branded variables in this file**

Run:
```bash
grep -nE "var\(--(bg-primary|bg-secondary|text-primary|text-secondary|border-color|cell-bg|cell-blocked|cell-selected-bg|cell-selected-ring|cell-highlighted|accent|accent-hover|accent-light|correct|correct-light)\b" games/src/lib/crossword/CrosswordGame.svelte
```
Expected: a list of CSS rules that read these vars without a fallback (or with a fallback that may differ from the `.light-theme` value). Note the line numbers; each will get an inline default in step 3.

- [ ] **Step 2: Replace the `.light-theme` block to remove all branded variable declarations**

Edit lines 1185-1201 from:
```svelte
.light-theme {
  --bg-primary: #ffffff;
  --bg-secondary: #f3f4f6;
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
  --cell-bg: #ffffff;
  --cell-blocked: #1a1a1a;
  --cell-selected-bg: #fcece8;
  --cell-selected-ring: #c25e40;
  --cell-highlighted: #fcece8;
  --accent: #c25e40;
  --accent-hover: #a0492d;
  --accent-light: #fcece8;
  --correct: #007a3c;
  --correct-light: #e2f3ea;
}
```
to:
```svelte
.light-theme {
  /* Branded CSS variables now flow in from a parent (dashboard wrapper or
     server-rendered embed). Use-site rules below carry the previous
     light-theme defaults as fallbacks. */
}
```

- [ ] **Step 3: Replace the `.dark-theme` block similarly**

Edit lines 1203-1219 from the long block to:
```svelte
.dark-theme {
  /* See .light-theme — defaults moved to use-site fallbacks.
     Paired `.dark-theme <selector>` rules below override fallbacks
     for properties whose dark-mode default differed. */
}
```

- [ ] **Step 4: Update every use-site identified in Step 1 to carry the previous `.light-theme` value as a fallback**

For each rule found, change `var(--name)` → `var(--name, <previous-light-default>)`. The light defaults are the ones from the original `.light-theme` block. Example transformations:

```svelte
/* before */ background: var(--bg-primary); color: var(--text-primary);
/* after  */ background: var(--bg-primary, #ffffff); color: var(--text-primary, #0f172a);
```

If a use site already has a fallback (e.g. `var(--bg-primary, #ffffff)`), leave it; just confirm the fallback matches the previous light default. If it doesn't match, update it to match.

- [ ] **Step 5: Add paired `.dark-theme <selector>` rules for every property whose previous dark default differed**

Compare the two original blocks; the differing properties are: `--bg-primary` (`#ffffff` → `#0f172a`), `--bg-secondary`, `--text-primary`, `--text-secondary`, `--border-color`, `--cell-bg`, `--cell-blocked`, `--cell-selected-bg` (`#fcece8` → `rgba(194, 94, 64, 0.2)`), `--cell-highlighted` (`#fcece8` → `rgba(194, 94, 64, 0.15)`), `--accent-light`, `--correct`, `--correct-light`. (`--cell-selected-ring`, `--accent`, `--accent-hover` were the same in both themes — no pair needed.)

Append, just below the (now empty) `.dark-theme {}` block:

```svelte
/* Paired dark-mode fallbacks. Apply only when no parent provides the variable. */
.dark-theme .crossword-container { background: var(--bg-primary, #0f172a); color: var(--text-primary, #f1f5f9); }
.dark-theme .clue-box           { background: var(--bg-primary, #0f172a); border-color: var(--border-color, #334155); }
/* …repeat for every selector in this file that uses one of the differing variables… */
```

The exhaustive list of paired rules to add is whatever Step 1's grep produced, restricted to properties whose dark default differed. Match each grepped selector with the selector it appears under in the file (Svelte scopes them automatically).

- [ ] **Step 6: Verify build still succeeds**

Run:
```bash
cd games && yarn build
```
Expected: build succeeds, `dist/crossword-engine.iife.js` produced. No CSS syntax errors.

- [ ] **Step 7: Commit (deferred — combine with all of Phase 1)**

### Task 1.2: Fix `CrosswordGrid.svelte`

**Files:**
- Modify: `games/src/lib/crossword/CrosswordGrid.svelte`

- [ ] **Step 1: Locate any `.light-theme` / `.dark-theme` blocks or container-level branded variable declarations**

Run:
```bash
grep -nE "(\.light-theme|\.dark-theme).*\{|--(bg-primary|cell-bg|cell-blocked|cell-highlighted|accent|cell-selected|grid-border)" games/src/lib/crossword/CrosswordGrid.svelte | head -30
```

- [ ] **Step 2: Apply the same pattern as Task 1.1 (steps 2–5)**

Strip declarations of branded variables from any theme/container block; convert use sites to `var(--name, <light-default>)`; add paired `.dark-theme <selector>` rules where the dark default differed. Use the values from `CrosswordGame.svelte`'s original blocks as the source of truth for defaults.

- [ ] **Step 3: Verify build**

Run: `cd games && yarn build`
Expected: success.

- [ ] **Step 4: Commit (deferred)**

### Task 1.3: Fix `ClueBanner.svelte`

**Files:**
- Modify: `games/src/lib/crossword/ClueBanner.svelte`

- [ ] **Step 1: Confirm current state**

The component already uses `var(--cell-highlighted, #e8ebfa)` at line 67 (light fallback). It needs a paired dark-mode rule.

- [ ] **Step 2: Add a paired `.dark-theme` rule**

After the `.clue-banner` rule's closing brace (around line 73), add:
```svelte
:global(.dark-theme) .clue-banner {
  background: var(--cell-highlighted, rgba(194, 94, 64, 0.15));
  border-color: var(--border-color, #334155);
}
```

The `:global(.dark-theme)` is needed because Svelte scopes class selectors; the `.dark-theme` class lives on the parent `CrosswordGame` component's root.

- [ ] **Step 3: Verify build**

Run: `cd games && yarn build`
Expected: success.

- [ ] **Step 4: Commit (deferred)**

### Task 1.4: Fix `WordSearchGame.svelte`

**Files:**
- Modify: `games/src/lib/WordSearchGame.svelte`

This file declares branded variables on `.word-search-container` directly (lines 522-535) — there is no `.light-theme` class.

- [ ] **Step 1: Strip branded variable declarations from `.word-search-container`**

Remove lines 522-535 (the `--bg-primary`…`--correct-hover` block) and leave the `font-family`, `padding`, `margin` declarations intact. Add a single comment in their place:
```svelte
/* Branded CSS variables flow in from the parent. Use-site fallbacks
   below preserve the previous light defaults. */
```

`--correct-hover` is NOT in the branded pipeline (not in `FIELD_MAP`); preserve it on `.word-search-container` as `--correct-hover: #005c2d;` rather than removing.

- [ ] **Step 2: Update use sites with fallbacks matching the previous declared values**

For each `var(--branded-var)` reference in this file, ensure it has a fallback equal to the light value declared on `.word-search-container` originally. The light defaults are the same as `CrosswordGame.svelte`'s `.light-theme` block.

- [ ] **Step 3: Add paired `.dark-theme` rules**

Word-search has no `.dark-theme` class today, but a parent (the dashboard preview, or an embed with `theme="dark"` on the host) may set one on an ancestor. For consistency with crossword, add `:global(.dark-theme) .word-search-container { background: var(--bg-primary, #0f172a); color: var(--text-primary, #f1f5f9); }` and paired rules for cells, mirroring the differing properties in `CrosswordGame.svelte`.

If you discover that the word-search component is only ever rendered in light mode in production today, you may skip the dark pairs — but the spec asks for them so embeds can opt into dark via `theme="dark"`. Add them.

- [ ] **Step 4: Verify build**

Run: `cd games && yarn build:wordsearch`
Expected: success.

- [ ] **Step 5: Commit (deferred)**

### Task 1.5: Fix `WordGame.svelte`

**Files:**
- Modify: `games/src/lib/WordGame.svelte`

This file has only a `.word-game.dark-theme` block (line 357). Inspect it.

- [ ] **Step 1: Read the dark-theme block**

Run:
```bash
sed -n '350,400p' games/src/lib/WordGame.svelte
```
Note which branded variables it declares.

- [ ] **Step 2: Apply the strip + fallback pattern**

For every branded variable declaration in `.word-game.dark-theme`, remove it. For every use site of those variables in this file, ensure a `var(--name, <light-default>)` fallback. Add paired `.word-game.dark-theme <selector>` rules carrying the previous dark values as fallbacks.

If light defaults are not declared anywhere in this file (and the game today only ships dark colours via the class), use the same light defaults as the crossword (`#ffffff` for `--bg-primary`, `#0f172a` for `--text-primary`, etc.) — these are the platform standard.

- [ ] **Step 3: Verify build**

Run: `cd games && yarn build:wordgame`
Expected: success.

- [ ] **Step 4: Commit (deferred)**

### Task 1.6: Fix `SudokuGame.svelte`

**Files:**
- Modify: `games/src/lib/SudokuGame.svelte`

- [ ] **Step 1: Locate theme blocks**

Run: `sed -n '510,555p' games/src/lib/SudokuGame.svelte`

- [ ] **Step 2: Apply the strip + fallback pattern from Task 1.1**

`--cell-conflict`, `--cell-given-bg`, `--cell-same-number`, `--conflict-text` are NOT in `FIELD_MAP` — leave their declarations alone. Strip only the branded variables.

- [ ] **Step 3: Verify build**

Run: `cd games && yarn build:all`
Expected: success.

- [ ] **Step 4: Commit (deferred)**

### Task 1.7: Manual verification of bug fix

- [ ] **Step 1: Start dev**

```bash
./dev.sh dev
```
Wait until the watcher reports IIFE bundles built and copied.

- [ ] **Step 2: For each of the four games (crossword, word-search, word-game, sudoku), navigate to the dashboard branding editor (`/dashboard/branding`), pick the game in the preview's game-type dropdown, and verify**

In `Advanced overrides`, pin one of these tokens to `#00ff00` and verify the marked region turns green:
- `highlight` → clue banner background (crossword), active row (word-search), active row outline (word-game)
- `selection` → currently selected cell background
- `cell-blocked` → black cells in crossword (should turn green)
- `surface` → page/container background

After each verification, click "Reset" to remove the override.

- [ ] **Step 3: Verify dark-mode parity**

Set `<crossword-game theme="dark">` (you can do this via DevTools by editing the host element's `theme` attribute on a published embed or by visiting `/play?type=crossword&id=<id>&theme=dark`). With NO branding overrides, confirm the dark palette renders identically to today's `main` branch. Compare side-by-side if uncertain.

- [ ] **Step 4: Commit Phase 1**

```bash
git add games/src/lib/crossword/CrosswordGame.svelte \
        games/src/lib/crossword/CrosswordGrid.svelte \
        games/src/lib/crossword/ClueBanner.svelte \
        games/src/lib/WordSearchGame.svelte \
        games/src/lib/WordGame.svelte \
        games/src/lib/SudokuGame.svelte \
        app/public/crossword-engine.iife.js \
        app/public/word-search-engine.iife.js \
        app/public/word-game-engine.iife.js
git commit -m "fix(branding): stop games from re-declaring branded CSS variables

The dashboard's Advanced overrides set CSS custom properties on a parent
wrapper, but each game's .light-theme/.dark-theme block re-declared the
same variables at a deeper level of the DOM, shadowing the override.

Strip branded-pipeline variable declarations from theme/container blocks;
move defaults to inline var(--x, fallback) at use sites; add paired
.dark-theme <selector> rules carrying the previous dark fallbacks so
unbranded dark-mode rendering is byte-identical to before."
```

---

## Phase 2 — Token Registry as Source of Truth

Pure refactor. Adds `token-registry.ts` and re-exports `FIELD_MAP` from it. No UI change yet; Phase 3 consumes the registry.

### Task 2.1: Compat regression test (TDD red)

**Files:**
- Create: `app/src/lib/__tests__/branding-field-map-compat.test.ts`

- [ ] **Step 1: Write the test snapshotting the current `FIELD_MAP` shape**

Create `app/src/lib/__tests__/branding-field-map-compat.test.ts`:
```ts
import { describe, it, expect } from "vitest"
import { FIELD_MAP } from "../branding/field-map"

const SNAPSHOT: Record<string, string[]> = {
  primary: ["--primary", "--accent"],
  "primary-hover": ["--primary-hover", "--accent-hover"],
  "primary-light": ["--primary-light", "--accent-light"],
  "primary-foreground": ["--primary-foreground"],
  surface: ["--surface", "--bg-primary"],
  "surface-elevated": ["--surface-elevated", "--bg-secondary"],
  "surface-muted": ["--surface-muted"],
  text: ["--text", "--text-primary"],
  "text-muted": ["--text-muted", "--text-secondary"],
  border: ["--border", "--border-color"],
  correct: ["--correct"],
  "correct-light": ["--correct-light"],
  present: ["--present"],
  absent: ["--absent"],
  selection: ["--selection", "--cell-selected", "--cell-selected-bg"],
  "selection-ring": ["--selection-ring", "--cell-selected-ring"],
  highlight: ["--highlight", "--cell-highlighted", "--cell-related"],
  "cell-bg": ["--cell-bg"],
  "cell-blocked": ["--cell-blocked"],
  "grid-border": ["--grid-border"],
  "main-word-marker": ["--main-word-marker"],
  "sidebar-active": ["--sidebar-active"],
  "sidebar-active-bg": ["--sidebar-active-bg"],
}

describe("FIELD_MAP compatibility", () => {
  it("matches the published shape exactly (regression guard for resolve.ts)", () => {
    expect(FIELD_MAP).toEqual(SNAPSHOT)
  })
})
```

- [ ] **Step 2: Run the test — should pass against current `field-map.ts`**

Run: `cd app && yarn test branding-field-map-compat -t "matches the published shape"`
Expected: PASS. (We're locking in current behaviour before refactoring.)

- [ ] **Step 3: Do not commit yet — Phase 2 commits as one unit**

### Task 2.2: Create the token registry

**Files:**
- Create: `app/src/lib/branding/token-registry.ts`

- [ ] **Step 1: Write the registry**

Create `app/src/lib/branding/token-registry.ts`:
```ts
export type TokenGroup = "color" | "surface" | "state" | "feedback" | "structural"

export type TokenDef = {
  id: string
  cssVars: string[]
  label: string
  description: string
  group: TokenGroup
}

export const TOKEN_REGISTRY: TokenDef[] = [
  { id: "primary",            cssVars: ["--primary", "--accent"],
    label: "Primary",         description: "Main brand colour. Drives buttons, accents, and the selection ring.",
    group: "color" },
  { id: "primary-hover",      cssVars: ["--primary-hover", "--accent-hover"],
    label: "Primary (hover)", description: "Darker shade of the brand colour used on hover.",
    group: "color" },
  { id: "primary-light",      cssVars: ["--primary-light", "--accent-light"],
    label: "Primary (light)", description: "Pale tint of the brand colour, used as a soft fill.",
    group: "color" },
  { id: "primary-foreground", cssVars: ["--primary-foreground"],
    label: "Primary text",    description: "Text colour shown on top of the primary brand colour.",
    group: "color" },
  { id: "surface",            cssVars: ["--surface", "--bg-primary"],
    label: "Surface",         description: "Page background and card surface.",
    group: "surface" },
  { id: "surface-elevated",   cssVars: ["--surface-elevated", "--bg-secondary"],
    label: "Elevated surface",description: "Slightly raised areas — e.g. clue list cards, hover states.",
    group: "surface" },
  { id: "surface-muted",      cssVars: ["--surface-muted"],
    label: "Muted surface",   description: "Subtle background for de-emphasised content.",
    group: "surface" },
  { id: "text",               cssVars: ["--text", "--text-primary"],
    label: "Text",            description: "Default body text colour.",
    group: "color" },
  { id: "text-muted",         cssVars: ["--text-muted", "--text-secondary"],
    label: "Muted text",      description: "Lower-emphasis text — labels, secondary captions.",
    group: "color" },
  { id: "border",             cssVars: ["--border", "--border-color"],
    label: "Border",          description: "Hairline borders around cards, inputs, dividers.",
    group: "structural" },
  { id: "correct",            cssVars: ["--correct"],
    label: "Correct",         description: "Success colour for correctly solved cells and answers.",
    group: "feedback" },
  { id: "correct-light",      cssVars: ["--correct-light"],
    label: "Correct (light)", description: "Pale success fill — e.g. correctly placed letter background in word game.",
    group: "feedback" },
  { id: "present",            cssVars: ["--present"],
    label: "Present",         description: "Word-game state: letter is in the word but in the wrong position.",
    group: "feedback" },
  { id: "absent",             cssVars: ["--absent"],
    label: "Absent",          description: "Word-game state: letter is not in the word.",
    group: "feedback" },
  { id: "selection",          cssVars: ["--selection", "--cell-selected", "--cell-selected-bg"],
    label: "Selected cell",   description: "Background of the currently selected cell or drag path.",
    group: "state" },
  { id: "selection-ring",     cssVars: ["--selection-ring", "--cell-selected-ring"],
    label: "Selection ring",  description: "Border around the currently selected cell or active row.",
    group: "state" },
  { id: "highlight",          cssVars: ["--highlight", "--cell-highlighted", "--cell-related"],
    label: "Highlighted clue",description: "Active clue banner background, and cells that share a word with the selected cell.",
    group: "state" },
  { id: "cell-bg",            cssVars: ["--cell-bg"],
    label: "Cell background", description: "Default fill colour of an empty grid cell.",
    group: "structural" },
  { id: "cell-blocked",       cssVars: ["--cell-blocked"],
    label: "Blocked cells",   description: "Crossword squares with no letter — the solid black blocks.",
    group: "structural" },
  { id: "grid-border",        cssVars: ["--grid-border"],
    label: "Grid border",     description: "Thin line drawn around each cell in the grid.",
    group: "structural" },
  { id: "main-word-marker",   cssVars: ["--main-word-marker"],
    label: "Main word marker",description: "Highlight on the row/column that hides the daily phrase in crossword.",
    group: "state" },
  { id: "sidebar-active",     cssVars: ["--sidebar-active"],
    label: "Sidebar active text", description: "Text colour for the active item in the dashboard sidebar.",
    group: "color" },
  { id: "sidebar-active-bg",  cssVars: ["--sidebar-active-bg"],
    label: "Sidebar active bg",   description: "Background for the active item in the dashboard sidebar.",
    group: "color" },
]
```

### Task 2.3: Wire registry into `field-map.ts`

**Files:**
- Modify: `app/src/lib/branding/field-map.ts`

- [ ] **Step 1: Replace the inline `FIELD_MAP` constant**

Edit `app/src/lib/branding/field-map.ts` — replace the existing `FIELD_MAP` constant block (lines 4-28) with:
```ts
import { TOKEN_REGISTRY } from "./token-registry"

export const FIELD_MAP: Record<string, string[]> = Object.fromEntries(
  TOKEN_REGISTRY.map((t) => [t.id, t.cssVars]),
)
```

Leave `TYPOGRAPHY_VARS`, `SCALE_VARS`, `DENSITY_VARS`, `radiusVars` unchanged.

- [ ] **Step 2: Run the compat test — must still pass**

Run: `cd app && yarn test branding-field-map-compat`
Expected: PASS. If it fails, the registry has a typo or missing entry — fix the registry until the test passes.

### Task 2.4: Registry shape & coverage tests

**Files:**
- Create: `app/src/lib/__tests__/branding-token-registry.test.ts`

- [ ] **Step 1: Write the test**

```ts
import { describe, it, expect } from "vitest"
import { TOKEN_REGISTRY } from "../branding/token-registry"
import { deriveTokens } from "../branding/derive"

const VALID_GROUPS = new Set(["color", "surface", "state", "feedback", "structural"])

describe("TOKEN_REGISTRY", () => {
  it("every entry has non-empty fields and at least one cssVar", () => {
    for (const t of TOKEN_REGISTRY) {
      expect(t.id, `id missing`).toBeTruthy()
      expect(t.label, `${t.id}: label missing`).toBeTruthy()
      expect(t.description, `${t.id}: description missing`).toBeTruthy()
      expect(t.cssVars.length, `${t.id}: cssVars empty`).toBeGreaterThan(0)
      expect(VALID_GROUPS.has(t.group), `${t.id}: invalid group ${t.group}`).toBe(true)
    }
  })

  it("all ids are unique", () => {
    const ids = TOKEN_REGISTRY.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("all CSS variables are unique across the registry", () => {
    const vars = TOKEN_REGISTRY.flatMap((t) => t.cssVars)
    expect(new Set(vars).size).toBe(vars.length)
  })

  it("covers every token name produced by deriveTokens", () => {
    const derived = deriveTokens({
      primary: "#c25e40", surface: "#ffffff", text: "#0f172a", overrides: {},
    })
    const registryIds = new Set(TOKEN_REGISTRY.map((t) => t.id))
    for (const k of Object.keys(derived)) {
      expect(registryIds.has(k), `derived token "${k}" has no registry entry`).toBe(true)
    }
  })
})
```

- [ ] **Step 2: Run all branding tests**

Run: `cd app && yarn test branding`
Expected: all four branding test files pass (derive, migrate, sanitize-css, sanitize-svg) plus the two new ones (registry, field-map-compat).

- [ ] **Step 3: Commit Phase 2**

```bash
git add app/src/lib/branding/token-registry.ts \
        app/src/lib/branding/field-map.ts \
        app/src/lib/__tests__/branding-field-map-compat.test.ts \
        app/src/lib/__tests__/branding-token-registry.test.ts
git commit -m "refactor(branding): introduce token registry as source of truth for FIELD_MAP

Adds app/src/lib/branding/token-registry.ts with id, cssVars, label,
description, and group for every branded token. field-map.ts now
re-exports FIELD_MAP from the registry. Compat test snapshots the
previous FIELD_MAP shape to guarantee resolve.ts behaviour is unchanged."
```

---

## Phase 3 — Hover-to-Highlight UI and `data-brand-token` Markers

### Task 3.1: Add `data-brand-token` markers to crossword

**Files:**
- Modify: `games/src/lib/crossword/ClueBanner.svelte`
- Modify: `games/src/lib/crossword/CrosswordGrid.svelte`
- Modify: `games/src/lib/crossword/CrosswordGame.svelte`

- [ ] **Step 1: Mark the clue banner**

In `ClueBanner.svelte` line 14, change:
```svelte
<div class="clue-banner">
```
to:
```svelte
<div class="clue-banner" data-brand-token="highlight">
```

- [ ] **Step 2: Mark cells in `CrosswordGrid.svelte` based on current state**

Find the cell render block (search for `class:selected` and `class:word-highlighted` near a `<div class="cell"`). Add a dynamic `data-brand-token` attribute reflecting the visible appearance:
```svelte
<div
  class="cell"
  class:blocked={cell.isBlocked}
  class:selected={isSelected}
  class:word-highlighted={isWordHighlighted}
  data-brand-token={
    cell.isBlocked ? "cell-blocked" :
    isSelected ? "selection" :
    isWordHighlighted ? "highlight" :
    "cell-bg"
  }
  …
>
```

For the selection ring (the inner highlight), add a child marker only on selected cells:
```svelte
{#if isSelected}
  <span class="cell-ring-marker" data-brand-token="selection-ring" aria-hidden="true"></span>
{/if}
```
And add to the `<style>` block:
```svelte
.cell-ring-marker {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
```

- [ ] **Step 3: Mark the active clue list item in `CrosswordGame.svelte`**

Find the `.clue-item.active` rendering (likely in a `{#each}` over clues). Add `data-brand-token={isActive ? "highlight" : undefined}` to the active item. Skipping inactive items keeps the DOM clean.

- [ ] **Step 4: Mark the grid wrapper for `grid-border`**

Find the grid container element (the `<div>` whose CSS rule sets `--grid-border`-driven borders). Add `data-brand-token="grid-border"`.

- [ ] **Step 5: Build and load the dashboard preview to confirm markers exist**

Run: `cd games && yarn build`
Then in DevTools on the preview: `document.querySelectorAll('[data-brand-token="highlight"]')` should return ≥1 elements when a clue is selected.

### Task 3.2: Markers in `WordSearchGame.svelte`

**Files:**
- Modify: `games/src/lib/WordSearchGame.svelte`

- [ ] **Step 1: Identify cell render and word list render**

Find the grid cell template and the active-row drag-selection markup.

- [ ] **Step 2: Add markers**

For each cell:
```svelte
<div
  class="cell"
  data-brand-token={
    isFound ? "correct" :
    isOnDragPath ? "selection" :
    isOnActiveRow ? "highlight" :
    "cell-bg"
  }
>
```

For the surface container (`.word-search-container`), add `data-brand-token="surface"` on the root.

- [ ] **Step 3: Build**

Run: `cd games && yarn build:wordsearch`
Expected: success.

### Task 3.3: Markers in `WordGame.svelte`

**Files:**
- Modify: `games/src/lib/WordGame.svelte`

- [ ] **Step 1: Identify tile and row rendering**

Find the per-tile render with state classes (correct / present / absent).

- [ ] **Step 2: Add markers**

```svelte
<div
  class="tile"
  data-brand-token={
    state === "correct" ? "correct" :
    state === "present" ? "present" :
    state === "absent"  ? "absent"  :
    "cell-bg"
  }
>
```

For the active row outline:
```svelte
<div class="row" class:active data-brand-token={isActiveRow ? "selection-ring" : undefined}>
```

- [ ] **Step 3: Build**

Run: `cd games && yarn build:wordgame`
Expected: success.

### Task 3.4: Markers in `SudokuGame.svelte`

**Files:**
- Modify: `games/src/lib/SudokuGame.svelte`

- [ ] **Step 1: Add markers**

```svelte
<div
  class="cell"
  data-brand-token={
    isSelected ? "selection" :
    isHighlighted ? "highlight" :
    "cell-bg"
  }
>
```

Sudoku-specific tokens (`--cell-conflict`, `--cell-given-bg`) are not in the branded pipeline; do not mark them.

- [ ] **Step 2: Build**

Run: `cd games && yarn build:all`
Expected: success.

### Task 3.5: Lift `hoveredToken` state in `BrandingEditor.tsx`

**Files:**
- Modify: `app/src/components/branding/BrandingEditor.tsx`

- [ ] **Step 1: Add the state and pass it down**

After `const [draft, setDraft] = useState<DraftState>(startState)` (line 102), add:
```tsx
const [hoveredToken, setHoveredToken] = useState<string | null>(null)
```

In the JSX, change the `<AdvancedSection draft={draft} update={update} />` line to:
```tsx
<AdvancedSection draft={draft} update={update} onTokenHover={setHoveredToken} />
```

And change `<BrandingPreviewPane draft={draft} />` to:
```tsx
<BrandingPreviewPane draft={draft} hoveredToken={hoveredToken} />
```

### Task 3.6: Hover-aware `AdvancedSection`

**Files:**
- Modify: `app/src/components/branding/sections/AdvancedSection.tsx`

- [ ] **Step 1: Read registry instead of `FIELD_MAP` keys, accept `onTokenHover`**

Replace the file contents with:
```tsx
"use client"
import { useMemo } from "react"
import type { DraftState } from "../BrandingEditor"
import { deriveTokens } from "@/lib/branding/derive"
import { TOKEN_REGISTRY } from "@/lib/branding/token-registry"

type Props = {
  draft: DraftState
  update: <K extends keyof DraftState>(key: K, val: DraftState[K]) => void
  onTokenHover?: (id: string | null) => void
}

const SKIP_IDS = new Set(["primary", "surface", "text"])

export default function AdvancedSection({ draft, update, onTokenHover }: Props) {
  const derived = useMemo(() => deriveTokens(draft.tokens), [draft.tokens])
  const tokens = TOKEN_REGISTRY.filter((t) => !SKIP_IDS.has(t.id))

  const setOverride = (key: string, value: string | null) => {
    const next = { ...draft.tokens.overrides }
    if (value === null) delete next[key]
    else next[key] = value
    update("tokens", { ...draft.tokens, overrides: next })
  }

  return (
    <details className="mb-4">
      <summary className="font-semibold cursor-pointer">Advanced overrides</summary>
      <div className="mt-3 space-y-1 text-xs">
        {tokens.map((t) => {
          const isPinned = t.id in draft.tokens.overrides
          const value = isPinned ? draft.tokens.overrides[t.id] : derived[t.id]
          return (
            <div
              key={t.id}
              className="flex items-center gap-2 py-1 px-1 rounded hover:bg-slate-50 focus-within:bg-slate-50"
              onMouseEnter={() => onTokenHover?.(t.id)}
              onMouseLeave={() => onTokenHover?.(null)}
              onFocus={() => onTokenHover?.(t.id)}
              onBlur={() => onTokenHover?.(null)}
            >
              <span className="inline-block w-4 h-4 border rounded shrink-0" style={{ background: value }} />
              <span className="font-medium truncate">{t.label}</span>
              <span
                className="text-slate-400 cursor-help shrink-0"
                title={t.description}
                aria-label={t.description}
              >ⓘ</span>
              <span className="font-mono text-[10px] text-slate-400 ml-auto truncate">{t.id}</span>
              {isPinned ? (
                <>
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => setOverride(t.id, e.target.value)}
                    className="w-8 h-6 shrink-0"
                  />
                  <button onClick={() => setOverride(t.id, null)} className="text-blue-600 shrink-0">
                    Reset
                  </button>
                </>
              ) : (
                <button onClick={() => setOverride(t.id, value)} className="text-blue-600 shrink-0">
                  Pin
                </button>
              )}
            </div>
          )
        })}
      </div>
    </details>
  )
}
```

### Task 3.7: Inject hover-outline style in `BrandingPreviewPane`

**Files:**
- Modify: `app/src/components/branding/BrandingPreviewPane.tsx`

- [ ] **Step 1: Accept `hoveredToken` prop and render conditional `<style>`**

Replace the component definition at the bottom of the file (lines 30-39) with:
```tsx
type PreviewProps = {
  draft: DraftState
  hoveredToken?: string | null
}

export default function BrandingPreviewPane({ draft, hoveredToken }: PreviewProps) {
  const cssVars = useMemo(() => buildVars(draft), [draft])
  return (
    <div className="p-6">
      {hoveredToken && (
        <style>{`
          [data-brand-preview] [data-brand-token="${hoveredToken}"] {
            outline: 2px dashed #ff00aa !important;
            outline-offset: 2px;
            transition: outline-color 100ms;
          }
        `}</style>
      )}
      <div data-brand-preview style={cssVars as React.CSSProperties}>
        <GamePreview />
      </div>
    </div>
  )
}
```

The `!important` on the outline guards against game-side rules that might also set an outline on the same selector.

`hoveredToken` is interpolated into a CSS string. It comes from `TOKEN_REGISTRY[i].id`, which is a closed enum of safe identifiers — no user input flows here. No sanitisation required.

### Task 3.8: Manual verification

- [ ] **Step 1: Start dev**

```bash
./dev.sh dev
```

- [ ] **Step 2: Hover-to-highlight in dashboard**

Open `/dashboard/branding/<id>`. In the "Advanced overrides" section, hover the `Highlighted clue` row. Confirm a magenta dashed outline appears around the clue banner (and any word-highlighted cells) in the preview pane.

Move the mouse off the row. Outline disappears within ~100ms.

- [ ] **Step 3: Keyboard focus**

Tab through the rows in the Advanced section. Outline appears as each row receives focus.

- [ ] **Step 4: Tooltip**

Hover the ⓘ icon on each row. Native browser tooltip shows the description. Confirm wording is concrete and identifies a specific visual element.

- [ ] **Step 5: Game type switching**

Switch the preview's game-type dropdown (crossword → word-search → word-game). Hover `highlight` on each — outline tracks the appropriate element. For `cell-blocked` while word-game is selected, no outline appears (correct — word-game has no blocked cells).

- [ ] **Step 6: Production embed unaffected**

In a separate browser tab, embed a published game via the public iframe with a real org token (or visit `/play?type=crossword&id=<id>` with a brand applied). Confirm saved branding still applies and there are no spurious magenta outlines.

- [ ] **Step 7: Run all app tests**

```bash
cd app && yarn test
```
Expected: all pass.

- [ ] **Step 8: Run lint**

```bash
cd app && yarn lint
```
Expected: no new errors.

- [ ] **Step 9: Commit Phase 3**

```bash
git add games/src/lib/crossword/ClueBanner.svelte \
        games/src/lib/crossword/CrosswordGrid.svelte \
        games/src/lib/crossword/CrosswordGame.svelte \
        games/src/lib/WordSearchGame.svelte \
        games/src/lib/WordGame.svelte \
        games/src/lib/SudokuGame.svelte \
        app/src/components/branding/BrandingEditor.tsx \
        app/src/components/branding/BrandingPreviewPane.tsx \
        app/src/components/branding/sections/AdvancedSection.tsx \
        app/public/crossword-engine.iife.js \
        app/public/word-search-engine.iife.js \
        app/public/word-game-engine.iife.js
git commit -m "feat(branding): hover-to-highlight token rows and tooltip hints

AdvancedSection now reads from TOKEN_REGISTRY: each row shows a human
label and a (?) icon with a description tooltip explaining what the
token controls. Hovering or focusing a row sets a hoveredToken state in
BrandingEditor; BrandingPreviewPane injects a scoped <style> selecting
[data-brand-token=<id>] elements in the preview, drawing a magenta
dashed outline around them.

Game components carry data-brand-token markers reflecting which token
controls each element's current visible appearance. State-dependent
elements (cells that are both selected and highlighted) compute the
attribute dynamically; selection-ring uses a child marker span."
```

---

## Self-Review Notes

1. **Spec coverage:** Phase 1 covers the bug fix (spec §"Game changes"); Phase 2 covers the registry (spec §"Token registry"); Phase 3 covers markers + dashboard plumbing (spec §"data-brand-token markers" + §"Dashboard hover plumbing"). The unit tests in Phase 2 cover the testing requirements (spec §"Testing"). Manual verification steps in 1.7 and 3.8 cover the manual checklist.

2. **Type consistency:** `TokenDef` and `TOKEN_REGISTRY` shapes are identical between Tasks 2.2 and 2.4's tests and 3.6's consumer. `hoveredToken` is `string | null` everywhere. `onTokenHover` signature matches in BrandingEditor (Task 3.5) and AdvancedSection (Task 3.6).

3. **Placeholder-free:** every code step contains the actual code. The "long block of paired dark-mode rules" in Task 1.1 step 5 is the one remaining instruction-rather-than-code section, but the pattern is shown explicitly with examples — the engineer follows the grep output from step 1 to know exactly which selectors need pairs. This is intentional rather than enumerated because the exact list is large and varies per file; the rule is precise.

4. **The unused `Components` section** (button variant, etc.) is explicitly out of scope per the spec's Non-goals; not addressed in this plan.
