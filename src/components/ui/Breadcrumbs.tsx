import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { breadcrumbJsonLd } from "@/lib/jsonld";

type Crumb = { label: string; href?: string };

const toneClasses = {
  default: {
    list: "text-ink-500",
    link: "hover:text-accent-600",
    current: "text-ink-600",
    chevron: "text-ink-300",
  },
  onDark: {
    list: "text-white/70",
    link: "hover:text-white focus-visible:outline-white",
    current: "text-white/90",
    chevron: "text-white/40",
  },
} as const;

export function Breadcrumbs({
  items,
  tone = "default",
}: {
  items: Crumb[];
  tone?: keyof typeof toneClasses;
}) {
  const t = toneClasses[tone];
  return (
    <nav aria-label="Breadcrumb">
      {/* BreadcrumbList lives here so every visible trail is described exactly
          once, rather than being re-declared per page. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(items)) }}
      />
      <ol className={cn("flex flex-wrap items-center gap-1.5 text-small", t.list)}>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <Link href={item.href} className={cn(t.link, "transition-colors")}>
                  {item.label}
                </Link>
              ) : (
                <span className={last ? t.current : undefined} aria-current={last ? "page" : undefined}>
                  {item.label}
                </span>
              )}
              {!last ? <ChevronRight className={cn("size-3.5", t.chevron)} aria-hidden /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
