import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type PaginationProps = {
  page: number;
  totalPages: number;
  /** Builds the href for a given page number. */
  hrefFor: (page: number) => string;
};

/** Compact numbered pagination with ellipses. */
export function Pagination({ page, totalPages, hrefFor }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageList(page, totalPages);

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1.5">
      <PageLink
        href={page > 1 ? hrefFor(page - 1) : undefined}
        aria-label="Previous page"
        className="px-2.5"
      >
        <ChevronLeft className="size-4" aria-hidden />
      </PageLink>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-2 text-ink-300" aria-hidden>
            …
          </span>
        ) : (
          <PageLink
            key={p}
            href={p === page ? undefined : hrefFor(p)}
            aria-current={p === page ? "page" : undefined}
            active={p === page}
          >
            {p}
          </PageLink>
        ),
      )}

      <PageLink
        href={page < totalPages ? hrefFor(page + 1) : undefined}
        aria-label="Next page"
        className="px-2.5"
      >
        <ChevronRight className="size-4" aria-hidden />
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  active,
  className,
  children,
  ...props
}: {
  href?: string;
  active?: boolean;
  className?: string;
  children: React.ReactNode;
} & React.AriaAttributes) {
  const classes = cn(
    "inline-flex h-10 min-w-10 items-center justify-center rounded-md border px-3 text-small font-medium transition-colors",
    active
      ? "border-ink-900 bg-ink-900 text-white"
      : "border-line text-ink-600 hover:border-line-strong hover:bg-canvas-subtle",
    !href && "pointer-events-none opacity-40",
    className,
  );
  if (!href) {
    return (
      <span className={classes} {...props}>
        {children}
      </span>
    );
  }
  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  );
}

function getPageList(current: number, total: number): (number | "…")[] {
  const delta = 1;
  const range: (number | "…")[] = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  range.push(1);
  if (left > 2) range.push("…");
  for (let i = left; i <= right; i++) range.push(i);
  if (right < total - 1) range.push("…");
  if (total > 1) range.push(total);
  return range;
}
