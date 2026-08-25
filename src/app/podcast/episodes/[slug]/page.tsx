import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { LibsynPlayer } from "@/components/content/LibsynPlayer";
import { Markdown } from "@/components/content/Markdown";
import { EpisodeCard } from "@/components/content/EpisodeCard";
import { CTASection } from "@/components/marketing/CTASection";
import { getAllEpisodes, getEpisodeBySlug, getHostBySlug, getRelatedEpisodes } from "@/lib/content";
import { formatDate, isoDuration, metaDescription } from "@/lib/utils";
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
      <Section spacing="tight" containerSize="narrow">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Podcast", href: "/podcast" },
            { label: "Episodes", href: "/podcast/episodes" },
            { label: ep.title },
          ]}
        />
        <div className="mt-6 flex items-center gap-2 font-mono text-eyebrow uppercase text-ink-400">
          {ep.episodeNumber ? <span>Episode {ep.episodeNumber}</span> : null}
          {ep.episodeNumber ? <span aria-hidden>·</span> : null}
          <time dateTime={ep.publishedAt}>{formatDate(ep.publishedAt)}</time>
        </div>
        <h1 className="mt-3 text-h1 font-light tracking-tight text-ink-900">{ep.title}</h1>

        {ep.image ? (
          <div className="relative mt-8 aspect-video overflow-hidden rounded-xl border border-line">
            <Image
              src={ep.image}
              alt={ep.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 760px"
              className="object-cover"
            />
          </div>
        ) : null}

        <div className="mt-8">
          <LibsynPlayer audioUrl={ep.audioUrl} title={ep.title} episodeNumber={ep.episodeNumber} />
        </div>

        <div className="mt-10">
          <Eyebrow>Show notes</Eyebrow>
          <div className="mt-4">
            <Markdown>{ep.body}</Markdown>
          </div>
        </div>

        <div className="mt-10 border-t border-line pt-8">
          <Button href="/podcast/episodes" variant="ghost">
            <ArrowLeft className="size-4" aria-hidden /> All episodes
          </Button>
        </div>
      </Section>

      {related.length > 0 ? (
        <Section tone="subtle" spacing="default">
          <h2 className="text-h2 font-light">More episodes</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <EpisodeCard key={r.slug} episode={r} />
            ))}
          </div>
        </Section>
      ) : null}

      <CTASection />
    </>
  );
}
