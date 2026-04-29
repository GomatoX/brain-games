import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const buildPageNumbers = (page: number, totalPages: number): (number | "...")[] => {
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

export const GamePagination = ({
  page,
  totalPages,
  basePath,
}: {
  page: number
  totalPages: number
  basePath: string
}) => {
  if (totalPages <= 1) return null

  const pageUrl = (p: number) => `${basePath}?page=${p}`
  const items = buildPageNumbers(page, totalPages)

  return (
    <Pagination className="py-4 border-t border-[#e2e8f0]">
      <PaginationContent>
        <PaginationItem>
          {page > 1 ? (
            <PaginationPrevious href={pageUrl(page - 1)} />
          ) : (
            <PaginationPrevious
              href="#"
              aria-disabled
              className="pointer-events-none opacity-50"
            />
          )}
        </PaginationItem>
        {items.map((item, i) =>
          item === "..." ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                href={pageUrl(item)}
                isActive={item === page}
                aria-label={`Page ${item}`}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          {page < totalPages ? (
            <PaginationNext href={pageUrl(page + 1)} />
          ) : (
            <PaginationNext
              href="#"
              aria-disabled
              className="pointer-events-none opacity-50"
            />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
