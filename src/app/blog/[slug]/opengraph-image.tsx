import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/content";
import { logoSrc } from "@/lib/og/assets";
import { BrandOgCard, DocumentOgCard } from "@/lib/og/cards";
import { renderOgImage } from "@/lib/og/render";
import { OG_SIZE } from "@/lib/og/size";

export const contentType = "image/png";

export function generateStaticParams() {
  return getAllBlogPosts().map((p) => ({ slug: p.slug }));
}

// Per-post alt text. Next feeds this into og:image:alt and the derived
// twitter:image:alt — the only image-context signal a text-render card has.
export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  return [
    {
      id: "og",
      size: OG_SIZE,
      contentType,
      alt: post
        ? `${post.title} — Ophthalmology Business Academy`
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
  const post = getBlogPostBySlug(slug);
  if (!post) {
    return renderOgImage(<BrandOgCard logoSrc={logoSrc} />);
  }
  return renderOgImage(
    <DocumentOgCard logoSrc={logoSrc} eyebrow="Article" title={post.title} />,
  );
}
