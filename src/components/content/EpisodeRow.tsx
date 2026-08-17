import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Headphones } from "lucide-react";
import type { Episode } from "@/lib/schemas";
import { formatDate, formatDuration } from "@/lib/utils";

/**
 * One dense archive row. Exactly one interactive element — the title link,
 * stretched across the whole row (the `li` is the `group` and `relative`, the
 * link's `after` covers it); thumbnail and "Listen" are decorative. The
 * episode number appears only in the mono meta line, and every row shows a
 * real date. Degrades: no image → headphones tile (fixed aspect, no height
 * shift); no guests → support line falls back to the excerpt; no duration →
 * the span is omitted and "Listen" stays flush right.
 */
export function EpisodeRow({ episode, priority = false }: { episode: Episode; priority?: boolean }) {
  const href = `/podcast/episodes/${episode.slug}`;
  const support =
    episode.guests.length > 0 ? `With ${episode.guests.join(", ")}` : episode.excerpt;
  const duration = formatDuration(episode.durationSec);

  return (
    <li className="group relative grid grid-cols-[5rem_minmax(0,1fr)] items-center gap-5 py-4 sm:grid-cols-[7rem_minmax(0,1fr)_auto]">
      <div className="relative aspect-video overflow-hidden rounded-md border border-line bg-canvas-subtle">
        {episode.image ? (
          <Image
            src={episode.image}
            alt=""
            fill
            priority={priority}
            sizes="(max-width:640px) 80px, 112px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-300">
            <Headphones className="size-5 sm:size-6" aria-hidden />
          </div>
        )}
      </div>

      <div className="min-w-0">
        <p className="font-mono text-eyebrow uppercase text-ink-400">
          {episode.episodeNumber ? <span>Ep. {episode.episodeNumber} · </span> : null}
          <time dateTime={episode.publishedAt}>{formatDate(episode.publishedAt)}</time>
        </p>
        <h3 className="mt-1 truncate text-body-lg font-medium leading-snug text-ink-900">
          <Link
            href={href}
            className="transition-colors after:absolute after:inset-0 after:content-[''] group-hover:text-accent-700 focus-visible:outline-offset-4"
          >
            {episode.title}
          </Link>
        </h3>
        {support ? (
          <p className="mt-1 hidden truncate text-body text-ink-500 sm:block">{support}</p>
        ) : null}
      </div>

      <div className="hidden items-center justify-self-end gap-4 sm:flex">
        {duration ? (
          <span className="font-mono text-eyebrow uppercase text-ink-400">{duration}</span>
        ) : null}
        <span aria-hidden className="inline-flex items-center gap-1 text-small font-semibold text-accent-600">
          Listen
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
      </div>
    </li>
  );
}
