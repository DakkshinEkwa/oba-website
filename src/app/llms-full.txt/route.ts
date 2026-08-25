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
 * Deliberately metadata-only rather than full bodies — the scraped episode
 * bodies are short teasers, so a roster of people and topics is the more
 * useful artefact for a retrieval system.
 */
export function GET() {
  const stats = getEpisodeStats();
  const items = allAgentItems();

  const entries = items
    .map((i) =>
      [
        `## ${i.title}`,
        ``,
        `- Type: ${KIND_LABEL[i.kind]}`,
        i.date ? `- Date: ${i.date}` : null,
        i.people.length ? `- People: ${i.people.join(", ")}` : null,
        i.tags.length ? `- Topics: ${i.tags.join(", ")}` : null,
        `- URL: ${abs(i.path)}`,
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
