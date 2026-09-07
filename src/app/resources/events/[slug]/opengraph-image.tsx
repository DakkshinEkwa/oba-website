import { getAllEvents, getEventBySlug } from "@/lib/content";
import { logoSrc } from "@/lib/og/assets";
import { BrandOgCard, DocumentOgCard } from "@/lib/og/cards";
import { renderOgImage } from "@/lib/og/render";
import { OG_SIZE } from "@/lib/og/size";

export const contentType = "image/png";

export function generateStaticParams() {
  return getAllEvents().map((e) => ({ slug: e.slug }));
}

// Per-panel alt text. Next feeds this into og:image:alt and the derived
// twitter:image:alt — the only image-context signal a text-render card has.
export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  return [
    {
      id: "og",
      size: OG_SIZE,
      contentType,
      alt: event
        ? `${event.title} — Ophthalmology Business Academy`
        : "Ophthalmology Business Academy",
    },
  ];
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) {
    return renderOgImage(<BrandOgCard logoSrc={logoSrc} />);
  }
  return renderOgImage(
    <DocumentOgCard logoSrc={logoSrc} eyebrow="Live panel" title={event.title} />,
  );
}
