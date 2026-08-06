import Link from "next/link";
import type { Episode } from "@/lib/schemas";

/**
 * Proof-by-volume strip: a continuous ticker of real episode titles, not a
 * fabricated logo wall. Content is duplicated once so the CSS marquee loops
 * seamlessly; `aria-hidden` on the duplicate keeps screen readers from
 * announcing the list twice.
 */
export function EpisodeTicker({ episodes }: { episodes: Episode[] }) {
  if (episodes.length === 0) return null;

  return (
    <div className="group overflow-hidden border-y border-line bg-canvas">
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        <TickerRow episodes={episodes} />
        <TickerRow episodes={episodes} ariaHidden />
      </div>
    </div>
  );
}

function TickerRow({ episodes, ariaHidden }: { episodes: Episode[]; ariaHidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden}>
      {episodes.map((ep, i) => (
        <Link
          key={`${ep.slug}-${i}`}
          href={`/podcast/episodes/${ep.slug}`}
          tabIndex={ariaHidden ? -1 : undefined}
          className="flex shrink-0 items-center gap-3 py-5 pr-10 pl-10 text-small text-ink-500 transition-colors hover:text-ink-900"
        >
          {ep.episodeNumber ? (
            <span className="font-mono text-eyebrow text-ink-300">Ep. {ep.episodeNumber}</span>
          ) : null}
          <span className="whitespace-nowrap">{ep.title}</span>
          <span aria-hidden className="text-ink-300">
            ·
          </span>
        </Link>
      ))}
    </div>
  );
}
