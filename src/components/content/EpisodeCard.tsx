import Link from "next/link";
import Image from "next/image";
import { Headphones, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Episode } from "@/lib/schemas";
import { cn, formatDate } from "@/lib/utils";

export function EpisodeCard({
  episode,
  variant = "card",
}: {
  episode: Episode;
  variant?: "card" | "panel" | "slider";
}) {
  const href = `/podcast/episodes/${episode.slug}`;

  // Panel and slider share one anatomy — image, meta, title, CTA pill,
  // whole-card hit target — and differ only in how hover behaves. "panel" is
  // the static treatment (`.panel-card`); "slider" is the free-resources /
  // events treatment (`.event-card`): the highlight glides between cards,
  // siblings dim, and the content shifts right. Slider must be rendered inside
  // an `.event-grid`.
  if (variant === "panel" || variant === "slider") {
    const slider = variant === "slider";
    const label = `Listen to ${episode.title}`;
    const textHover =
      "transition-colors duration-200 ease-in-out group-hover:text-white group-focus-within:text-white";
    return (
      <article
        className={cn(
          "group flex cursor-pointer flex-col rounded-[28px]",
          slider ? "event-card p-2" : "panel-card p-4",
        )}
      >
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-canvas">
          {episode.image ? (
            <Image
              src={episode.image}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-ink-300">
              <Headphones className="size-10" aria-hidden />
            </div>
          )}
        </div>

        <div
          className={cn(
            "relative mt-8 min-w-0 px-4 sm:px-5",
            slider &&
              "transition-transform duration-200 ease-in-out group-hover:translate-x-4 group-focus-within:translate-x-4",
          )}
        >
          <p className={`font-mono text-small font-light uppercase tracking-wide text-ink-400 ${textHover}`}>
            {episode.episodeNumber ? <span>Ep. {episode.episodeNumber}</span> : null}
            {episode.episodeNumber ? <span aria-hidden> · </span> : null}
            <time dateTime={episode.publishedAt}>{formatDate(episode.publishedAt)}</time>
          </p>
          <h3 className={`mt-3 text-body-lg font-medium leading-snug text-ink-900 ${textHover}`}>
            {episode.title}
          </h3>
        </div>

        <div className="relative mt-auto flex items-center justify-between gap-4 px-4 pt-7 pb-5 sm:px-5 sm:pb-6">
          <span className="inline-flex h-9 items-center rounded-pill border border-line-strong px-4 text-small font-semibold text-ink-800 transition-colors duration-200 ease-in-out group-hover:border-white/30 group-hover:text-white group-focus-within:border-white/30 group-focus-within:text-white">
            Listen now
          </span>
          <ArrowRight
            className={
              slider
                ? "size-5 -translate-x-4 text-white opacity-0 transition-[opacity,transform] duration-[50ms] ease-in-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:opacity-100"
                : "size-5 text-white opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100 group-focus-within:opacity-100"
            }
            aria-hidden
          />
        </div>

        <Link
          href={href}
          className="absolute inset-0 z-[1] cursor-pointer rounded-[28px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label={label}
        />
      </article>
    );
  }

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
