import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-small text-ink-500">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <Link href={item.href} className="hover:text-accent-600 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className={last ? "text-ink-600" : undefined} aria-current={last ? "page" : undefined}>
                  {item.label}
                </span>
              )}
              {!last ? <ChevronRight className="size-3.5 text-ink-300" aria-hidden /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
