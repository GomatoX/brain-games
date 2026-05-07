import Link from "next/link"
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
  total,
  pageSize = 12,
  basePath,
}: {
  page: number
  totalPages: number
  total?: number
  pageSize?: number
  basePath: string
}) => {
  if (totalPages <= 1) return null

  const pageUrl = (p: number) => `${basePath}?page=${p}`
  const items = buildPageNumbers(page, totalPages)
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total ?? page * pageSize)

  return (
    <div className="flex items-center justify-between mt-3.5 px-0.5">
      <span className="text-xs text-muted-foreground">
        Showing{" "}
        <strong className="text-foreground">
          {start}–{end}
        </strong>{" "}
        {total != null && <>of {total}</>}
      </span>
      <Pagination className="w-auto mx-0 justify-end">
        <PaginationContent>
          <PaginationItem>
            {page > 1 ? (
              <Link href={pageUrl(page - 1)} legacyBehavior passHref>
                <PaginationPrevious aria-label="Previous page" />
              </Link>
            ) : (
              <PaginationPrevious
                aria-disabled="true"
                className="pointer-events-none opacity-40"
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
                <Link href={pageUrl(item)} legacyBehavior passHref>
                  <PaginationLink
                    isActive={item === page}
                    aria-label={`Page ${item}`}
                    aria-current={item === page ? "page" : undefined}
                  >
                    {item}
                  </PaginationLink>
                </Link>
              </PaginationItem>
            ),
          )}
          <PaginationItem>
            {page < totalPages ? (
              <Link href={pageUrl(page + 1)} legacyBehavior passHref>
                <PaginationNext aria-label="Next page" />
              </Link>
            ) : (
              <PaginationNext
                aria-disabled="true"
                className="pointer-events-none opacity-40"
              />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
