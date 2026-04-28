# shadcn/ui Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 11 hand-rolled components in `app/src/components/ui/` with stock shadcn/ui components, migrate every importer (7 dashboard files + 3 auth forms), adopt `react-hook-form + zod` for validated forms and `sonner` for toasts, then delete the legacy components and the app's import of `shared/styles/components.css`.

**Architecture:**
- shadcn is already initialized (`app/components.json` exists, `cn()` helper already at `app/src/lib/utils.ts`). Phase 1 only `add`s components.
- Strategy: rename collision-prone files (`Button`/`Input`/`Select`/`Badge`) to `*Legacy.tsx` first so shadcn's lowercase files can land alongside; delete legacy after every importer is migrated.
- Visual fidelity = stock shadcn defaults. The user will re-skin via CSS variables later. **Do not** port legacy `.btn`/`.modal` styles into the new components.
- Per-area PRs in Phase 2 (branding → settings → team → keys → games-admin → auth) so each migration is independently reviewable.

**Tech Stack:** Next.js 16, React 19.2, Tailwind v4, Radix (already installed), CVA + clsx + tailwind-merge (already installed), lucide-react (already installed), shadcn/ui (CLI add only), `react-hook-form`, `zod`, `@hookform/resolvers`, `sonner`, `cmdk`.

---

## File Structure

### New files (created by `npx shadcn add`)
- `app/src/components/ui/button.tsx`
- `app/src/components/ui/input.tsx`
- `app/src/components/ui/select.tsx`
- `app/src/components/ui/badge.tsx`
- `app/src/components/ui/dialog.tsx`
- `app/src/components/ui/card.tsx`
- `app/src/components/ui/dropdown-menu.tsx`
- `app/src/components/ui/tooltip.tsx`
- `app/src/components/ui/sheet.tsx`
- `app/src/components/ui/tabs.tsx`
- `app/src/components/ui/separator.tsx`
- `app/src/components/ui/skeleton.tsx`
- `app/src/components/ui/alert.tsx`
- `app/src/components/ui/avatar.tsx`
- `app/src/components/ui/switch.tsx`
- `app/src/components/ui/checkbox.tsx`
- `app/src/components/ui/label.tsx`
- `app/src/components/ui/textarea.tsx`
- `app/src/components/ui/popover.tsx`
- `app/src/components/ui/sonner.tsx`
- `app/src/components/ui/command.tsx`
- `app/src/components/ui/form.tsx`
- `app/src/components/ui/table.tsx`

### Renamed in Phase 0 (collision avoidance)
- `app/src/components/ui/Button.tsx` → `app/src/components/ui/ButtonLegacy.tsx`
- `app/src/components/ui/Input.tsx` → `app/src/components/ui/InputLegacy.tsx`
- `app/src/components/ui/Select.tsx` → `app/src/components/ui/SelectLegacy.tsx`
- `app/src/components/ui/Badge.tsx` → `app/src/components/ui/BadgeLegacy.tsx`

### Deleted in Phase 3
- `ButtonLegacy.tsx`, `InputLegacy.tsx`, `SelectLegacy.tsx`, `BadgeLegacy.tsx`
- `Modal.tsx` (replaced by `dialog.tsx`)
- `Panel.tsx` (replaced by `card.tsx`)
- `index.ts` (the PascalCase barrel — shadcn convention is direct imports)

### Kept (no shadcn equivalent — domain primitives)
- `app/src/components/ui/PageHeader.tsx`
- `app/src/components/ui/ListItem.tsx`
- `app/src/components/ui/FileUpload.tsx` (its internal `import { Button } from "./Button"` will switch to `import { Button } from "./button"`)
- `app/src/components/ui/CodeBlock.tsx`

### Modified
- `app/src/app/globals.css` — remove `@import "../../../shared/styles/components.css"` line (Phase 3 only); the shared file itself stays untouched because `games/` still uses it.
- `app/src/components/Providers.tsx` — add `<Toaster />` from `@/components/ui/sonner` (Phase 1).
- 10 importer files in Phase 2 (one PR per area).

### Untouched (intentionally)
- `shared/styles/components.css` — used by `games/` package; only the app's `@import` of it goes away.
- `app/src/lib/utils.ts` — already has the `cn()` helper shadcn expects.
- `app/components.json` — already correctly configured (style: new-york, baseColor: neutral, RSC enabled).

---

## Importer Map (what each Phase 2 task touches)

| Area      | File(s)                                                                                                  | Components currently used                                  |
| --------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Branding  | `app/src/components/BrandingContent.tsx`                                                                 | `PageHeader, Panel, Modal, Button, Input, Select` + raw `.btn` at line 222 |
| Settings  | `app/src/components/SettingsContent.tsx`                                                                 | `PageHeader, Panel, Input, Select, FileUpload, Button`     |
| Team      | `app/src/components/TeamContent.tsx`                                                                     | `Panel, PanelHeader, Badge, Button, Modal, PageHeader`     |
| Keys      | `app/src/components/KeysContent.tsx`                                                                     | `Panel, PanelHeader, Button, PageHeader, CodeBlock`        |
| Games     | `app/src/components/GameSection.tsx`, `GameModal.tsx`, `GameListClient.tsx`                              | `Panel, PanelHeader, Badge, Button, Modal`                 |
| Auth      | `app/src/app/login/LoginForm.tsx`, `register/RegisterForm.tsx`, `invite/[token]/InviteForm.tsx`          | none from `@/components/ui` (vanilla `<input>`/`<button>`) |

---

## Component Mapping Cheat-Sheet

Use this when rewriting importers. Refer back here in every Phase 2 task.

### Button (`<Button>` legacy → `<Button>` shadcn)
- `variant="primary"` → `variant="default"`
- `variant="secondary"` → `variant="secondary"`
- `variant="outline"` → `variant="outline"`
- `variant="danger"` → `variant="destructive"`
- `variant="ghost"` → `variant="ghost"`
- `size="sm"` → `size="sm"`
- `size="md"` → omit (shadcn default)
- `icon="add"` (Material Symbol) → render a lucide icon as a child: `<Plus className="size-4" />Label`
- `disabled`, `onClick`, `type` — same API

Common Material Symbol → lucide swaps used in the codebase:
- `add` → `Plus`
- `person_add` → `UserPlus`
- `person_remove` → `UserMinus`
- `delete` → `Trash2`
- `edit` → `Pencil`
- `close` → `X`
- `check` → `Check`
- `check_circle` → `CheckCircle2`
- `content_copy` → `Copy`
- `code` → `Code`
- `mail` → `Mail`
- `refresh` → `RefreshCw`
- `lock` → `Lock`
- `palette` → `Palette`
- `expand_more` → `ChevronDown`
- `expand_less` → `ChevronUp`
- `info` → `Info`
- `cloud_upload` → `CloudUpload`
- `download` → `Download`
- `visibility` → `Eye`
- `auto_awesome` → `Sparkles`
- `grid_on` → `Grid3x3`
- `progress_activity` → `Loader2` (with `className="animate-spin"`)

Keep `<span class="material-symbols-outlined">` only when the icon is purely decorative inside untouched legacy markup that isn't part of this migration. **Inside any shadcn-migrated importer, prefer lucide.**

### Input (`<Input label="…">` legacy → `<Label>` + `<Input>` shadcn)
shadcn separates label and input. Pattern:
```tsx
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
</div>
```
Drop the `field`/`field-label` wrapper. The legacy `label` prop is gone; render `<Label>` explicitly.

### Select (`<Select options={[…]}>` legacy → composed shadcn `<Select>`)
Pattern:
```tsx
<div className="space-y-2">
  <Label htmlFor="lang">Language</Label>
  <Select value={lang} onValueChange={setLang}>
    <SelectTrigger id="lang"><SelectValue placeholder="Select…" /></SelectTrigger>
    <SelectContent>
      <SelectItem value="lt">🇱🇹 Lithuanian</SelectItem>
      <SelectItem value="en">🇬🇧 English</SelectItem>
    </SelectContent>
  </Select>
</div>
```
**API change:** legacy used `onChange={(e) => setX(e.target.value)}`; shadcn uses `onValueChange={setX}`. Native `<option value="">` for "(no default)" entries becomes `<SelectItem value="__none__">…</SelectItem>` because shadcn `SelectItem` cannot have an empty-string value — translate `"__none__"` → `""` (and back) at the boundary.

### Badge (legacy 7 variants → shadcn 4 + custom additions)
shadcn ships `default | secondary | destructive | outline`. We need the legacy variants. Edit the generated `badge.tsx` after install to add them via CVA. See Task 1.4 for exact code.

Mapping:
- `success` → keep custom (emerald)
- `warning` → keep custom (amber)
- `error` → `destructive`
- `info` → keep custom (blue)
- `neutral` → `secondary`
- `draft` → keep custom (slate)
- `scheduled` → keep custom (purple)

The legacy `dot` (default true) and `outline` (default false) and `onClick` (renders as button) features must be preserved. See Task 1.4.

### Modal → Dialog
- `<Modal open={x} onClose={fn} title="…" icon="…" size="md">…</Modal>`
  →
  `<Dialog open={x} onOpenChange={(o) => !o && fn()}>
     <DialogContent className="sm:max-w-lg">
       <DialogHeader>
         <DialogTitle><Icon className="mr-2 size-5" />Title</DialogTitle>
       </DialogHeader>
       <div className="…">{children}</div>
     </DialogContent>
   </Dialog>`
- Size mapping: `sm` → `className="sm:max-w-sm"`, `md` → `sm:max-w-lg` (default), `lg` → `sm:max-w-2xl`.
- shadcn's Dialog handles ESC, body scroll lock, and click-outside automatically — delete the manual `useEffect` from any inline copy.

### Panel/PanelHeader → Card/CardHeader/CardTitle/CardAction
- `<Panel>…</Panel>` → `<Card>…</Card>`
- `<PanelHeader title="…" count={n} action={<Button/>} />`
  →
  `<CardHeader>
     <CardTitle className="text-[15px]">{title}</CardTitle>
     {count !== undefined && <Badge variant="secondary">{count}</Badge>}
     <CardAction>{action}</CardAction>
   </CardHeader>`
  Wrap the body in `<CardContent>` (replaces the `<div className="px-6 py-4">…</div>` pattern).

### Sonner toasts (replace inline `{error && <div…>}`)
After Phase 1 lands, in every migrated importer:
- `import { toast } from "sonner"` (no need to import `<Toaster />` — already in `Providers`)
- `setError("…")` → `toast.error("…")`; delete the matching `{error && <div>…</div>}` JSX
- `setSuccess(true); setTimeout(…3000)` → `toast.success("…")`; delete the success JSX

### Forms (auth + password + invite) → react-hook-form + zod
Pattern (use literally — same imports, same shape — for every form migrated):
```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Min. 8 characters"),
})
type Values = z.infer<typeof schema>

const form = useForm<Values>({
  resolver: zodResolver(schema),
  defaultValues: { email: "", password: "" },
})

async function onSubmit(values: Values) { /* …existing fetch logic… */ }

return (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <FormField control={form.control} name="email" render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl><Input type="email" {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
      {/* repeat for other fields */}
      <Button type="submit" disabled={form.formState.isSubmitting}>Submit</Button>
    </form>
  </Form>
)
```

---

# PHASE 0 — Prep: rename collision-prone files

**Goal:** Rename four PascalCase files to `*Legacy.tsx` so the shadcn install in Phase 1 won't collide on case-insensitive filesystems. After Phase 0, the dashboard still compiles and behaves identically — nothing has been migrated yet.

### Task 0.1: Rename Button → ButtonLegacy

**Files:**
- Modify (rename): `app/src/components/ui/Button.tsx` → `app/src/components/ui/ButtonLegacy.tsx`
- Modify: `app/src/components/ui/index.ts`
- Modify: `app/src/components/ui/FileUpload.tsx`

- [ ] **Step 1: Move the file using `git mv` (case-sensitive, safe on macOS)**

```bash
cd /home/mindaugas/projects/brain-games/app
git mv src/components/ui/Button.tsx src/components/ui/ButtonLegacy.tsx
```

- [ ] **Step 2: Update internal import in FileUpload.tsx**

In `app/src/components/ui/FileUpload.tsx` line 2, change:
```tsx
import { Button } from "./Button";
```
to:
```tsx
import { Button } from "./ButtonLegacy";
```

- [ ] **Step 3: Update barrel export in index.ts**

In `app/src/components/ui/index.ts` line 4, change:
```ts
export { Button } from "./Button";
```
to:
```ts
export { Button } from "./ButtonLegacy";
```

- [ ] **Step 4: Verify build still passes**

Run from `app/`:
```bash
yarn build
```
Expected: build succeeds, no "Cannot find module './Button'" errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor(ui): rename Button.tsx to ButtonLegacy.tsx for shadcn migration"
```

---

### Task 0.2: Rename Input → InputLegacy

**Files:**
- Modify (rename): `app/src/components/ui/Input.tsx` → `app/src/components/ui/InputLegacy.tsx`
- Modify: `app/src/components/ui/index.ts`

- [ ] **Step 1: Rename**

```bash
cd /home/mindaugas/projects/brain-games/app
git mv src/components/ui/Input.tsx src/components/ui/InputLegacy.tsx
```

- [ ] **Step 2: Update barrel export**

In `app/src/components/ui/index.ts` line 5, change:
```ts
export { Input } from "./Input";
```
to:
```ts
export { Input } from "./InputLegacy";
```

- [ ] **Step 3: Verify**

```bash
yarn build
```
Expected: success.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor(ui): rename Input.tsx to InputLegacy.tsx for shadcn migration"
```

---

### Task 0.3: Rename Select → SelectLegacy

**Files:**
- Modify (rename): `app/src/components/ui/Select.tsx` → `app/src/components/ui/SelectLegacy.tsx`
- Modify: `app/src/components/ui/index.ts`

- [ ] **Step 1: Rename**

```bash
cd /home/mindaugas/projects/brain-games/app
git mv src/components/ui/Select.tsx src/components/ui/SelectLegacy.tsx
```

- [ ] **Step 2: Update barrel export**

In `app/src/components/ui/index.ts` line 6, change:
```ts
export { Select } from "./Select";
```
to:
```ts
export { Select } from "./SelectLegacy";
```

- [ ] **Step 3: Verify**

```bash
yarn build
```
Expected: success.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor(ui): rename Select.tsx to SelectLegacy.tsx for shadcn migration"
```

---

### Task 0.4: Rename Badge → BadgeLegacy

**Files:**
- Modify (rename): `app/src/components/ui/Badge.tsx` → `app/src/components/ui/BadgeLegacy.tsx`
- Modify: `app/src/components/ui/index.ts`

- [ ] **Step 1: Rename**

```bash
cd /home/mindaugas/projects/brain-games/app
git mv src/components/ui/Badge.tsx src/components/ui/BadgeLegacy.tsx
```

- [ ] **Step 2: Update barrel export**

In `app/src/components/ui/index.ts` line 3, change:
```ts
export { Badge } from "./Badge";
```
to:
```ts
export { Badge } from "./BadgeLegacy";
```

- [ ] **Step 3: Verify**

```bash
yarn build && yarn lint
```
Expected: both succeed.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor(ui): rename Badge.tsx to BadgeLegacy.tsx for shadcn migration"
```

---

# PHASE 1 — Install shadcn components and peer deps

**Goal:** Drop in every component scope-B requires, install the form/toast peer libraries, hook up `<Toaster />`, and extend `badge.tsx` with the project's status variants. After Phase 1 the dashboard still builds and runs — no importer has been switched yet.

### Task 1.1: Install peer dependencies

**Files:**
- Modify: `app/package.json`, `app/yarn.lock`

- [ ] **Step 1: Install runtime libs**

```bash
cd /home/mindaugas/projects/brain-games/app
yarn add react-hook-form zod @hookform/resolvers sonner cmdk
```

- [ ] **Step 2: Install peer needed by `@tanstack/react-table` (used by table.tsx if added later)**

```bash
yarn add @tanstack/react-table
```

- [ ] **Step 3: Verify**

```bash
yarn build
```
Expected: success.

- [ ] **Step 4: Commit**

```bash
git add package.json yarn.lock
git commit -m "chore(deps): add react-hook-form, zod, sonner, cmdk, react-table for shadcn migration"
```

---

### Task 1.2: Add shadcn components via CLI

**Files:**
- Create: `app/src/components/ui/button.tsx`
- Create: `app/src/components/ui/input.tsx`
- Create: `app/src/components/ui/select.tsx`
- Create: `app/src/components/ui/badge.tsx`
- Create: `app/src/components/ui/dialog.tsx`
- Create: `app/src/components/ui/card.tsx`
- Create: `app/src/components/ui/dropdown-menu.tsx`
- Create: `app/src/components/ui/tooltip.tsx`
- Create: `app/src/components/ui/sheet.tsx`
- Create: `app/src/components/ui/tabs.tsx`
- Create: `app/src/components/ui/separator.tsx`
- Create: `app/src/components/ui/skeleton.tsx`
- Create: `app/src/components/ui/alert.tsx`
- Create: `app/src/components/ui/avatar.tsx`
- Create: `app/src/components/ui/switch.tsx`
- Create: `app/src/components/ui/checkbox.tsx`
- Create: `app/src/components/ui/label.tsx`
- Create: `app/src/components/ui/textarea.tsx`
- Create: `app/src/components/ui/popover.tsx`
- Create: `app/src/components/ui/sonner.tsx`
- Create: `app/src/components/ui/command.tsx`
- Create: `app/src/components/ui/form.tsx`
- Create: `app/src/components/ui/table.tsx`

- [ ] **Step 1: Run the CLI add (one shot)**

```bash
cd /home/mindaugas/projects/brain-games/app
npx shadcn@latest add button input select badge dialog card dropdown-menu tooltip sheet tabs separator skeleton alert avatar switch checkbox label textarea popover sonner command form table --yes --overwrite
```

If the CLI prompts about overwriting `lib/utils.ts`, answer **No** (we keep ours — it's identical to shadcn's). The `--yes --overwrite` flag accepts component overwrites; you may need to answer the lib/utils prompt manually.

- [ ] **Step 2: Verify all 23 files were created**

```bash
ls app/src/components/ui/*.tsx | grep -E '^app/src/components/ui/[a-z]'
```
Expected: 23 lowercase files listed.

- [ ] **Step 3: Verify build passes (sonner.tsx may pull next-themes)**

```bash
yarn build
```
Expected: success. If it fails because `next-themes` is missing (referenced from `sonner.tsx`), install it:
```bash
yarn add next-themes
yarn build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/*.tsx package.json yarn.lock
git commit -m "feat(ui): add shadcn components (button, input, select, badge, dialog, card, dropdown-menu, tooltip, sheet, tabs, separator, skeleton, alert, avatar, switch, checkbox, label, textarea, popover, sonner, command, form, table)"
```

---

### Task 1.3: Mount the Sonner Toaster in the Providers tree

**Files:**
- Modify: `app/src/components/Providers.tsx`

- [ ] **Step 1: Update Providers.tsx to render Toaster**

Replace the entire content of `app/src/components/Providers.tsx` with:
```tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster richColors closeButton position="top-right" />
    </SessionProvider>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
yarn build
```
Expected: success.

- [ ] **Step 3: Smoke-check in dev**

Start the dev server and load the dashboard:
```bash
./dev.sh dev
```
Open http://localhost:3013/dashboard. Open the browser console and run:
```js
// In browser console:
import("/_next/static/chunks/...").then(() => {}); // skip — just visually check no errors
```
Visually confirm no hydration errors in the console. Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/components/Providers.tsx
git commit -m "feat(ui): mount Sonner Toaster in Providers"
```

---

### Task 1.4: Extend `badge.tsx` with project-specific status variants

**Files:**
- Modify: `app/src/components/ui/badge.tsx`

- [ ] **Step 1: Read what shadcn generated**

```bash
cat /home/mindaugas/projects/brain-games/app/src/components/ui/badge.tsx
```
Expected output: a CVA-based `badgeVariants` definition with `default | secondary | destructive | outline`. The exact shadcn-2025 file looks roughly like:
```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 ...",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
)
// ...
```

- [ ] **Step 2: Add the project status variants**

Open `app/src/components/ui/badge.tsx`. Inside the `variants.variant` object, **add** these five entries below the existing four (do not modify the existing four):
```ts
        success: "border-transparent bg-emerald-100 text-emerald-800 [a&]:hover:bg-emerald-200",
        warning: "border-transparent bg-amber-100 text-amber-800 [a&]:hover:bg-amber-200",
        info: "border-transparent bg-blue-100 text-blue-800 [a&]:hover:bg-blue-200",
        draft: "border-transparent bg-slate-100 text-slate-700 [a&]:hover:bg-slate-200",
        scheduled: "border-transparent bg-purple-100 text-purple-800 [a&]:hover:bg-purple-200",
```

- [ ] **Step 3: Verify build picks up the new variants**

```bash
yarn build
```
Expected: success.

- [ ] **Step 4: Verify lint**

```bash
yarn lint
```
Expected: zero errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/badge.tsx
git commit -m "feat(ui): add success/warning/info/draft/scheduled variants to shadcn Badge"
```

---

# PHASE 2 — Per-area migration

**Goal:** One area = one PR. Each task fully migrates its area off legacy components and onto shadcn + sonner + (where it's a real form) react-hook-form. After every task, the dashboard for that area uses **only** shadcn primitives. Other areas may still use Legacy until their own task lands — that's fine; the shadcn and Legacy components coexist cleanly.

**Order is deliberate:** start with Branding (smallest, isolated), then Settings → Team → Keys → Games (the largest) → Auth (separate route group). This builds momentum and surfaces gotchas early.

### Task 2.1: Migrate Branding (`BrandingContent.tsx`)

**Files:**
- Modify: `app/src/components/BrandingContent.tsx`

- [ ] **Step 1: Replace imports**

In `app/src/components/BrandingContent.tsx` lines 6–10, replace:
```tsx
import { PageHeader, Panel, Modal, Button, Input, Select } from "@/components/ui"
```
with:
```tsx
import { PageHeader } from "@/components/ui/PageHeader"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Trash2, Pencil, Palette } from "lucide-react"
import { toast } from "sonner"
```

- [ ] **Step 2: Convert `<Panel>` (used twice — once empty state, once around card grid wasn't actually a Panel; verify the exact two `<Panel>` usages)**

Search for `<Panel>` in the file. The empty-state block (around line 134):
```tsx
<Panel>
  <div className="p-12 text-center">
    …
  </div>
</Panel>
```
becomes:
```tsx
<Card>
  <CardContent className="p-12 text-center">
    …
  </CardContent>
</Card>
```

- [ ] **Step 3: Convert the `<Modal>` for "New brand" (around line 246)**

Replace the entire `<Modal open={showCreateModal} …>…</Modal>` block with:
```tsx
<Dialog open={showCreateModal} onOpenChange={(open) => { if (!open && !creating) handleCloseCreate() }}>
  <DialogContent className="sm:max-w-lg">
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        <Palette className="size-5" />
        New brand
      </DialogTitle>
    </DialogHeader>
    <form onSubmit={handleCreate} className="flex flex-col gap-4">
      <div className="space-y-2">
        <Label htmlFor="brand-name">Name</Label>
        <Input
          id="brand-name"
          value={createName}
          onChange={(e) => setCreateName(e.target.value)}
          placeholder="e.g. Default, Dark theme, LRT"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="brand-preset">Starter preset</Label>
        <Select value={createPresetId} onValueChange={setCreatePresetId}>
          <SelectTrigger id="brand-preset"><SelectValue /></SelectTrigger>
          <SelectContent>
            {PRESETS.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-2">
        <Button type="button" variant="outline" onClick={handleCloseCreate}>Cancel</Button>
        <Button type="submit" disabled={creating}>
          {creating ? "Creating…" : "Create brand"}
        </Button>
      </div>
    </form>
  </DialogContent>
</Dialog>
```
**Delete** the existing `{createError && <p>…</p>}` JSX — replace with `toast.error(createError)` calls. Update `handleCreate` so the existing `setCreateError("Failed to create brand")` lines become `toast.error("Failed to create brand")`. Remove `createError` state.

- [ ] **Step 4: Convert the delete-confirmation `<Modal>` (around line 287)**

Replace with:
```tsx
<Dialog open={deleteTarget != null} onOpenChange={(open) => { if (!open && !deletingId) handleCancelDelete() }}>
  <DialogContent className="sm:max-w-sm">
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        <Trash2 className="size-5" />
        Delete brand
      </DialogTitle>
    </DialogHeader>
    {deleteTarget && (
      <div className="flex flex-col gap-4">
        <p className="text-sm">
          Delete <strong>&ldquo;{deleteTarget.name || "Untitled"}&rdquo;</strong>?
        </p>
        {deleteTarget.usageCount > 0 ? (
          <p className="text-sm bg-yellow-50 text-yellow-800 px-3 py-2 rounded-[4px]">
            <span className="font-medium">{formatUsageLabel(deleteTarget.usageCount)}.</span>{" "}
            Those games will lose their custom styling and fall back to platform defaults.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            This brand isn&rsquo;t attached to any games, so nothing else will change.
          </p>
        )}
        <p className="text-xs text-muted-foreground">This cannot be undone.</p>
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-2">
          <Button variant="outline" onClick={handleCancelDelete} disabled={deletingId === deleteTarget.id}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmDelete}
            disabled={deletingId === deleteTarget.id}
          >
            {deletingId === deleteTarget.id ? "Deleting…" : "Delete brand"}
          </Button>
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>
```
Replace `setDeleteError("…")` calls inside `handleConfirmDelete` with `toast.error("…")`. Remove `deleteError` state and the inline `<p>{deleteError}</p>`.

- [ ] **Step 5: Replace remaining `<Button>` invocations**

- Line ~127 `<Button icon="add" onClick={handleOpenCreate}>New brand</Button>`
  → `<Button onClick={handleOpenCreate}><Plus className="size-4" />New brand</Button>`
- Line ~142 `<Button onClick={handleOpenCreate}>Create first brand</Button>` (no change)
- Line ~229 `<Button variant="outline" size="sm" icon="delete" disabled={…} onClick={…}>{…}</Button>`
  → `<Button variant="outline" size="sm" disabled={deletingId === p.id} onClick={() => handleRequestDelete(p)}><Trash2 className="size-4" />{deletingId === p.id ? "Deleting…" : "Delete"}</Button>`

- [ ] **Step 6: Replace the raw `.btn` Link at line 222**

Currently:
```tsx
<Link
  href={`/dashboard/branding/${p.id}/edit`}
  className="btn btn-secondary btn--sm"
>
  <span className="material-symbols-outlined text-sm">edit</span>
  Edit
</Link>
```
Replace with:
```tsx
<Button asChild variant="secondary" size="sm">
  <Link href={`/dashboard/branding/${p.id}/edit`}>
    <Pencil className="size-4" />
    Edit
  </Link>
</Button>
```
This requires the shadcn `Button` to support `asChild` (it does via Radix `Slot`).

- [ ] **Step 7: Remove orphaned state**

Delete the now-unused `createError` and `deleteError` state declarations and any `setCreateError("")` / `setDeleteError("")` resets.

- [ ] **Step 8: Verify build + lint**

```bash
cd /home/mindaugas/projects/brain-games/app
yarn lint && yarn build
```
Expected: both succeed.

- [ ] **Step 9: Smoke test in dev**

```bash
./dev.sh dev
```
Visit http://localhost:3013/dashboard/branding. Verify:
- The "New brand" button opens the dialog.
- Creating a brand with empty name shows a toast error.
- The "Delete brand" dialog opens, "Cancel" closes it, and "Delete brand" calls the API.
- The brand cards still show Edit + Delete buttons.

Stop dev.

- [ ] **Step 10: Commit**

```bash
git add src/components/BrandingContent.tsx
git commit -m "refactor(branding): migrate BrandingContent to shadcn dialog/card/button + sonner"
```

---

### Task 2.2: Migrate Settings (`SettingsContent.tsx`)

**Files:**
- Modify: `app/src/components/SettingsContent.tsx`

This file has two distinct flows: organization settings (state-driven) and a password change form (validated). Migrate both.

- [ ] **Step 1: Replace imports**

Replace lines 5–12:
```tsx
import {
  PageHeader,
  Panel,
  Input,
  Select,
  FileUpload,
  Button,
} from "@/components/ui";
```
with:
```tsx
import { PageHeader } from "@/components/ui/PageHeader"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { FileUpload } from "@/components/ui/FileUpload"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Lock } from "lucide-react"
import { toast } from "sonner"
```

- [ ] **Step 2: Convert each `<Panel>` to `<Card><CardContent>`**

Three Panels exist (organization settings, appearance, social sharing). For each:
- `<Panel>` → `<Card>`
- The inner `<div className="p-4 sm:p-6 lg:p-8 …">` → `<CardContent className="p-4 sm:p-6 lg:p-8 …">`
- The inner `<div className="px-4 sm:px-6 lg:px-8 py-4 border-t border-[#f1f5f9] …">` (the save footer) stays as a `<div>` after the `</CardContent>` but inside the `<Card>`.

- [ ] **Step 3: Replace `<Input label="…">` with `<Label>` + `<Input>`**

Six inputs: org name, share image URL, share title, share description, current password, new password, confirm password. Pattern for each (using org name as the example):
```tsx
<div className="space-y-2">
  <Label htmlFor="org-name">Organization Name</Label>
  <Input
    id="org-name"
    value={orgName}
    onChange={(e) => setOrgName(e.target.value)}
    placeholder="e.g. My Company"
    disabled={!isOwner}
  />
</div>
```

- [ ] **Step 4: Replace `<Select>` calls**

The two Selects (Language, Default Branding):
```tsx
<div className="space-y-2">
  <Label htmlFor="language">Language</Label>
  <Select value={language} onValueChange={setLanguage} disabled={!isOwner}>
    <SelectTrigger id="language"><SelectValue /></SelectTrigger>
    <SelectContent>
      <SelectItem value="lt">🇱🇹 Lithuanian</SelectItem>
      <SelectItem value="en">🇬🇧 English</SelectItem>
    </SelectContent>
  </Select>
</div>
```
For Default Branding, the legacy `{ value: "", label: "None (no default)" }` must use a non-empty sentinel because shadcn `SelectItem` rejects empty strings:
```tsx
<Select value={defaultBranding || "__none__"} onValueChange={(v) => setDefaultBranding(v === "__none__" ? "" : v)} disabled={!isOwner}>
  <SelectTrigger id="branding"><SelectValue /></SelectTrigger>
  <SelectContent>
    <SelectItem value="__none__">None (no default)</SelectItem>
    {brandingOptions.map((b) => (
      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
    ))}
  </SelectContent>
</Select>
```

- [ ] **Step 5: Replace the appearance checkbox with `<Switch>`**

Inside the Appearance card, replace the `<label><input type="checkbox" …/>…</label>` block with:
```tsx
<div className="flex items-start gap-3">
  <Switch
    id="use-platform-chrome"
    checked={usePlatformChrome}
    disabled={chromePending}
    onCheckedChange={(checked) => void handleChromeToggle(checked)}
    className="mt-0.5"
  />
  <Label htmlFor="use-platform-chrome" className="text-sm font-normal cursor-pointer">
    Use the platform default appearance (don&apos;t apply my organization&apos;s brand to the dashboard).
  </Label>
</div>
```
Replace `setChromeError("…")` calls with `toast.error("…")` and remove the `chromeError` state and the `<p>{chromeError}</p>`.

- [ ] **Step 6: Replace the "Saved!" success indicator + setTimeout with `toast.success`**

In `handleSave`, replace:
```tsx
if (res.ok) {
  setSaved(true);
  setTimeout(() => setSaved(false), 3000);
} else if (res.status === 403) {
  setLogoError("Only the organization owner can change settings.");
}
```
with:
```tsx
if (res.ok) {
  toast.success("Settings saved")
} else if (res.status === 403) {
  toast.error("Only the organization owner can change settings.")
}
```
Delete the `saved` state, the `{saved && …}` JSX in both card footers, and the `setLogoError` call (replace with `toast.error`).

- [ ] **Step 7: Migrate `PasswordSection` to react-hook-form + zod**

Replace the entire `function PasswordSection() { … }` (lines 375–496) with:
```tsx
function PasswordSection() {
  const schema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Min. 8 characters"),
    confirmPassword: z.string().min(8, "Min. 8 characters"),
  }).refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  type Values = z.infer<typeof schema>

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  })

  async function onSubmit(values: Values) {
    try {
      const res = await fetch("/api/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success("Password changed!")
      form.reset()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to change password")
    }
  }

  return (
    <Card>
      <CardContent className="p-4 sm:p-6 lg:p-8 pt-6 space-y-6">
        <div className="border-b border-[#f1f5f9] pb-4">
          <h2 className="text-lg font-semibold text-navy-900">Security &amp; Access</h2>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="password-form" className="space-y-5 max-w-sm">
            <FormField control={form.control} name="currentPassword" render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="newPassword" render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="confirmPassword" render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </form>
        </Form>
      </CardContent>
      <div className="px-8 py-4 border-t border-[#f1f5f9] flex items-center justify-end gap-3">
        <Button variant="outline" form="password-form" type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Updating..." : "Update Password"}
        </Button>
      </div>
    </Card>
  )
}
```

- [ ] **Step 8: Replace the "Settings can only be changed by the organization owner" lock notice**

```tsx
<p className="text-sm text-muted-foreground flex items-center gap-2">
  <Lock className="size-4" />
  Settings can only be changed by the organization owner
</p>
```

- [ ] **Step 9: Verify build + lint**

```bash
cd /home/mindaugas/projects/brain-games/app
yarn lint && yarn build
```
Expected: both succeed.

- [ ] **Step 10: Smoke test**

```bash
./dev.sh dev
```
Visit http://localhost:3013/dashboard/settings. Verify:
- Org name input, language select, branding select work.
- Logo upload still works (FileUpload kept).
- Switch toggles platform chrome.
- Password form: empty submission shows zod errors inline; mismatched passwords show error on confirm field; valid submission shows toast.

Stop dev.

- [ ] **Step 11: Commit**

```bash
git add src/components/SettingsContent.tsx
git commit -m "refactor(settings): migrate SettingsContent + password form to shadcn + react-hook-form + sonner"
```

---

### Task 2.3: Migrate Team (`TeamContent.tsx`)

**Files:**
- Modify: `app/src/components/TeamContent.tsx`

- [ ] **Step 1: Replace imports**

Lines 4–11:
```tsx
import {
  Panel,
  PanelHeader,
  Badge,
  Button,
  Modal,
  PageHeader,
} from "@/components/ui";
```
becomes:
```tsx
import { PageHeader } from "@/components/ui/PageHeader"
import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  UserPlus,
  UserMinus,
  RefreshCw,
  Mail,
  CheckCircle2,
} from "lucide-react"
import { toast } from "sonner"
```

- [ ] **Step 2: Convert the Members `<Panel>` + `<PanelHeader>`**

Replace:
```tsx
<Panel>
  <PanelHeader title="Members" count={data.members.length} action={…} />
  <div className="divide-y divide-[#e2e8f0]">…</div>
</Panel>
```
with:
```tsx
<Card>
  <CardHeader>
    <CardTitle className="text-[15px]">Members</CardTitle>
    <Badge variant="secondary">{data.members.length}</Badge>
    {data.isOwner && (
      <CardAction>
        <Button size="sm" onClick={() => setInviteOpen(true)}>
          <UserPlus className="size-4" />
          Invite Member
        </Button>
      </CardAction>
    )}
  </CardHeader>
  <div className="divide-y divide-[#e2e8f0]">…</div>
</Card>
```

- [ ] **Step 3: Convert the per-member badge calls**

Inside the `data.members.map` block:
- The `Badge variant={member.invite_expired ? "error" : "warning"}` call: change `"error"` to `"destructive"`. (warning stays.)
- The `Badge variant={member.org_role === "owner" ? "warning" : "neutral"}`: change `"neutral"` to `"secondary"`.
- All these badges previously had `dot={true}` (default) implicitly drawn via the legacy badge's CSS. The shadcn badge does **not** render a dot. To preserve the look, prefix the badge text with a small dot using a `<span>`:
  ```tsx
  <Badge variant={member.invite_expired ? "destructive" : "warning"}>
    <span className="size-1.5 rounded-full bg-current opacity-70" />
    {member.invite_expired ? "Expired" : "Pending"}
  </Badge>
  ```
  Apply the same dot pattern to the role badge.

- [ ] **Step 4: Replace owner action `<button>`s with shadcn `Button`**

The two icon buttons (resend, remove member) should use shadcn:
```tsx
{member.invite_pending && (
  <Button
    variant="ghost"
    size="icon"
    onClick={() => handleResendInvite(member.id)}
    title="Regenerate invite link"
  >
    <RefreshCw className="size-4" />
  </Button>
)}
{member.org_role !== "owner" && (
  <Button
    variant="ghost"
    size="icon"
    onClick={() => setDeleteConfirm(member.id)}
    title="Remove member"
    className="hover:text-red-600"
  >
    <UserMinus className="size-4" />
  </Button>
)}
```

- [ ] **Step 5: Convert the Invite `<Modal>` to `<Dialog>` and migrate the form to react-hook-form**

Replace the entire invite modal (the long block starting around line 273 with `<Modal open={inviteOpen} …>`) with:
```tsx
<Dialog open={inviteOpen} onOpenChange={(open) => { if (!open) closeInviteModal() }}>
  <DialogContent className="sm:max-w-lg">
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        <UserPlus className="size-5" />
        {inviteLink ? "Invite Link Ready" : "Invite Member"}
      </DialogTitle>
    </DialogHeader>
    {inviteLink ? (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-[4px] mx-auto">
          <CheckCircle2 className="size-6 text-green-600" />
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Share this link with the new member. They&apos;ll be able to set their own password and join your organization.
        </p>
        <div className="flex items-center gap-2 bg-slate-50 border rounded-md px-3 py-2.5">
          <input
            type="text"
            readOnly
            value={inviteLink}
            className="flex-1 bg-transparent text-sm outline-none truncate"
          />
          <Button size="sm" onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</Button>
        </div>
        <p className="text-xs text-muted-foreground text-center">This link expires in 7 days.</p>
        <Button variant="outline" onClick={closeInviteModal} className="w-full">Done</Button>
      </div>
    ) : (
      <InviteMemberForm onSubmit={handleInvite} loading={inviteLoading} onCancel={closeInviteModal} />
    )}
  </DialogContent>
</Dialog>
```

Add a new sub-component at the bottom of the file (above the `Member` interface block? No — at the bottom of the file as a named function):
```tsx
function InviteMemberForm({
  onSubmit,
  loading,
  onCancel,
}: {
  onSubmit: (values: { email: string; firstName: string; lastName: string }) => Promise<void>
  loading: boolean
  onCancel: () => void
}) {
  const schema = z.object({
    email: z.string().email("Enter a valid email"),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  })
  type Values = z.infer<typeof schema>

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", firstName: "", lastName: "" },
  })

  async function handle(values: Values) {
    await onSubmit({
      email: values.email,
      firstName: values.firstName ?? "",
      lastName: values.lastName ?? "",
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handle)} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField control={form.control} name="firstName" render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl><Input placeholder="John" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="lastName" render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl><Input placeholder="Doe" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>Email *</FormLabel>
            <FormControl><Input type="email" placeholder="member@example.com" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={loading}>{loading ? "Sending…" : "Send Invite"}</Button>
        </div>
      </form>
    </Form>
  )
}
```

Update `handleInvite` to take `(values: { email; firstName; lastName })` instead of a `FormEvent`. Replace the existing `setInviteError("…")` calls with `toast.error("…")` and remove the `inviteError` state.

- [ ] **Step 6: Convert the resend-link `<Modal>` (around line 397) to `<Dialog>`**

```tsx
<Dialog open={!!inviteLink && !inviteOpen} onOpenChange={(open) => { if (!open) setInviteLink("") }}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        <Mail className="size-5" />
        New Invite Link
      </DialogTitle>
    </DialogHeader>
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground text-center">Share this updated link with the member.</p>
      <div className="flex items-center gap-2 bg-slate-50 border rounded-md px-3 py-2.5">
        <input type="text" readOnly value={inviteLink} className="flex-1 bg-transparent text-sm outline-none truncate" />
        <Button size="sm" onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</Button>
      </div>
      <p className="text-xs text-muted-foreground text-center">This link expires in 7 days.</p>
      <Button variant="outline" onClick={() => setInviteLink("")} className="w-full">Done</Button>
    </div>
  </DialogContent>
</Dialog>
```

- [ ] **Step 7: Convert the Remove Member confirm `<Modal>` (around line 438) to `<Dialog>`**

```tsx
<Dialog open={!!deleteConfirm} onOpenChange={(open) => { if (!open) setDeleteConfirm(null) }}>
  <DialogContent className="sm:max-w-sm">
    <DialogHeader>
      <DialogTitle>Remove Member</DialogTitle>
    </DialogHeader>
    <p className="text-sm text-muted-foreground">
      Are you sure you want to remove this member? They will lose access to all shared games and data.
    </p>
    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-4">
      <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
      <Button variant="destructive" onClick={() => deleteConfirm && handleRemove(deleteConfirm)}>
        Remove
      </Button>
    </div>
  </DialogContent>
</Dialog>
```

- [ ] **Step 8: Verify build + lint**

```bash
cd /home/mindaugas/projects/brain-games/app
yarn lint && yarn build
```
Expected: both succeed.

- [ ] **Step 9: Smoke test**

```bash
./dev.sh dev
```
Visit http://localhost:3013/dashboard/team. Verify:
- "Invite Member" opens the dialog.
- Submitting an invalid email shows the zod inline error.
- Submitting a valid one progresses to the link-ready view.
- Remove-member dialog opens and the destructive Remove button is red.

Stop dev.

- [ ] **Step 10: Commit**

```bash
git add src/components/TeamContent.tsx
git commit -m "refactor(team): migrate TeamContent to shadcn dialog/card/badge + react-hook-form + sonner"
```

---

### Task 2.4: Migrate Keys (`KeysContent.tsx`)

**Files:**
- Modify: `app/src/components/KeysContent.tsx`

- [ ] **Step 1: Replace imports**

Lines 4–10:
```tsx
import {
  Panel,
  PanelHeader,
  Button,
  PageHeader,
  CodeBlock,
} from "@/components/ui";
```
becomes:
```tsx
import { PageHeader } from "@/components/ui/PageHeader"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CodeBlock } from "@/components/ui/CodeBlock"
import { Copy, Check } from "lucide-react"
import { toast } from "sonner"
```

- [ ] **Step 2: Convert the API Token `<Panel>`**

```tsx
<Card className="mb-8">
  <CardHeader>
    <CardTitle className="text-[15px]">API Token</CardTitle>
  </CardHeader>
  <CardContent className="p-4 sm:p-5">
    {/* existing token display unchanged except buttons below */}
  </CardContent>
</Card>
```

- [ ] **Step 3: Replace the inline Copy/Generate/Revoke `<button>`s with shadcn `Button`**

The Copy button in the token row:
```tsx
<Button variant="secondary" onClick={() => copyToClipboard(token, "token")}>
  {copied === "token" ? <Check className="size-4" /> : <Copy className="size-4" />}
  {copied === "token" ? "Copied!" : "Copy"}
</Button>
```
The Revoke link:
```tsx
<Button variant="ghost" size="sm" onClick={handleRevoke} className="text-red-600 hover:text-red-700">
  Revoke Token
</Button>
```
The Generate Token button:
```tsx
<Button onClick={handleGenerate} disabled={generating}>
  {generating ? "Generating…" : "Generate Token"}
</Button>
```

- [ ] **Step 4: Convert each `EmbedCard` to use Card primitives**

Update the `EmbedCard` component:
```tsx
function EmbedCard({ title, icon: _icon, iconColor: _iconColor, code, copied, onCopy }: {
  title: string
  icon: string
  iconColor: string
  code: string
  copied: string | null
  onCopy: (text: string, label: string) => void
}) {
  const label = `embed-${title.toLowerCase().replace(/\s/g, "-")}`
  const isCopied = copied === label

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[15px]">{title} Embed Code</CardTitle>
        <CardAction>
          <Button size="sm" variant="secondary" onClick={() => onCopy(code, label)}>
            {isCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {isCopied ? "Copied!" : "Copy Snippet"}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="p-4 sm:p-5">
        <CodeBlock code={code} />
      </CardContent>
    </Card>
  )
}
```
The `icon` and `iconColor` props are now unused — keep them in the type but prefix with `_` so lint doesn't complain, or remove them and update the three call sites.

- [ ] **Step 5: Replace the `copyToClipboard` setTimeout success-state with toast**

In `copyToClipboard`, after `navigator.clipboard.writeText(text)`, replace the `setCopied`/`setTimeout` mechanic if you remove `copied` state entirely — but the inline button labels rely on `copied`. **Keep the existing behaviour** (it's a UX pattern). Just add `toast.success("Copied to clipboard")` so users get feedback whether the button is in view or not:
```tsx
function copyToClipboard(text: string, label: string) {
  navigator.clipboard.writeText(text)
  toast.success("Copied to clipboard")
  setCopied(label)
  setTimeout(() => setCopied(null), 2000)
}
```

- [ ] **Step 6: Verify build + lint**

```bash
cd /home/mindaugas/projects/brain-games/app
yarn lint && yarn build
```
Expected: both succeed.

- [ ] **Step 7: Smoke test**

```bash
./dev.sh dev
```
Visit http://localhost:3013/dashboard/keys. Verify Generate Token, Copy, and Revoke all work and show toasts where appropriate.

Stop dev.

- [ ] **Step 8: Commit**

```bash
git add src/components/KeysContent.tsx
git commit -m "refactor(keys): migrate KeysContent to shadcn card/button + sonner"
```

---

### Task 2.5: Migrate Games admin (`GameSection.tsx` + `GameModal.tsx` + `GameListClient.tsx`)

**Files:**
- Modify: `app/src/components/GameSection.tsx`
- Modify: `app/src/components/GameModal.tsx`
- Modify: `app/src/components/GameListClient.tsx`

These three are tightly coupled (one renders the other). Migrate them in a single task and a single commit so the build never breaks mid-area.

- [ ] **Step 1: Update `GameSection.tsx` imports**

Replace line 3:
```tsx
import { Panel, PanelHeader, Badge, Button } from "@/components/ui"
```
with:
```tsx
import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Code, Download, Eye, Pencil, Trash2 } from "lucide-react"
```

- [ ] **Step 2: Restructure `GameSection.tsx` — Panel → Card and inline icon buttons**

Replace `<Panel><PanelHeader title={…} count={…} action={…} />…</Panel>` with:
```tsx
<Card>
  <CardHeader>
    <CardTitle className="text-[15px]">{title}</CardTitle>
    <Badge variant="secondary">{games.length}</Badge>
    <CardAction>
      <Button size="sm" onClick={onAdd}><Plus className="size-4" />New</Button>
    </CardAction>
  </CardHeader>
  {/* existing inner divide-y rendering, but with the changes below */}
</Card>
```

In each game row:
- The status `<Badge variant="scheduled" onClick={…}>` and `<Badge variant={…success/draft}>` calls keep their variants (we added these to `badge.tsx` in Task 1.4).
- Replace each `<button>` icon button with shadcn `<Button variant="ghost" size="icon">`:
  ```tsx
  <Button variant="ghost" size="icon" onClick={() => onShowCode(game)} title="Embed Code" className="hover:text-rust">
    <Code className="size-4" />
  </Button>
  ```
  Repeat for Export CSV (`Download`), Preview (`<Button asChild variant="ghost" size="icon"><a href={…}><Eye/></a></Button>`), Edit (`Pencil`), Delete (`Trash2` with `className="hover:text-red-600"`).

- [ ] **Step 3: Update `GameModal.tsx` imports and replace `<Modal>`**

Replace line 4:
```tsx
import { Modal } from "@/components/ui"
```
with:
```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider" // see Step 4 below
import { Loader2, X, Sparkles, Grid3x3, Copy, Check, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
```

- [ ] **Step 4: Add the Slider component (used for AI word-count range)**

```bash
cd /home/mindaugas/projects/brain-games/app
npx shadcn@latest add slider --yes --overwrite
```
Verify `app/src/components/ui/slider.tsx` exists.

- [ ] **Step 5: Wrap the success view in `<Dialog>`**

Replace the entire `if (createdGame) { return <Modal …>…</Modal> }` block. The new shape:
```tsx
if (createdGame) {
  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{`${typeLabels[type]} Created!`}</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle2 className="size-5 text-green-600" />
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate">&ldquo;{createdGame.title}&rdquo;</p>
            <p className="text-xs text-muted-foreground">ID: {createdGame.id}</p>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2 gap-2">
            <Label>Embed Code</Label>
            <Button size="sm" variant="secondary" onClick={copyEmbed}>
              {embedCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {embedCopied ? "Copied!" : "Copy Snippet"}
            </Button>
          </div>
          <pre className="bg-slate-900 text-slate-300 rounded-md p-4 text-xs overflow-x-auto leading-relaxed">
            <code>{getEmbedCode(createdGame.id)}</code>
          </pre>
        </div>
        <p className="text-xs text-muted-foreground mb-5">
          Paste this snippet into your website&apos;s HTML to display the game.
        </p>
        <div className="flex justify-end">
          <Button onClick={onClose}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```
Replace `setEmbedCopied(true); setTimeout(…2000)` with both behaviours: keep the `embedCopied` flag for the inline button label, **and** add `toast.success("Embed code copied")`.

- [ ] **Step 6: Wrap the create/edit form in `<Dialog>`**

Replace the outer `return ( <Modal open onClose={onClose} title={…} size="md"> <form…>…</form> </Modal> )` with:
```tsx
return (
  <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
    <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{`${mode === "create" ? "Create" : "Edit"} ${typeLabels[type]}`}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit}>{/* the existing form content */}</form>
    </DialogContent>
  </Dialog>
)
```

- [ ] **Step 7: Replace inline form `<input>`/`<select>`/`<textarea>` with shadcn equivalents**

For each of: Title input, Status select, Scheduled Date input, Difficulty select, Branding Preset select, Main Word input, Word Game Word input, Definition textarea, Max Attempts input, Words/Clues entry inputs, Word Search inputs:

- Plain `<input>` → `<Input>` with a separate `<Label>`.
- `<select>` → composed `<Select><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>…</SelectContent></Select>` and `onChange` → `onValueChange`.
- `<textarea>` → `<Textarea>`.
- `<input type="range">` (the AI word-count slider) → `<Slider min={3} max={20} value={[aiWordCount]} onValueChange={(v) => setAiWordCount(v[0])} />`.

Drop the legacy custom focus styling (`focus:ring-rust/20 focus:border-rust`) — shadcn provides its own focus ring via `--ring` (which is already wired to the platform accent in `globals.css`).

- [ ] **Step 8: Replace inline action buttons with shadcn `Button`**

The Cancel/Submit footer:
```tsx
<div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-4 border-t">
  <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
  <Button type="submit" disabled={saving}>
    {saving ? "Saving…" : mode === "create" ? "Create" : "Save Changes"}
  </Button>
</div>
```

The "Generate with AI" gradient button stays a custom `<button>` because shadcn `Button` doesn't ship a gradient variant, **but** wrap its loading icon swap with lucide's `Loader2` and the sparkle with `<Sparkles className="size-4" />`. The "Layout"/"AI Layout" buttons should become shadcn `Button` instances:
```tsx
<Button size="sm" variant="default" onClick={generateLayoutWithAI} disabled={layoutLoading}>
  {layoutLoading ? <Loader2 className="size-4 animate-spin" /> : <Grid3x3 className="size-4" />}
  Layout
</Button>
```

The per-word remove `<button>` (the `<X>` icon) → `<Button variant="ghost" size="icon">…</Button>`.

The two language-toggle buttons in the AI panel: convert into a `Toggle Group` later if you want; for now leave as plain buttons (this is the only "stylistic legacy" allowed in this task — call it out in the PR description).

- [ ] **Step 9: Replace `setError` / `setAiError` / `setLayoutError` with toasts**

Every `setError("…")` / `setAiError("…")` becomes `toast.error("…")`. The `setLayoutError("✓ N% density…")` is informational, not an error — use `toast.success(…)` for the positive case and `toast.error(…)` for the negative. Delete the `error`, `aiError`, `layoutError` states and the inline JSX that renders them.

- [ ] **Step 10: Update `GameListClient.tsx` imports**

Replace line 5:
```tsx
import { Modal } from "@/components/ui"
```
with:
```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Code, Copy, Check } from "lucide-react"
```

- [ ] **Step 11: Convert the Delete Confirmation `<Modal>` to `<Dialog>`**

```tsx
<Dialog open={!!deleteConfirm} onOpenChange={(open) => { if (!open) setDeleteConfirm(null) }}>
  <DialogContent className="sm:max-w-sm">
    <DialogHeader>
      <DialogTitle>Delete Game</DialogTitle>
    </DialogHeader>
    <p className="text-sm text-muted-foreground mb-2">Are you sure? This action cannot be undone.</p>
    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-4">
      <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
      <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm.type, deleteConfirm.id)}>
        Delete
      </Button>
    </div>
  </DialogContent>
</Dialog>
```

- [ ] **Step 12: Convert the Embed Code Popover `<Modal>` to `<Dialog>`**

```tsx
<Dialog open={!!embedPopover} onOpenChange={(open) => { if (!open) { setEmbedPopover(null); setEmbedCopied(false) } }}>
  <DialogContent className="sm:max-w-lg">
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        <Code className="size-5" />
        Embed Code
      </DialogTitle>
    </DialogHeader>
    {embedPopover && (
      <>
        <div className="flex items-center gap-3 mb-4">
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">{embedPopover.game.title || `Game #${embedPopover.game.id}`}</p>
            <p className="text-xs text-muted-foreground">ID: {embedPopover.game.id}</p>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2 gap-2">
            <Label>Paste this into your HTML</Label>
            <Button size="sm" variant="secondary" onClick={() => copyEmbedSnippet(embedPopover.game.id)}>
              {embedCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {embedCopied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <pre className="bg-slate-900 text-slate-300 rounded-md p-4 text-xs overflow-x-auto leading-relaxed">
            <code>{getEmbedSnippet(embedPopover.game.id)}</code>
          </pre>
        </div>
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => { setEmbedPopover(null); setEmbedCopied(false) }}>Close</Button>
        </div>
      </>
    )}
  </DialogContent>
</Dialog>
```

- [ ] **Step 13: Verify build + lint**

```bash
cd /home/mindaugas/projects/brain-games/app
yarn lint && yarn build
```
Expected: both succeed.

- [ ] **Step 14: Smoke test**

```bash
./dev.sh dev
```
Visit `http://localhost:3013/dashboard/games/crosswords`. Verify:
- The list renders with status badges (success/draft/scheduled).
- Icon buttons (code, preview, edit, delete) all work.
- "New" opens the GameModal dialog. Title, Status select, Branding select all behave.
- The "Words & Clues" section renders correctly.
- Generating words with AI either succeeds (toast.success) or shows an error toast.
- Editing an existing crossword works.
- Delete confirmation dialog shows and Delete is destructive-styled.
- Embed Code dialog from the list view works.

Stop dev.

- [ ] **Step 15: Commit**

```bash
git add src/components/GameSection.tsx src/components/GameModal.tsx src/components/GameListClient.tsx src/components/ui/slider.tsx package.json yarn.lock
git commit -m "refactor(games): migrate GameSection/Modal/ListClient to shadcn dialog/card/button/select + sonner"
```

---

### Task 2.6: Migrate Auth (`LoginForm`, `RegisterForm`, `InviteForm`)

**Files:**
- Modify: `app/src/app/login/LoginForm.tsx`
- Modify: `app/src/app/register/RegisterForm.tsx`
- Modify: `app/src/app/invite/[token]/InviteForm.tsx`

All three are vanilla `useState` + `<input>` forms with inline error divs. Convert each to react-hook-form + zod + shadcn Input/Button + sonner. They don't currently import from `@/components/ui`, so no Legacy aliases are involved.

- [ ] **Step 1: Migrate `LoginForm.tsx`**

Replace the entire body of the component (the `useState` calls + JSX) — keep the imports at top and the SSR `<head>`/wrapper unchanged. New body:
```tsx
const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
})
type Values = z.infer<typeof schema>

const router = useRouter()
const form = useForm<Values>({
  resolver: zodResolver(schema),
  defaultValues: { email: "", password: "" },
})

async function onSubmit(values: Values) {
  const result = await signIn("credentials", {
    email: values.email,
    password: values.password,
    redirect: false,
  })
  if (result?.error) {
    toast.error("Invalid email or password")
    return
  }
  router.push("/dashboard")
}

return (
  <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center p-4 font-[family-name:var(--font-inter)]">
    <div className="w-full max-w-md">
      <Link href={isWhiteLabel ? "/dashboard" : "/"} className="flex items-center justify-center gap-2 mb-8">
        <PlatformLogo platformName={platformName} orgLogoUrl={orgLogoUrl} />
      </Link>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-center">Sign In</CardTitle>
          <CardDescription className="text-center">Sign in to manage your games</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input type="email" placeholder="you@company.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                {form.formState.isSubmitting ? "Signing in…" : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      {!hideRegister && (
        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline font-medium">
            Create one free
          </Link>
        </p>
      )}
    </div>
  </div>
)
```
Update the imports at top:
```tsx
"use client";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import PlatformLogo from "@/components/PlatformLogo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
```

- [ ] **Step 2: Migrate `RegisterForm.tsx`**

Same pattern as LoginForm. Schema:
```tsx
const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Min. 8 characters"),
})
```
The `onSubmit` body keeps the existing fetch logic; replace `setError(…)` with `toast.error(…)`. Use `<Card>` + `<CardHeader>` + `<CardContent>` like LoginForm. The first/last name pair sits in a `<div className="grid grid-cols-2 gap-4">` containing two `<FormField>`s.

- [ ] **Step 3: Migrate `InviteForm.tsx`**

Schema:
```tsx
const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string().min(8, "Min. 8 characters"),
  confirmPassword: z.string().min(8, "Min. 8 characters"),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})
```
The read-only email field is **not** a form field — render it outside `<Form>`:
```tsx
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" value={email} readOnly disabled />
</div>
```
Default values come from props: `defaultValues: { firstName: initialFirstName, lastName: initialLastName, password: "", confirmPassword: "" }`.

- [ ] **Step 4: Verify build + lint**

```bash
cd /home/mindaugas/projects/brain-games/app
yarn lint && yarn build
```
Expected: both succeed.

- [ ] **Step 5: Smoke test all three**

```bash
./dev.sh dev
```
Visit each route:
- http://localhost:3013/login — submit empty form (zod errors), submit wrong creds (toast error), submit valid creds (redirect to dashboard).
- http://localhost:3013/register — submit invalid email (zod error), short password (zod error), valid form (redirects to dashboard).
- Generate an invite link from `/dashboard/team`, then visit that link — verify the form pre-fills firstName/lastName, password mismatch shows on confirmField, valid setup redirects to dashboard.

Stop dev.

- [ ] **Step 6: Commit**

```bash
git add src/app/login/LoginForm.tsx src/app/register/RegisterForm.tsx src/app/invite/\[token\]/InviteForm.tsx
git commit -m "refactor(auth): migrate Login/Register/Invite forms to shadcn + react-hook-form + zod + sonner"
```

---

# PHASE 3 — Delete legacy and remove the .btn import

**Goal:** No more dual systems. The `*Legacy.tsx` files are dead code; the `.btn`/`.modal`/`.input` classes are no longer referenced from the app; the `index.ts` barrel is gone.

### Task 3.1: Confirm zero remaining legacy imports

**Files:**
- Read-only audit

- [ ] **Step 1: Search for any remaining legacy imports**

```bash
cd /home/mindaugas/projects/brain-games
```
Then run these searches and verify each returns **zero matches**:
```bash
grep -r 'from "@/components/ui"' app/src
grep -r 'from "./Button"' app/src
grep -rE 'from "(\.|@/components/ui)/(Button|Input|Select|Badge|Modal|Panel)Legacy"' app/src
grep -r 'from "@/components/ui/Modal"' app/src
grep -r 'from "@/components/ui/Panel"' app/src
```
If any return matches, that importer was missed in Phase 2 — go back and migrate it before continuing.

- [ ] **Step 2: Search for raw legacy class names in `.tsx` files**

```bash
grep -rE 'className="[^"]*\b(btn|btn-primary|btn-secondary|btn-outline|btn-danger|btn-ghost|btn--sm|btn--md|modal-panel|modal-backdrop|modal-header|modal-title|modal-close|modal-body|field|field-label|input)\b[^"]*"' app/src
```
Expected: zero matches in `app/src` (the `Button`/`Input`/etc. you'll see at this point are the shadcn lowercase ones, which use Tailwind utilities, not these class names). Matches inside `node_modules/`, `app/src/components/ui/*Legacy.tsx`, or `shared/styles/components.css` are fine and ignored — they're going away in 3.2.

If `app/src` matches show up outside `*Legacy.tsx`, fix them before proceeding (they're a hidden importer of the legacy CSS).

---

### Task 3.2: Delete legacy component files and the old barrel

**Files:**
- Delete: `app/src/components/ui/ButtonLegacy.tsx`
- Delete: `app/src/components/ui/InputLegacy.tsx`
- Delete: `app/src/components/ui/SelectLegacy.tsx`
- Delete: `app/src/components/ui/BadgeLegacy.tsx`
- Delete: `app/src/components/ui/Modal.tsx`
- Delete: `app/src/components/ui/Panel.tsx`
- Delete: `app/src/components/ui/index.ts`

- [ ] **Step 1: Update `FileUpload.tsx` to import the shadcn Button**

`app/src/components/ui/FileUpload.tsx` line 2 currently imports `./ButtonLegacy`. Change to:
```tsx
import { Button } from "./button"
```
Also update its usage in line ~50 — replace `<Button variant="outline" onClick={…}>{changeLabel}</Button>` (no change in API since variant="outline" is the same in shadcn).

- [ ] **Step 2: Delete the seven files**

```bash
cd /home/mindaugas/projects/brain-games/app
git rm src/components/ui/ButtonLegacy.tsx
git rm src/components/ui/InputLegacy.tsx
git rm src/components/ui/SelectLegacy.tsx
git rm src/components/ui/BadgeLegacy.tsx
git rm src/components/ui/Modal.tsx
git rm src/components/ui/Panel.tsx
git rm src/components/ui/index.ts
```

- [ ] **Step 3: Verify build still passes**

```bash
yarn lint && yarn build
```
Expected: both succeed. Common failure: an importer still referenced `@/components/ui` (the barrel) — fix the import path in that file to use the specific shadcn or kept-domain file.

- [ ] **Step 4: Verify the FileUploadField test still passes**

```bash
yarn test src/components/branding/fields/__tests__/FileUploadField.test.tsx
```
Expected: pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore(ui): delete legacy component files (ButtonLegacy/InputLegacy/SelectLegacy/BadgeLegacy/Modal/Panel) and ui barrel"
```

---

### Task 3.3: Stop importing the legacy `.btn`/`.modal`/`.input` stylesheet in the app

**Files:**
- Modify: `app/src/app/globals.css`

- [ ] **Step 1: Remove the `@import` line**

In `app/src/app/globals.css` line 2, delete:
```css
@import "../../../shared/styles/components.css";
```
Leave the `shared/tokens.css` import (line 1) alone — that file provides the design tokens consumed elsewhere. Leave the `shared/styles/components.css` file itself untouched on disk; the games package still imports it.

- [ ] **Step 2: Verify build**

```bash
cd /home/mindaugas/projects/brain-games/app
yarn build
```
Expected: success.

- [ ] **Step 3: Smoke-test the dashboard end-to-end**

```bash
./dev.sh dev
```
Click through every migrated area:
- /dashboard/branding — list, create, delete
- /dashboard/settings — save org settings, change password, toggle appearance
- /dashboard/team — invite, copy link, remove
- /dashboard/keys — generate token, copy snippet
- /dashboard/games/crosswords — list, create new crossword, edit, delete, embed
- /login + /register — both submit
- existing invite link — submit

Verify there are no broken-looking buttons (would indicate a missed `.btn` user). If you see a button rendered without styling, run `grep -rE 'className="[^"]*\bbtn\b[^"]*"' app/src` again — there's a hidden user.

Stop dev.

- [ ] **Step 4: Verify games package build still works (it uses the same shared CSS file)**

```bash
cd /home/mindaugas/projects/brain-games/games
yarn build:all
```
Expected: success — the games package imports `shared/styles/components.css` independently, so removing it from the app shouldn't affect them.

- [ ] **Step 5: Commit**

```bash
cd /home/mindaugas/projects/brain-games
git add app/src/app/globals.css
git commit -m "chore(ui): drop shared/styles/components.css import from app globals (games package keeps it)"
```

---

### Task 3.4: Final verification

**Files:**
- Read-only

- [ ] **Step 1: Run the full app verification suite**

```bash
cd /home/mindaugas/projects/brain-games/app
yarn lint && yarn build && yarn test
```
Expected: all three pass.

- [ ] **Step 2: Run the games build**

```bash
cd /home/mindaugas/projects/brain-games/games
yarn build:all
```
Expected: success.

- [ ] **Step 3: Confirm the new file tree**

```bash
ls /home/mindaugas/projects/brain-games/app/src/components/ui/
```
Expected output (alphabetical):
```
alert.tsx
avatar.tsx
badge.tsx
button.tsx
card.tsx
checkbox.tsx
CodeBlock.tsx
command.tsx
dialog.tsx
dropdown-menu.tsx
FileUpload.tsx
form.tsx
input.tsx
label.tsx
ListItem.tsx
PageHeader.tsx
popover.tsx
select.tsx
separator.tsx
sheet.tsx
skeleton.tsx
slider.tsx
sonner.tsx
switch.tsx
table.tsx
tabs.tsx
textarea.tsx
tooltip.tsx
```
Four PascalCase domain primitives kept (`CodeBlock`, `FileUpload`, `ListItem`, `PageHeader`); everything else is stock shadcn lowercase.

- [ ] **Step 4: Tag the migration completion**

```bash
git tag shadcn-migration-complete
```

The plan is done. The user can now re-skin via CSS variables (`--primary`, `--card`, `--popover`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring` — already wired) without touching component source. To extend with new shadcn components later, run `npx shadcn@latest add <component>`.

---

## Self-Review Checklist (already verified by plan author)

- ✅ Phase 0 covers all four collision-prone PascalCase files. Modal/Panel/ListItem/PageHeader/FileUpload/CodeBlock don't collide and stay PascalCase until deleted (or kept) at the right time.
- ✅ Phase 1 installs every shadcn component scope-B requires plus all peer libraries (`react-hook-form`, `zod`, `@hookform/resolvers`, `sonner`, `cmdk`, `@tanstack/react-table`, `next-themes` if needed). Sonner toaster is mounted in `Providers`. Badge variants are extended to cover legacy status colors.
- ✅ Phase 2 has one task per logical area with explicit before/after code, lucide icon mappings, and `__none__` sentinel for empty Select values. Forms (Login/Register/Invite/Password/TeamInvite) are migrated to react-hook-form + zod. State-driven flows (Settings, Branding, Game-Modal) keep `useState` but adopt sonner.
- ✅ Phase 3 has an audit gate (3.1) before any deletions, deletes the legacy files, removes the legacy CSS import, runs full verification, and confirms the games package still builds.
- ✅ No "TBD"/placeholder text. Every step shows the code or the exact command to run.
- ✅ Type/method names are consistent: `Card/CardContent/CardHeader/CardTitle/CardAction`, `Dialog/DialogContent/DialogHeader/DialogTitle`, `Form/FormField/FormItem/FormLabel/FormControl/FormMessage`, `Select/SelectTrigger/SelectValue/SelectContent/SelectItem` — these are the shadcn-2025 canonical exports and used identically across all tasks.
- ✅ Spec coverage: every importer the prior research surfaced (BrandingContent, SettingsContent, TeamContent, KeysContent, GameSection/Modal/ListClient, LoginForm, RegisterForm, InviteForm) has a Phase 2 task. The single raw-`.btn` user (BrandingContent.tsx:222) is explicitly addressed in Task 2.1 Step 6.
