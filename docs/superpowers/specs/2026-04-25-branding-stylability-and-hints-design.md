# Branding stylability fix and per-token hints — design

## Context

The dashboard branding editor (added in the recent branding overhaul) lets organization admins pin and override derived design tokens in an "Advanced" section. The user reports two issues:

1. **Advanced overrides do not propagate to games.** Pinning a token like `highlight` in the dashboard saves the value and updates the preview's CSS variable on the wrapper, but the rendered game does not change colour.
2. **Token names are abstract.** With ~24 token rows named `highlight`, `selection`, `cell-blocked`, `selection-ring`, etc., users cannot tell which row controls which visible element. They want bubble-style hints showing what each option updates.

This document specifies the fix and the hints UX together.

## Root cause of (1)

The CSS-variable pipeline is correct end-to-end:

- `app/src/lib/branding/derive.ts` produces a derived token map from the base palette and applies `overrides` last (`derive.ts:88`).
- `app/src/lib/branding/field-map.ts` maps each token id to one or more CSS custom properties (e.g. `highlight → ["--highlight", "--cell-highlighted", "--cell-related"]`).
- `BrandingPreviewPane.tsx` builds an inline-style object and applies it to a wrapper `<div data-brand-preview style={cssVars}>` around the game host.
- The crossword's `ClueBanner.svelte` reads `var(--cell-highlighted, #e8ebfa)` correctly.

The break is inside the games. Each Svelte game component ships hardcoded theme classes that **re-declare** the same custom properties at a deeper level of the DOM:

```svelte
/* games/src/lib/crossword/CrosswordGame.svelte:1185 */
.light-theme {
  --bg-primary: #ffffff;
  --cell-highlighted: #fcece8;
  --accent: #c25e40;
  --cell-selected-bg: #fcece8;
  /* …18 more declarations… */
}
```

The component wraps itself in `<div class="light-theme">`. CSS custom-property resolution uses the nearest declaration on the inheritance chain, so `.light-theme`'s declaration on the inner `<div>` shadows the parent wrapper's inline style. The dashboard's override is set, but the game promptly redefines the variable below it.

Same pattern exists in `games/src/lib/WordSearchGame.svelte`, `games/src/lib/WordGame.svelte`, and `games/src/lib/SudokuGame.svelte`.

## Goals

- **G1.** Every token in `FIELD_MAP` that the dashboard exposes for override actually changes the rendered game when overridden.
- **G2.** Each token row in the dashboard has a human label and a one-sentence description.
- **G3.** Hovering a token row visibly outlines the affected element(s) in the live preview.
- **G4.** Today's unbranded default appearance for both light and dark themes is preserved (no visual regression on platforms that don't customise branding).

## Non-goals

- Reworking the dark-mode palette. The dark theme will become brand-aware (see Tradeoffs).
- Adding click-to-find ("click an element in the preview, highlight the controlling token row"). Out of scope; can layer on later.
- Replacing the native `title` tooltip with a styled tooltip component.
- Wiring the unused **Components** section (button variant, card elevation, input variant). That section is stored but never consumed; addressing it is a separate effort.

## Architecture

```
┌───────────────────────┐    ┌────────────────────────────┐
│  Token registry       │    │  Game components            │
│  (single source       │    │  - data-brand-token attrs   │
│   of truth)           │    │  - no hardcoded var decls   │
│  - id                 │    │  - var(--x, fallback)       │
│  - cssVars            │    │    inline at use sites      │
│  - label              │    └────────────────────────────┘
│  - description        │                  ▲
│  - group              │                  │ data-brand-token="highlight"
└───────────┬───────────┘                  │
            │                              │
            ▼                              │
┌───────────────────────┐    ┌────────────────────────────┐
│  Dashboard UI         │    │  Preview pane               │
│  - AdvancedSection    ├───▶│  - Listens for token-row    │
│  - Tooltip on label   │    │    hover/focus              │
│  - Hover row → emit   │    │  - Injects scoped CSS:      │
│    "highlightedToken" │    │    [data-brand-token=X]     │
└───────────────────────┘    │    { outline: 2px dashed }  │
                             └────────────────────────────┘
```

Three layers, kept independent:

- A **token registry** in `app/src/lib/branding/` is the single source of truth for token id, CSS vars, label, description, group.
- The **games** carry `data-brand-token` markers on the elements whose appearance maps to a given token, and stop redeclaring the relevant CSS variables.
- The **dashboard** lifts a `hoveredToken` state to the editor root, passes it to the preview, and the preview injects a scoped `<style>` selecting the matching `data-brand-token` element.

## Components

### Token registry

**New file:** `app/src/lib/branding/token-registry.ts`.

```ts
export type TokenDef = {
  id: string                    // matches existing FIELD_MAP key
  cssVars: string[]             // CSS custom properties this token sets
  label: string                 // user-facing name
  description: string           // tooltip text — what it controls
  group: "color" | "surface" | "state" | "feedback" | "structural"
}

export const TOKEN_REGISTRY: TokenDef[] = [
  {
    id: "highlight",
    cssVars: ["--highlight", "--cell-highlighted", "--cell-related"],
    label: "Highlighted clue",
    description:
      "Background of the active clue banner and cells that share a word with the selected cell.",
    group: "state",
  },
  // … one entry per existing FIELD_MAP key (~24 entries)
]

export const FIELD_MAP: Record<string, string[]> = Object.fromEntries(
  TOKEN_REGISTRY.map((t) => [t.id, t.cssVars]),
)
```

`field-map.ts` re-exports `FIELD_MAP` from the registry. Other constants (`TYPOGRAPHY_VARS`, `SCALE_VARS`, `DENSITY_VARS`, `radiusVars`) stay in `field-map.ts` — they are not per-token.

`group` is included now to enable future grouping in the UI (collapsible "Cell states", "Surfaces", etc.) without a migration. Not consumed by the v1 UI.

Labels and descriptions are plain strings. i18n is out of scope; when adopted later, the registry will hold keys (`"branding.token.highlight.label"`) and a hook in the dashboard resolves them.

### Game changes (bug fix)

**Files:**

- `games/src/lib/crossword/CrosswordGame.svelte`
- `games/src/lib/crossword/CrosswordGrid.svelte`
- `games/src/lib/WordSearchGame.svelte`
- `games/src/lib/WordGame.svelte`
- `games/src/lib/SudokuGame.svelte`

**Pattern:**

```svelte
<!-- BEFORE -->
.light-theme {
  --bg-primary: #ffffff;
  --cell-highlighted: #fcece8;
  --accent: #c25e40;
  /* …18 more… */
}
.dark-theme {
  --cell-highlighted: rgba(194, 94, 64, 0.15);
  /* …18 more… */
}
.cell.word-highlighted { background: var(--cell-highlighted); }
```

```svelte
<!-- AFTER -->
.light-theme { /* class kept only for non-token concerns */ }
.dark-theme  { /* class kept only for non-token concerns */ }

.cell.word-highlighted { background: var(--cell-highlighted, #fcece8); }
.dark-theme .cell.word-highlighted { background: var(--cell-highlighted, rgba(194, 94, 64, 0.15)); }
```

**Why this preserves dark mode without re-introducing the bug:** the `.dark-theme` selector never re-declares the custom property, it only changes the *fallback* used when the property is unset. When the dashboard provides `--cell-highlighted` on a parent wrapper, the property is set, the fallback is unused, and the user's brand colour wins under both themes. When no parent provides the variable (unbranded production embed), the rule's fallback is used — light or dark depending on `.dark-theme` ancestor — matching today's behaviour exactly.

**Rules:**

1. For every CSS variable that appears on the right-hand side of any `TOKEN_REGISTRY` entry's `cssVars`, **remove its declaration** from `.light-theme` and `.dark-theme` blocks.
2. At every use site of one of those variables:
   - The default rule uses the previous `.light-theme` value as the fallback: `var(--name, <light-default>)`.
   - If the previous `.dark-theme` value differed, add a paired rule `.dark-theme <selector> { property: var(--name, <dark-default>) }`.
3. Variables not in the registry (game-private decorations) are left alone.
4. `ClueBanner.svelte` already uses `var(--cell-highlighted, #e8ebfa)` and needs only the dark-mode pair added.

### `data-brand-token` markers

Markers are added on the elements whose visible appearance is currently being controlled by the token. For state-driven elements (e.g. a cell that's both selected and word-highlighted), the attribute is computed so it reflects the **active** appearance rather than a static "could affect" list.

**Static markers:**

```svelte
<div class="clue-banner" data-brand-token="highlight">…</div>
<div class="cell blocked" data-brand-token="cell-blocked"></div>
```

**Dynamic markers:**

```svelte
<div
  class="cell"
  class:word-highlighted={isHighlighted}
  class:selected={isSelected}
  data-brand-token={
    isSelected ? "selection" :
    isHighlighted ? "highlight" :
    "cell-bg"
  }
>
```

**Two-token elements (e.g. selected cell with both background and ring):** add a child marker rather than picking one:

```svelte
<div class="cell" data-brand-token="selection">
  <span class="cell-ring" data-brand-token="selection-ring" aria-hidden="true"></span>
  …
</div>
```

**Initial coverage:**

| Game        | Element                                | Token            |
|-------------|----------------------------------------|------------------|
| Crossword   | `.clue-banner`                         | `highlight`      |
| Crossword   | `.cell.word-highlighted`               | `highlight`      |
| Crossword   | `.cell.selected` (background)          | `selection`      |
| Crossword   | `.cell.selected` (ring child span)     | `selection-ring` |
| Crossword   | `.cell.blocked`                        | `cell-blocked`   |
| Crossword   | `.cell` (default)                      | `cell-bg`        |
| Crossword   | grid wrapper                           | `grid-border`    |
| Crossword   | `.clue-item.active`                    | `sidebar-active-bg` |
| Word search | found-word cell                        | `correct-light`  |
| Word search | drag-selection path                    | `selection`      |
| Word game   | tile per submitted state               | `correct` / `present` / `absent` |
| Word game   | current cell (active row entry)        | `selection-ring` |
| All         | top-level surface container            | `surface`        |
| All         | text-bearing element (illustrative)    | `text` / `text-muted` |

Tokens without a representative element in a given game (e.g. `cell-blocked` in word-game) get no marker; hovering the row highlights nothing in that preview, which is the correct behaviour.

### Dashboard hover plumbing

**State** — `BrandingEditor` adds:

```tsx
const [hoveredToken, setHoveredToken] = useState<string | null>(null)

<EditorPane … onTokenHover={setHoveredToken} />
<BrandingPreviewPane draft={draft} hoveredToken={hoveredToken} />
```

**Token row** in `AdvancedSection` (and any other section that wants to opt in):

```tsx
<div
  className="flex items-center gap-2"
  onMouseEnter={() => onTokenHover(token.id)}
  onMouseLeave={() => onTokenHover(null)}
  onFocus={() => onTokenHover(token.id)}
  onBlur={() => onTokenHover(null)}
>
  <span className="w-4 h-4 border rounded" style={{ background: value }} />
  <span className="font-medium">{token.label}</span>
  <span
    className="text-slate-400 cursor-help"
    title={token.description}
    aria-label={token.description}
  >ⓘ</span>
  <span className="font-mono text-xs text-slate-400 ml-auto">{token.id}</span>
  {/* …existing pin / customize controls… */}
</div>
```

Focus handlers ensure keyboard users see the highlight when tabbing through rows.

**Preview outline** — `BrandingPreviewPane` renders a scoped `<style>` next to the wrapper:

```tsx
{hoveredToken && (
  <style>{`
    [data-brand-preview] [data-brand-token="${hoveredToken}"] {
      outline: 2px dashed #ff00aa;
      outline-offset: 2px;
      transition: outline-color 100ms;
    }
  `}</style>
)}
```

`#ff00aa` is fixed magenta; never themed (it must remain visible against any user palette).

A `<style>` tag is preferred over mutating elements because the games own their DOM and re-render on Svelte updates; the selector approach is one mutation per hover state with zero coupling.

## Data flow (overrides, end-to-end)

1. User pins `highlight` and picks `#00ff00` in `AdvancedSection`.
2. `setOverride` calls `update("tokens", { ...draft.tokens, overrides: { highlight: "#00ff00" } })`.
3. `BrandingPreviewPane.buildVars(draft)` → `deriveTokens(draft.tokens)` returns `derived.highlight === "#00ff00"` (overrides win at `derive.ts:88`).
4. `FIELD_MAP.highlight` is `["--highlight", "--cell-highlighted", "--cell-related"]`; the wrapper inline-style gets all three set to `#00ff00`.
5. **Today:** the game's `<div class="light-theme">` re-declares `--cell-highlighted: #fcece8`, shadowing the wrapper. **After:** that declaration is gone; the wrapper's inline style cascades into the game; `.cell.word-highlighted { background: var(--cell-highlighted, #fcece8) }` resolves to `#00ff00`.

## Tradeoffs

- **Branded dark-mode visuals.** Today's `.dark-theme` ships a bespoke palette where alpha values and tints are tuned for dark backgrounds. After the fix, *unbranded* dark mode is byte-identical to today (paired `.dark-theme <selector>` rules carry the same defaults via fallbacks). *Branded* dark mode shows the brand colour at full saturation rather than the dark-tuned alpha-mixed version — so a brand pink rendered on a crossword in dark mode looks more saturated than today's bespoke `rgba(194, 94, 64, 0.15)` would. This is the intended behaviour: the user picked the colour. A future enhancement could derive a dark-tuned variant per token, but that is out of scope.
- **Marker coverage breadth.** Some elements (e.g. typography) lack an obvious anchor. v1 marks one representative element per token; coverage can grow incrementally based on user feedback.
- **Single magenta outline.** A user with a magenta brand will see a less-distinct outline. Acceptable; we prefer a fixed colour over palette-derived contrast logic.
- **Multiple tokens on one element.** Solved with child marker spans where it matters. For the long tail (a cell whose background and border are different tokens), we accept that hovering the border token highlights the whole cell.

## Testing

**Vitest unit tests in `app/src/lib/branding/__tests__/`:**

- `token-registry.test.ts`:
  - Every entry has non-empty `label`, `description`, `cssVars.length >= 1`, and a valid `group`.
  - The registry is closed over `derive.ts`'s output: every key returned by `deriveTokens()` for a known input has a registry entry (no UI-orphan tokens).
- `field-map-compat.test.ts`:
  - The `FIELD_MAP` re-exported from the registry deep-equals a snapshot of the previous static `FIELD_MAP` (regression guard for the resolve pipeline).

No game-side tests; `games/` has no test suite.

**Manual verification (dev mode `./dev.sh dev`, dashboard `/dashboard/branding`):**

1. **Per game (crossword, word-search, word-game, sudoku):**
   - Override `highlight = #00ff00`. Confirm the marked element turns green in the preview.
   - Override `selection = #00ff00`. Confirm.
   - Override `cell-blocked = #00ff00` (crossword). Confirm blocked squares are green, not black.
   - Reset all overrides. Confirm visual parity with `main`.
   - Set `theme="dark"` on the game host with no overrides. Confirm dark palette is unchanged from `main` (verifies paired `.dark-theme` rules carry the right fallback for every variable that previously differed in dark mode).
2. **Hover-to-highlight:**
   - Hover the `highlight` row. Magenta dashed outline appears around the clue banner and word-highlighted cells.
   - Move mouse away; outline disappears within ~100ms.
   - Tab to the row via keyboard. Outline appears.
   - Switch preview game type while hovering; outline tracks the new game's elements (or shows nothing for tokens with no marker, which is correct).
3. **Tooltip:** hover ⓘ on each row; description appears, names a concrete visual element.
4. **Production resolve unaffected:** embed a game via the public iframe with a real org token; saved branding still applies (this exercises `resolve.ts` server-side, which uses the same `FIELD_MAP` derived from the registry).

## Rollout

Three commits, each independently shippable:

1. **`fix(branding): stop games from re-declaring branded CSS variables`** — bug fix only. Each game's `.light-theme` block trimmed; defaults moved to use-site fallbacks. Safe to ship to production immediately; makes today's Advanced overrides actually work.
2. **`refactor(branding): introduce token registry as source of truth for FIELD_MAP`** — pure refactor. `field-map-compat.test.ts` guards the migration.
3. **`feat(branding): hover-to-highlight token rows and tooltips`** — markers in games + dashboard plumbing. The visible feature.

Splitting (3) into "markers" and "dashboard listener" is not worthwhile: markers without the listener are dead code; the listener without markers does nothing.

## Risk

- Paired `.dark-theme <selector>` rules must be written for every use site whose previous `.dark-theme` value differed from `.light-theme`. Easy to miss; manual verification step (4) covers each game.
- The registry migration could drop a key if hand-typed. The compat test guards this.
