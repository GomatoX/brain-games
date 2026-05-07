"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import type { GameType } from "@/lib/game-types"

type SettingsTabProps = {
  type: GameType
  // Status
  status: string
  onStatusChange: (v: string) => void
  // Difficulty
  difficulty: string
  onDifficultyChange: (v: string) => void
  // Schedule
  scheduledDate: string
  onScheduledDateChange: (v: string) => void
  // Branding
  brandingPresets: { id: string | number; name: string }[]
  selectedBranding: string
  onBrandingChange: (v: string) => void
  // Max attempts (word games only)
  maxAttempts: number
  onMaxAttemptsChange: (v: number) => void
  // Grid size (crosswords + wordsearches)
  gridSize: number
  onGridSizeChange: (v: number) => void
}

const hasDifficulty = (type: GameType) =>
  type === "crosswords" || type === "sudoku" || type === "wordsearches"

const GRID_SIZES: Record<string, number[]> = {
  crosswords: [9, 11, 13, 15],
  wordsearches: [10, 12, 15, 18],
}

const GRID_HELP: Record<string, string> = {
  crosswords:
    "The solver auto-fits your words into a symmetric grid of this size.",
  wordsearches:
    "Larger grids fit more words but take longer to solve.",
}

export const SettingsTab = ({
  type,
  status,
  onStatusChange,
  difficulty,
  onDifficultyChange,
  scheduledDate,
  onScheduledDateChange,
  brandingPresets,
  selectedBranding,
  onBrandingChange,
  maxAttempts,
  onMaxAttemptsChange,
  gridSize,
  onGridSizeChange,
}: SettingsTabProps) => (
  <>
    {/* Status + Difficulty / Language row */}
    <div className="grid-2">
      <Field>
        <FieldLabel htmlFor="game-status">
          Status
        </FieldLabel>
        <Select
          value={status}
          onValueChange={(value) => {
            onStatusChange(value)
            if (value !== "scheduled") {
              onScheduledDateChange("")
            }
          }}
        >
          <SelectTrigger id="game-status" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      {hasDifficulty(type) && (
        <Field>
          <FieldLabel htmlFor="game-difficulty">
            Difficulty
          </FieldLabel>
          <Select value={difficulty} onValueChange={onDifficultyChange}>
            <SelectTrigger id="game-difficulty" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      )}
    </div>

    {/* Scheduled Date */}
    {status === "scheduled" && (
      <Field>
        <FieldLabel htmlFor="scheduled-date">
          Publish Date & Time
        </FieldLabel>
        <Input
          id="scheduled-date"
          type="datetime-local"
          value={scheduledDate}
          onChange={(e) => onScheduledDateChange(e.target.value)}
          min={new Date().toISOString().slice(0, 16)}
          required
          aria-label="Schedule publish date and time"
        />
        <FieldDescription>
          The game will automatically become public at this date and time.
        </FieldDescription>
      </Field>
    )}

    {/* Branding Preset */}
    <Field>
      <FieldLabel htmlFor="game-branding">
        Branding preset{" "}
        <span className="font-normal normal-case tracking-normal text-muted-foreground">
          optional
        </span>
      </FieldLabel>
      <Select
        value={selectedBranding || "none"}
        onValueChange={(value) =>
          onBrandingChange(value === "none" ? "" : value)
        }
      >
        <SelectTrigger id="game-branding" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Default (no branding)</SelectItem>
          {brandingPresets.map((p) => (
            <SelectItem key={String(p.id)} value={String(p.id)}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldDescription>
        Inherits colors, type, and shape tokens from the chosen preset.
      </FieldDescription>
    </Field>

    {/* Max attempts — word games only */}
    {type === "wordgames" && (
      <Field>
        <FieldLabel htmlFor="word-game-attempts">
          Max attempts
        </FieldLabel>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-[34px]"
            onClick={() => onMaxAttemptsChange(Math.max(3, maxAttempts - 1))}
            aria-label="Decrease max attempts"
            tabIndex={0}
          >
            −
          </Button>
          <Input
            id="word-game-attempts"
            value={maxAttempts}
            onChange={(e) =>
              onMaxAttemptsChange(
                Math.min(10, Math.max(3, Number(e.target.value) || 3)),
              )
            }
            className="w-14 text-center font-mono"
            aria-label="Max attempts value"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-[34px]"
            onClick={() => onMaxAttemptsChange(Math.min(10, maxAttempts + 1))}
            aria-label="Increase max attempts"
            tabIndex={0}
          >
            +
          </Button>
        </div>
        <FieldDescription>Wordle uses 6. Lower = harder.</FieldDescription>
      </Field>
    )}

    {/* Grid size — crosswords + wordsearches */}
    {GRID_SIZES[type] && (
      <Field>
        <FieldLabel>Grid size</FieldLabel>
        <ToggleGroup
          type="single"
          variant="outline"
          value={String(gridSize)}
          onValueChange={(v) => {
            if (v) onGridSizeChange(Number(v))
          }}
          spacing={1}
          className="justify-start"
        >
          {GRID_SIZES[type].map((n) => (
            <ToggleGroupItem
              key={n}
              value={String(n)}
              aria-label={`${n} by ${n} grid`}
            >
              {n}×{n}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        {GRID_HELP[type] && <FieldDescription>{GRID_HELP[type]}</FieldDescription>}
      </Field>
    )}
  </>
)
