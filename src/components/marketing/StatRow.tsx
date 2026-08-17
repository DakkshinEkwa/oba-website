import { AnimatedStat } from "@/components/marketing/AnimatedStat";
import { getEpisodeStats } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * The four sanctioned proof-by-numbers stats, derived from the catalog at
 * build time (count / first year / host count) — never hardcoded, never
 * fabricated. `tone="light"` renders white text for dark surfaces (the podcast
 * hero footer); `tone="default"` is the ink-on-canvas homepage band.
 */
export function StatRow({
  tone = "default",
  size = "h1",
}: {
  tone?: "default" | "light";
  size?: "h1" | "h2";
}) {
  const stats = getEpisodeStats();
  const items = [
    { n: `${stats.count}+`, l: "Recorded conversations" },
    { n: String(stats.hostCount), l: "Hosts & regular contributors" },
    { n: stats.firstYear, l: "Convening leaders since" },
    { n: "100%", l: "Ophthalmology-specific" },
  ];

  const onDark = tone === "light";
  const dt = `${size === "h1" ? "text-h1" : "text-h2"} font-light tracking-tight ${
    onDark ? "text-white" : "text-ink-900"
  }`;
  const dl = onDark
    ? "grid grid-cols-2 divide-x divide-white/15 lg:grid-cols-4"
    : "grid grid-cols-2 divide-x divide-line lg:grid-cols-4";

  return (
    <dl className={cn(dl)}>
      {items.map((s, i) => (
        <div key={i} className="px-6 py-10">
          <dt className={dt}>
            <AnimatedStat value={s.n} />
          </dt>
          <dd className={cn("mt-1 text-small", onDark ? "text-white/65" : "text-ink-500")}>{s.l}</dd>
        </div>
      ))}
    </dl>
  );
}
