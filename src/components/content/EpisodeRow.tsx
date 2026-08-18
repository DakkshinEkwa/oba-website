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
    <li className="episode-row group grid grid-cols-[6rem_minmax(0,1fr)] items-center gap-5 rounded-[20px] px-6 py-6 sm:grid-cols-[8rem_minmax(0,1fr)_auto] sm:gap-7 sm:px-8 sm:py-7">
      <div className="relative aspect-video overflow-hidden rounded-md bg-canvas">
        {episode.image ? (
          <Image
            src={episode.image}
            alt=""
            fill
            priority={priority}
            sizes="(max-width:640px) 96px, 128px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-300">
            <Headphones className="size-5 sm:size-6" aria-hidden />
          </div>
        )}
      </div>

      <div className="relative min-w-0 transition-transform duration-200 ease-in-out group-hover:translate-x-4 group-focus-within:translate-x-4">
        <p className="font-mono text-small font-light uppercase tracking-wide text-ink-400 transition-colors duration-200 ease-in-out group-hover:text-white group-focus-within:text-white">
          {episode.episodeNumber ? <span>Ep. {episode.episodeNumber} · </span> : null}
          <time dateTime={episode.publishedAt}>{formatDate(episode.publishedAt)}</time>
        </p>
        <h3 className="mt-2 truncate text-h4 font-medium text-ink-900 transition-colors duration-200 ease-in-out group-hover:text-white group-focus-within:text-white">
          <Link
            href={href}
            className="after:absolute after:inset-0 after:z-10 after:content-[''] focus-visible:outline-offset-4"
          >
            {episode.title}
          </Link>
        </h3>
        {support ? (
          <p className="mt-3 hidden truncate text-body font-light text-ink-400 transition-colors duration-200 ease-in-out group-hover:text-white group-focus-within:text-white sm:block">{support}</p>
        ) : null}
      </div>

      <div className="relative hidden items-center justify-self-end gap-5 sm:flex">
        {duration ? (
          <span className="font-mono text-small font-light uppercase tracking-wide text-ink-400 transition-colors duration-200 ease-in-out group-hover:text-white group-focus-within:text-white">{duration}</span>
        ) : null}
        <ArrowRight
          className="size-5 text-white opacity-0 transition-[opacity,transform] duration-200 ease-in-out group-hover:translate-x-1 group-hover:opacity-100 group-focus-within:translate-x-1 group-focus-within:opacity-100"
          aria-hidden
        />
      </div>
    </li>
  );
}
