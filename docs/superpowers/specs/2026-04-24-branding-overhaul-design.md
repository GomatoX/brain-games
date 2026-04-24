# Branding Overhaul — Design Spec

**Date:** 2026-04-24
**Status:** Draft — pending user approval
**Primary goal:** Replace the current 27-flat-field branding system with a unified, token-based brand system that covers the dashboard chrome, embedded games, and play/landing pages from one editor — with a live, side-by-side preview and a draft-then-publish workflow.

## Context

Today, branding in `brain-games` lives in two parallel, disconnected systems:

1. **Per-org branding presets** (DB table `branding`, 27 flat color/font/radius columns, scoped by `orgId`) drive only the embedded games. Editor at `app/src/components/BrandingContent.tsx` is a long form of color pickers; the only "preview" is static color swatches on each preset card. Authors have no feedback loop and cannot see what their changes look like in a real game without leaving the editor.
2. **Platform env vars** (`PLATFORM_ACCENT`, `PLATFORM_NAME`, `HIDE_LANDING`, …) drive the dashboard chrome and landing page. These are baked at deploy time, one value per container, and have no per-org granularity.

Three concrete pain points:

- **Authoring UX is broken.** Org admins are presented with 27 ungrouped color pickers and no live feedback. Non-technical admins are overwhelmed; designers don't trust the result without testing in a real game.
- **Coverage is incomplete.** Logos, typography scale (sizes/weights, not just family), spacing density, full radius scale, and component variants (button/input/card style) are not customizable. The custom-CSS escape hatch designers ask for does not exist.
- **The dashboard isn't truly white-labellable.** Per-org branding stops at the game embed; an admin who has set their brand still sees the platform's colors when they log in to manage their content.

The overhaul unifies both systems behind one per-org branding model, expands what's customizable using a token-based architecture (small set of seeds + algorithmic derivation + override panel), and adds a live preview pane next to the editor so changes are visible as you type.

## Non-goals

- **Dark mode as part of brand presets.** `theme=light|dark` remains a separate query-param concept; brand presets define a single visual mode. (Cut from scope by user.)
- **Per-game-type extras as new top-level fields.** Game-specific tokens (crossword cell-bg, wordsearch highlight, etc.) move into the "advanced overrides" tier of the new system; no new dedicated game-specific surface in the editor.
- **Email template branding.** Branded transactional emails are out of scope; same for share-image/OG generation pipelines beyond just storing an uploaded OG image.
- **Dashboard layout customization.** Brand colors flow through to the dashboard, but admins do not get controls to restyle sidebar shape, topbar, or modal layout. The dashboard's *visual structure* stays platform-controlled.
- **Versioned brand history with rollback.** Draft + publish only. If rollback becomes a need later, a `branding_versions` table can be added without touching this design.
- **Image transcoding / thumbnail generation.** No Sharp dep. Admins upload at the size they want; the system caps dimensions and size, browsers do the rest.
- **A new feature flag.** This is a dashboard feature with a clean migration path; flag-gating it would just be ceremony.
- **Object-storage SDK now.** Local filesystem is the default backend; an `S3Backend` lands behind the same interface only when multi-replica PG deployment becomes real.

## Architecture

### Data model

The existing `branding` table is reshaped (not replaced) to use structured JSON columns:

```
branding
├─ id, org_id, name
├─ tokens             JSON  — { primary, surface, text, overrides: { ... } }
├─ typography         JSON  — { fontSans, fontSerif, scale }
├─ spacing            JSON  — { density, radius }
├─ components         JSON  — { button, input, card }
├─ logo_path          TEXT  — relative path under uploads root
├─ logo_dark_path     TEXT
├─ favicon_path       TEXT
├─ background_path    TEXT
├─ og_image_path      TEXT
├─ custom_css_games   TEXT  — sanitized, scope-prefixed CSS
├─ created_at, updated_at
```

JSON over flat columns because the token set will evolve (new derived tokens, new component variants); flat columns force a migration for every addition.

Two new tables:

- `branding_drafts` — same column shape as `branding`, with FK + UNIQUE on `branding_id`. Edits autosave here. "Publish" copies draft → live in a single transaction.
- `uploaded_files` — `id, org_id, path, mime, size, sha256, created_by, created_at`. Registry of every successful upload. Lets us GC orphans and dedupe by hash.

One new column on existing tables:

- `users.use_platform_chrome BOOLEAN NOT NULL DEFAULT FALSE` — staff/power-user opt-out from per-org dashboard branding.
- `organizations.default_branding_id` already exists; reused as the org's "active" brand.

Per-game `brandingId` FK on `crosswords` / `wordgames` / `wordsearches` is unchanged; org-level fallback via `default_branding_id` is unchanged; the existing `/api/public/games` continues to return the resolved brand.

### Storage abstraction

A single small file with no new deps:

```ts
// app/src/lib/storage/types.ts
export interface StorageBackend {
  put(key: string, data: Buffer, mime: string): Promise<{ path: string; sha256: string }>
  get(path: string): Promise<{ data: Buffer; mime: string } | null>
  delete(path: string): Promise<void>
}
```

- `LocalFsBackend` — writes under `BRANDING_UPLOAD_ROOT` env var, default `/app/data/uploads` (already a mounted PVC in the K8s SQLite deploy). Default backend, selected via `STORAGE_BACKEND=local` (also the default if unset).
- Future `S3Backend` lands as a sibling file behind the same interface; no caller changes.

All paths returned are relative (`branding/<orgId>/<sha256>.<ext>`); the backend resolves to absolute on read.

### Token system

Three seeds form the default editor surface; everything else is derived.

**Seeds:** `primary`, `surface`, `text`.

**Derived tokens** (computed in OKLCH space using `culori` for perceptual consistency):

| Token | Derivation rule |
|---|---|
| `primary-hover` | `primary` darkened by 8% L |
| `primary-light` | `primary` lightened to L=0.95, chroma 0.04 |
| `primary-foreground` | white or dark, chosen by APCA contrast against `primary` |
| `surface-elevated` | `surface` ±4% L (sign depends on surface lightness) |
| `surface-muted` | `surface` mixed with 4% `primary` |
| `border` | `text` at 12% alpha |
| `text-muted` | `text` at 60% alpha |
| `correct` / `present` / `absent` | fixed semantic greens/yellows/grays, lightly tinted by `primary` hue |
| `selection-*`, `highlight`, `cell-bg`, `cell-blocked`, `grid-border`, `main-word-marker`, `sidebar-active*` | derived from `primary` + `surface` |

About 30 derived tokens total, covering all 27 of the existing flat fields plus the new typography/spacing additions.

**Typography:**
- `fontSans`, `fontSerif` — same Google Fonts dropdown as today.
- `typeScale` — enum: `compact` | `default` | `relaxed`. Maps to `--text-sm`, `--text-base`, etc.

**Spacing:**
- `density` — enum: `compact` | `cozy` | `comfortable`. Maps to a small set of spacing CSS vars.
- `radius` — single seed (`md` value); `sm`, `lg`, `xl`, `pill` derived as `md * 0.5`, `md * 1.5`, `md * 2`, `9999px`. Each individually overridable.

**Component styles:**
- `button.variant` — `solid` | `outline` | `ghost-fill`.
- `button.shadow` — `none` | `subtle` | `pronounced`.
- `input.variant` — `outlined` | `filled` | `underlined`.
- `card.elevation` — `flat` | `subtle` | `lifted`.

**Presets:** 3–5 starter themes (working titles: Coral, Ocean, Forest, Mono, Sunset) ship as static seed-set definitions. Picking a preset fills the seeds and overrides; admin can tweak from there. Coral matches today's `#c25e40` platform default to preserve the current visual identity for orgs that don't customize.

**Advanced override panel:** flat scrollable list of all derived tokens. Each row shows `computed from <seed>` badge + resolved color swatch + a "pin / customize" action that converts it to a stored override. Pinned tokens get a small dot; clicking removes the pin and restores derivation. This is the mechanism by which a designer matches a brand guide pixel-for-pixel.

### Editor UX

Routes:

```
/dashboard/branding              — list of presets (cards, with live thumbnail)
/dashboard/branding/<id>/edit    — split-pane editor + preview
```

**Edit page (≥1024px viewport):**

```
┌──────────────────────────────────────────────────────────────────┐
│ Topbar: < Back   "Coral Theme" (name)    [Discard] [Publish●]   │
├──────────────────────────────┬───────────────────────────────────┤
│ EDITOR (scroll, ~480px)      │ PREVIEW (sticky, fills viewport)  │
│  ▼ Identity                  │  [Dashboard] [Game] [Login]       │
│  ▼ Theme (preset + 3 seeds)  │                                   │
│  ▼ Typography                │  ← live preview renders here      │
│  ▼ Spacing                   │                                   │
│  ▼ Components                │                                   │
│  ▼ Imagery                   │                                   │
│  ▶ Custom CSS (games)        │                                   │
│  ▶ Advanced overrides        │                                   │
└──────────────────────────────┴───────────────────────────────────┘
```

`▼` sections open by default; `▶` are collapsed.

**Edit page (<1024px):** editor stacks full-width; a floating "Preview" button bottom-right opens a sheet containing the tabbed preview.

**Preview tabs:**
- **Dashboard** — a representative slice (sidebar fragment + topbar + a card with buttons / inputs / text). Composed of the same React components used in the real dashboard so the preview is authentic. Not the literal `/dashboard` page.
- **Game** — mounts a real Web Component (`<crossword-game>` by default; small dropdown switches between crossword / wordsearch / wordgame). Loads a hardcoded sample puzzle; no API call.
- **Login** — a representative login card (logo + email/password + button) using the same components as the real login page.

**Live update mechanism (in-process, no iframe, no postMessage):**

1. Preview pane is a `<div data-brand-preview>` wrapper.
2. On every editor change, recompute the full token set from seeds + overrides via `culori`.
3. Set CSS vars on the wrapper element. CSS-var cascade applies to everything inside, including the mounted Web Component (the games' existing `applyBrandingFromData()` already uses `element.style.setProperty()` — the same approach scales to the wrapper level).
4. React state cycles re-render the dashboard/login tabs.

**Debounce:** 50ms on color picker drag (avoid layout-thrash). Instant on dropdown / radio changes. Autosave (separate, network) debounces at 800ms.

**Topbar status indicator:**
- "Saved" (gray) — no unsaved draft changes.
- "Saving…" (gray, spinner) — autosave in flight.
- "Draft" (yellow dot) — draft differs from live; **Publish** enabled.
- **Discard** wipes the draft, reverts editor to live state.

**List page:** preset cards each include a small "live preview" thumbnail rendered from the brand's tokens (primary swatch + font sample + button shape). Same Create / Edit / Delete actions as today.

### Draft + publish lifecycle

```
GET    /api/branding/<id>           → returns live + draft (if any)
PATCH  /api/branding/<id>/draft     → upsert draft (autosave)
POST   /api/branding/<id>/publish   → atomic: copy draft → live, delete draft
DELETE /api/branding/<id>/draft     → wipe draft, revert editor to live
```

- Each PATCH includes the draft's last-known `updated_at`; server rejects with 409 on mismatch. Editor catches 409 and prompts "reload draft from server / keep my changes."
- Publish is a single transaction: copy draft fields to live row, bump live `updated_at`, delete draft row. No mid-publish state where a viewer sees half a brand.
- Drafts are invisible outside the editor — they're not returned by `/api/public/games` and not applied to the dashboard chrome. Preview pane reads draft state directly from React, not via API.

### Runtime application

**Dashboard chrome (new path, replaces today's `--platform-accent` env-var injection):**

1. `app/src/app/dashboard/layout.tsx` (server component) reads the active org for the session: `getActiveOrgId(session) → orgs.defaultBrandingId → branding row`.
2. Computes the full token set server-side (seeds + overrides → derived values via `culori`). Returns a flat `Record<string, string>` of CSS-var-name → value.
3. Reads `users.use_platform_chrome` for the current user. If `true`, swaps the resolved tokens for the platform default token set. (Staff escape hatch.)
4. Layout renders `<html data-org-id="<orgId>" style={cssVarsObject}>`. The `data-org-id` attribute exists for custom-CSS scoping (below) and QA debugging.
5. Tailwind v4's `@theme inline { … }` block in `globals.css` (consistent with the shared-UI spec) maps semantic tokens like `bg-primary`, `text-foreground` to these CSS vars. Components written in plain Tailwind classes pick up the brand automatically.

Tokens that don't have a Tailwind mapping (e.g., game-specific `--cell-bg`) are still set on `<html>` but Tailwind doesn't know about them — they're consumed only by the embedded game's own CSS, which references them by raw var name.

**Org switcher:** when a user changes active org, the layout re-resolves and re-renders. CSS-var swap is single-frame; no flash if the switcher uses a server action that revalidates the layout. Falls back to a hard navigation if a server action isn't wired.

**Embedded game application (mostly unchanged):**

`/api/public/games?type=X&id=Y` returns `{ ..., branding }` where `branding` is the **fully derived** token set (computed once on the server). Two changes vs today:

1. **Field map rename.** `BRANDING_FIELD_MAP` keys in `shared/game-lib/branding.js` change from `accent_color`-style to the new derived-token names (`primary`, `primary-hover`, `cell-bg`, etc.). Game CSS files swap `var(--accent)` for `var(--primary)`, and so on. Mechanical rename across game-side stylesheets.
2. **Server-side derivation.** Games receive the flat resolved map; they don't need to know about derivation.

### Custom CSS (games-only)

- Stored in `branding.custom_css_games` as a sanitized, scope-prefixed blob (cap 16 KB).
- **Sanitization on save** (server-side): strip `@import`, `expression(`, `javascript:`, `<` (no embedded HTML), `behavior:`. Reject input that exceeds 16 KB.
- **Auto-scoping on save:** every top-level selector is rewritten by prepending `[data-org-id="<orgId>"] `. Implementation: tiny CSS tokenizer (no PostCSS dep — that would shake in ~200 KB). Common selector lists, `@media`, and `@supports` blocks supported. Storing the already-scoped version means the DB row is always safe to inject as-is.
- **Injection:** the `/play` page wraps the embedded game in `<div data-org-id="X">`. The custom CSS string lands in a `<style>` tag adjacent to the wrapper.
- **Editor preview parity:** the same scope-prefix function runs client-side in the editor so the preview matches what the published version will look like. Single source of truth function lives in `app/src/lib/branding/scope-css.ts`, imported by both server (sanitize on save) and client (preview).
- Custom CSS does not inject into the dashboard chrome — only into game embeds and the `/play` page. Lower blast radius.

### Uploads (logos & imagery)

**Endpoint:**

```
POST /api/uploads/branding   — multipart/form-data
  Auth: session required, user must belong to body.orgId
  Fields: file (binary), kind ("logo" | "logo-dark" | "favicon" | "background" | "og-image")
  → 200 { path: "branding/<orgId>/<sha256>.<ext>", sha256, size, mime }
  → 400 invalid mime / too big / bad dimensions
  → 401 / 403 auth
```

**Validation pipeline (server, in order):**

1. **Size** — reject >2 MB.
2. **Mime sniff** — read magic bytes; trust the signature, not the `Content-Type` header. Allowed: `image/png`, `image/jpeg`, `image/svg+xml`, `image/webp`.
3. **SVG sanitization** — for `image/svg+xml`, strip `<script>`, `<foreignObject>`, every `on*=` attribute, and `javascript:` URLs. Inline ~30-line sanitizer; no new dep.
4. **Dimension cap** — for raster images, decode header-only and reject if either side exceeds 2048 px. No transcoding.
5. **Hash & dedupe** — `sha256` the buffer; if `uploaded_files` already has this hash for this org, return the existing path.

**Storage layout:** `<root>/branding/<orgId>/<sha256>.<ext>`. Org-scoped subdirectory makes per-org cleanup trivial; sha256 filename means cache-friendly URLs (file content can never change for a given path) and inherent dedupe.

**`uploaded_files` registry:** every successful upload writes a row. On `branding`/`branding_drafts` save, the row's `logo_path` etc. point at registry entries. A nightly cleanup job (or on-delete handler when an org is deleted) GCs registry rows that aren't referenced.

**Serving:**

```
GET /api/uploads/<path>   — public read, no auth
  Streams from StorageBackend.get(path)
  Cache-Control: public, max-age=31536000, immutable
  404 on miss
```

Public read is acceptable because: (a) brand assets land on public game embeds anyway — no privacy expectation; (b) sha256-named paths are unguessable enough to prevent enumeration; (c) auth-free fetch means embedded games don't need session cookies to load logos. If org-private uploads ever appear, they'd live under a different prefix with auth.

## Migration

One Drizzle migration (consistent with the existing `ALTER TABLE` legacy auto-migrations in `app/src/db/index.ts`):

1. **Add new columns / tables** — `branding.tokens`, `branding.typography`, `branding.spacing`, `branding.components`, `branding.logo_path`, etc.; `branding_drafts`; `uploaded_files`; `users.use_platform_chrome`. All new columns nullable.
2. **Backfill existing rows** as part of the same auto-migration on first boot:
   - `tokens.primary` ← `accent_color`
   - `tokens.surface` ← `bg_primary_color` (or platform default if null)
   - `tokens.text` ← `text_primary_color` (or platform default if null)
   - `tokens.overrides` ← every other non-null old field, keyed by its derived-token name
   - `typography.fontSans` ← `font_sans`; `typography.fontSerif` ← `font_serif`
   - `spacing.radius` ← parsed numeric from `border_radius` text field (default `8` if unparseable)
   - `components.*` ← schema defaults
3. **Keep old columns for one release.** Do not drop in the same migration. Lets us roll back the app code without losing data if anything visible breaks.
4. **Drop old columns** in a follow-up small PR after the soak window.

Backfill is lossless for colors — every old field has a token destination, either as a seed or as an override. Day-1 visual result for any existing preset is indistinguishable from day-0.

## Testing

Vitest suites under `app/src/lib/__tests__/`:

- `branding-derive.test.ts` — pure function `(seeds, overrides) → flat token map`. Property-style assertions: `primary-hover` always darker than `primary`; `primary-foreground` always passes APCA against `primary`; overrides win.
- `scope-css.test.ts` — pure function. Simple selectors, nested selectors, `@media` rules, multi-selector lists (`a, b { ... }`), comments, malformed input. Snapshot test on a representative real-world CSS sample.
- `sanitize-svg.test.ts` — adversarial inputs: `<script>`, `onload=`, `javascript:` URLs, `<foreignObject>`, nested encodings.
- `branding-migrate.test.ts` — integration. Spin up an in-memory SQLite, seed with snapshot of old-format rows, run migration, assert mappings.
- `api/branding.test.ts` — full CRUD + draft + publish flow. PATCH idempotent; publish atomic; 409 on stale `updated_at`.
- `api/uploads.test.ts` — happy-path PNG; oversized PNG; mime mismatch; SVG with `<script>` (sanitized); 3000×3000 image (rejected on dimensions); dedupe (second upload of identical bytes returns existing path).

**Manual / browser verification** (per `CLAUDE.md`'s "if you can't test the UI, say so explicitly"):

- Editor live-preview parity: change primary color, confirm preview's dashboard tab updates within ~50ms; confirm game tab's mounted Web Component re-themes too.
- Cross-tab draft conflict: open same brand in two tabs, edit in both, confirm one gets a 409 and the conflict modal.
- Publish: change brand, publish, navigate to `/play?id=...&type=...` for that org's game, confirm new brand renders.
- Multi-org dashboard: log in as user in two orgs, switch active org, confirm chrome re-themes.
- `users.use_platform_chrome=true` opt-out: chrome stays neutral while game previews still re-theme.

## Rollout

Single PR or short series. Not a long-lived feature branch.

1. **Schema migration only** — add new columns/tables, leave old columns in place. Deploy.
2. **Data backfill** — runs as part of the same auto-migration on first boot of the new app code. Idempotent (skips rows where new columns are populated).
3. **New code** — editor, runtime application, API routes, derivation. Same deploy as #2 in practice.
4. **Soak window** — leave old columns in place for one release cycle. Lets us roll back app code without losing data.
5. **Drop old columns** — separate small PR merged after the soak.

**Backward compat for in-the-wild IIFE bundles.** The API response shape changes (new flat token map instead of old field names), but `shared/game-lib/branding.js` is updated in lockstep and bundled into the new IIFE. Customers re-pulling the IIFE get the new field map automatically. Customers pinned to an old IIFE would see broken branding — acceptable because the IIFE is delivered from this same `app/public/`, not a long-lived CDN; every page load gets the latest. There is no SDK versioning concern.

## Dependencies added

- `culori` — OKLCH color math for token derivation. ~50 KB. Used server-side and client-side. No transitive concerns.

No other new runtime deps. No PostCSS, Sharp, DOMPurify, multer, AWS SDK, or similar.

## Files touched (non-exhaustive)

**New:**
- `app/src/lib/branding/derive.ts` — token derivation (uses `culori`).
- `app/src/lib/branding/scope-css.ts` — CSS selector scope-prefixing (shared server/client).
- `app/src/lib/branding/sanitize-css.ts` — CSS sanitization (strip `@import`, `expression(`, etc.). Server-only.
- `app/src/lib/branding/sanitize-svg.ts` — SVG sanitizer. Server-only.
- `app/src/lib/storage/{types,local-fs,index}.ts` — storage abstraction.
- `app/src/app/api/branding/[id]/draft/route.ts` — draft PATCH/DELETE.
- `app/src/app/api/branding/[id]/publish/route.ts` — publish POST.
- `app/src/app/api/uploads/branding/route.ts` — upload POST.
- `app/src/app/api/uploads/[...path]/route.ts` — upload GET.
- `app/src/app/dashboard/branding/[id]/edit/page.tsx` — editor page.
- `app/src/components/branding/Editor.tsx`, `PreviewPane.tsx`, sub-components.
- `app/src/lib/__tests__/{branding-derive,scope-css,sanitize-svg,branding-migrate}.test.ts`.
- `app/src/lib/__tests__/api/{branding,uploads}.test.ts`.

**Modified:**
- `app/src/db/schema.sqlite.ts`, `schema.pg.ts` — branding reshape, new tables.
- `drizzle/sqlite/`, `drizzle/pg/` — generated migrations + backfill SQL.
- `app/src/db/index.ts` — register backfill auto-migration step.
- `app/src/components/BrandingContent.tsx` — list page (new thumbnails).
- `app/src/app/dashboard/layout.tsx` — dashboard chrome resolves from per-org brand instead of env var.
- `app/src/app/api/public/games/route.ts` — return derived token map instead of raw fields.
- `shared/game-lib/branding.js` — `BRANDING_FIELD_MAP` rename.
- Game-side stylesheets in `games/src/lib/*.svelte` — CSS-var name updates.
- `app/src/lib/platform.ts` — `PLATFORM_ACCENT` becomes the platform default seed (used when no per-org brand exists), not the only mechanism.
- `app/package.json` — add `culori`.

**Removed (in follow-up PR after soak):**
- 27 legacy color/font/radius columns from `branding`.
