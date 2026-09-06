import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { EpisodeHero } from "@/components/content/EpisodeHero";
import { Markdown } from "@/components/content/Markdown";
import { EpisodeCard } from "@/components/content/EpisodeCard";
import { TranscriptPanel } from "@/components/content/TranscriptPanel";
import { CTASection } from "@/components/marketing/CTASection";
import {
  getAllEpisodes,
  getEpisodeBySlug,
  getHostBySlug,
  getRelatedEpisodes,
  getTranscriptBySlug,
} from "@/lib/content";
import { isoDuration, metaDescription } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import { pageMetadata } from "@/lib/og/metadata";
import { person, PODCAST_SERIES_ID } from "@/lib/jsonld";
import type { Host } from "@/lib/schemas";

export function generateStaticParams() {
  return getAllEpisodes().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ep = getEpisodeBySlug(slug);
  if (!ep) return {};
  return pageMetadata({
    title: ep.title,
    description: metaDescription(ep),
    path: `/podcast/episodes/${slug}`,
    type: "article",
    publishedTime: ep.publishedAt,
    modifiedTime: ep.publishedAt,
    section: "The Ophthalmology Business Podcast",
    ...(ep.tags.length ? { tags: ep.tags } : {}),
    image: "route",
  });
}

export default async function EpisodePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ep = getEpisodeBySlug(slug);
  if (!ep) notFound();

  const related = getRelatedEpisodes(slug, 3);
  const transcript = getTranscriptBySlug(slug);
  const hosts = ep.hostSlugs
    .map((s) => getHostBySlug(s))
    .filter((h): h is Host => Boolean(h));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    name: ep.title,
    datePublished: ep.publishedAt,
    dateModified: ep.publishedAt,
    inLanguage: "en",
    description: metaDescription(ep),
    url: `${siteConfig.url}/podcast/episodes/${ep.slug}`,
    ...(ep.episodeNumber ? { episodeNumber: ep.episodeNumber } : {}),
    ...(ep.audioUrl
      ? {
          associatedMedia: {
            "@type": "AudioObject",
            contentUrl: ep.audioUrl,
            encodingFormat: "audio/mpeg",
            uploadDate: ep.publishedAt,
            ...(isoDuration(ep.durationSec) ? { duration: isoDuration(ep.durationSec) } : {}),
          },
        }
      : {}),
    ...(ep.guests.length
      ? { actor: ep.guests.map((g) => ({ "@type": "Person", name: g })) }
      : {}),
    ...(hosts.length
      ? { author: hosts.map((h) => person(h, `${siteConfig.url}/podcast/hosts`)) }
      : {}),
    partOfSeries: { "@id": PODCAST_SERIES_ID },
  };

  return (
    <>
      {/* JSON-LD rendered in the body is Next.js's documented pattern for structured data. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <EpisodeHero episode={ep} hosts={hosts} />

      <section className="bg-canvas py-16 sm:py-20 lg:py-24">
        <Container>
          <p className="font-mono text-eyebrow uppercase text-ink-500">Show notes</p>
          <div className="mt-6 border-t border-line pt-8">
            <Markdown>{ep.body}</Markdown>
          </div>

          {ep.tags.length ? (
            <div className="mt-12 border-t border-line pt-8">
              <p className="font-mono text-eyebrow uppercase text-ink-500">Topics</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {ep.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-pill border border-line px-3 py-1 text-small text-ink-600"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {transcript ? (
            <TranscriptPanel title={ep.title} slug={ep.slug} transcript={transcript} />
          ) : null}

          <div className="mt-16 border-t border-line pt-8">
            <Button href="/podcast/episodes" variant="ghost">
              <ArrowLeft className="size-4" aria-hidden /> All episodes
            </Button>
          </div>
        </Container>
      </section>

      {related.length > 0 ? (
        <Section tone="subtle" spacing="default">
          <p className="font-mono text-eyebrow uppercase text-ink-500">Keep listening</p>
          <h2 className="mt-4 text-h2 font-light tracking-tight">
            More from the podcast
          </h2>
          <div className="panel-grid mt-10">
            {related.map((r) => (
              <EpisodeCard key={r.slug} episode={r} variant="panel" />
            ))}
          </div>
        </Section>
      ) : null}

      {/* One ask. The episode page is first-touch content, so the next episode
          above is the smallest next commitment and the band carries the single
          macro CTA — its usual "Browse Episodes" secondary would be a second
          ask for something the reader has just been offered. */}
      <CTASection secondary={null} />
    </>
  );
}
