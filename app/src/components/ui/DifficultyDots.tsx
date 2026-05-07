import { cn } from "@/lib/utils"

type DifficultyLevel = "easy" | "medium" | "hard"

const DIFFICULTY_CONFIG: Record<
  DifficultyLevel,
  { color: string; bars: number }
> = {
  easy: { color: "#15803d", bars: 1 },
  medium: { color: "#b45309", bars: 2 },
  hard: { color: "#b91c1c", bars: 3 },
}

type DifficultyDotsProps = {
  difficulty: string
  className?: string
}

export const DifficultyDots = ({
  difficulty,
  className,
}: DifficultyDotsProps) => {
  const d = difficulty?.toLowerCase() as DifficultyLevel
  const { color, bars } = DIFFICULTY_CONFIG[d] ?? DIFFICULTY_CONFIG.easy

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-muted-foreground",
        className,
      )}
    >
      <span className="flex gap-[2px]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="rounded-[1px]"
            style={{
              width: 4,
              height: 11,
              background: i < bars ? color : "#e5e7eb",
            }}
          />
        ))}
      </span>
      <span className="capitalize">{d}</span>
    </span>
  )
}
