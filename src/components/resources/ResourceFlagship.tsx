import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { formatDate, formatDuration } from "@/lib/utils";
import type { Episode } from "@/lib/schemas";

/**
 * One flagship conversation, not a rail of three.
 *
 * Brand ch.9: "One flagship asset per pillar, not a stream. Cut volume, raise
 * density." The three-card episode grid this replaced said nothing a single
 * well-set episode does not say better, and it repeated the card vocabulary the
 * blog rail below already uses.
 *
 * Mirrored against the homepage's `FeaturedEpisode` on purpose — artwork left,
 * copy right, on the grey ground rather than white — so the two spotlights read
 * as siblings rather than as the same section twice.
 */
export function ResourceFlagship({ episode }: { episode?: Episode }) {
  if (!episode) return null;

  const href = `/podcast/episodes/${episode.slug}`;
  const duration = formatDuration(episode.durationSec);

  return (
    <Section tone="subtle" spacing="default">
      <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1fr] lg:gap-16">
        {episode.image ? (
          <Link
            href={href}
            aria-hidden
            tabIndex={-1}
            className="relative block aspect-video overflow-hidden rounded-lg border border-line"
          >
            <Image
              src={episode.image}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </Link>
        ) : null}

        <div className="min-w-0">
          <Eyebrow>Start here</Eyebrow>
          <h2 className="mt-5 text-h2 font-light tracking-tight text-ink-900">
            The most recent
            <br />
            <span className="title-dim">conversation in the library</span>
          </h2>
          <p className="mt-5 font-mono text-eyebrow uppercase text-ink-400">
            {episode.episodeNumber ? `Episode ${episode.episodeNumber} · ` : ""}
            {formatDate(episode.publishedAt)}
            {duration ? ` · ${duration}` : ""}
          </p>
          <p className="mt-4 text-lede text-ink-900">
            <Link href={href} className="hover:text-ink-500">
              {episode.title}
            </Link>
          </p>
          {episode.excerpt ? (
            <p className="mt-4 max-w-xl text-body text-ink-500">{episode.excerpt}</p>
          ) : null}
          <Link
            href={href}
            className="mt-6 inline-flex items-center gap-2 text-body text-ink-900 underline-offset-4 hover:underline"
          >
            <Play className="size-4" aria-hidden /> Listen to this episode
          </Link>
        </div>
      </div>
    </Section>
  );
}
