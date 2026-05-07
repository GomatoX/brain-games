import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type SearchInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export const SearchInput = ({
  value,
  onChange,
  placeholder = "Search\u2026",
  className,
}: SearchInputProps) => (
  <div className={cn("relative flex-1 min-w-[220px] max-w-[340px]", className)}>
    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
    <Input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Search"
      className="h-8 pl-8 text-[13px]"
    />
  </div>
)
