# Shadcn Migration Round 3 — GameModal Bespoke Primitives Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the four remaining raw HTML form/button primitives in `app/src/components/GameModal.tsx` to shadcn equivalents, preserving the current visual identity exactly. After this plan ships, the entire `app/src` tree contains zero shadcn-replaceable raw primitives outside the documented allowlist (which shrinks by one entry).

**Architecture:** Pure mechanical migration — no design refresh, no GameModal file split. Three migration sites, three patterns:

1. **AI "Generate with AI" CTA** (line 615) — add a reusable `gradient` variant to `ui/button.tsx` (rust → rust-dark gradient with hover glow), then use `<Button variant="gradient">` at the call site.
2. **Inline word + clue editors** (lines 752, 765) — swap raw `<input>`s for shadcn `<Input>` with skinning className overrides that preserve the invisible-until-hover UX and small footprint.
3. **Per-letter main-word picker** (line 798) — install shadcn `<ToggleGroup>` + `<Toggle>` primitives (not yet present), then convert the 6×6 grid to `<ToggleGroup type="single">` with bespoke item className matching the current rust selected state. This adds proper a11y (arrow-key nav, `aria-pressed`).

**Tech Stack:** Next.js 16, React 19, Tailwind CSS, shadcn/ui (new-york style, neutral base, lucide icons), Radix UI primitives, class-variance-authority, tailwind-merge via `cn()`.

**Verification model:** This codebase has no React component test infrastructure (Vitest only matches `src/**/*.test.ts`, never `.tsx`). Each task therefore verifies via `yarn lint` (must remain at 0 errors / 0 warnings — gate locked in commit `538a710`), `yarn build`, the project pre-commit hook (`.githooks/pre-commit`), and visual inspection in dev (`./dev.sh dev` then open `http://localhost:3013/dashboard`). The pre-commit hook currently allowlists `app/src/components/GameModal.tsx`; the **final** task removes that allowlist entry, which is itself a regression test — if any raw primitive remains, the hook will reject the commit.

**Out of scope:**
- File split / extraction (CrosswordEditor, AiSettingsPanel, etc.) — would require its own brainstorm.
- Design refresh of any of the three sites — explicitly chosen "keep all 3 visuals" during brainstorming.
- Wider GameModal cleanup (1,211-line file has other smells, but those are not migration concerns).

**Pre-flight assumption:** You are working in a branch off the current `main` (`7a2a3db` or later). Use `superpowers:using-git-worktrees` to set up an isolated worktree before starting Task 1.

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `app/src/components/ui/button.tsx` | Modify | Add `gradient` variant to the cva `variant` enum. |
| `app/src/components/ui/toggle.tsx` | Create (via shadcn CLI) | Standard shadcn `<Toggle>` primitive (Radix `@radix-ui/react-toggle`). Dependency for `<ToggleGroup>`. |
| `app/src/components/ui/toggle-group.tsx` | Create (via shadcn CLI) | Standard shadcn `<ToggleGroup>` + `<ToggleGroupItem>` primitives (Radix `@radix-ui/react-toggle-group`). |
| `app/src/components/GameModal.tsx` | Modify | Three migration sites: AI CTA (~line 615), inline editors (~lines 752, 765), letter picker (~line 798). Plus removing two now-stale `TODO(games):` comments. Plus adding new imports (`Input`, `ToggleGroup`, `ToggleGroupItem`). |
| `.githooks/pre-commit` | Modify | Remove the `app/src/components/GameModal.tsx` entry from `ALLOWLIST` (final cleanup). |

No new components are extracted — the migration happens in place. The `gradient` variant in `ui/button.tsx` is reusable and may be adopted by other CTA surfaces later (e.g., `LandingHero`), but this plan does not migrate any other site to it.

---

## Task 1: Add `gradient` variant to `<Button>`

**Files:**
- Modify: `app/src/components/ui/button.tsx`

The current AI CTA className is:

```
w-full px-4 py-2.5 bg-gradient-to-r from-rust to-rust-dark text-white rounded-lg text-sm font-medium transition-all hover:shadow-md hover:shadow-rust/20 disabled:opacity-60 flex items-center justify-center gap-2
```

The cva base class for `Button` already provides `inline-flex items-center justify-center gap-2 transition-all rounded-md text-sm font-medium disabled:pointer-events-none disabled:opacity-50`. The new `gradient` variant therefore only needs to add: the gradient background, white text, and the rust-tinted hover shadow. Width (`w-full`), padding (`px-4 py-2.5`), and corner radius override (`rounded-lg`) stay at the call site since they are layout-specific, not variant-defining.

`disabled:opacity-60` from the original code conflicts with the base `disabled:opacity-50`. `cn()` uses `tailwind-merge`, which resolves duplicate utilities to the last-applied value, so listing `disabled:opacity-60` in the variant correctly overrides the base. (Verified: `tailwind-merge` is used inside `lib/utils.ts`.)

- [ ] **Step 1: Read current `ui/button.tsx`**

Run: `cat app/src/components/ui/button.tsx`

You should see a `cva(...)` block with `variants.variant` containing `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`. Confirm before editing.

- [ ] **Step 2: Add the `gradient` variant entry**

In `app/src/components/ui/button.tsx`, locate the `link` entry inside `variants.variant`:

```tsx
        link: "text-primary underline-offset-4 hover:underline",
```

Add a new `gradient` entry directly after it (still inside the `variant` object):

```tsx
        link: "text-primary underline-offset-4 hover:underline",
        gradient:
          "bg-gradient-to-r from-rust to-rust-dark text-white shadow-xs hover:shadow-md hover:shadow-rust/20 disabled:opacity-60",
```

Rationale for each token:
- `bg-gradient-to-r from-rust to-rust-dark` — exact match for the original site. `--rust` resolves to `var(--platform-accent)` so this is automatically white-label aware (verified in `globals.css:99-100`).
- `text-white` — original.
- `shadow-xs` — neutral default shadow, matched to other variants in this file (e.g. `outline`).
- `hover:shadow-md hover:shadow-rust/20` — original glow on hover.
- `disabled:opacity-60` — overrides base `disabled:opacity-50` via tailwind-merge.

Do **not** add `w-full`, `px-*`, `py-*`, or `rounded-lg` — those are layout overrides applied at the call site (Task 2).

- [ ] **Step 3: Verify lint stays green**

Run: `cd app && yarn lint`
Expected: `✖ 0 problems (0 errors, 0 warnings)` (or `Done in N.NNs.` with no error/warning lines).

If lint fails, the most likely cause is a stray comma or quote — re-check the diff.

- [ ] **Step 4: Verify build still succeeds**

Run: `cd app && yarn build`
Expected: `✓ Compiled successfully` followed by route listing. Should complete in under a minute.

- [ ] **Step 5: Commit**

```bash
git add app/src/components/ui/button.tsx
git commit -m "feat(ui): add gradient variant to Button"
```

The pre-commit hook should pass — this file isn't in the GameModal allowlist scope and the diff doesn't introduce raw primitives.

---

## Task 2: Migrate the AI "Generate with AI" CTA

**Files:**
- Modify: `app/src/components/GameModal.tsx` (~lines 614–637)

The CTA is wrapped in a conditional `{mainWord.trim() && (...)}` block. After migration, only the `<button>` element changes — the `aiLoading`/`aiSettingsOpen` content tree inside it stays identical (Loader2/Sparkles/ChevronUp/ChevronDown render exactly as before). The `Button` component already accepts arbitrary children and forwards button props (`type`, `onClick`, `disabled`).

**Stable anchors** for `Edit`:
- `TODO(games): unify "Generate with AI" CTA styling once branding tokens land` — single occurrence, will be deleted.
- The `<button type="button" onClick={() => setAiSettingsOpen(...)}` opening tag — single occurrence in the file.

- [ ] **Step 1: Confirm `Button` is already imported in GameModal.tsx**

Run: `grep -n "from \"@/components/ui/button\"" app/src/components/GameModal.tsx`

Expected: at least one match. (If zero, you'll need to add `import { Button } from "@/components/ui/button"` near the other UI imports — but Round 2 already added `<Button>` usage in this file at line 779, so this should never fail.)

- [ ] **Step 2: Replace the raw `<button>` with `<Button variant="gradient">`**

Use `Edit` with this `old_string`:

```tsx
                    {/* TODO(games): unify "Generate with AI" CTA styling once branding tokens land */}
                    <button
                      type="button"
                      onClick={() => setAiSettingsOpen(!aiSettingsOpen)}
                      disabled={aiLoading}
                      className="w-full px-4 py-2.5 bg-gradient-to-r from-rust to-rust-dark text-white rounded-lg text-sm font-medium transition-all hover:shadow-md hover:shadow-rust/20 disabled:opacity-60 flex items-center justify-center gap-2"
                    >
```

And this `new_string`:

```tsx
                    <Button
                      type="button"
                      variant="gradient"
                      onClick={() => setAiSettingsOpen(!aiSettingsOpen)}
                      disabled={aiLoading}
                      className="w-full px-4 py-2.5 rounded-lg"
                    >
```

The closing `</button>` tag of this element must also become `</Button>`. Find the matching close — it's the line that contains only `</button>` and follows the `aiLoading ? (...) : (...)` ternary block. The exact string to replace (after the opening-tag swap above):

`old_string`:
```tsx
                      )}
                    </button>
```

`new_string`:
```tsx
                      )}
                    </Button>
```

⚠️ **`</button>` is not unique in this file.** Other raw `<button>` sites still exist at this point (the letter picker, line ~798). Use the `replace_all: false` default and provide enough surrounding context (the `)}` on the preceding line plus indentation) — that two-line combination is unique to this site. Verify uniqueness first:

Run: `grep -n -B1 "</button>" app/src/components/GameModal.tsx`

You should see two occurrences. Confirm the right one is the AI CTA (preceded by the ternary closing `)}`) before editing.

- [ ] **Step 3: Verify the file builds**

Run: `cd app && yarn build`
Expected: `✓ Compiled successfully`.

If TypeScript complains, the most likely error is a malformed JSX after the edit — re-read lines 610–640 of the file to confirm the structure.

- [ ] **Step 4: Verify lint stays green**

Run: `cd app && yarn lint`
Expected: `0 errors, 0 warnings`.

- [ ] **Step 5: Visual verification**

This step requires the dev server. If `pm2` is already running brain-games on `:3013` (per CLAUDE.md MEMORY), use that. Otherwise:

Run: `./dev.sh dev` (or `pm2 restart brain-games` if pm2-managed)

Open `http://localhost:3013/dashboard`, sign in, click any game card to open `GameModal`. Type a value into "Main Word" — the "Generate with AI" CTA should appear and look **identical to before** (rust gradient left-to-right, white text + Sparkles icon, hover glow, ChevronDown/Up affordance, full-width with rounded-lg corners). Toggle it open and closed; click while disabled (set `aiLoading` momentarily by triggering a generate).

If the gradient direction looks wrong or the hover glow disappeared, check the variant entry in `ui/button.tsx`.

- [ ] **Step 6: Commit**

```bash
git add app/src/components/GameModal.tsx
git commit -m "refactor(GameModal): migrate AI CTA to Button gradient variant"
```

---

## Task 3: Migrate inline word + clue editors

**Files:**
- Modify: `app/src/components/GameModal.tsx` (~lines 750–778)

There are two adjacent raw `<input>`s inside the `wordsList.map(...)` row. The visual goal: invisible-until-hover border, small footprint, transparent background. shadcn `<Input>` has a default `h-9 px-3 py-1` with a visible `border-input` — we need to override these.

**Skinning className** (applied via `Input`'s `className` prop, which `cn()`-merges with the base):

```
h-auto px-1.5 py-1 text-xs border-transparent shadow-none rounded
hover:border-border
focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-ring
bg-transparent
```

Per-input additions:
- **Word input:** `font-mono font-bold uppercase w-24 shrink-0 text-[#0f172a]`
- **Clue input:** `text-muted-foreground flex-1`

`text-[#0f172a]` is preserved exactly from the current code (it's a hard-coded near-black; we're not refactoring color tokens in this plan).

**`shadow-none`** is required because the shadcn `<Input>` base includes `shadow-xs` — without overriding, the inline editor would gain a subtle shadow it doesn't currently have.

**`focus-visible:ring-0 focus-visible:ring-offset-0`** is required because the shadcn `<Input>` base adds `focus-visible:ring-[3px] focus-visible:ring-ring/50`. Original code only highlighted the border on focus (no ring), so we suppress the ring while keeping the `focus-visible:border-ring` border-color change.

- [ ] **Step 1: Confirm `Input` is already imported**

Run: `grep -n "from \"@/components/ui/input\"" app/src/components/GameModal.tsx`

Expected: one match. (Round 2 introduced the `<Input>` for the main-word field at line 600.)

- [ ] **Step 2: Replace the word input**

Use `Edit` with this `old_string`:

```tsx
                          <input
                            type="text"
                            value={entry.word}
                            onChange={(e) => {
                              const updated = [...wordsList]
                              updated[idx] = {
                                ...updated[idx],
                                word: e.target.value.toUpperCase(),
                              }
                              setWordsList(updated)
                            }}
                            className="text-xs font-mono font-bold text-[#0f172a] w-24 shrink-0 px-1.5 py-1 border border-transparent hover:border-border focus:border-ring focus:outline-none rounded bg-transparent uppercase"
                          />
```

And this `new_string`:

```tsx
                          <Input
                            type="text"
                            value={entry.word}
                            onChange={(e) => {
                              const updated = [...wordsList]
                              updated[idx] = {
                                ...updated[idx],
                                word: e.target.value.toUpperCase(),
                              }
                              setWordsList(updated)
                            }}
                            className="h-auto w-24 shrink-0 px-1.5 py-1 text-xs font-mono font-bold uppercase text-[#0f172a] bg-transparent border-transparent shadow-none rounded hover:border-border focus-visible:border-ring focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
```

- [ ] **Step 3: Replace the clue input**

Use `Edit` with this `old_string`:

```tsx
                          <input
                            type="text"
                            value={entry.clue}
                            onChange={(e) => {
                              const updated = [...wordsList]
                              updated[idx] = {
                                ...updated[idx],
                                clue: e.target.value,
                              }
                              setWordsList(updated)
                            }}
                            className="text-xs text-muted-foreground flex-1 px-1.5 py-1 border border-transparent hover:border-border focus:border-ring focus:outline-none rounded bg-transparent"
                            placeholder="Clue"
                          />
```

And this `new_string`:

```tsx
                          <Input
                            type="text"
                            value={entry.clue}
                            onChange={(e) => {
                              const updated = [...wordsList]
                              updated[idx] = {
                                ...updated[idx],
                                clue: e.target.value,
                              }
                              setWordsList(updated)
                            }}
                            className="h-auto flex-1 px-1.5 py-1 text-xs text-muted-foreground bg-transparent border-transparent shadow-none rounded hover:border-border focus-visible:border-ring focus-visible:ring-0 focus-visible:ring-offset-0"
                            placeholder="Clue"
                          />
```

- [ ] **Step 4: Verify lint + build**

Run: `cd app && yarn lint && yarn build`
Expected: lint = 0 errors / 0 warnings; build = `✓ Compiled successfully`.

- [ ] **Step 5: Visual verification**

In `GameModal`, add at least one word to the words list (or open an existing crossword). Each row should show the word (mono uppercase, fixed width) and clue (small muted, flexible width) in two adjacent inline fields:
- **No visible border at rest** — they should look like plain text.
- **Border appears on row hover** — the hover-target is the input itself; hovering the row container alone is *not* enough (matches existing behavior).
- **Border darkens on focus**, no glow ring around the field, no shadow.
- Typing a letter in the word field uppercases it; the X/remove button still works.

If a focus ring appears, the `focus-visible:ring-0` override didn't apply — check `ring-offset-0` is also set.

- [ ] **Step 6: Commit**

```bash
git add app/src/components/GameModal.tsx
git commit -m "refactor(GameModal): migrate inline word/clue editors to Input"
```

---

## Task 4: Install shadcn `toggle-group` + `toggle` primitives

**Files:**
- Create: `app/src/components/ui/toggle.tsx` (via shadcn CLI)
- Create: `app/src/components/ui/toggle-group.tsx` (via shadcn CLI)
- Modify: `app/package.json` + `app/yarn.lock` (Radix dependencies)

The shadcn CLI manages installation. `toggle-group` depends on `toggle`, so `add toggle-group` will auto-install both. Run from the `app/` directory because that's where `components.json` lives.

- [ ] **Step 1: Confirm `toggle-group` is not yet installed**

Run: `ls app/src/components/ui/ | grep -i toggle`
Expected: no output.

- [ ] **Step 2: Install via shadcn CLI**

Run: `cd app && npx shadcn@latest add toggle-group --yes`

Expected output includes:
- `Adding components: toggle-group, toggle`
- `Created app/src/components/ui/toggle.tsx`
- `Created app/src/components/ui/toggle-group.tsx`
- `Adding dependencies: @radix-ui/react-toggle, @radix-ui/react-toggle-group` (or similar)
- yarn install runs automatically

If the CLI prompts about overwriting `components.json` or any existing file, decline. `--yes` should suppress most prompts.

If you see a TypeScript or peer-dep warning, it's safe to proceed — Round 2 has shipped many shadcn additions on the same React 19 / Next 16 baseline without issues.

- [ ] **Step 3: Verify the new files exist and look right**

Run: `ls app/src/components/ui/toggle*.tsx`
Expected: both `toggle.tsx` and `toggle-group.tsx` present.

Run: `head -30 app/src/components/ui/toggle-group.tsx`
Expected: imports from `@radix-ui/react-toggle-group`, exports `ToggleGroup` and `ToggleGroupItem`, uses `cva` from `class-variance-authority` (matches the rest of the `ui/` directory).

If the file imports from `radix-ui` (the umbrella package) rather than `@radix-ui/react-toggle-group`, that's also fine — both styles exist in this codebase (e.g., `button.tsx` uses `radix-ui`). Don't refactor; leave as-is.

- [ ] **Step 4: Verify lint + build still green**

Run: `cd app && yarn lint && yarn build`
Expected: 0 errors / 0 warnings; build succeeds.

The newly added files will not have any warnings — they come straight from the shadcn registry, which is lint-clean for the configured rules.

- [ ] **Step 5: Commit**

The commit must include `package.json`, `yarn.lock`, and both new `ui/` files. No `GameModal.tsx` changes yet.

```bash
git add app/src/components/ui/toggle.tsx app/src/components/ui/toggle-group.tsx app/package.json app/yarn.lock
git commit -m "feat(ui): install shadcn ToggleGroup primitives"
```

If `git status` shows other unintended changes (e.g., a `components.json` rewrite), unstage and inspect — only the four files above should be in this commit.

---

## Task 5: Migrate the per-letter main-word picker to `<ToggleGroup>`

**Files:**
- Modify: `app/src/components/GameModal.tsx` (~lines 790–828)

Current structure:

```tsx
{/* TODO(games): the main-word letter picker uses bespoke per-letter selection styling — defer migration */}
{entry.word.split("").map((letter, letterIdx) => {
  const isSelected = entry.main_word_index === letterIdx
  return (
    <button ... onClick={() => { ... main_word_index: isSelected ? undefined : letterIdx }} ... className={isSelected ? "bg-rust ..." : "bg-white ..."}>
      {letter}
    </button>
  )
})}
```

This is a **single-select toggle group** where clicking the selected item deselects it (`isSelected ? undefined : letterIdx`). This maps cleanly to:

```tsx
<ToggleGroup
  type="single"
  value={entry.main_word_index?.toString() ?? ""}
  onValueChange={(v) => {
    const updated = [...wordsList]
    updated[idx] = {
      ...updated[idx],
      main_word_index: v === "" ? undefined : parseInt(v, 10),
    }
    setWordsList(updated)
  }}
>
  {entry.word.split("").map((letter, letterIdx) => (
    <ToggleGroupItem
      key={letterIdx}
      value={letterIdx.toString()}
      title={`Select letter "${letter}" for main word`}
      className="..."
    >
      {letter}
    </ToggleGroupItem>
  ))}
</ToggleGroup>
```

**Why `value` is a string:** Radix `ToggleGroup` requires string values. Convert with `.toString()` and `parseInt`. `main_word_index === undefined` maps to `""` (empty string = nothing selected), and Radix returns `""` when the user deselects the active item — preserving the original "click selected to clear" behavior.

**Skinning className for `ToggleGroupItem`** — the shadcn default item is roughly `h-9 px-3` with `data-[state=on]:bg-accent data-[state=on]:text-accent-foreground`. Override to match the existing 6×6 cell:

Base + selected state:
```
size-6 p-0 text-xs font-mono font-bold rounded border bg-white text-[#0f172a] border-border
hover:border-rust hover:bg-rust-light
data-[state=on]:bg-rust data-[state=on]:text-white data-[state=on]:border-rust data-[state=on]:ring-2 data-[state=on]:ring-rust/30
transition-all
```

The `data-[state=on]` selectors match Radix's data attribute on the active item — this is how shadcn's own default toggles handle selected styling.

`size-6` = `w-6 h-6`, matching the original `w-6 h-6`.

`p-0` is required because shadcn's `<ToggleGroupItem>` typically applies horizontal padding that would push the letter off-center in a 24px box.

- [ ] **Step 1: Add the new imports**

Find the existing `Input` import line in `GameModal.tsx`:

Run: `grep -n "components/ui/input" app/src/components/GameModal.tsx`

Add this line directly after the `Input` import:

```tsx
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
```

Use `Edit` with `old_string` = the `Input` import line and `new_string` = the `Input` import line + `\n` + the new `ToggleGroup` import line.

- [ ] **Step 2: Replace the picker block**

Use `Edit` with this `old_string`:

```tsx
                          <div className="flex gap-1 mt-1.5">
                            {/* TODO(games): the main-word letter picker uses bespoke per-letter selection styling — defer migration */}
                            {entry.word.split("").map((letter, letterIdx) => {
                              const isSelected =
                                entry.main_word_index === letterIdx
                              return (
                                <button
                                  key={letterIdx}
                                  type="button"
                                  onClick={() => {
                                    const updated = [...wordsList]
                                    updated[idx] = {
                                      ...updated[idx],
                                      main_word_index: isSelected
                                        ? undefined
                                        : letterIdx,
                                    }
                                    setWordsList(updated)
                                  }}
                                  className={`w-6 h-6 flex items-center justify-center text-xs font-mono font-bold rounded border transition-all ${
                                    isSelected
                                      ? "bg-rust text-white border-rust ring-2 ring-rust/30"
                                      : "bg-white text-[#0f172a] border-border hover:border-rust hover:bg-rust-light"
                                  }`}
                                  title={`Select letter "${letter}" for main word`}
                                >
                                  {letter}
                                </button>
                              )
                            })}
                            <span className="text-[10px] text-muted-foreground ml-1 self-center">
                              {entry.main_word_index !== undefined
                                ? "✓"
                                : "click a letter"}
                            </span>
                          </div>
```

And this `new_string`:

```tsx
                          <div className="flex gap-1 mt-1.5">
                            <ToggleGroup
                              type="single"
                              value={entry.main_word_index?.toString() ?? ""}
                              onValueChange={(v) => {
                                const updated = [...wordsList]
                                updated[idx] = {
                                  ...updated[idx],
                                  main_word_index:
                                    v === "" ? undefined : parseInt(v, 10),
                                }
                                setWordsList(updated)
                              }}
                              className="gap-1"
                            >
                              {entry.word.split("").map((letter, letterIdx) => (
                                <ToggleGroupItem
                                  key={letterIdx}
                                  value={letterIdx.toString()}
                                  title={`Select letter "${letter}" for main word`}
                                  className="size-6 p-0 text-xs font-mono font-bold rounded border bg-white text-[#0f172a] border-border hover:border-rust hover:bg-rust-light data-[state=on]:bg-rust data-[state=on]:text-white data-[state=on]:border-rust data-[state=on]:ring-2 data-[state=on]:ring-rust/30 transition-all"
                                >
                                  {letter}
                                </ToggleGroupItem>
                              ))}
                            </ToggleGroup>
                            <span className="text-[10px] text-muted-foreground ml-1 self-center">
                              {entry.main_word_index !== undefined
                                ? "✓"
                                : "click a letter"}
                            </span>
                          </div>
```

Note: the explicit `className="gap-1"` on `<ToggleGroup>` overrides shadcn's default item-grouping styling (which may include `gap-0` to make items visually adjoin). The original picker had `gap-1`, so we match it.

- [ ] **Step 3: Verify zero raw `<button>` or `<input>` remains in `GameModal.tsx`**

Run: `grep -nE '<(button|input|select|textarea)\b' app/src/components/GameModal.tsx`

Expected: **no output** (zero matches). If anything appears, it's a missed migration site or a leftover — re-read the surrounding lines and address before continuing.

- [ ] **Step 4: Verify lint + build**

Run: `cd app && yarn lint && yarn build`
Expected: 0 errors / 0 warnings; build succeeds.

- [ ] **Step 5: Visual + behavioral verification**

In `GameModal`, with a non-empty `mainWord` and at least one word added:

| Check | Expected |
|---|---|
| Letter cells render | One small (24×24) cell per character in the word, mono font, rust border on hover. |
| Click an unselected letter | Cell turns rust-filled, white text, with a soft rust ring. The "✓" indicator appears next to the row. |
| Click the same letter again | Cell deselects (returns to white). "click a letter" indicator returns. |
| Click a different letter while one is selected | Selection moves to the new letter (single-select). |
| Tab + arrow-key navigation | Tabbing into the group focuses the first item; left/right arrows move between cells; Enter/Space activates. (This is **new** functionality from Radix — a small a11y win.) |
| Multiple word rows | Each row is its own independent group — selecting in one doesn't affect another. |
| Existing crossword data | Loading a saved crossword with `main_word_index` already set shows the correct cell pre-selected. |

If arrow-key navigation doesn't work, the import path is wrong (you got the toggle component instead of toggle-group). If selection breaks across rows, the `value` prop is mis-bound — re-check that each `ToggleGroup` reads its own `entry.main_word_index`.

- [ ] **Step 6: Commit**

```bash
git add app/src/components/GameModal.tsx
git commit -m "refactor(GameModal): migrate letter picker to ToggleGroup"
```

---

## Task 6: Final cleanup — remove allowlist entry + final verification

**Files:**
- Modify: `.githooks/pre-commit`

The pre-commit hook currently exempts `app/src/components/GameModal.tsx` from the raw-primitives check. Now that all four sites are migrated, that exemption is stale. Removing it serves as a permanent regression test: any future commit reintroducing a raw `<button>/<input>/<select>/<textarea>` to GameModal will be blocked.

- [ ] **Step 1: Re-grep for raw primitives in GameModal**

Run: `grep -nE '<(button|input|select|textarea)\b' app/src/components/GameModal.tsx`

Expected: **zero output**.

If anything appears, do NOT proceed — go back and migrate it. The whole point of removing the allowlist is that GameModal should now match the same standard as the rest of `app/src`.

- [ ] **Step 2: Remove the GameModal allowlist entry**

Use `Edit` with this `old_string`:

```bash
  # disclosure button — Phase 11 audit allowlisted
  "app/src/components/DashboardSidebar.tsx"
  # bespoke per-feature widgets explicitly deferred from Round 2
  "app/src/components/GameModal.tsx"
)
```

And this `new_string`:

```bash
  # disclosure button — Phase 11 audit allowlisted
  "app/src/components/DashboardSidebar.tsx"
)
```

(Removes both the `# bespoke per-feature widgets ...` comment and the `GameModal.tsx` line, plus the now-unnecessary blank/preceding lines if any.)

- [ ] **Step 3: Verify the hook still runs**

Run: `bash .githooks/pre-commit`

Expected: exits silently with status 0 (no staged changes that violate the rules). If it errors, the bash file is malformed — re-check the syntax around the closing `)`.

- [ ] **Step 4: Final full-stack verification gate**

Run all three from `app/`:

```bash
cd app && yarn lint
cd app && yarn test
cd app && yarn build
```

Expected:
- Lint: `0 errors, 0 warnings`.
- Tests: `Tests  179 passed (179)` (or `178 passed (179)` if one of the parallel-load timeouts in `crossword-layout-server.test.ts` flakes; rerun if so).
- Build: `✓ Compiled successfully` followed by the route table.

- [ ] **Step 5: Final audit grep**

Run from repo root:

```bash
grep -rEn '<(button|input|select|textarea)\b' app/src --include='*.tsx'
```

Expected matches (everything below is allowlisted or required):
- `app/src/components/ui/input.tsx` — primitive internals
- `app/src/components/ui/textarea.tsx` — primitive internals
- `app/src/components/ui/FileUpload.tsx` (×2) — react-dropzone API
- `app/src/components/branding/fields/FileUploadField.tsx` — react-dropzone API
- `app/src/components/branding/sections/ThemeSection.tsx` — `<input type="color">`
- `app/src/components/branding/sections/TokenRow.tsx` — `<input type="color">`
- `app/src/components/DashboardSidebar.tsx` — disclosure button
- `app/src/components/ui/toggle.tsx` — primitive internals (newly added in Task 4)

**Zero matches in `app/src/components/GameModal.tsx`.** That's the success criterion for this round.

If GameModal appears, that's a regression — go back to Tasks 2/3/5.

- [ ] **Step 6: Commit**

```bash
git add .githooks/pre-commit
git commit -m "chore: remove GameModal allowlist after round 3 migration"
```

This commit will exercise the now-stricter hook against itself — if the file accidentally still has any raw primitives, the staged GameModal diff (if any from a previous commit being amended) would fail. Since this commit only touches the hook file, it should pass cleanly.

---

## Self-Review Checklist

Run after the plan is complete, before handoff. Each item must be a clear ✓ or fixed inline.

- [ ] **Spec coverage** — all three migration sites have an explicit task that migrates them: AI CTA (Task 2), inline editors (Task 3), letter picker (Task 5). The supporting infrastructure (Button gradient variant in Task 1, ToggleGroup install in Task 4) is included. The cleanup of the allowlist + final audit (Task 6) closes the loop.
- [ ] **Placeholder scan** — no `TODO`, `TBD`, `implement later`, or "similar to Task N" exists. Every step shows actual code or actual commands.
- [ ] **Type consistency** — `main_word_index` is `number | undefined` (existing schema, unchanged). Convert to/from string at the Radix boundary in Task 5; no type drift. `Button` props from Task 1 (`variant: "gradient"`) match the call site in Task 2. `ToggleGroup` / `ToggleGroupItem` import names in Task 5 match the export names in the shadcn-installed file from Task 4.
- [ ] **Allowlist consistency** — Task 6 removes only the GameModal entry. ThemeSection, TokenRow, FileUpload, FileUploadField, DashboardSidebar, and the two ui/ primitives stay allowlisted (verified necessary in Step 5 audit).
- [ ] **No new dependencies introduced beyond `@radix-ui/react-toggle*`** — the gradient variant uses only existing tokens (`--rust`, `--rust-dark`); the inline editor skinning uses only Tailwind utilities; the toggle group uses only the shadcn-installed Radix primitives.
- [ ] **Frequent commits** — six commits, one per task, each independently revertable.
