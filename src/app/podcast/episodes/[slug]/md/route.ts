import { getAllEpisodes } from "@/lib/content";
import { episodeItems, toMarkdownDocument } from "@/lib/agent/content";

/** Fully static: rendered once at build time (SSG). */
export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllEpisodes().map((e) => ({ slug: e.slug }));
}

/**
 * Plain-Markdown mirror of an episode page, for LLM retrieval without the
 * surrounding page chrome. Linked from llms.txt, deliberately kept out of the
 * sitemap: it is an alternate representation, not a separate page.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const item = episodeItems().find((i) => i.slug === slug);
  if (!item) return new Response("Not found", { status: 404 });

  return new Response(toMarkdownDocument(item), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Robots-Tag": "noindex",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
