"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/PageHeader"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Trash2, Pencil, Palette, Blocks } from "lucide-react"
import { toast } from "sonner"
import { PRESETS } from "@/lib/branding/presets"
import { formatRelativeTime } from "@/lib/branding/relative-time"
import { formatUsageLabel } from "@/lib/branding/usage-format"
import type { BrandingTokens, BrandingTypography } from "@/lib/branding/tokens"

const FALLBACK_PRIMARY = "#c2410c"
const FALLBACK_SURFACE = "#ffffff"
const FALLBACK_TEXT = "#1a1814"

export interface BrandingListItem {
  id: string
  name: string
  tokens: BrandingTokens | null
  typography: BrandingTypography | null
  logoPath: string | null
  updatedAt: string
  hasDraft: boolean
  lastEditedAt: string
  usageCount: number
}

const Swatch = ({ color, label }: { color: string; label: string }) => (
  <div
    className="flex items-center gap-1.5 bg-muted rounded-md px-2 py-1"
    title={label}
  >
    <div
      className="w-3.5 h-3.5 rounded-[3px] border border-border"
      style={{ background: color }}
    />
    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
      {label}
    </span>
  </div>
)

export default function BrandingContent({
  initialPresets,
}: {
  initialPresets: BrandingListItem[]
}) {
  const router = useRouter()
  const [presets, setPresets] = useState<BrandingListItem[]>(initialPresets)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createName, setCreateName] = useState("")
  const [createPresetId, setCreatePresetId] = useState(PRESETS[0]?.id ?? "")
  const [creating, setCreating] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<BrandingListItem | null>(null)

  const handleOpenCreate = () => {
    setCreateName("")
    setCreatePresetId(PRESETS[0]?.id ?? "")
    setShowCreateModal(true)
  }

  const handleCloseCreate = () => {
    if (creating) return
    setShowCreateModal(false)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (creating) return
    const name = createName.trim()
    if (!name) {
      toast.error("Name is required")
      return
    }
    setCreating(true)
    try {
      const res = await fetch("/api/branding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, presetId: createPresetId }),
      })
      if (!res.ok) {
        toast.error("Failed to create brand")
        setCreating(false)
        return
      }
      const data = (await res.json()) as { id: string; name: string }
      router.push(`/dashboard/branding/${data.id}/edit`)
    } catch {
      toast.error("Failed to create brand")
      setCreating(false)
    }
  }

  const handleRequestDelete = (item: BrandingListItem) => {
    if (deletingId) return
    setDeleteTarget(item)
  }

  const handleCancelDelete = () => {
    if (deletingId) return
    setDeleteTarget(null)
  }

  const handleConfirmDelete = async () => {
    const target = deleteTarget
    if (!target || deletingId) return
    setDeletingId(target.id)
    try {
      const res = await fetch(`/api/branding/${encodeURIComponent(target.id)}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        toast.error(`Failed to delete "${target.name}". Please try again.`)
        return
      }
      setPresets((prev) => prev.filter((p) => p.id !== target.id))
      setDeleteTarget(null)
    } catch {
      toast.error(`Failed to delete "${target.name}". Please try again.`)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <PageHeader
        title="Branding"
        description="Create and manage reusable brand presets for your games."
        action={
          <Button onClick={handleOpenCreate}>
            <Plus className="size-4" />
            New brand
          </Button>
        }
      />

      {presets.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <Palette className="size-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-4">
            No brands yet. Create one to start customizing your games.
          </p>
          <Button onClick={handleOpenCreate}>Create first brand</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {presets.map((p) => {
            const primary = p.tokens?.primary ?? FALLBACK_PRIMARY
            const surface = p.tokens?.surface ?? FALLBACK_SURFACE
            const text = p.tokens?.text ?? FALLBACK_TEXT
            const fontSansLabel = p.typography?.fontSans
              ? p.typography.fontSans.split(",")[0].trim()
              : null

            return (
              <div
                key={p.id}
                className="bg-card border border-border rounded-lg shadow-sharp overflow-hidden flex flex-col"
              >
                <div className="flex h-3">
                  <div className="flex-1" style={{ background: primary }} />
                  <div className="flex-1" style={{ background: surface }} />
                  <div className="flex-1" style={{ background: text }} />
                </div>

                <div className="p-4 flex flex-col gap-3 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground truncate min-w-0">
                      {p.name || "Untitled"}
                    </h3>
                    {p.hasDraft ? (
                      <span
                        className="shrink-0 inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-md"
                        title="Has unpublished changes"
                      >
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Draft
                      </span>
                    ) : (
                      <span
                        className="shrink-0 inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide bg-green-50 text-green-700 px-1.5 py-0.5 rounded-md"
                        title="All changes are published"
                      >
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
                        Live
                      </span>
                    )}
                  </div>

                  {/* suppressHydrationWarning: formatRelativeTime() reads
                      Date.now() on the client; the server snapshot is built
                      at request time. The two strings ("5m ago" vs "6m ago")
                      can disagree when the page is hydrated more than 60s
                      after SSR — that's correct, not a hydration bug. */}
                  <div className="text-xs text-muted-foreground" suppressHydrationWarning>
                    Edited {formatRelativeTime(p.lastEditedAt)}
                  </div>

                  <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
                    <Blocks className="size-4" />
                    {formatUsageLabel(p.usageCount)}
                  </div>

                  <div className="flex items-center gap-2">
                    <Swatch color={primary} label="Primary" />
                    <Swatch color={surface} label="Surface" />
                    <Swatch color={text} label="Text" />
                  </div>

                  {fontSansLabel && (
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">Font: </span>
                      {fontSansLabel}
                    </div>
                  )}

                  <div className="mt-auto pt-2 flex items-center gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dashboard/branding/${p.id}/edit`}>
                        <Pencil className="size-4" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={deletingId === p.id}
                      onClick={() => handleRequestDelete(p)}
                    >
                      <Trash2 className="size-4" />
                      {deletingId === p.id ? "Deleting…" : "Delete"}
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Dialog
        open={showCreateModal}
        onOpenChange={(open) => {
          if (!open && !creating) handleCloseCreate()
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Palette className="size-5" />
              New brand
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="brand-name">Name</FieldLabel>
              <Input
                id="brand-name"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="e.g. Default, Dark theme, LRT"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="brand-preset">Starter preset</FieldLabel>
              <Select value={createPresetId} onValueChange={setCreatePresetId}>
                <SelectTrigger id="brand-preset">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRESETS.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-2">
              <Button type="button" variant="outline" onClick={handleCloseCreate}>
                Cancel
              </Button>
              <Button type="submit" disabled={creating}>
                {creating ? "Creating…" : "Create brand"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteTarget != null}
        onOpenChange={(open) => {
          if (!open && !deletingId) handleCancelDelete()
        }}
      >
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
                <p className="text-sm bg-amber-50 text-amber-800 px-3 py-2 rounded-[6px]">
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
                <Button
                  variant="outline"
                  onClick={handleCancelDelete}
                  disabled={deletingId === deleteTarget.id}
                >
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
    </div>
  )
}
