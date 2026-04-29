# Shadcn Migration — Round 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the shadcn/ui migration started in Round 1 by converting every remaining surface in the dashboard, branding editor, dashboard chrome, public pages, and shared primitives to shadcn components and lucide-react icons. After this round, no `material-symbols-outlined` usage remains in `app/src` and no raw `<input>`/`<button>`/`<select>`/`<textarea>` left where a shadcn equivalent exists.

**Architecture:** Stock shadcn defaults (option C — branding/CSS variables come later). All components are owned source under `app/src/components/ui/`. The `react-dropzone` library is added for drag-and-drop file upload. Custom wrapper components (`PageHeader`, `FileUpload`, `CodeBlock`) are kept as thin shells but rebuilt internally on shadcn primitives so consumers don't change.

**Tech Stack:** Next.js 16, React 19, Tailwind v4, Radix primitives, shadcn/ui, react-hook-form + zod (already installed), `sonner` (already installed), `react-dropzone` (new), `lucide-react` (already installed).

---

## Pre-flight

This plan assumes you are working in the worktree at `.worktrees/shadcn-migration/` on branch `feat/shadcn-migration`. The branch already contains 21 commits from Round 1.

Pre-existing baseline (these are not your job to fix):
- `crossword-layout-server.test.ts` — 3 to 9 tests time out depending on machine load. Pre-existing on `main`.
- `globals.css` side-effect-import — produces a Next 16 type-check warning. Pre-existing on `main`.
- `no-img-element` ESLint warnings on existing `<img>` tags. Pre-existing.

After **every** code-changing task, the gate is:
```bash
cd app && yarn lint --max-warnings=0   # warnings allowed if pre-existing
cd app && yarn test                    # 175/178 baseline (3 pre-existing flaky)
```

A drop below 175 passing tests OR a NEW lint error means stop and investigate.

---

## File Structure

### New files
- `app/src/lib/upload-branding.ts` — extracted upload logic shared by `FileUpload` (custom) + `FileUploadField` (branding).

### Files modified (grouped by phase)
**Phase 5 — branding editor primitives:**
- `app/src/components/branding/fields/SelectField.tsx`
- `app/src/components/branding/sections/ThemeSection.tsx`
- `app/src/components/branding/sections/TokenRow.tsx`
- `app/src/components/branding/sections/SpacingSection.tsx`
- `app/src/components/branding/sections/CustomCssSection.tsx`
- `app/src/components/branding/fields/FileUploadField.tsx`
- `app/src/components/branding/BrandingEditor.tsx`
- `app/src/components/branding/preview/GamePreview.tsx`

**Phase 6 — dashboard chrome:**
- `app/src/components/DashboardTopbar.tsx`
- `app/src/components/DashboardSidebar.tsx`
- `app/src/components/PlatformLogo.tsx`

**Phase 7 — lists & nav:**
- `app/src/components/GamePagination.tsx`
- `app/src/components/DashboardContent.tsx`

**Phase 8 — round-1 leftovers:**
- `app/src/components/TeamContent.tsx` (lines 321, 370)

**Phase 9 — public pages:**
- `app/src/app/page.tsx` (landing)
- `app/src/app/play/page.tsx`
- `app/src/app/invite/[token]/page.tsx`
- `app/src/app/invite/[token]/InviteForm.tsx`

**Phase 10 — custom primitives + last icons:**
- `app/src/components/ui/FileUpload.tsx`
- `app/src/components/ui/PageHeader.tsx`
- `app/src/components/ui/CodeBlock.tsx`
- `app/src/components/BrandingContent.tsx`

**Phase 11 — cleanup:**
- (audit + commit only — no further code edits expected)

### Files explicitly NOT modified
- `app/src/components/branding/preview/ButtonVariantPreview.tsx` — it exists to preview the user's custom CSS tokens via inline styles. Migrating to shadcn `<Button>` would mask the token effects from the user. Same applies to `CardElevationPreview.tsx`, `InputVariantPreview.tsx`.
- `app/src/components/branding/BrandingPreviewPane.tsx` — pure layout, no interactive primitives.
- `app/src/components/CrosswordDemo.tsx`, `app/src/components/PlayEmbed.tsx`, `app/src/components/SessionGuard.tsx`, `app/src/components/DashboardContainer.tsx` — verified by audit; either layout-only or script loaders. Phase 11 reverifies.
- `app/src/app/globals.css:152` — the `.material-symbols-outlined` utility class definition stays (harmless if no consumer remains; keeps emergency escape valve).

---

## Task Conventions

Each task's commits follow Conventional Commits (`feat:`, `refactor:`, `chore:`). After each task:
1. **Stage explicit paths** — never `git add -A`. Round 1 had a leak; Phase 0 hardened against it.
2. **Run gate** — `cd app && yarn lint && yarn test`.
3. **Match surrounding style.** Existing branding files **omit semicolons**; existing top-level dashboard files (e.g. `DashboardSidebar.tsx`, `TeamContent.tsx`) **use semicolons**. CLAUDE.md says: "match the surrounding file." When you create new code in a file that has semicolons, keep semicolons. New code in a no-semi file: no semis.

The **handle\*** event-handler convention applies to all new handlers.

---

# Phase 5 — Branding Editor Primitives

The branding editor sidebar uses raw `<select>`, `<input type="color">`, `<input type="range">`, `<textarea>`, and bespoke buttons. Migrate the **field primitives** (used many times) and the **section-level controls** that don't compose to a primitive.

---

### Task 5.1: Migrate SelectField to shadcn Select

**Files:**
- Modify: `app/src/components/branding/fields/SelectField.tsx`

`SelectField` is the most-used field primitive in the editor (Theme preset, Spacing density, Typography font choice). Currently a native `<select>` in a `<label>`.

- [ ] **Step 1: Read the file**

```bash
cat app/src/components/branding/fields/SelectField.tsx
```

Confirm the props interface: `{ label, value, options: { value, label }[], onChange, placeholder? }`. The `placeholder` becomes a disabled `<option value="">` shown when `value === ""`.

- [ ] **Step 2: Replace contents**

Write `app/src/components/branding/fields/SelectField.tsx`:

```tsx
"use client"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type SelectOption = { value: string; label: string }

type Props = {
  label: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  /** Optional placeholder shown when value === "". */
  placeholder?: string
}

export default function SelectField({
  label,
  value,
  options,
  onChange,
  placeholder,
}: Props) {
  // shadcn Select disallows empty-string values for items; map "" → undefined
  // for the controlled value so the placeholder shows.
  const selectValue = value === "" ? undefined : value
  return (
    <div className="block text-sm">
      <Label className="block mb-1">{label}</Label>
      <Select value={selectValue} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
```

**Why `selectValue === undefined`:** Radix Select treats empty string as a sentinel reserved for "no selection"; passing `value=""` to a controlled Select throws at runtime. The `ThemeSection` calls `<SelectField value="" ... />` to show a "Pick a preset…" placeholder, so this mapping keeps that behaviour.

- [ ] **Step 3: Verify the lint+test gate**

```bash
cd app && yarn lint && yarn test
```

Expected: 175 passing, no new lint warnings.

- [ ] **Step 4: Commit**

```bash
git add app/src/components/branding/fields/SelectField.tsx
git commit -m "refactor(branding): migrate SelectField to shadcn Select"
```

---

### Task 5.2: Migrate ThemeSection brand-seed inputs

**Files:**
- Modify: `app/src/components/branding/sections/ThemeSection.tsx`

The "primary / surface / text" rows use `<input type="color">` next to `<input type="text" className="border rounded ...">`. Native color picker stays (shadcn has no equivalent), but the text input → shadcn `<Input>`. The hover-highlight wrapper stays (it drives the preview's token highlight).

- [ ] **Step 1: Update imports**

At the top of `app/src/components/branding/sections/ThemeSection.tsx`, after the existing imports, add:

```tsx
import { Input } from "@/components/ui/input"
```

- [ ] **Step 2: Replace the brand-seed loop**

Find the block (currently lines 58–82):

```tsx
{(["primary", "surface", "text"] as const).map((k) => (
  <label
    key={k}
    className="block text-sm rounded px-1 -mx-1 hover:bg-slate-50 focus-within:bg-slate-50"
    onMouseEnter={() => onTokenHover?.(k)}
    onMouseLeave={() => onTokenHover?.(null)}
    onFocus={() => onTokenHover?.(k)}
    onBlur={() => onTokenHover?.(null)}
  >
    <span className="block mb-1 capitalize">{k}</span>
    <div className="flex gap-2 items-center">
      <input
        type="color"
        value={draft.tokens[k]}
        onChange={(e) => setSeed(k, e.target.value)}
      />
      <input
        type="text"
        className="border rounded px-2 py-1 flex-1"
        value={draft.tokens[k]}
        onChange={(e) => setSeed(k, e.target.value)}
      />
    </div>
  </label>
))}
```

Replace with (label → Label component; text input → shadcn Input; native color picker preserved):

```tsx
{(["primary", "surface", "text"] as const).map((k) => (
  <div
    key={k}
    className="block text-sm rounded px-1 -mx-1 hover:bg-accent focus-within:bg-accent"
    onMouseEnter={() => onTokenHover?.(k)}
    onMouseLeave={() => onTokenHover?.(null)}
    onFocus={() => onTokenHover?.(k)}
    onBlur={() => onTokenHover?.(null)}
  >
    <Label className="block mb-1 capitalize" htmlFor={`brand-seed-${k}`}>
      {k}
    </Label>
    <div className="flex gap-2 items-center">
      <input
        type="color"
        aria-label={`${k} color`}
        value={draft.tokens[k]}
        onChange={(e) => setSeed(k, e.target.value)}
        className="h-9 w-10 rounded border border-input cursor-pointer bg-background"
      />
      <Input
        id={`brand-seed-${k}`}
        type="text"
        value={draft.tokens[k]}
        onChange={(e) => setSeed(k, e.target.value)}
        className="flex-1"
      />
    </div>
  </div>
))}
```

Also add `import { Label } from "@/components/ui/label"` at the top.

The `<label>` becomes a `<div>` because shadcn `Label` is the actual label and we need the wrapping element for hover/focus events without nesting labels.

- [ ] **Step 3: Verify the lint+test gate**

```bash
cd app && yarn lint && yarn test
```

- [ ] **Step 4: Commit**

```bash
git add app/src/components/branding/sections/ThemeSection.tsx
git commit -m "refactor(branding): migrate ThemeSection brand-seed inputs to shadcn"
```

---

### Task 5.3: Migrate TokenRow buttons + color input

**Files:**
- Modify: `app/src/components/branding/sections/TokenRow.tsx`

`TokenRow` currently uses native `<button>` for Pin/Reset and `<input type="color">` for the swatch picker. Migrate buttons to shadcn `<Button variant="link" size="sm">`, keep native color input.

- [ ] **Step 1: Replace contents**

Write `app/src/components/branding/sections/TokenRow.tsx`:

```tsx
"use client"
import HelpHint from "../fields/HelpHint"
import type { TokenDef } from "@/lib/branding/token-registry"
import { Button } from "@/components/ui/button"

type Props = {
  token: TokenDef
  /** Resolved colour shown in the swatch (override value if pinned, else derived). */
  value: string
  /** True when the user has pinned an override for this token. */
  isPinned: boolean
  onPin: (value: string) => void
  onReset: () => void
  onChange: (next: string) => void
  onHover?: (id: string | null) => void
}

export default function TokenRow({
  token, value, isPinned, onPin, onReset, onChange, onHover,
}: Props) {
  return (
    <div
      className="flex items-center gap-2 py-1 px-1 rounded hover:bg-accent focus-within:bg-accent"
      onMouseEnter={() => onHover?.(token.id)}
      onMouseLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(token.id)}
      onBlur={() => onHover?.(null)}
    >
      <span className="inline-block w-4 h-4 border rounded shrink-0" style={{ background: value }} />
      <span className="font-medium truncate text-xs">{token.label}</span>
      <HelpHint text={token.description} />
      <span className="font-mono text-[10px] text-muted-foreground ml-auto truncate">{token.id}</span>
      {isPinned ? (
        <>
          <input
            type="color"
            aria-label={`${token.label} color`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-8 h-6 shrink-0 rounded border border-input cursor-pointer bg-background"
          />
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={onReset}
            className="h-auto p-0 text-xs shrink-0"
          >
            Reset
          </Button>
        </>
      ) : (
        <Button
          type="button"
          variant="link"
          size="sm"
          onClick={() => onPin(value)}
          className="h-auto p-0 text-xs shrink-0"
        >
          Pin
        </Button>
      )}
    </div>
  )
}
```

The `text-blue-600` colour is replaced with shadcn's link variant which uses `text-primary`. The slate-50 hover becomes `bg-accent`. `text-slate-400` becomes `text-muted-foreground`.

- [ ] **Step 2: Verify the lint+test gate**

```bash
cd app && yarn lint && yarn test
```

- [ ] **Step 3: Commit**

```bash
git add app/src/components/branding/sections/TokenRow.tsx
git commit -m "refactor(branding): migrate TokenRow buttons to shadcn"
```

---

### Task 5.4: Migrate SpacingSection range to shadcn Slider

**Files:**
- Modify: `app/src/components/branding/sections/SpacingSection.tsx`

`SpacingSection` has a corner-radius `<input type="range" min={0} max={24}>`. shadcn ships a `<Slider>` that wraps Radix Slider. The component is already installed (`app/src/components/ui/slider.tsx`).

- [ ] **Step 1: Replace contents**

Write `app/src/components/branding/sections/SpacingSection.tsx`:

```tsx
"use client"
import type { DraftState } from "../BrandingEditor"
import SelectField from "../fields/SelectField"
import HelpHint from "../fields/HelpHint"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

const DENSITY_OPTIONS = [
  { value: "compact", label: "Compact" },
  { value: "cozy", label: "Cozy" },
  { value: "comfortable", label: "Comfortable" },
]

const DENSITY_HELP =
  "Controls the breathing room around buttons, cards, and form fields. Compact = tighter; Comfortable = roomier."

type Props = {
  draft: DraftState
  update: <K extends keyof DraftState>(key: K, val: DraftState[K]) => void
}

export default function SpacingSection({ draft, update }: Props) {
  return (
    <details open className="mb-4">
      <summary className="font-semibold cursor-pointer">Spacing</summary>
      <div className="mt-3 space-y-3">
        <div className="flex items-center gap-1">
          <div className="flex-1">
            <SelectField
              label="Density"
              value={draft.spacing.density}
              options={DENSITY_OPTIONS}
              onChange={(v) =>
                update("spacing", { ...draft.spacing, density: v as DraftState["spacing"]["density"] })
              }
            />
          </div>
          <div className="self-end pb-2">
            <HelpHint text={DENSITY_HELP} />
          </div>
        </div>
        <div className="block text-sm">
          <Label className="block mb-1" htmlFor="branding-radius">
            Corner radius: {draft.spacing.radius} px
          </Label>
          <Slider
            id="branding-radius"
            aria-label="Corner radius"
            min={0}
            max={24}
            step={1}
            value={[draft.spacing.radius]}
            onValueChange={(values) =>
              update("spacing", { ...draft.spacing, radius: values[0] })
            }
            className="w-full"
          />
        </div>
      </div>
    </details>
  )
}
```

shadcn `<Slider>` is array-based for range support; we read `values[0]` for single-thumb.

- [ ] **Step 2: Verify the lint+test gate**

```bash
cd app && yarn lint && yarn test
```

- [ ] **Step 3: Commit**

```bash
git add app/src/components/branding/sections/SpacingSection.tsx
git commit -m "refactor(branding): migrate SpacingSection range to shadcn Slider"
```

---

### Task 5.5: Migrate CustomCssSection textarea to shadcn Textarea

**Files:**
- Modify: `app/src/components/branding/sections/CustomCssSection.tsx`

- [ ] **Step 1: Replace contents**

Write `app/src/components/branding/sections/CustomCssSection.tsx`:

```tsx
"use client"
import type { DraftState } from "../BrandingEditor"
import { Textarea } from "@/components/ui/textarea"

const MAX_CSS_BYTES = 16 * 1024

type Props = {
  draft: DraftState
  update: <K extends keyof DraftState>(key: K, val: DraftState[K]) => void
}

export default function CustomCssSection({ draft, update }: Props) {
  const value = draft.customCssGames ?? ""
  return (
    <details className="mb-4">
      <summary className="font-semibold cursor-pointer">Custom CSS (games only)</summary>
      <div className="mt-3 space-y-2">
        <p className="text-xs text-muted-foreground">
          Extra styles applied inside game embeds for this brand only —
          your CSS won&apos;t affect other tenants. Max {MAX_CSS_BYTES.toLocaleString()} bytes.
        </p>
        <Textarea
          aria-label="Custom CSS for games"
          className="font-mono text-xs"
          rows={10}
          value={value}
          onChange={(e) => update("customCssGames", e.target.value)}
        />
        <div className="text-xs text-muted-foreground">
          {value.length} / {MAX_CSS_BYTES} bytes
        </div>
      </div>
    </details>
  )
}
```

The inline `style={{ color: "var(--text-muted)" }}` becomes `text-muted-foreground` (shadcn token).

- [ ] **Step 2: Verify the lint+test gate**

```bash
cd app && yarn lint && yarn test
```

- [ ] **Step 3: Commit**

```bash
git add app/src/components/branding/sections/CustomCssSection.tsx
git commit -m "refactor(branding): migrate CustomCssSection textarea to shadcn"
```

---

### Task 5.6: Migrate FileUploadField to react-dropzone + shadcn

**Files:**
- Modify: `app/src/components/branding/fields/FileUploadField.tsx`
- Test: `app/src/components/branding/fields/__tests__/FileUploadField.test.tsx` (must keep passing)

This is the largest task in Phase 5. Existing component handles drag+drop with hand-rolled handlers, file-input, upload progress, alert-on-error, and remove-button. Replace drag-and-drop with `react-dropzone`, hook in shadcn `<Button>`, and replace `window.alert` with `sonner`. Existing test file (`FileUploadField.test.tsx`) covers: initial render, file-input change, drag-and-drop, accept-prop, max-file-size — all must continue passing.

- [ ] **Step 1: Add react-dropzone dependency**

```bash
cd app && yarn add react-dropzone
```

Verify it's added to `app/package.json` dependencies.

- [ ] **Step 2: Read the existing test file to understand the contract**

```bash
cat app/src/components/branding/fields/__tests__/FileUploadField.test.tsx
```

Key contracts (test names):
- renders dropzone when path is null
- renders preview when path is set
- calls onChange with new path on successful upload
- calls onChange with null when remove is clicked
- shows alert on upload error  ← need to migrate this expectation to sonner toast
- accepts drag-and-drop on the dropzone (data-testid="file-upload-dropzone")
- restricts accepted file types to images
- restricts max file size

If the existing test asserts `window.alert` was called, change those assertions to assert on sonner. **Use `vi.mock("sonner", () => ({ toast: { error: vi.fn() } }))`** at the top of the test.

- [ ] **Step 3: Replace component contents**

Write `app/src/components/branding/fields/FileUploadField.tsx`:

```tsx
"use client"
import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

type Props = {
  label: string
  /** Upload kind passed to /api/uploads/branding (e.g. "logo", "favicon", "background"). */
  kind: string
  /** Current upload path, relative to /api/uploads/. `null` means no image yet. */
  path: string | null
  onChange: (path: string | null) => void
}

export default function FileUploadField({ label, kind, path, onChange }: Props) {
  const [uploading, setUploading] = useState(false)

  const handleFile = async (file: File) => {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("kind", kind)
      const res = await fetch("/api/uploads/branding", { method: "POST", body: fd })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        toast.error(`Upload failed: ${body.error ?? res.status}`)
        return
      }
      const body = (await res.json()) as { path: string }
      onChange(body.path)
    } finally {
      setUploading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
      "image/svg+xml": [".svg"],
    },
    multiple: false,
    disabled: uploading,
    noClick: false,
    onDrop: (accepted) => {
      const f = accepted[0]
      if (f) void handleFile(f)
    },
  })

  return (
    <div className="text-sm">
      <div className="mb-1">{label}</div>
      <div
        {...getRootProps()}
        data-testid="file-upload-dropzone"
        className={
          "flex gap-3 items-center p-3 border-2 rounded transition cursor-pointer " +
          (isDragActive
            ? "border-primary bg-accent"
            : "border-dashed border-input hover:border-ring")
        }
      >
        <input {...getInputProps()} />
        {path ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api/uploads/${path}`}
            alt={label}
            className="h-16 max-w-[8rem] object-contain border rounded bg-background"
          />
        ) : (
          <span className="flex-1 text-muted-foreground">
            Drop an image here, or click to choose
          </span>
        )}
        {uploading && (
          <span className="text-xs text-muted-foreground">Uploading…</span>
        )}
        {path && !uploading && (
          <Button
            type="button"
            variant="link"
            size="sm"
            className="text-destructive h-auto p-0"
            onClick={(e) => {
              // The dropzone root would re-open the file dialog otherwise.
              e.stopPropagation()
              onChange(null)
            }}
          >
            Remove
          </Button>
        )}
        {!path && !uploading && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              open()
            }}
          >
            Choose file
          </Button>
        )}
      </div>
    </div>
  )
}
```

Notes:
- `useDropzone({ noClick: false })` makes the whole zone clickable, matching the original "click to upload" affordance.
- `open()` from `useDropzone` triggers the file picker programmatically — wired to a "Choose file" button so the explicit affordance still exists when the entire zone is clickable.
- `e.stopPropagation()` on the Remove and Choose-file buttons prevents the dropzone root's click from firing twice.

- [ ] **Step 4: Update the test file if it asserted on `window.alert`**

If the existing test asserts on `window.alert`, replace those assertions:

```ts
// Before
expect(window.alert).toHaveBeenCalledWith(...)

// After
import { toast } from "sonner"
vi.mock("sonner", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}))

// in test:
expect(toast.error).toHaveBeenCalledWith(expect.stringContaining("Upload failed"))
```

If the test does not assert on alert, no test changes needed.

- [ ] **Step 5: Run the targeted test**

```bash
cd app && yarn test src/components/branding/fields/__tests__/FileUploadField.test.tsx
```

Expected: all 8 tests pass. If any fail, read the failure output and fix the test or component until they pass.

- [ ] **Step 6: Run the full gate**

```bash
cd app && yarn lint && yarn test
```

- [ ] **Step 7: Commit**

```bash
git add app/package.json app/yarn.lock app/src/components/branding/fields/FileUploadField.tsx app/src/components/branding/fields/__tests__/FileUploadField.test.tsx
git commit -m "refactor(branding): migrate FileUploadField to react-dropzone + shadcn"
```

---

### Task 5.7: Migrate BrandingEditor header buttons + status icons

**Files:**
- Modify: `app/src/components/branding/BrandingEditor.tsx`

Three action buttons (Discard, Publish, Reload-after-conflict) + four `material-symbols-outlined` status icons (`check_circle`, `rocket_launch`, `undo`, `warning`).

- [ ] **Step 1: Update imports**

Add at the top of the file:

```tsx
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, Rocket, Undo2, AlertTriangle } from "lucide-react"
```

- [ ] **Step 2: Replace the four status-icon spans**

Replace the four uses of `<span className="material-symbols-outlined ...">` with their lucide equivalents. Find each block and swap as follows:

`{saveState === "just-saved" && (` block:
```tsx
// Before
<span className="material-symbols-outlined text-sm">check_circle</span>
// After
<CheckCircle2 className="size-4" />
```

`{saveState === "just-published" && (` block:
```tsx
// Before
<span className="material-symbols-outlined text-sm">rocket_launch</span>
// After
<Rocket className="size-4" />
```

`{saveState === "just-discarded" && (` block:
```tsx
// Before
<span className="material-symbols-outlined text-sm">undo</span>
// After
<Undo2 className="size-4" />
```

The `<span className="material-symbols-outlined text-yellow-700">warning</span>` inside the conflicted-banner block:
```tsx
// Before
<span className="material-symbols-outlined text-yellow-700">warning</span>
// After
<AlertTriangle className="size-4 text-yellow-700" />
```

- [ ] **Step 3: Replace the two header buttons**

Find the header right-aligned button group (currently lines ~322–337):

```tsx
<div className="ml-auto flex gap-2">
  <button
    onClick={discard}
    disabled={!hasDraft || editorLocked}
    className="px-3 py-1 border rounded disabled:opacity-50"
  >
    Discard
  </button>
  <button
    onClick={publish}
    className="px-3 py-1 rounded text-white disabled:opacity-50"
    style={{ background: "var(--primary)" }}
    disabled={publishDisabled}
  >
    {publishing ? "Publishing…" : "Publish"}
  </button>
</div>
```

Replace with:

```tsx
<div className="ml-auto flex gap-2">
  <Button
    type="button"
    variant="outline"
    size="sm"
    onClick={discard}
    disabled={!hasDraft || editorLocked}
  >
    Discard
  </Button>
  <Button
    type="button"
    size="sm"
    onClick={publish}
    disabled={publishDisabled}
  >
    {publishing ? "Publishing…" : "Publish"}
  </Button>
</div>
```

The `style={{ background: "var(--primary)" }}` is gone because shadcn Button's default variant already maps to `--primary`.

- [ ] **Step 4: Replace the conflict banner with shadcn Alert**

Find the conflict-banner block (currently lines ~340–354):

```tsx
{conflicted && (
  <div className="px-6 py-3 border-b bg-yellow-50 text-sm flex items-center gap-3" style={{ borderColor: "var(--border)" }}>
    <span className="material-symbols-outlined text-yellow-700">warning</span>
    <span className="flex-1">
      Another tab saved changes to this brand. Your edits can&apos;t be auto-saved. Reload to see the latest draft.
    </span>
    <button
      onClick={() => window.location.reload()}
      className="px-3 py-1 rounded text-white"
      style={{ background: "var(--primary)" }}
    >
      Reload
    </button>
  </div>
)}
```

Replace with:

```tsx
{conflicted && (
  <Alert variant="default" className="rounded-none border-x-0 border-t-0 bg-yellow-50">
    <AlertTriangle className="size-4 text-yellow-700" />
    <AlertDescription className="flex items-center gap-3">
      <span className="flex-1">
        Another tab saved changes to this brand. Your edits can&apos;t be auto-saved. Reload to see the latest draft.
      </span>
      <Button type="button" size="sm" onClick={() => window.location.reload()}>
        Reload
      </Button>
    </AlertDescription>
  </Alert>
)}
```

`rounded-none border-x-0 border-t-0` keeps the original full-bleed bottom-border-only appearance.

- [ ] **Step 5: Replace `window.alert` calls in `publish` and `discard`**

The `publish()` function (currently around line 230) does `window.alert("Failed to publish. Please try again.")`. Same for `discard()`. Replace both with `toast.error(...)`.

Add at the top:
```tsx
import { toast } from "sonner"
```

Inside `publish`:
```tsx
// Before
window.alert("Failed to publish. Please try again.")
// After
toast.error("Failed to publish. Please try again.")
```

Inside `discard`:
```tsx
// Before
window.alert("Failed to discard draft. Please try again.")
// After
toast.error("Failed to discard draft. Please try again.")
```

The `window.confirm("Discard unpublished changes? ...")` in `discard` is left as-is — replacing with a shadcn `<Dialog>` confirm is out of scope for this round (the brainstorm decision was to migrate components, not redesign UX flows). Add a comment above:

```tsx
// TODO(branding): replace native confirm with shadcn AlertDialog in a future round.
const ok = window.confirm("Discard unpublished changes? This cannot be undone.")
```

- [ ] **Step 6: Verify the lint+test gate**

```bash
cd app && yarn lint && yarn test
```

- [ ] **Step 7: Commit**

```bash
git add app/src/components/branding/BrandingEditor.tsx
git commit -m "refactor(branding): migrate BrandingEditor header to shadcn + lucide + sonner"
```

---

### Task 5.8: Migrate GamePreview type-selector buttons

**Files:**
- Modify: `app/src/components/branding/preview/GamePreview.tsx` (read first)

The branding preview has type-selector buttons (e.g. switching between Crossword / Word Game / Word Search previews). The `<script>` IIFE-loader logic must remain untouched.

- [ ] **Step 1: Read the file to confirm scope**

```bash
cat app/src/components/branding/preview/GamePreview.tsx | head -100
```

Identify each `<button>` element and the script-loading effect. Do NOT change the IIFE script-loading logic.

- [ ] **Step 2: For each raw `<button>` in the type-selector group**

Replace with shadcn `<Button>`:
- A selected button → `variant="default"` (filled).
- Unselected → `variant="outline"`.
- Use `size="sm"`.
- Add `aria-pressed={isSelected}` for screen readers.
- Add `import { Button } from "@/components/ui/button"` at the top.

Example transformation:

```tsx
// Before
<button
  key={type}
  onClick={() => setType(type)}
  className={`px-3 py-1 text-sm rounded ${
    type === selected ? "bg-rust text-white" : "border"
  }`}
>
  {label}
</button>

// After
<Button
  key={type}
  type="button"
  size="sm"
  variant={type === selected ? "default" : "outline"}
  aria-pressed={type === selected}
  onClick={() => setType(type)}
>
  {label}
</Button>
```

If the preview surrounds the buttons with a custom container that needs a tab-style look, consider whether shadcn `<Tabs>` is more appropriate. Use this rule: if there are exactly 2-4 buttons and they switch a content area, use `<Tabs>`. If they're scattered actions, use `<Button>` group. Inspect what the file actually does and choose accordingly.

- [ ] **Step 3: Replace any `material-symbols-outlined` usage in the file**

Map any icon to its lucide equivalent. Common ones in this file are likely game-type icons — use the same lucide mapping as Phase 7 / Phase 9 below (see the master icon table at end of plan).

- [ ] **Step 4: Verify the lint+test gate**

```bash
cd app && yarn lint && yarn test
```

- [ ] **Step 5: Commit**

```bash
git add app/src/components/branding/preview/GamePreview.tsx
git commit -m "refactor(branding): migrate GamePreview controls to shadcn + lucide"
```

---

# Phase 6 — Dashboard Chrome

The persistent dashboard navigation: desktop sidebar, mobile drawer (currently hand-rolled overlay), mobile topbar with menu button, and the platform logo wordmark.

---

### Task 6.1: Migrate DashboardTopbar to shadcn Button + lucide

**Files:**
- Modify: `app/src/components/DashboardTopbar.tsx`

Smallest task in Phase 6 — single raw `<button>` and one icon.

- [ ] **Step 1: Replace contents**

Write `app/src/components/DashboardTopbar.tsx`:

```tsx
"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import PlatformLogo from "@/components/PlatformLogo"
import { Button } from "@/components/ui/button"

interface DashboardTopbarProps {
  onOpenDrawer: () => void
  platformName: string
  isWhiteLabel: boolean
  orgLogoUrl?: string | null
}

export default function DashboardTopbar({
  onOpenDrawer,
  platformName,
  isWhiteLabel,
  orgLogoUrl,
}: DashboardTopbarProps) {
  return (
    <header className="lg:hidden fixed top-0 inset-x-0 h-14 z-30 flex items-center gap-3 px-3 bg-[#F8FAFC] border-b border-[#e2e8f0]">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onOpenDrawer}
        aria-label="Open navigation"
      >
        <Menu className="size-5" />
      </Button>
      <Link
        href={isWhiteLabel ? "/dashboard" : "/"}
        className="flex items-center"
      >
        <PlatformLogo
          platformName={platformName}
          orgLogoUrl={orgLogoUrl}
          size="sm"
        />
      </Link>
    </header>
  )
}
```

The bespoke `bg-[#F8FAFC]` background and `border-[#e2e8f0]` colour stay — those are the navy/slate tokens used by the chrome design and not yet wired through CSS variables. Phase 4 (re-skin, later) will sweep those.

- [ ] **Step 2: Verify the lint+test gate**

```bash
cd app && yarn lint && yarn test
```

- [ ] **Step 3: Commit**

```bash
git add app/src/components/DashboardTopbar.tsx
git commit -m "refactor(chrome): migrate DashboardTopbar to shadcn Button + lucide"
```

---

### Task 6.2: Migrate DashboardSidebar to Sheet + Button + lucide

**Files:**
- Modify: `app/src/components/DashboardSidebar.tsx`

Largest task in this round. The mobile drawer is a hand-rolled overlay (currently lines 99–111 + 302–319). Migrating to shadcn `<Sheet>` brings:
- Focus trap (Radix Dialog under the hood)
- ESC closes (currently hand-rolled in `useEffect`)
- Body scroll lock (currently hand-rolled)
- Backdrop click closes (currently hand-rolled)
- Animations come for free

The desktop rail stays as-is structurally — just swap raw buttons + material icons.

⚠️ **Behavioural change warning:** Sheet uses portal rendering (renders into a separate DOM root). The mobile-drawer body-scroll-lock and ESC handling are now Radix's; remove the hand-rolled `useEffect` to avoid double-handling. Animation easing/duration will shift slightly — this is expected.

Material icon mapping for this file:

| Source string | Lucide component |
|---|---|
| `home` | `Home` |
| `branding_watermark` | `Palette` |
| `groups` | `Users` |
| `key` | `Key` |
| `settings` | `Settings` |
| `stacks` | `LayoutGrid` |
| `expand_more` | `ChevronDown` |
| `logout` | `LogOut` |

- [ ] **Step 1: Update imports + nav-item type**

Replace the existing imports at the top of `DashboardSidebar.tsx`:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import type { ComponentType } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  ChevronDown,
  Home,
  Key,
  LayoutGrid,
  LogOut,
  Palette,
  Settings,
  Users,
} from "lucide-react";
import PlatformLogo from "@/components/PlatformLogo";
import DashboardTopbar from "@/components/DashboardTopbar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
```

Note: `useEffect` is removed (the body-scroll-lock effect goes away with Sheet).

- [ ] **Step 2: Replace nav-item icon prop type**

Currently `topNavItems` and `bottomNavItems` use `icon: "home"` (string). Switch to a component reference. Replace the `topNavItems` definition:

```tsx
type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  active: boolean;
};

const topNavItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: Home,
    active: pathname === "/dashboard",
  },
];

const bottomNavItems: NavItem[] = [
  {
    href: "/dashboard/branding",
    label: "Branding",
    icon: Palette,
    active: pathname === "/dashboard/branding",
  },
  {
    href: "/dashboard/team",
    label: "Team",
    icon: Users,
    active: pathname === "/dashboard/team",
  },
  {
    href: "/dashboard/keys",
    label: "API Keys & Embeds",
    icon: Key,
    active: pathname === "/dashboard/keys",
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
    active: pathname === "/dashboard/settings",
  },
];
```

- [ ] **Step 3: Replace icon usage in `topNavItems`/`bottomNavItems` rendering**

Find every:
```tsx
<span
  className={`material-symbols-outlined text-[20px] ${
    item.active ? "text-navy-900" : "text-[#94a3b8] group-hover:text-navy-900"
  }`}
>
  {item.icon}
</span>
```

Replace with:
```tsx
<item.icon
  className={`size-5 ${
    item.active ? "text-navy-900" : "text-[#94a3b8] group-hover:text-navy-900"
  }`}
/>
```

There are two such blocks (one for top, one for bottom items).

- [ ] **Step 4: Replace the games-group toggle**

Find the games-group toggle button (currently lines ~170–198):

```tsx
<button
  type="button"
  onClick={() => setGamesOpen((o) => !o)}
  className={`w-full flex items-center gap-3 px-3 py-2 transition-all rounded-[4px] border ${
    isOnGameRoute
      ? "border-transparent text-navy-900"
      : "border-transparent text-[#64748b] hover:text-navy-900 hover:bg-white"
  }`}
  aria-expanded={gamesOpen}
  aria-label="Toggle Games menu"
>
  <span
    className={`material-symbols-outlined text-[20px] ${
      isOnGameRoute ? "text-navy-900" : "text-[#94a3b8]"
    }`}
  >
    stacks
  </span>
  <span className={`text-[14px] flex-1 text-left ${isOnGameRoute ? "font-semibold" : "font-medium"}`}>
    Games
  </span>
  <span
    className={`material-symbols-outlined text-[16px] text-[#94a3b8] transition-transform ${
      gamesOpen ? "rotate-180" : ""
    }`}
  >
    expand_more
  </span>
</button>
```

Replace with:

```tsx
<button
  type="button"
  onClick={() => setGamesOpen((o) => !o)}
  className={`w-full flex items-center gap-3 px-3 py-2 transition-all rounded-[4px] border ${
    isOnGameRoute
      ? "border-transparent text-navy-900"
      : "border-transparent text-[#64748b] hover:text-navy-900 hover:bg-white"
  }`}
  aria-expanded={gamesOpen}
  aria-label="Toggle Games menu"
>
  <LayoutGrid
    className={`size-5 ${
      isOnGameRoute ? "text-navy-900" : "text-[#94a3b8]"
    }`}
  />
  <span className={`text-[14px] flex-1 text-left ${isOnGameRoute ? "font-semibold" : "font-medium"}`}>
    Games
  </span>
  <ChevronDown
    className={`size-4 text-[#94a3b8] transition-transform ${
      gamesOpen ? "rotate-180" : ""
    }`}
  />
</button>
```

The custom toggle button stays as a raw `<button>` — it's a disclosure pattern that a shadcn `<Button>` doesn't model better, and we want the existing styling. Material icons → lucide.

- [ ] **Step 5: Replace the logout button**

Find the logout block at the bottom of `sidebarBody` (currently lines ~268–278):

```tsx
<button
  onClick={handleLogout}
  disabled={loggingOut}
  className="text-[#94a3b8] hover:text-navy-900 p-1 transition-colors disabled:opacity-50 flex-shrink-0"
  title="Sign Out"
>
  <span className="material-symbols-outlined text-[18px]">
    logout
  </span>
</button>
```

Replace with:

```tsx
<Button
  type="button"
  variant="ghost"
  size="icon-sm"
  onClick={handleLogout}
  disabled={loggingOut}
  aria-label="Sign Out"
  title="Sign Out"
  className="text-[#94a3b8] hover:text-navy-900 flex-shrink-0"
>
  <LogOut className="size-[18px]" />
</Button>
```

Note: shadcn's stock Button has sizes `default | sm | lg | icon`. Round 1 added `xs` and `icon-xs`. **Verify `icon-sm` exists**:

```bash
grep -n 'icon-sm\|"icon"' app/src/components/ui/button.tsx
```

If `icon-sm` does NOT exist, fall back to `size="icon-xs"` if present, or `size="icon"` and override class `h-7 w-7`. Use whatever is consistent with the existing Button variants — do **not** add a new size variant in this task.

- [ ] **Step 6: Replace the body-scroll-lock + ESC effect**

Delete the `useEffect` block currently at lines 99–111 — Sheet handles both. The `useState<boolean>(drawerOpen)` declaration stays (controls Sheet open state).

Also delete the `useEffect` import from React imports if no other effect remains in the file.

- [ ] **Step 7: Replace the mobile-drawer markup with Sheet**

Find the entire mobile drawer block (currently lines ~302–319):

```tsx
{/* Mobile drawer */}
<div
  className={`lg:hidden fixed inset-0 z-40 transition-opacity ${
    drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
  }`}
  aria-hidden={!drawerOpen}
>
  <div
    className="absolute inset-0 bg-black/40"
    onClick={() => setDrawerOpen(false)}
  />
  <aside
    className={`absolute inset-y-0 left-0 w-[280px] max-w-[85vw] flex flex-col bg-[#F8FAFC] border-r border-[#e2e8f0] shadow-xl transform transition-transform ${
      drawerOpen ? "translate-x-0" : "-translate-x-full"
    }`}
  >
    {sidebarBody}
  </aside>
</div>
```

Replace with:

```tsx
{/* Mobile drawer */}
<Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
  <SheetContent
    side="left"
    className="w-[280px] max-w-[85vw] flex flex-col bg-[#F8FAFC] border-r border-[#e2e8f0] p-0"
  >
    {sidebarBody}
  </SheetContent>
</Sheet>
```

Notes:
- `p-0` overrides shadcn Sheet's default padding because `sidebarBody` does its own padding.
- `lg:hidden` on the wrapper isn't needed because the Sheet only opens via `drawerOpen`, which is only set on mobile (the topbar that triggers it has `lg:hidden`). The desktop rail above (`<aside className="hidden lg:flex ...">`) is the desktop view.
- Sheet automatically renders an accessible close button. If the design doesn't want it, pass `<SheetContent showCloseButton={false}>` if that prop exists in the version installed; otherwise it's harmless.

**Verify Sheet's prop API:**
```bash
grep -nA 5 'SheetContent' app/src/components/ui/sheet.tsx
```

If `showCloseButton` isn't supported, leave the close button visible (it's a UX improvement).

- [ ] **Step 8: Verify the lint+test gate**

```bash
cd app && yarn lint && yarn test
```

- [ ] **Step 9: Commit**

```bash
git add app/src/components/DashboardSidebar.tsx
git commit -m "refactor(chrome): migrate DashboardSidebar mobile drawer to shadcn Sheet + lucide"
```

---

### Task 6.3: Migrate PlatformLogo material icon to lucide

**Files:**
- Modify: `app/src/components/PlatformLogo.tsx`

- [ ] **Step 1: Replace contents**

Write `app/src/components/PlatformLogo.tsx`:

```tsx
/**
 * Shared platform branding component.
 *
 * Renders the org logo (if uploaded) or falls back to the
 * default icon + platform name text. Used across login,
 * register, invite, and dashboard sidebar.
 */

import { Settings2 } from "lucide-react";

interface PlatformLogoProps {
  /** Platform display name (from config) */
  platformName: string;
  /** Base64 data URI or URL of the org logo (optional) */
  orgLogoUrl?: string | null;
  /** Size variant */
  size?: "sm" | "md";
}

export default function PlatformLogo({
  platformName,
  orgLogoUrl,
  size = "md",
}: PlatformLogoProps) {
  const iconSize = size === "sm" ? "size-6" : "size-8";
  const textSize = size === "sm" ? "text-lg" : "text-xl";
  const imgHeight = size === "sm" ? "h-6" : "h-10";
  const imgMaxWidth = size === "sm" ? "max-w-[140px]" : "max-w-[180px]";

  if (orgLogoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={orgLogoUrl}
        alt={platformName}
        className={`${imgHeight} ${imgMaxWidth} object-contain`}
      />
    );
  }

  return (
    <>
      <Settings2 className={`text-rust ${iconSize}`} />
      <span className={`${textSize} font-bold font-serif text-[#0f172a]`}>
        {platformName}
      </span>
    </>
  );
}
```

`Settings2` is the closest lucide analogue to material's `settings_suggest` (gear with sparkle); no exact match exists.

- [ ] **Step 2: Verify the lint+test gate**

```bash
cd app && yarn lint && yarn test
```

- [ ] **Step 3: Commit**

```bash
git add app/src/components/PlatformLogo.tsx
git commit -m "refactor(chrome): swap PlatformLogo material icon for lucide Settings2"
```

---

# Phase 7 — Lists & Nav

---

### Task 7.1: Migrate GamePagination to shadcn pagination

**Files:**
- Modify: `app/src/components/GamePagination.tsx`

shadcn ships a `Pagination` component (`app/src/components/ui/pagination.tsx`). It composes `Pagination`, `PaginationContent`, `PaginationItem`, `PaginationLink`, `PaginationPrevious`, `PaginationNext`, `PaginationEllipsis`. Already installed in Round 1's bulk add.

**Verify before writing:**
```bash
ls app/src/components/ui/pagination.tsx
```

If it does NOT exist, add it:
```bash
cd app && npx shadcn@latest add pagination
```

- [ ] **Step 1: Replace contents**

Write `app/src/components/GamePagination.tsx`:

```tsx
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const buildPageNumbers = (page: number, totalPages: number): (number | "...")[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  const pages: (number | "...")[] = [1]
  if (page > 3) pages.push("...")
  for (let p = Math.max(2, page - 1); p <= Math.min(totalPages - 1, page + 1); p++) {
    pages.push(p)
  }
  if (page < totalPages - 2) pages.push("...")
  pages.push(totalPages)
  return pages
}

export const GamePagination = ({
  page,
  totalPages,
  basePath,
}: {
  page: number
  totalPages: number
  basePath: string
}) => {
  if (totalPages <= 1) return null

  const pageUrl = (p: number) => `${basePath}?page=${p}`
  const items = buildPageNumbers(page, totalPages)

  return (
    <Pagination className="py-4 border-t border-[#e2e8f0]">
      <PaginationContent>
        <PaginationItem>
          {page > 1 ? (
            <PaginationPrevious href={pageUrl(page - 1)} />
          ) : (
            <PaginationPrevious
              href="#"
              aria-disabled
              className="pointer-events-none opacity-50"
            />
          )}
        </PaginationItem>
        {items.map((item, i) =>
          item === "..." ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                href={pageUrl(item)}
                isActive={item === page}
                aria-label={`Page ${item}`}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          {page < totalPages ? (
            <PaginationNext href={pageUrl(page + 1)} />
          ) : (
            <PaginationNext
              href="#"
              aria-disabled
              className="pointer-events-none opacity-50"
            />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
```

The shadcn `<PaginationPrevious />` and `<PaginationNext />` already include lucide `ChevronLeft` / `ChevronRight` internally. The "disabled" affordance is hand-rolled because shadcn's pagination doesn't support a disabled state directly.

`function buildPageNumbers` → `const buildPageNumbers = ...` to match coding-style preference.

- [ ] **Step 2: Verify the lint+test gate**

```bash
cd app && yarn lint && yarn test
```

- [ ] **Step 3: Commit**

```bash
git add app/src/components/GamePagination.tsx
git commit -m "refactor(nav): migrate GamePagination to shadcn pagination"
```

---

### Task 7.2: Migrate DashboardContent stat strip + game cards

**Files:**
- Modify: `app/src/components/DashboardContent.tsx`

Three "stat" blocks at the top + four "game type" cards. All are currently raw `<div>`s with bespoke borders/shadows. Migrate to shadcn `<Card>`.

Material icons in this file: `grid_on`, `spellcheck`, `search`, `grid_4x4`. **NOTE:** the audit flagged these as material icons, but reading the source confirms they're stored as strings on `GAME_TYPES` but never *rendered* as material icons in the current code (the cards don't show them). They're dead data. Either delete the `icon` field from `GAME_TYPES` OR start rendering them as lucide. The brainstorm direction is "more visual consistency" — render them.

Lucide map:
- `grid_on` → `Grid3x3`
- `spellcheck` → `SpellCheck2`
- `search` → `Search`
- `grid_4x4` → `Grid` (closest)

- [ ] **Step 1: Replace contents**

Write `app/src/components/DashboardContent.tsx`:

```tsx
"use client"

import Link from "next/link"
import type { ComponentType } from "react"
import { Grid, Grid3x3, Search, SpellCheck2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface OverviewCounts {
  crosswords: number
  wordgames: number
  wordsearches: number
  sudoku: number
}

interface Props {
  counts: OverviewCounts
  publishedCount: number
}

type GameType = {
  href: string | null
  label: string
  description: string
  icon: ComponentType<{ className?: string }>
  accent: string
  iconBg: string
  countKey: keyof OverviewCounts
  comingSoon?: boolean
}

const GAME_TYPES: GameType[] = [
  {
    href: "/dashboard/crosswords",
    label: "Crosswords",
    description: "Classic grid-based word puzzles with across and down clues.",
    icon: Grid3x3,
    accent: "from-blue-500 to-indigo-500",
    iconBg: "bg-blue-50 text-blue-600",
    countKey: "crosswords",
  },
  {
    href: "/dashboard/word-game",
    label: "Word Game",
    description: "Vocabulary and spelling challenges for players of all ages.",
    icon: SpellCheck2,
    accent: "from-emerald-500 to-teal-500",
    iconBg: "bg-green-50 text-green-600",
    countKey: "wordgames",
  },
  {
    href: "/dashboard/word-search",
    label: "Word Search",
    description: "Hidden word grids — words concealed in any direction.",
    icon: Search,
    accent: "from-violet-500 to-pink-500",
    iconBg: "bg-purple-50 text-purple-600",
    countKey: "wordsearches",
  },
  {
    href: null,
    label: "Sudoku",
    description: "Classic number-placement puzzles on a 9×9 grid.",
    icon: Grid,
    accent: "from-orange-400 to-yellow-400",
    iconBg: "bg-orange-50 text-orange-500",
    countKey: "sudoku",
    comingSoon: true,
  },
]

export default function DashboardContent({ counts, publishedCount }: Props) {
  const totalGames =
    counts.crosswords + counts.wordgames + counts.wordsearches + counts.sudoku
  const activeTypes = GAME_TYPES.filter((g) => !g.comingSoon).length

  return (
    <div className="px-4 sm:px-6 py-6">
      {/* Hero */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#0f172a] tracking-tight mb-1">Games Overview</h1>
        <p className="text-sm text-[#64748b]">
          Manage your game library — select a type to browse, filter, and create puzzles.
        </p>
      </div>

      {/* Summary strip */}
      <Card className="mb-6 rounded-[4px] shadow-sharp">
        <CardContent className="flex flex-wrap gap-x-6 gap-y-3 items-center py-3.5">
          <div className="flex flex-col gap-0.5">
            <span className="text-xl font-bold text-[#0f172a] leading-none">{totalGames}</span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#94a3b8]">Total games</span>
          </div>
          <div className="w-px self-stretch bg-[#e2e8f0]" />
          <div className="flex flex-col gap-0.5">
            <span className="text-xl font-bold text-[#0f172a] leading-none">{publishedCount}</span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#94a3b8]">Published</span>
          </div>
          <div className="w-px self-stretch bg-[#e2e8f0]" />
          <div className="flex flex-col gap-0.5">
            <span className="text-xl font-bold text-[#0f172a] leading-none">{activeTypes}</span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#94a3b8]">Game types</span>
          </div>
        </CardContent>
      </Card>

      {/* Game cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {GAME_TYPES.map((g) => {
          const Icon = g.icon
          const cardContent = (
            <Card
              className={`overflow-hidden rounded-[4px] shadow-sharp transition-all p-0 gap-0 ${
                g.comingSoon
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-md hover:border-[#cbd5e1] cursor-pointer"
              }`}
            >
              {/* Colored top accent */}
              <div className={`h-[3px] bg-gradient-to-r ${g.accent}`} />

              {/* Card body */}
              <div className="px-5 pt-4 pb-3 flex items-start justify-between gap-4">
                <div className="min-w-0 flex items-start gap-3">
                  <div className={`flex items-center justify-center size-8 rounded-[4px] ${g.iconBg}`}>
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-[#0f172a] text-[15px] mb-1">{g.label}</p>
                    <p className="text-xs text-[#64748b] leading-relaxed">{g.description}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-3xl font-bold text-[#0f172a] leading-none tracking-tight">
                    {g.comingSoon ? "—" : counts[g.countKey]}
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#94a3b8] mt-1">
                    puzzles
                  </p>
                </div>
              </div>

              {/* Card footer */}
              <div className="px-5 pb-4 flex items-center justify-between">
                {g.comingSoon ? (
                  <Badge variant="info">Coming soon</Badge>
                ) : (
                  <>
                    <span className="text-xs font-semibold text-indigo-600">View all →</span>
                    <span className="text-[11px] font-semibold px-3 py-1 border border-[#e2e8f0] rounded-[4px] text-[#0f172a] bg-[#f8fafc]">
                      ＋ Create new
                    </span>
                  </>
                )}
              </div>
            </Card>
          )

          return g.comingSoon ? (
            <div key={g.label}>{cardContent}</div>
          ) : (
            <Link key={g.label} href={g.href!} className="block">
              {cardContent}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
```

Key changes:
- Stat strip wrapper → `<Card>` + `<CardContent>` (with `py-3.5` to keep the existing height).
- Game cards → `<Card>` (with `p-0 gap-0` to override shadcn's default internal padding/gap; the original used custom internal layout).
- Coming-soon pill → `<Badge variant="info">` (the `info` variant was added in Round 1 Task 1.4).
- Added a small icon block in each card's body (was previously dead data; now visualised, matching the consistency goal of this round).

- [ ] **Step 2: Verify the lint+test gate**

```bash
cd app && yarn lint && yarn test
```

- [ ] **Step 3: Commit**

```bash
git add app/src/components/DashboardContent.tsx
git commit -m "refactor(nav): migrate DashboardContent to shadcn Card + Badge + lucide"
```

---

# Phase 8 — Round-1 Leftovers

---

### Task 8.1: Migrate TeamContent invite-link inputs

**Files:**
- Modify: `app/src/components/TeamContent.tsx`

Two raw `<input type="text" readOnly>` elements at lines 321 and 370 inside the invite-link/Copy boxes. Round 1 missed these because the surrounding migration focused on form fields, not the post-success display.

- [ ] **Step 1: Verify imports**

`Input` is already imported at the top of `TeamContent.tsx`. Confirm:

```bash
grep -n 'from "@/components/ui/input"' app/src/components/TeamContent.tsx
```

If not, add `import { Input } from "@/components/ui/input"`.

- [ ] **Step 2: Replace the first raw input (line ~321)**

Find:
```tsx
<input
  type="text"
  readOnly
  value={inviteLink}
  className="flex-1 bg-transparent text-sm outline-none truncate"
/>
```

Replace with:
```tsx
<Input
  type="text"
  readOnly
  value={inviteLink}
  className="flex-1 border-0 bg-transparent shadow-none px-0 focus-visible:ring-0"
/>
```

The classes neutralise shadcn Input's default styling because the parent (`bg-slate-50 border rounded-md px-3 py-2.5`) already provides the visual treatment.

- [ ] **Step 3: Replace the second raw input (line ~370)**

Find the identical pattern in the resend-invite modal and apply the same replacement.

- [ ] **Step 4: Verify the lint+test gate**

```bash
cd app && yarn lint && yarn test
```

- [ ] **Step 5: Commit**

```bash
git add app/src/components/TeamContent.tsx
git commit -m "refactor(team): migrate invite-link inputs to shadcn Input"
```

---

# Phase 9 — Public Pages

These pages are SSR Next pages, not dashboard components. The migration covers icons (material → lucide) and structural primitives (CTAs → `<Button asChild>`, statistic cards → `<Card>`).

---

### Task 9.1: Migrate landing page (app/page.tsx)

**Files:**
- Modify: `app/src/app/page.tsx`

The landing page is 593 lines of marketing HTML. Migration scope:
1. All `<span className="material-symbols-outlined">…</span>` → lucide icons.
2. The "Publisher Login" / "Get Started" / similar CTA `<a>` tags wrapped with `<Button asChild>`.
3. Stat blocks / feature blocks → `<Card>` where they're clearly card-shaped.

Lucide map (gather while reading):

| Material name | Lucide |
|---|---|
| `settings_suggest` | `Settings2` |
| `arrow_forward` | `ArrowRight` |
| `arrow_outward` | `ArrowUpRight` |
| `bolt` | `Zap` |
| `code` | `Code` |
| `palette` | `Palette` |
| `lock` | `Lock` |
| `language` | `Languages` |
| `puzzle` | `Puzzle` |
| `check_circle` | `CheckCircle2` |
| `extension` | `Puzzle` (closest) |
| `dashboard` | `LayoutDashboard` |
| `share` | `Share2` |
| `mail` | `Mail` |
| `analytics` | `LineChart` |
| `groups` | `Users` |
| (any other) | look up lucide.dev |

- [ ] **Step 1: Read and inventory**

```bash
cd app && grep -nE 'material-symbols-outlined' src/app/page.tsx
```

For every match, note (1) the icon string and (2) the surrounding context. Build a complete map before editing.

- [ ] **Step 2: Add lucide import**

At the top of `app/src/app/page.tsx`, add a single import line listing every lucide icon you'll use. Example shape:

```tsx
import { ArrowRight, Settings2, Zap, Code, Palette, Lock, Languages, Puzzle, CheckCircle2, LayoutDashboard, Share2, Mail, LineChart, Users } from "lucide-react";
```

Add the imports for `Button` and `Card`:

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
```

- [ ] **Step 3: Replace each material-symbols span**

For every `<span className="material-symbols-outlined ...">name</span>`:
- Replace `<span>` → lucide component.
- Translate Material's `text-3xl`/`text-lg` etc. → lucide `className="size-N"`:
  - `text-sm` → `size-4`
  - `text-base` / `text-lg` → `size-5`
  - `text-xl` → `size-6`
  - `text-2xl` → `size-7`
  - `text-3xl` → `size-8`
  - `text-4xl` → `size-9`
  - `text-5xl` → `size-12`
- Preserve any colour utilities (`text-rust`, `text-green-600`, etc.) on the lucide component's className.

Example:
```tsx
// Before
<span className="material-symbols-outlined text-3xl">settings_suggest</span>
// After
<Settings2 className="size-8" />

// Before
<span className="material-symbols-outlined text-green-600 mt-0.5">check_circle</span>
// After
<CheckCircle2 className="size-5 text-green-600 mt-0.5" />
```

- [ ] **Step 4: Wrap header CTA links with Button asChild**

Find the header buttons (currently around lines 45–65):

```tsx
<a
  href="/login"
  className="flex cursor-pointer items-center justify-center rounded-lg h-10 px-5 text-[#0f172a] hover:text-rust transition-all text-sm font-semibold border border-transparent hover:bg-[#f9fafb]"
>
  <span className="truncate">Publisher Login</span>
</a>
```

Replace with:

```tsx
<Button asChild variant="ghost" size="sm">
  <a href="/login">Publisher Login</a>
</Button>
```

Apply the same treatment to other anchor-styled-as-buttons in the page. Keep the bespoke marketing buttons that have gradients/large CTAs IF replacing them with `<Button>` would lose the gradient; in those cases:
1. Keep as `<a>` for now,
2. Add a `// TODO(landing): unify CTA styling once branding tokens land` comment.

The decision rule: if a CTA's `className` is just padding + colour + radius (basic), wrap it; if it's gradient/multi-layer, leave it.

- [ ] **Step 5: Wrap stat/feature blocks in Card where appropriate**

Look for blocks with `bg-white border border-[#e2e8f0] rounded-...` that contain a heading + description. Wrap with `<Card>` + `<CardHeader>` + `<CardContent>` only when the conversion is straightforward — keep wrapping conservative, prefer leaving the marketing layout alone when it's bespoke.

The brainstorm acknowledged this could make marketing pages "subtly worse" — apply the rule: **only wrap when it actually simplifies the JSX.** If the result is `<Card>` with a long list of `className` overrides to suppress shadcn defaults, **don't** wrap; revert to the original `<div>`.

- [ ] **Step 6: Verify the lint+test gate**

```bash
cd app && yarn lint && yarn test
```

- [ ] **Step 7: Visual smoke**

```bash
cd app && yarn dev
```

Open `http://localhost:3013/` (port 3013 per project pm2 config). Click through the landing page. Verify all icons render (no broken `text-rust` strings as text, no missing icons). Kill the dev server when done.

If any icon is missing/wrong, fix it before committing.

- [ ] **Step 8: Commit**

```bash
git add app/src/app/page.tsx
git commit -m "refactor(landing): migrate to lucide + shadcn Button/Card"
```

---

### Task 9.2: Migrate play page (app/play/page.tsx)

**Files:**
- Modify: `app/src/app/play/page.tsx`

This is the public game-gallery page (455 lines). Material-symbols usage at lines 70, 132, 255, 282, 314, 325, 339, 372, 381, 393. Most are decorative icons inside cards or empty states.

Lucide map for this file (gather from grep at Step 1):

| Material name | Lucide |
|---|---|
| `progress_activity` | `Loader2` (with `animate-spin`) |
| `puzzle` / `extension` | `Puzzle` |
| `arrow_forward` | `ArrowRight` |
| `language` | `Languages` |
| `play_arrow` | `Play` |
| `search_off` | `SearchX` |
| `error` | `AlertCircle` |

- [ ] **Step 1: Inventory icons**

```bash
cd app && grep -nE 'material-symbols-outlined' src/app/play/page.tsx
```

Build full map.

- [ ] **Step 2: Add imports**

At the top of `app/src/app/play/page.tsx`:

```tsx
import { Loader2, Puzzle, ArrowRight, Languages, Play, SearchX, AlertCircle /* etc. */ } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
```

- [ ] **Step 3: Replace each material-symbols span**

Same translation rules as Task 9.1.

For the loader at line ~70:
```tsx
// Before
<span className="material-symbols-outlined animate-spin">progress_activity</span>
// After
<Loader2 className="size-5 animate-spin" />
```

- [ ] **Step 4: Wrap gallery game-cards in Card**

The play page has gallery cards rendering puzzle previews. Apply the same conservative rule from 9.1 — only wrap if it simplifies the JSX.

- [ ] **Step 5: Verify the lint+test gate + smoke**

```bash
cd app && yarn lint && yarn test
```

If you have a play.org seeded in dev DB, smoke at `http://localhost:3013/play`. Otherwise, navigate to a known game URL (e.g. `/play?id=1&type=crossword&token=…`) — the icons should resolve.

- [ ] **Step 6: Commit**

```bash
git add app/src/app/play/page.tsx
git commit -m "refactor(play): migrate gallery page to lucide + shadcn Card"
```

---

### Task 9.3: Migrate invite/[token]/page.tsx error states

**Files:**
- Modify: `app/src/app/invite/[token]/page.tsx`
- Modify: `app/src/app/invite/[token]/InviteForm.tsx` (one icon swap)

Two error states (invalid invite, expired invite) each render a bespoke card with a red/amber material icon, heading, message, and "Go to Login" link.

- [ ] **Step 1: Replace contents of `app/src/app/invite/[token]/page.tsx`**

Write:

```tsx
import { db } from "@/db";
import { users, organizations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { LinkOff, Clock } from "lucide-react";
import InviteForm from "./InviteForm";
import { getClientConfig } from "@/lib/platform";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

interface InvitePageProps {
  params: Promise<{ token: string }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;
  const config = getClientConfig();

  // Look up the invite
  const [user] = await db
    .select({
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      orgId: users.orgId,
      inviteExpiresAt: users.inviteExpiresAt,
    })
    .from(users)
    .where(eq(users.inviteToken, token))
    .limit(1);

  if (!user) {
    return (
      <ErrorShell
        icon={<LinkOff className="size-12 text-destructive mx-auto" />}
        title="Invalid Invite Link"
        message="This invite link is invalid or has already been used."
      />
    );
  }

  // Check expiry
  const isExpired =
    !!user.inviteExpiresAt && new Date(user.inviteExpiresAt) < new Date();

  if (isExpired) {
    return (
      <ErrorShell
        icon={<Clock className="size-12 text-amber-500 mx-auto" />}
        title="Invite Expired"
        message="This invite link has expired. Please ask your administrator to send a new invitation."
      />
    );
  }

  // Get org name and logo
  const [org] = await db
    .select({ name: organizations.name, logoUrl: organizations.logoUrl })
    .from(organizations)
    .where(eq(organizations.id, user.orgId))
    .limit(1);

  return (
    <InviteForm
      token={token}
      email={user.email}
      firstName={user.firstName || ""}
      lastName={user.lastName || ""}
      orgName={org?.name || ""}
      platformName={config.platformName}
      orgLogoUrl={org?.logoUrl || null}
    />
  );
}

const ErrorShell = ({
  icon,
  title,
  message,
}: {
  icon: React.ReactNode;
  title: string;
  message: string;
}) => (
  <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center p-4 font-[family-name:var(--font-inter)]">
    <div className="w-full max-w-md text-center">
      <Card>
        <CardContent className="p-8">
          <div className="mb-4">{icon}</div>
          <h1 className="text-2xl font-serif font-medium text-[#0f172a] mb-2">
            {title}
          </h1>
          <p className="text-[#64748b] text-sm mb-6">{message}</p>
          <Button asChild>
            <a href="/login">Go to Login</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
);
```

Note: `LinkOff` doesn't exist in lucide as a single icon. The closest is `Link2Off`. Use that instead — replace `LinkOff` with `Link2Off` in both the import and JSX.

The unused `Alert`, `AlertDescription`, `AlertTitle` imports (kept above for clarity in the brainstorm — the original idea was to use Alert) can be removed; this implementation uses Card + Button + lucide which is cleaner. Final import:

```tsx
import { Link2Off, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
```

(Drop Alert imports.)

- [ ] **Step 2: Replace InviteForm.tsx icon**

In `app/src/app/invite/[token]/InviteForm.tsx`, the `material-symbols-outlined` icon at line 105:

```tsx
// Before
<div className="flex items-center justify-center w-12 h-12 bg-rust/10 rounded-xl mx-auto mb-2">
  <span className="material-symbols-outlined text-rust text-2xl">
    person_add
  </span>
</div>
// After (and add `import { UserPlus } from "lucide-react"` at the top)
<div className="flex items-center justify-center w-12 h-12 bg-rust/10 rounded-xl mx-auto mb-2">
  <UserPlus className="text-rust size-6" />
</div>
```

- [ ] **Step 3: Verify the lint+test gate**

```bash
cd app && yarn lint && yarn test
```

- [ ] **Step 4: Commit**

```bash
git add app/src/app/invite/[token]/page.tsx app/src/app/invite/[token]/InviteForm.tsx
git commit -m "refactor(invite): migrate error states + icons to shadcn + lucide"
```

---

# Phase 10 — Custom UI Primitives + Last Icons

The three retained custom components have their internals refactored. Plus the three remaining material icon usages in `BrandingContent.tsx`.

---

### Task 10.1: Refactor FileUpload (custom) internals

**Files:**
- Modify: `app/src/components/ui/FileUpload.tsx`

Same idea as Task 5.6 but for the simpler custom component used by `SettingsContent` (single logo upload). Add react-dropzone (already installed via 5.6) and replace material icon.

Lucide for this file: `cloud_upload` → `Cloud`/`UploadCloud`. Use `UploadCloud`.

- [ ] **Step 1: Replace contents**

Write `app/src/components/ui/FileUpload.tsx`:

```tsx
import { useDropzone } from "react-dropzone";
import { UploadCloud, X } from "lucide-react";
import { Button } from "./button";

interface FileUploadProps {
  label?: string;
  accept?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  preview?: string | null;
  onRemove?: () => void;
  changeLabel?: string;
  hint?: string;
}

const DEFAULT_ACCEPT = "image/png,image/jpeg,image/svg+xml,image/webp";

export const FileUpload = ({
  label,
  accept = DEFAULT_ACCEPT,
  onChange,
  preview,
  onRemove,
  changeLabel = "Change Logo",
  hint = "SVG, PNG, or JPG up to 2MB",
}: FileUploadProps) => {
  // Convert the comma-separated MIME string into the object form react-dropzone wants.
  const acceptMap: Record<string, string[]> = {};
  for (const mime of accept.split(",").map((s) => s.trim()).filter(Boolean)) {
    acceptMap[mime] = [];
  }

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: acceptMap,
    multiple: false,
    noClick: !!preview, // when there's a preview, the user clicks "Change Logo" instead
    onDrop: (accepted) => {
      const f = accepted[0];
      if (!f || !onChange) return;
      // Adapt to the existing onChange contract (an input ChangeEvent).
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(f);
      const fakeInput = document.createElement("input");
      fakeInput.type = "file";
      fakeInput.files = dataTransfer.files;
      const event = {
        target: fakeInput,
        currentTarget: fakeInput,
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    },
  });

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.04em]">
          {label}
        </span>
      )}
      {preview ? (
        <div className="flex items-center gap-4">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Preview"
              className="h-[120px] max-w-[200px] rounded-[4px] object-contain border border-[#e2e8f0] bg-[#f8fafc] p-2"
            />
            {onRemove && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={onRemove}
                aria-label="Remove"
                title="Remove"
                className="absolute -top-2 -right-2 size-5 rounded-full p-0"
              >
                <X className="size-3" />
              </Button>
            )}
          </div>
          <Button type="button" variant="outline" onClick={() => open()}>
            {changeLabel}
          </Button>
          {/* hidden native input retained so callers depending on event semantics still work */}
          <input {...getInputProps()} />
        </div>
      ) : (
        <div
          {...getRootProps()}
          className="group relative flex flex-col items-center justify-center w-full h-[120px] rounded-[4px] border border-dashed border-[#cbd5e1] bg-[#f8fafc] hover:bg-[#f1f5f9] hover:border-[#94a3b8] transition-all cursor-pointer"
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2 text-center pointer-events-none">
            <UploadCloud className="text-[#94a3b8] size-6" />
            <p className="text-[13px] font-medium text-navy-900">
              Drag & drop or click to upload
            </p>
            <p className="text-[11px] text-[#94a3b8]">{hint}</p>
          </div>
        </div>
      )}
    </div>
  );
};
```

The synthetic `ChangeEvent` shim preserves the public API (callers in `SettingsContent` pass an `e.target.files[0]` handler). The previous component had the same affordance, just wired to the real native input.

**Verify the consumer still works:**
```bash
grep -nA 10 'FileUpload' app/src/components/SettingsContent.tsx | head -30
```

The handler in `SettingsContent` reads `e.target.files?.[0]`, which the shim supports.

- [ ] **Step 2: Verify the lint+test gate**

```bash
cd app && yarn lint && yarn test
```

- [ ] **Step 3: Commit**

```bash
git add app/src/components/ui/FileUpload.tsx
git commit -m "refactor(ui): rebuild FileUpload internals on react-dropzone + shadcn"
```

---

### Task 10.2: Verify PageHeader needs no changes

**Files:**
- Read only: `app/src/components/ui/PageHeader.tsx`

The component is 24 lines and uses no raw HTML primitives that have shadcn equivalents (just `<header>`, `<h1>`, `<p>`, `<div>`). No material icons. **Likely no-op.**

- [ ] **Step 1: Read the file**

```bash
cat app/src/components/ui/PageHeader.tsx
```

- [ ] **Step 2: Decide**

If you find any raw `<button>` or icon usage you missed earlier, migrate. Otherwise — no commit, just record this in your task tracker that 10.2 was a no-op.

If a no-op, **proceed to Task 10.3 without committing.**

---

### Task 10.3: Verify CodeBlock needs no changes

**Files:**
- Read only: `app/src/components/ui/CodeBlock.tsx`

15 lines, just a styled `<pre><code>`. No interactive elements, no icons. **Almost certainly a no-op.**

The current colours (`bg-[#1e293b] text-slate-300`) are hard-coded for a "dark code block on light page" effect — *intentionally* off-token, similar to the branding-editor previews. Leaving them is consistent with the precedent set in Phase 5 not migrating preview components.

- [ ] **Step 1: Read the file**

```bash
cat app/src/components/ui/CodeBlock.tsx
```

- [ ] **Step 2: Decide**

If no changes are warranted, **no-op.**

---

### Task 10.4: Migrate BrandingContent material icons

**Files:**
- Modify: `app/src/components/BrandingContent.tsx`

Two material icon spans at lines 147 and 211. Both decorative.

- [ ] **Step 1: Read context**

```bash
cd app && sed -n '140,220p' src/components/BrandingContent.tsx
```

Identify the two icons and what they represent.

- [ ] **Step 2: Map to lucide**

Common candidates given the BrandingContent context (likely "no brands yet" empty state and "edit" button):

| Material name | Lucide |
|---|---|
| `palette` / `brush` | `Palette` |
| `add` / `plus` | `Plus` |
| `edit` / `edit_pencil` | `Pencil` |
| `image` | `Image` |
| `check_circle` | `CheckCircle2` |

Inspect the actual strings and pick.

- [ ] **Step 3: Replace**

Add the lucide imports at the top, swap each `<span className="material-symbols-outlined ...">name</span>` for the lucide component using the size translation rules from Task 9.1.

- [ ] **Step 4: Verify the lint+test gate**

```bash
cd app && yarn lint && yarn test
```

- [ ] **Step 5: Commit**

```bash
git add app/src/components/BrandingContent.tsx
git commit -m "refactor(branding): swap remaining material icons for lucide"
```

---

# Phase 11 — Cleanup & Final Verification

---

### Task 11.1: Audit grep gate — zero material-symbols remaining

**Files:**
- Audit only — no edits except possibly the `globals.css` utility class.

- [ ] **Step 1: Search for remaining material-symbols usage in `app/src`**

```bash
cd app && grep -rnE 'material-symbols-outlined' src --include='*.tsx' --include='*.ts'
```

Expected result: **zero matches**, except possibly `app/src/app/globals.css:152` (the utility class definition). The CSS class definition is harmless and can stay as a future escape valve.

- [ ] **Step 2: If any TSX/TS match remains, migrate it**

Apply the same Material→lucide mapping from prior tasks. Commit each fix as `refactor(<scope>): swap remaining material icons for lucide`.

- [ ] **Step 3: Audit raw HTML primitives**

```bash
cd app && grep -rnE '<(button|input|select|textarea)\s' src --include='*.tsx'
```

Review every match. Acceptable matches:
- shadcn component internals (`app/src/components/ui/*.tsx` — these are the migrated wrappers)
- Branding preview components (`ButtonVariantPreview`, `InputVariantPreview`, etc. — intentional, preview tokens)
- Native color picker (`<input type="color">` in `ThemeSection` and `TokenRow` — kept; no shadcn equivalent)
- Native file input (`<input {...getInputProps()}>` from react-dropzone — required)
- Disclosure-toggle buttons (`DashboardSidebar` games-group toggle — intentional; not a shadcn Button case)

Anything else is a regression — open and migrate.

- [ ] **Step 4: Verify legacy-component imports are gone**

```bash
cd app && grep -rE 'ButtonLegacy|InputLegacy|SelectLegacy|BadgeLegacy|@/components/ui/Modal|@/components/ui/Panel' src
```

Expected: zero matches. Round 1 cleanup should already cover this.

- [ ] **Step 5: No commit if audit clean**

If the audit finds nothing to fix, no commit. Move to 11.2.

---

### Task 11.2: Final verification — lint, build, test

- [ ] **Step 1: Lint**

```bash
cd app && yarn lint
```

Expected: no errors. Warnings allowed only if pre-existing on `main` (e.g. `no-img-element` on legacy `<img>` tags). If a NEW warning appears that wasn't there at the start of this round, fix it.

- [ ] **Step 2: Tests**

```bash
cd app && yarn test
```

Expected: ≥175 passing (baseline). Failures should be confined to the pre-existing `crossword-layout-server.test.ts` timeouts.

- [ ] **Step 3: Build**

```bash
cd app && yarn build
```

Expected: builds, with the same pre-existing `globals.css` Next 16 type-check warning. No NEW build errors.

- [ ] **Step 4: Smoke test in dev**

Optional but recommended:

```bash
./dev.sh dev
```

Click through:
- `http://localhost:3013/` — landing page (icons + CTAs)
- `http://localhost:3013/login` — already verified Round 1
- `http://localhost:3013/dashboard` — DashboardContent stat cards + game cards
- `http://localhost:3013/dashboard/branding` — open a brand → editor sidebar (Theme presets, color pickers, typography, spacing slider, custom CSS textarea, file upload drag-drop)
- `http://localhost:3013/dashboard/team` — invite modal copy box
- Toggle window width below `lg` (1024px) → tap menu icon → mobile drawer should open via Sheet (focus traps, ESC closes)
- `http://localhost:3013/play` — gallery (icons render)

Take notes of any visible regressions. Cosmetic shifts from stock-shadcn defaults are expected and documented as part of this round; behavioural regressions are bugs.

---

### Task 11.3: Final summary commit

If 11.1 and 11.2 produced no further code changes, this task is just a marker — no commit needed. Move on to PR creation.

If 11.2 surfaced any minor fixes, those have been committed individually with their own conventional-commit messages already.

---

## Master Material → Lucide icon table

For reference across all phases. Sizing rule: `text-[N]` and `text-Nxl` → use the size translations from Task 9.1.

| Material name | Lucide component | Notes |
|---|---|---|
| `add` | `Plus` | |
| `analytics` | `LineChart` | |
| `arrow_back` | `ArrowLeft` | |
| `arrow_forward` | `ArrowRight` | |
| `arrow_outward` | `ArrowUpRight` | |
| `bolt` | `Zap` | |
| `branding_watermark` | `Palette` | (closest match) |
| `brush` | `Brush` | |
| `check_circle` | `CheckCircle2` | |
| `chevron_left` | `ChevronLeft` | |
| `chevron_right` | `ChevronRight` | |
| `close` / `clear` | `X` | |
| `cloud_upload` | `UploadCloud` | |
| `code` | `Code` | |
| `dashboard` | `LayoutDashboard` | |
| `delete` / `trash` | `Trash2` | |
| `edit` | `Pencil` | |
| `error` | `AlertCircle` | |
| `expand_more` | `ChevronDown` | |
| `extension` | `Puzzle` | (closest) |
| `grid_4x4` | `Grid` | (closest) |
| `grid_on` | `Grid3x3` | |
| `groups` | `Users` | |
| `home` | `Home` | |
| `image` | `Image` | |
| `key` | `Key` | |
| `language` | `Languages` | |
| `link_off` | `Link2Off` | |
| `lock` | `Lock` | |
| `logout` | `LogOut` | |
| `mail` | `Mail` | |
| `menu` | `Menu` | |
| `palette` | `Palette` | |
| `person_add` | `UserPlus` | |
| `play_arrow` | `Play` | |
| `progress_activity` | `Loader2` | always pair with `animate-spin` |
| `puzzle` | `Puzzle` | |
| `rocket_launch` | `Rocket` | |
| `schedule` | `Clock` | |
| `search` | `Search` | |
| `search_off` | `SearchX` | |
| `settings` | `Settings` | |
| `settings_suggest` | `Settings2` | (closest match for the brand wordmark) |
| `share` | `Share2` | |
| `spellcheck` | `SpellCheck2` | |
| `stacks` | `LayoutGrid` | |
| `undo` | `Undo2` | |
| `warning` | `AlertTriangle` | |

If you encounter a material icon not in this table, look it up at https://lucide.dev/icons/ and pick the closest visual match. Add it to this table as you go (commit the doc edit alongside the source change).

---

## Self-Review Notes

Spec coverage check (phase → audit groups):
- Phase 5: covers branding editor primitives (audit group B partial — sections like IdentitySection are pure compositions and don't need migration; sections that own raw inputs are covered)
- Phase 6: covers dashboard chrome (audit group C)
- Phase 7: covers lists & nav (audit group F + part of overview)
- Phase 8: covers round-1 leftovers (audit group A)
- Phase 9: covers public/landing (audit group D + part of E)
- Phase 10: covers custom primitives (audit group H) + miscellaneous icon swaps
- Phase 11: cleanup gate

Type consistency: all task code uses identical prop interfaces from imports (`<Button>`, `<Input>`, `<Card>`, `<Sheet>`, etc.); no method signature drift.

Placeholder scan: all "what to do" steps include actual code blocks. The Phase 9 marketing-page tasks deliberately ask the engineer to inventory icons before writing because the page has 12+ icons — listing every one in advance would bloat the plan. The Master icon table at the end provides the canonical mapping.

Risk hot-spots flagged inline:
- Task 5.1 — Radix Select's empty-string sentinel
- Task 5.6 — `react-dropzone` test interaction (tests must mock sonner)
- Task 6.2 — Sheet behavioural change (focus trap, scroll lock, ESC handling now Radix's)
- Task 9.1 — marketing CTA migration discretion (don't fight the design)
- Task 10.1 — synthetic `ChangeEvent` shim to preserve `FileUpload` public API
