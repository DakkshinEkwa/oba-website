import Link from "next/link";
import Image from "next/image";
import { Headphones, ArrowUpRight } from "lucide-react";
import type { Episode } from "@/lib/schemas";
import { formatDate } from "@/lib/utils";

export function EpisodeCard({ episode }: { episode: Episode }) {
  const href = `/podcast/episodes/${episode.slug}`;
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-line bg-canvas transition-colors duration-200 hover:border-ink-300">
      <Link
        href={href}
        aria-hidden
        tabIndex={-1}
        className="relative block aspect-video overflow-hidden bg-canvas-subtle"
      >
        {episode.image ? (
          <Image
            src={episode.image}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-300">
            <Headphones className="size-10" aria-hidden />
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col border-t border-line p-5 pb-2.5">
        <div className="flex items-center gap-2 font-mono text-eyebrow uppercase text-ink-400">
          {episode.episodeNumber ? <span>Ep. {episode.episodeNumber}</span> : null}
          {episode.episodeNumber ? <span aria-hidden>·</span> : null}
          <time dateTime={episode.publishedAt}>{formatDate(episode.publishedAt)}</time>
        </div>
        <h3 className="mt-2 text-body-lg font-medium leading-snug">
          <Link
            href={href}
            className="transition-colors after:absolute after:inset-0 after:content-[''] group-hover:text-accent-700"
          >
            {episode.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-body text-ink-500">{episode.excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-small font-semibold text-accent-600">
          Listen now
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
        </span>
      </div>
    </article>
  );
}
