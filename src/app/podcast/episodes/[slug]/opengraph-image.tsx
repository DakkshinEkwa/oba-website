import { getAllEpisodes, getEpisodeBySlug } from "@/lib/content";
import { logoSrc } from "@/lib/og/assets";
import { BrandOgCard, DocumentOgCard } from "@/lib/og/cards";
import { renderOgImage } from "@/lib/og/render";
import { OG_SIZE } from "@/lib/og/size";

export const contentType = "image/png";

export function generateStaticParams() {
  return getAllEpisodes().map((e) => ({ slug: e.slug }));
}

// Per-episode alt text. Next feeds this into og:image:alt and the derived
// twitter:image:alt — the only image-context signal a text-render card has.
export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ep = getEpisodeBySlug(slug);
  return [
    {
      id: "og",
      size: OG_SIZE,
      contentType,
      alt: ep
        ? `${ep.title} — The Ophthalmology Business Podcast`
        : "The Ophthalmology Business Podcast",
    },
  ];
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ep = getEpisodeBySlug(slug);
  if (!ep) {
    return renderOgImage(<BrandOgCard logoSrc={logoSrc} />);
  }
  const eyebrow = ep.episodeNumber ? `Episode ${ep.episodeNumber}` : "Episode";
  return renderOgImage(
    <DocumentOgCard logoSrc={logoSrc} eyebrow={eyebrow} title={ep.title} />,
  );
}
