import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/content";
import { logoSrc } from "@/lib/og/assets";
import { BrandOgCard, DocumentOgCard } from "@/lib/og/cards";
import { renderOgImage } from "@/lib/og/render";
import { OG_SIZE } from "@/lib/og/size";

export const alt = "Ophthalmology Business Academy article";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllBlogPosts().map((p) => ({ slug: p.slug }));
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
