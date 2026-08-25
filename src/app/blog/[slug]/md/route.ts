import { getAllBlogPosts } from "@/lib/content";
import { articleItems, toMarkdownDocument } from "@/lib/agent/content";

/** Fully static: rendered once at build time (SSG). */
export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllBlogPosts().map((p) => ({ slug: p.slug }));
}

/**
 * Plain-Markdown mirror of an article page, for LLM retrieval without the
 * surrounding page chrome. Linked from llms.txt, deliberately kept out of the
 * sitemap: it is an alternate representation, not a separate page.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const item = articleItems().find((i) => i.slug === slug);
  if (!item) return new Response("Not found", { status: 404 });

  return new Response(toMarkdownDocument(item), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Robots-Tag": "noindex",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
