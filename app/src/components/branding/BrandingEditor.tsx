"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, ChevronRight, Rocket, Undo2, AlertTriangle, Save } from "lucide-react"
import { toast } from "sonner"
import BrandingPreviewPane from "./BrandingPreviewPane"
import IdentitySection from "./sections/IdentitySection"
import ThemeSection from "./sections/ThemeSection"
import TypographySection from "./sections/TypographySection"
import SpacingSection from "./sections/SpacingSection"
import ComponentsSection from "./sections/ComponentsSection"
import GameColorsSection from "./sections/GameColorsSection"
import ImagerySection from "./sections/ImagerySection"
import CustomCssSection from "./sections/CustomCssSection"
import type {
  BrandingTokens, BrandingTypography, BrandingSpacing, BrandingComponents,
} from "@/lib/branding/tokens"
import {
  PLATFORM_DEFAULT_TOKENS as DEFAULT_TOKENS,
  PLATFORM_DEFAULT_TYPOGRAPHY as DEFAULT_TYPOGRAPHY,
  PLATFORM_DEFAULT_SPACING as DEFAULT_SPACING,
  PLATFORM_DEFAULT_COMPONENTS as DEFAULT_COMPONENTS,
} from "@/lib/branding/defaults"
import { hasPendingSave } from "@/lib/branding/unload-guard"
import type { PreviewGameType } from "@/lib/branding/platform-defaults"

export interface DraftState {
  tokens: BrandingTokens
  typography: BrandingTypography
  spacing: BrandingSpacing
  components: BrandingComponents
  logoPath: string | null
  logoDarkPath: string | null
  faviconPath: string | null
  backgroundPath: string | null
  ogImagePath: string | null
  customCssGames: string | null
}

type Props = {
  brandingId: string
  live: {
    id: string
    name: string
    tokens: unknown
    typography: unknown
    spacing: unknown
    components: unknown
    logoPath: string | null
    logoDarkPath: string | null
    faviconPath: string | null
    backgroundPath: string | null
    ogImagePath: string | null
    customCssGames: string | null
    updatedAt: string
  }
  initialDraft: {
    updatedAt: string
    tokens: unknown
    typography: unknown
    spacing: unknown
    components: unknown
    logoPath: string | null
    logoDarkPath: string | null
    faviconPath: string | null
    backgroundPath: string | null
    ogImagePath: string | null
    customCssGames: string | null
  } | null
  availableGameTypes: PreviewGameType[]
  defaultGameType: PreviewGameType | null
}

type SaveState = "idle" | "saving" | "just-saved" | "just-published" | "just-discarded"

const AUTOSAVE_DEBOUNCE_MS = 800
const JUST_SAVED_DISPLAY_MS = 1500

const liveToDraft = (src: {
  tokens: unknown
  typography: unknown
  spacing: unknown
  components: unknown
  logoPath: string | null
  logoDarkPath: string | null
  faviconPath: string | null
  backgroundPath: string | null
  ogImagePath: string | null
  customCssGames: string | null
}): DraftState => ({
  tokens: (src.tokens as BrandingTokens | null) ?? DEFAULT_TOKENS,
  typography: (src.typography as BrandingTypography | null) ?? DEFAULT_TYPOGRAPHY,
  spacing: (src.spacing as BrandingSpacing | null) ?? DEFAULT_SPACING,
  components: (src.components as BrandingComponents | null) ?? DEFAULT_COMPONENTS,
  logoPath: src.logoPath,
  logoDarkPath: src.logoDarkPath,
  faviconPath: src.faviconPath,
  backgroundPath: src.backgroundPath,
  ogImagePath: src.ogImagePath,
  customCssGames: src.customCssGames,
})

export default function BrandingEditor({
  brandingId, live, initialDraft, availableGameTypes, defaultGameType,
}: Props) {
  const startState: DraftState = useMemo(() => liveToDraft(initialDraft ?? live), [initialDraft, live])

  const [draft, setDraft] = useState<DraftState>(startState)
  const [hoveredToken, setHoveredToken] = useState<string | null>(null)
  const [hasDraft, setHasDraft] = useState<boolean>(!!initialDraft)
  const [saveState, setSaveState] = useState<SaveState>("idle")
  const [draftUpdatedAt, setDraftUpdatedAt] = useState<string | null>(initialDraft?.updatedAt ?? null)
  const [inspectorTab, setInspectorTab] = useState<"design" | "identity" | "components">("design")
  const [conflicted, setConflicted] = useState(false)
  const [publishing, setPublishing] = useState(false)
  // Refs — declared up front so every effect/handler can reference them
  // without temporal-dead-zone or "Cannot access variable before declared"
  // errors.
  const saveTimer = useRef<NodeJS.Timeout | null>(null)
  const justSavedTimer = useRef<NodeJS.Timeout | null>(null)
  const isInitialMount = useRef(true)
  const dirtyRef = useRef(false)
  const savingRef = useRef(false)
  const draftRef = useRef(draft)
  const draftUpdatedAtRef = useRef(draftUpdatedAt)
  const discardingRef = useRef(false)

  async function saveDraft() {
    setSaveState("saving")
    let res: Response
    try {
      res = await fetch(`/api/branding/${brandingId}/draft`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...draft, expectedUpdatedAt: draftUpdatedAt }),
      })
    } catch {
      setSaveState("idle")
      return
    }
    if (res.status === 409) {
      setConflicted(true)
      setSaveState("idle")
      return
    }
    if (!res.ok) {
      setSaveState("idle")
      return
    }
    const body = (await res.json()) as { draft: { updatedAt: string } | null }
    if (body.draft) setDraftUpdatedAt(body.draft.updatedAt)
    setHasDraft(true)
    dirtyRef.current = false
    setSaveState("just-saved")
    if (justSavedTimer.current) clearTimeout(justSavedTimer.current)
    justSavedTimer.current = setTimeout(() => setSaveState("idle"), JUST_SAVED_DISPLAY_MS)
  }

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    if (conflicted) return
    if (discardingRef.current) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      void saveDraft()
    }, AUTOSAVE_DEBOUNCE_MS)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
    // saveDraft is intentionally omitted: it closes over draft/draftUpdatedAt
    // and re-creating it every render would defeat the debounce. The ref
    // chain (draftRef/draftUpdatedAtRef) is what actually keeps the request
    // body fresh during the keepalive flush in the unload handler.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft])

  useEffect(() => {
    return () => {
      if (justSavedTimer.current) clearTimeout(justSavedTimer.current)
    }
  }, [])

  useEffect(() => {
    draftRef.current = draft
  }, [draft])

  useEffect(() => {
    draftUpdatedAtRef.current = draftUpdatedAt
  }, [draftUpdatedAt])

  useEffect(() => {
    savingRef.current = saveState === "saving"
  }, [saveState])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasPendingSave({ dirty: dirtyRef.current, saving: savingRef.current })) return
      e.preventDefault()
      // Some browsers still require returnValue to be set.
      e.returnValue = ""
    }

    const handlePageHide = () => {
      if (!hasPendingSave({ dirty: dirtyRef.current, saving: savingRef.current })) return
      // Best-effort flush; keepalive lets the request complete after page unload.
      try {
        const body = JSON.stringify({
          ...draftRef.current,
          expectedUpdatedAt: draftUpdatedAtRef.current,
        })
        fetch(`/api/branding/${brandingId}/draft`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body,
          keepalive: true,
        })
      } catch {
        // No-op: page is unloading anyway.
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    window.addEventListener("pagehide", handlePageHide)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      window.removeEventListener("pagehide", handlePageHide)
    }
  }, [brandingId])

  async function publish() {
    if (publishing) return
    setPublishing(true)
    try {
      const res = await fetch(`/api/branding/${brandingId}/publish`, { method: "POST" })
      if (!res.ok) {
        toast.error("Failed to publish. Please try again.")
        return
      }
      // Server returned the new live snapshot timestamp; mirror locally so the
      // header indicator flips from "Unpublished draft" to "Live" immediately.
      setHasDraft(false)
      setDraftUpdatedAt(null)
      dirtyRef.current = false
      setSaveState("just-published")
      if (justSavedTimer.current) clearTimeout(justSavedTimer.current)
      justSavedTimer.current = setTimeout(() => setSaveState("idle"), JUST_SAVED_DISPLAY_MS)
    } finally {
      setPublishing(false)
    }
  }

  async function discard() {
    if (!hasDraft) return
    // TODO(branding): replace native confirm with shadcn AlertDialog in a future round.
    const ok = window.confirm("Discard unpublished changes? This cannot be undone.")
    if (!ok) return
    const res = await fetch(`/api/branding/${brandingId}/draft`, { method: "DELETE" })
    if (!res.ok) {
      toast.error("Failed to discard draft. Please try again.")
      return
    }
    // Reset draft state to whatever is currently live. The discardingRef is set
    // synchronously so the autosave effect (triggered by the setDraft below) sees
    // it and skips; the setTimeout(0) clears it after that effect run completes,
    // so any subsequent user edits during the "Discarded" toast window still
    // autosave normally.
    discardingRef.current = true
    setDraft(liveToDraft(live))
    setHasDraft(false)
    setDraftUpdatedAt(null)
    dirtyRef.current = false
    setSaveState("just-discarded")
    if (justSavedTimer.current) clearTimeout(justSavedTimer.current)
    justSavedTimer.current = setTimeout(() => setSaveState("idle"), JUST_SAVED_DISPLAY_MS)
    setTimeout(() => { discardingRef.current = false }, 0)
  }

  const update = <K extends keyof DraftState>(key: K, val: DraftState[K]) => {
    dirtyRef.current = true
    setDraft((d) => ({ ...d, [key]: val }))
  }

  const publishDisabled = !hasDraft || saveState === "saving" || publishing || conflicted
  const editorLocked = conflicted || publishing

  const statusBadge = (() => {
    if (saveState === "saving") return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[11.5px] font-medium text-muted-foreground">
        Saving…
      </span>
    )
    if (saveState === "just-saved") return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[11.5px] font-medium text-green-700">
        <CheckCircle2 className="size-3.5" />
        Saved
      </span>
    )
    if (saveState === "just-published") return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[11.5px] font-medium text-green-700">
        <Rocket className="size-3.5" />
        Published
      </span>
    )
    if (saveState === "just-discarded") return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[11.5px] font-medium text-muted-foreground">
        <Undo2 className="size-3.5" />
        Discarded
      </span>
    )
    if (hasDraft) return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[11.5px] font-medium text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        Unpublished draft
      </span>
    )
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[11.5px] font-medium text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        Live
      </span>
    )
  })()

  return (
    <div className="flex flex-col h-screen" style={{ "--primary": "#c2410c", "--ring": "#c2410c" } as React.CSSProperties}>
      <header className="flex h-[52px] shrink-0 items-center gap-4 border-b border-border bg-card px-5">
        <Link
          href="/dashboard/branding"
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ChevronRight className="size-3.5 rotate-180" />
          Back
        </Link>
        <div className="flex items-center gap-2 text-[13.5px]">
          <span className="text-muted-foreground">{live.name}</span>
          <span className="text-muted-foreground/50">/</span>
          <strong className="font-semibold">Branding</strong>
          {statusBadge}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={discard}
            disabled={!hasDraft || editorLocked}
          >
            Discard
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void saveDraft()}
            disabled={!dirtyRef.current || editorLocked}
          >
            Save
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={publish}
            disabled={publishDisabled}
            className="bg-[var(--primary)] text-white hover:bg-[#a8390a]"
          >
            {publishing ? "Publishing…" : "Publish"}
          </Button>
        </div>
      </header>

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

      <div className="flex flex-1 overflow-hidden">
        <aside
          className="flex w-[min(30%,480px)] min-w-[320px] flex-col border-r border-border bg-card"
          style={{ pointerEvents: editorLocked ? "none" : undefined, opacity: editorLocked ? 0.5 : 1 }}
        >
          {/* Inspector tabs */}
          <div className="flex shrink-0 gap-0.5 border-b border-border px-2">
            {([
              { id: "design" as const, label: "Design", count: "14" },
              { id: "identity" as const, label: "Identity", count: null },
              { id: "components" as const, label: "Components", count: null },
            ]).map(({ id, label, count }) => (
              <button
                key={id}
                type="button"
                onClick={() => setInspectorTab(id)}
                className={`relative -mb-px flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-[12.5px] font-medium transition-colors ${
                  inspectorTab === id
                    ? "border-[var(--primary)] text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
                {count && (
                  <span className="rounded bg-muted px-1.5 py-px font-mono text-[10.5px] text-muted-foreground">
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Inspector body */}
          <div className="flex-1 overflow-y-auto pb-6">
            {inspectorTab === "design" && (
              <>
                <ThemeSection draft={draft} update={update} onTokenHover={setHoveredToken} />
                <TypographySection draft={draft} update={update} />
                <SpacingSection draft={draft} update={update} />
                <GameColorsSection draft={draft} update={update} onTokenHover={setHoveredToken} />
              </>
            )}
            {inspectorTab === "identity" && (
              <>
                <IdentitySection draft={draft} update={update} />
                <ImagerySection draft={draft} update={update} />
                <CustomCssSection draft={draft} update={update} />
              </>
            )}
            {inspectorTab === "components" && (
              <ComponentsSection draft={draft} update={update} />
            )}
          </div>
        </aside>
        <section className="flex-1 overflow-hidden">
          <BrandingPreviewPane
            draft={draft}
            hoveredToken={hoveredToken}
            availableGameTypes={availableGameTypes}
            defaultGameType={defaultGameType}
          />
        </section>
      </div>
    </div>
  )
}
