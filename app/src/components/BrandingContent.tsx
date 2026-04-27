"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PageHeader, Panel, Modal, Button, Input, Select } from "@/components/ui"
import { PRESETS } from "@/lib/branding/presets"
import { formatRelativeTime } from "@/lib/branding/relative-time"
import { formatUsageLabel } from "@/lib/branding/usage"
import type { BrandingTokens, BrandingTypography } from "@/lib/branding/tokens"

const FALLBACK_PRIMARY = "#c25e40"
const FALLBACK_SURFACE = "#ffffff"
const FALLBACK_TEXT = "#0f172a"

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
  const [createError, setCreateError] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<BrandingListItem | null>(null)

  const handleOpenCreate = () => {
    setCreateName("")
    setCreatePresetId(PRESETS[0]?.id ?? "")
    setCreateError("")
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
      setCreateError("Name is required")
      return
    }
    setCreating(true)
    setCreateError("")
    try {
      const res = await fetch("/api/branding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, presetId: createPresetId }),
      })
      if (!res.ok) {
        setCreateError("Failed to create brand")
        setCreating(false)
        return
      }
      const data = (await res.json()) as { id: string; name: string }
      router.push(`/dashboard/branding/${data.id}/edit`)
    } catch {
      setCreateError("Failed to create brand")
      setCreating(false)
    }
  }

  const handleRequestDelete = (item: BrandingListItem) => {
    if (deletingId) return
    setDeleteError("")
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
    setDeleteError("")
    try {
      const res = await fetch(`/api/branding?id=${encodeURIComponent(target.id)}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        setDeleteError(`Failed to delete "${target.name}". Please try again.`)
        return
      }
      setPresets((prev) => prev.filter((p) => p.id !== target.id))
      setDeleteTarget(null)
    } catch {
      setDeleteError(`Failed to delete "${target.name}". Please try again.`)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6 lg:py-10 pb-24">
      <PageHeader
        title="Branding"
        description="Create and manage reusable brand presets for your games."
        action={
          <Button icon="add" onClick={handleOpenCreate}>
            New brand
          </Button>
        }
      />

      {presets.length === 0 ? (
        <Panel>
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-4xl text-[#cbd5e1] mb-3 block">
              palette
            </span>
            <p className="text-sm text-[#64748b] mb-4">
              No brands yet. Create one to start customizing your games.
            </p>
            <Button onClick={handleOpenCreate}>Create first brand</Button>
          </div>
        </Panel>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
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
                className="bg-white border border-[#e2e8f0] rounded-[4px] shadow-sharp overflow-hidden flex flex-col"
              >
                <div className="flex h-3">
                  <div className="flex-1" style={{ background: primary }} />
                  <div className="flex-1" style={{ background: surface }} />
                  <div className="flex-1" style={{ background: text }} />
                </div>

                <div className="p-4 flex flex-col gap-3 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-[#0f172a] truncate min-w-0">
                      {p.name || "Untitled"}
                    </h3>
                    {p.hasDraft ? (
                      <span
                        className="shrink-0 inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded-[3px]"
                        title="Has unpublished changes"
                      >
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-500" />
                        Draft
                      </span>
                    ) : (
                      <span
                        className="shrink-0 inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide bg-green-50 text-green-700 px-1.5 py-0.5 rounded-[3px]"
                        title="All changes are published"
                      >
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
                        Live
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-[#64748b]" suppressHydrationWarning>
                    Edited {formatRelativeTime(p.lastEditedAt)}
                  </div>

                  <div className="text-[11px] text-[#64748b] inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] leading-none">
                      extension
                    </span>
                    {formatUsageLabel(p.usageCount)}
                  </div>

                  <div className="flex items-center gap-2">
                    <Swatch color={primary} label="Primary" />
                    <Swatch color={surface} label="Surface" />
                    <Swatch color={text} label="Text" />
                  </div>

                  {fontSansLabel && (
                    <div className="text-[11px] text-[#64748b]">
                      <span className="font-medium text-[#0f172a]">Font: </span>
                      {fontSansLabel}
                    </div>
                  )}

                  <div className="mt-auto pt-2 flex items-center gap-2">
                    <Link
                      href={`/dashboard/branding/${p.id}/edit`}
                      className="btn btn-secondary btn--sm"
                    >
                      <span className="material-symbols-outlined text-sm">
                        edit
                      </span>
                      Edit
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      icon="delete"
                      disabled={deletingId === p.id}
                      onClick={() => handleRequestDelete(p)}
                    >
                      {deletingId === p.id ? "Deleting…" : "Delete"}
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal
        open={showCreateModal}
        onClose={creating ? () => {} : handleCloseCreate}
        title="New brand"
        icon="palette"
        size="md"
      >
        <form onSubmit={handleCreate} className="p-4 sm:p-6 flex flex-col gap-4">
          <Input
            id="brand-name"
            label="Name"
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
            placeholder="e.g. Default, Dark theme, LRT"
          />

          <Select
            id="brand-preset"
            label="Starter preset"
            value={createPresetId}
            onChange={(e) => setCreatePresetId(e.target.value)}
            options={PRESETS.map((p) => ({ value: p.id, label: p.name }))}
          />

          {createError && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-[4px]">
              {createError}
            </p>
          )}

          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-2">
            <Button variant="outline" onClick={handleCloseCreate}>
              Cancel
            </Button>
            <Button type="submit" disabled={creating}>
              {creating ? "Creating…" : "Create brand"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={deleteTarget != null}
        onClose={handleCancelDelete}
        title="Delete brand"
        icon="delete"
        size="sm"
      >
        {deleteTarget && (
          <div className="p-4 sm:p-6 flex flex-col gap-4">
            <p className="text-sm text-[#0f172a]">
              Delete <strong>&ldquo;{deleteTarget.name || "Untitled"}&rdquo;</strong>?
            </p>
            {deleteTarget.usageCount > 0 ? (
              <p className="text-sm bg-yellow-50 text-yellow-800 px-3 py-2 rounded-[4px]">
                <span className="font-medium">{formatUsageLabel(deleteTarget.usageCount)}.</span>{" "}
                Those games will lose their custom styling and fall back to platform defaults.
              </p>
            ) : (
              <p className="text-sm text-[#64748b]">
                This brand isn&rsquo;t attached to any games, so nothing else will change.
              </p>
            )}
            <p className="text-xs text-[#64748b]">This cannot be undone.</p>
            {deleteError && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-[4px]">
                {deleteError}
              </p>
            )}
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-2">
              <Button variant="outline" onClick={handleCancelDelete} disabled={deletingId === deleteTarget.id}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                disabled={deletingId === deleteTarget.id}
              >
                {deletingId === deleteTarget.id ? "Deleting…" : "Delete brand"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

const Swatch = ({ color, label }: { color: string; label: string }) => (
  <div
    className="flex items-center gap-1.5 bg-slate-50 rounded-[4px] px-2 py-1"
    title={label}
  >
    <div
      className="w-3.5 h-3.5 rounded-sm border border-slate-200"
      style={{ background: color }}
    />
    <span className="text-[10px] text-[#64748b] font-medium uppercase tracking-wide">
      {label}
    </span>
  </div>
)
