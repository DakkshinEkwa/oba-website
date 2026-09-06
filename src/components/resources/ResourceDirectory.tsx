import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export type DirectoryEntry = {
  title: string;
  body: string;
  href: string;
  /** Live count rendered as the row's right-hand figure, e.g. "75 conversations". */
  count: string;
};

/**
 * The hub index, as rows rather than cards.
 *
 * The card grid this replaced put four items in a three-column grid, which
 * orphaned the fourth on its own row at `lg`. Rows cannot orphan, and a hub
 * whose whole job is to point elsewhere reads better as an index than as a
 * wall of equal-weight tiles.
 *
 * Vocabulary is the homepage's `ProblemAreas` — `divide-y` hairlines and a mono
 * bracketed counter — turned 90° so it reads as a directory, not as a copy of
 * that section. Each row carries a real count, so the index states how much is
 * actually behind each door.
 */
export function ResourceDirectory({ entries }: { entries: DirectoryEntry[] }) {
  return (
    <ul className="mt-12 divide-y divide-line border-y border-line">
      {entries.map((entry, i) => (
        <li key={entry.href}>
          <Link
            href={entry.href}
            className="group grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-x-5 gap-y-2 py-8 sm:grid-cols-[3rem_minmax(0,18rem)_minmax(0,1fr)_auto] sm:items-center sm:gap-x-8"
          >
            <span className="font-mono text-eyebrow text-ink-300" aria-hidden>
              [{String(i + 1).padStart(2, "0")}]
            </span>

            <h3 className="flex items-center gap-2 text-h3 font-normal text-ink-900">
              {entry.title}
              <ArrowUpRight
                className="size-4 shrink-0 opacity-0 transition-[opacity,transform] duration-200 ease-in-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 group-focus-visible:opacity-100"
                aria-hidden
              />
            </h3>

            <p className="col-start-2 text-body font-light text-ink-500 sm:col-start-3">
              {entry.body}
            </p>

            <span className="col-start-2 font-mono text-small uppercase tracking-wide text-ink-400 sm:col-start-4 sm:justify-self-end">
              {entry.count}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
