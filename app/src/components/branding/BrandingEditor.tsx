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

const STATUS_SAVED = "saved" as const
const STATUS_SAVING = "saving" as const
const STATUS_DRAFT = "draft" as const
type Status = typeof STATUS_SAVED | typeof STATUS_SAVING | typeof STATUS_DRAFT

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
  const [status, setStatus] = useState<Status>(initialDraft ? STATUS_DRAFT : STATUS_SAVED)
  const [draftUpdatedAt, setDraftUpdatedAt] = useState<string | null>(initialDraft?.updatedAt ?? null)
  const saveTimer = useRef<NodeJS.Timeout | null>(null)
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      void saveDraft()
    }, 800)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft])

  async function saveDraft() {
    setStatus(STATUS_SAVING)
    const res = await fetch(`/api/branding/${brandingId}/draft`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...draft, expectedUpdatedAt: draftUpdatedAt }),
    })
    if (res.status === 409) {
      const body = (await res.json()) as { currentUpdatedAt: string }
      setDraftUpdatedAt(body.currentUpdatedAt)
      setStatus(STATUS_DRAFT)
      window.alert("Another tab updated this brand. Reload to see the latest draft.")
      return
    }
    if (!res.ok) {
      setStatus(STATUS_DRAFT)
      return
    }
    const body = (await res.json()) as { draft: { updatedAt: string } | null }
    if (body.draft) setDraftUpdatedAt(body.draft.updatedAt)
    setStatus(STATUS_DRAFT)
  }

  async function publish() {
    const res = await fetch(`/api/branding/${brandingId}/publish`, { method: "POST" })
    if (res.ok) {
      setStatus(STATUS_SAVED)
      setDraftUpdatedAt(null)
      window.location.reload()
    }
  }

  async function discard() {
    await fetch(`/api/branding/${brandingId}/draft`, { method: "DELETE" })
    window.location.reload()
  }

  const update = <K extends keyof DraftState>(key: K, val: DraftState[K]) =>
    setDraft((d) => ({ ...d, [key]: val }))

  return (
    <div className="flex flex-col h-screen" style={{ background: "var(--surface)" }}>
      <header className="flex items-center gap-4 px-6 py-3 border-b" style={{ borderColor: "var(--border)" }}>
        <Link href="/dashboard/branding" className="text-sm">← Back</Link>
        <span className="font-semibold">{live.name}</span>
        <span className="ml-4 text-sm">
          {status === STATUS_SAVING && "Saving…"}
          {status === STATUS_SAVED && "Saved"}
          {status === STATUS_DRAFT && (
            <span className="inline-flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-500" /> Draft
            </span>
          )}
        </span>
        <div className="ml-auto flex gap-2">
          <button onClick={discard} className="px-3 py-1 border rounded">Discard</button>
          <button
            onClick={publish}
            className="px-3 py-1 rounded text-white"
            style={{ background: "var(--primary)" }}
            disabled={status !== STATUS_DRAFT}
          >
            Publish
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-[480px] overflow-y-auto p-6 border-r" style={{ borderColor: "var(--border)" }}>
          <IdentitySection draft={draft} update={update} />
          <ThemeSection draft={draft} update={update} />
          <TypographySection draft={draft} update={update} />
          <SpacingSection draft={draft} update={update} />
          <ComponentsSection draft={draft} update={update} />
          <ImagerySection draft={draft} update={update} />
          <CustomCssSection draft={draft} update={update} />
          <AdvancedSection draft={draft} update={update} />
        </aside>
        <section className="flex-1 overflow-y-auto">
          <BrandingPreviewPane draft={draft} />
        </section>
      </div>
    </div>
  )
}
