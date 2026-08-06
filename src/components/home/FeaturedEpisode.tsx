import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { formatDate } from "@/lib/utils";
import type { Episode } from "@/lib/schemas";

/** Latest-conversation spotlight strip. */
export function FeaturedEpisode({ featured }: { featured?: Episode }) {
  if (!featured) return null;

  return (
    <section className="border-b border-line bg-canvas">
      <Container size="wide">
        <div className="grid items-center gap-8 py-14 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
          <div>
            <Eyebrow>Latest conversation</Eyebrow>
            <h2 className="mt-5 text-h2 font-light text-ink-900">
              <Link href={`/podcast/episodes/${featured.slug}`} className="hover:text-ink-500">
                {featured.title}
              </Link>
            </h2>
            <p className="mt-3 font-mono text-eyebrow uppercase text-ink-400">
              {featured.episodeNumber ? `Episode ${featured.episodeNumber} · ` : ""}
              {formatDate(featured.publishedAt)}
            </p>
            <p className="mt-4 max-w-xl text-body text-ink-500">{featured.excerpt}</p>
            <Link
              href={`/podcast/episodes/${featured.slug}`}
              className="mt-6 inline-flex items-center gap-2 text-body text-ink-900 underline-offset-4 hover:underline"
            >
              <Play className="size-4" aria-hidden /> Listen to this episode
            </Link>
          </div>
          {featured.image ? (
            <Link
              href={`/podcast/episodes/${featured.slug}`}
              className="relative block aspect-video overflow-hidden rounded-lg border border-line"
            >
              <Image
                src={featured.image}
                alt=""
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </Link>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
