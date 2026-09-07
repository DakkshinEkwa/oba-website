import { getAllEpisodes, getEpisodeBySlug, getTranscriptBySlug } from "@/lib/content";
import { toTranscriptMarkdown } from "@/lib/transcripts";

/** Fully static: rendered once at build time (SSG). */
export const dynamic = "force-static";

/**
 * Only episodes that actually have a transcript get a route. An episode without
 * one is not a 404 waiting to be filled — it simply has no transcript surface,
 * and nothing links to it (`AgentItem.alternates.transcript` is absent too).
 */
export function generateStaticParams() {
  return getAllEpisodes()
    .filter((e) => getTranscriptBySlug(e.slug))
    .map((e) => ({ slug: e.slug }));
}

/**
 * The full verbatim transcript as Markdown, for retrieval without page chrome.
 *
 * This is the only surface that carries a transcript whole: the `/md` mirror and
 * the OKF document open with an excerpt and link here, because inlining ~40
 * minutes of speech into every catalogue surface would make them unusable.
 *
 * Deliberately `noindex` like the other mirrors — the canonical, indexable copy
 * is the transcript rendered on the episode page itself.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const ep = getEpisodeBySlug(slug);
  const transcript = ep ? getTranscriptBySlug(slug) : undefined;
  if (!ep || !transcript) return new Response("Not found", { status: 404 });

  return new Response(toTranscriptMarkdown({ title: ep.title, slug, transcript }), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Robots-Tag": "noindex",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
