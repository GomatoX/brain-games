"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import BrandingPreviewPane from "./BrandingPreviewPane"
import IdentitySection from "./sections/IdentitySection"
import ThemeSection from "./sections/ThemeSection"
import TypographySection from "./sections/TypographySection"
import SpacingSection from "./sections/SpacingSection"
import ComponentsSection from "./sections/ComponentsSection"
import ImagerySection from "./sections/ImagerySection"
import CustomCssSection from "./sections/CustomCssSection"
import AdvancedSection from "./sections/AdvancedSection"
import type {
  BrandingTokens, BrandingTypography, BrandingSpacing, BrandingComponents,
} from "@/lib/branding/tokens"

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
}

type SaveState = "idle" | "saving" | "just-saved"

const DEFAULT_TOKENS: BrandingTokens = {
  primary: "#c25e40",
  surface: "#ffffff",
  text: "#0f172a",
  overrides: {},
}
const DEFAULT_TYPOGRAPHY: BrandingTypography = {
  fontSans: null,
  fontSerif: null,
  scale: "default",
}
const DEFAULT_SPACING: BrandingSpacing = { density: "cozy", radius: 8 }
const DEFAULT_COMPONENTS: BrandingComponents = {
  button: { variant: "solid", shadow: "subtle" },
  input: { variant: "outlined" },
  card: { elevation: "subtle" },
}

const AUTOSAVE_DEBOUNCE_MS = 800
const JUST_SAVED_DISPLAY_MS = 1500

export default function BrandingEditor({ brandingId, live, initialDraft }: Props) {
  const startState: DraftState = useMemo(() => {
    const src = initialDraft ?? live
    return {
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
    }
  }, [initialDraft, live])

  const [draft, setDraft] = useState<DraftState>(startState)
  const [hoveredToken, setHoveredToken] = useState<string | null>(null)
  const [hasDraft, setHasDraft] = useState<boolean>(!!initialDraft)
  const [saveState, setSaveState] = useState<SaveState>("idle")
  const [draftUpdatedAt, setDraftUpdatedAt] = useState<string | null>(initialDraft?.updatedAt ?? null)
  const [conflicted, setConflicted] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const saveTimer = useRef<NodeJS.Timeout | null>(null)
  const justSavedTimer = useRef<NodeJS.Timeout | null>(null)
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    if (conflicted) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      void saveDraft()
    }, AUTOSAVE_DEBOUNCE_MS)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft])

  useEffect(() => {
    return () => {
      if (justSavedTimer.current) clearTimeout(justSavedTimer.current)
    }
  }, [])

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
    setSaveState("just-saved")
    if (justSavedTimer.current) clearTimeout(justSavedTimer.current)
    justSavedTimer.current = setTimeout(() => setSaveState("idle"), JUST_SAVED_DISPLAY_MS)
  }

  async function publish() {
    if (publishing) return
    setPublishing(true)
    try {
      const res = await fetch(`/api/branding/${brandingId}/publish`, { method: "POST" })
      if (!res.ok) {
        window.alert("Failed to publish. Please try again.")
        return
      }
      window.location.reload()
    } finally {
      setPublishing(false)
    }
  }

  async function discard() {
    if (!hasDraft) return
    const ok = window.confirm("Discard unpublished changes? This cannot be undone.")
    if (!ok) return
    const res = await fetch(`/api/branding/${brandingId}/draft`, { method: "DELETE" })
    if (res.ok) {
      window.location.reload()
    } else {
      window.alert("Failed to discard draft. Please try again.")
    }
  }

  const update = <K extends keyof DraftState>(key: K, val: DraftState[K]) =>
    setDraft((d) => ({ ...d, [key]: val }))

  const publishDisabled = !hasDraft || saveState === "saving" || publishing || conflicted
  const editorLocked = conflicted || publishing

  return (
    <div className="flex flex-col h-screen" style={{ background: "var(--surface)" }}>
      <header className="flex items-center gap-4 px-6 py-3 border-b" style={{ borderColor: "var(--border)" }}>
        <Link href="/dashboard/branding" className="text-sm">← Back</Link>
        <span className="font-semibold">{live.name}</span>
        <span className="ml-4 text-sm">
          {saveState === "saving" && "Saving…"}
          {saveState === "just-saved" && (
            <span className="inline-flex items-center gap-1 text-green-600">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              Saved
            </span>
          )}
          {saveState === "idle" && hasDraft && (
            <span className="inline-flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-500" /> Unpublished draft
            </span>
          )}
          {saveState === "idle" && !hasDraft && (
            <span className="inline-flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
              <span className="inline-block w-2 h-2 rounded-full bg-green-500" /> Live
            </span>
          )}
        </span>
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
      </header>

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

      <div className="flex flex-1 overflow-hidden">
        <aside
          className="w-[480px] overflow-y-auto p-6 border-r"
          style={{ borderColor: "var(--border)", pointerEvents: editorLocked ? "none" : undefined, opacity: editorLocked ? 0.5 : 1 }}
        >
          {/* Section order is canonically defined in @/lib/branding/section-order.ts */}
          <ThemeSection draft={draft} update={update} />
          <IdentitySection draft={draft} update={update} />
          <TypographySection draft={draft} update={update} />
          <SpacingSection draft={draft} update={update} />
          <ComponentsSection draft={draft} update={update} />
          <ImagerySection draft={draft} update={update} />
          <CustomCssSection draft={draft} update={update} />
          <AdvancedSection draft={draft} update={update} onTokenHover={setHoveredToken} />
        </aside>
        <section className="flex-1 overflow-y-auto">
          <BrandingPreviewPane draft={draft} hoveredToken={hoveredToken} />
        </section>
      </div>
    </div>
  )
}
