"use client"
import { ChevronRight } from "lucide-react"
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
    <details className="bp-section">
      <summary className="bp-header">
        <ChevronRight className="bp-chevron" />
        <span>Custom CSS</span>
      </summary>
      <div className="bp-body">
        <p className="text-[11.5px] leading-relaxed text-muted-foreground">
          Extra styles applied inside game embeds for this brand only.
          Max {MAX_CSS_BYTES.toLocaleString()} bytes.
        </p>
        <Textarea
          aria-label="Custom CSS for games"
          className="font-mono text-xs"
          rows={10}
          value={value}
          onChange={(e) => update("customCssGames", e.target.value)}
        />
        <div className="text-[11px] text-muted-foreground">
          {value.length} / {MAX_CSS_BYTES} bytes
        </div>
      </div>
    </details>
  )
}
