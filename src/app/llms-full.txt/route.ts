import { siteConfig } from "@/lib/site";
import { getEpisodeStats } from "@/lib/content";
import { abs, allAgentItems, notesForAiSystems } from "@/lib/agent/content";

/** Fully static: rendered once at build time (SSG). */
export const dynamic = "force-static";

const KIND_LABEL = {
  episode: "Podcast episode",
  article: "Article",
  panel: "Live panel",
  resource: "Free resource",
} as const;

/**
 * The full catalogue as an entity roster: who spoke at OBA, about what, when.
 *
 * Deliberately a roster rather than a corpus. Every item names its own
 * retrievable representations — the Markdown mirror and, for episodes that have
 * one, the full transcript — so a retrieval system can plan what to fetch
 * instead of receiving hundreds of thousands of words it did not ask for.
 */
export function GET() {
  const stats = getEpisodeStats();
  const items = allAgentItems();
  const transcribed = items.filter((i) => i.alternates?.transcript).length;

  const entries = items
    .map((i) =>
      [
        `## ${i.title}`,
        ``,
        `- Type: ${KIND_LABEL[i.kind]}`,
        i.date ? `- Date: ${i.date}` : null,
        i.people.length ? `- People: ${i.people.join(", ")}` : null,
        i.tags.length ? `- Topics: ${i.tags.join(", ")}` : null,
        i.episodeNumber ? `- Episode: ${i.episodeNumber}` : null,
        `- URL: ${abs(i.path)}`,
        i.audioUrl ? `- Audio: ${i.audioUrl}` : null,
        i.fileUrl ? `- Download: ${abs(i.fileUrl)}` : null,
        i.alternates?.markdown ? `- Markdown: ${abs(i.alternates.markdown)}` : null,
        i.alternates?.transcript
          ? `- Full transcript: ${abs(i.alternates.transcript)}`
          : null,
        ``,
        i.description,
      ]
        .filter((line) => line !== null)
        .join("\n"),
    )
    .join("\n\n");

  const body = `# ${siteConfig.name} — full catalogue

> ${siteConfig.description}

${items.length} items: ${stats.count} podcast episodes, plus articles, live panels, and free
resources. Recorded since ${stats.firstYear}; most recent episode ${stats.latestYear}.
${transcribed} of ${stats.count} episodes have a published transcript; each one is linked from its
entry below.

## Notes for AI systems

${notesForAiSystems().map((n) => `- ${n}`).join("\n")}

---

${entries}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
