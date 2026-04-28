import Link from "next/link"

function buildPageNumbers(page: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  const pages: (number | "...")[] = [1]
  if (page > 3) pages.push("...")
  for (let p = Math.max(2, page - 1); p <= Math.min(totalPages - 1, page + 1); p++) {
    pages.push(p)
  }
  if (page < totalPages - 2) pages.push("...")
  pages.push(totalPages)
  return pages
}

export function GamePagination({
  page,
  totalPages,
  basePath,
}: {
  page: number
  totalPages: number
  basePath: string
}) {
  if (totalPages <= 1) return null

  const pageUrl = (p: number) => `${basePath}?page=${p}`
  const items = buildPageNumbers(page, totalPages)

  return (
    <div className="flex items-center justify-center gap-1 py-4 border-t border-[#e2e8f0]">
      {page > 1 ? (
        <Link
          href={pageUrl(page - 1)}
          className="w-8 h-8 flex items-center justify-center border border-[#e2e8f0] rounded text-sm text-[#64748b] hover:bg-slate-50 transition-colors"
          aria-label="Previous page"
        >
          <span className="material-symbols-outlined text-sm">chevron_left</span>
        </Link>
      ) : (
        <span className="w-8 h-8 flex items-center justify-center border border-[#e2e8f0] rounded text-sm text-[#cbd5e1] cursor-not-allowed">
          <span className="material-symbols-outlined text-sm">chevron_left</span>
        </span>
      )}

      {items.map((item, i) =>
        item === "..." ? (
          <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-sm text-[#94a3b8]">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={pageUrl(item)}
            className={`w-8 h-8 flex items-center justify-center border rounded text-sm transition-colors ${
              item === page
                ? "bg-[#0f172a] text-white border-[#0f172a] font-semibold"
                : "border-[#e2e8f0] text-[#64748b] hover:bg-slate-50"
            }`}
            aria-label={`Page ${item}`}
            aria-current={item === page ? "page" : undefined}
          >
            {item}
          </Link>
        )
      )}

      {page < totalPages ? (
        <Link
          href={pageUrl(page + 1)}
          className="w-8 h-8 flex items-center justify-center border border-[#e2e8f0] rounded text-sm text-[#64748b] hover:bg-slate-50 transition-colors"
          aria-label="Next page"
        >
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </Link>
      ) : (
        <span className="w-8 h-8 flex items-center justify-center border border-[#e2e8f0] rounded text-sm text-[#cbd5e1] cursor-not-allowed">
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </span>
      )}
    </div>
  )
}
