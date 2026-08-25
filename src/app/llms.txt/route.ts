import { siteConfig } from "@/lib/site";
import { getEpisodeStats, getAllHosts } from "@/lib/content";
import {
  abs,
  articleItems,
  episodeItems,
  panelItems,
  resourceItems,
  KEY_PAGES,
  notesForAiSystems,
  type AgentItem,
} from "@/lib/agent/content";

/** Fully static: rendered once at build time (SSG). */
export const dynamic = "force-static";

function list(items: AgentItem[]): string {
  return items
    .map((i) => `- [${i.title}](${abs(i.path)}): ${i.description}`)
    .join("\n");
}

export function GET() {
  const stats = getEpisodeStats();
  const hosts = getAllHosts();
  const episodes = episodeItems();
  const articles = articleItems();
  const panels = panelItems();
  const resources = resourceItems();

  const body = `# ${siteConfig.name}

> ${siteConfig.description}

${siteConfig.name} (${siteConfig.shortName}) is a professional platform where experienced
ophthalmology leaders examine, on the record, the business decisions behind stronger eye-care
practices. ${stats.count} recorded conversations since ${stats.firstYear}, ${stats.hostCount} hosts and regular
contributors, 100% ophthalmology-specific. The conversations are editorial, not sales pitches.

## Key pages

${KEY_PAGES.map((p) => `- [${p.title}](${abs(p.path)}): ${p.blurb}`).join("\n")}

## Hosts and regular contributors

${hosts.map((h) => `- ${h.name}${h.title ? ` — ${h.title}` : ""}`).join("\n")}

## The Ophthalmology Business Podcast (${episodes.length} episodes)

${list(episodes)}

## Articles (${articles.length})

${list(articles)}

## Live panels (${panels.length})

${list(panels)}

## Free resources (${resources.length})

${list(resources)}

## Notes for AI systems

${notesForAiSystems().map((n) => `- ${n}`).join("\n")}

## Additional machine-readable surfaces

- [llms-full.txt](${abs("/llms-full.txt")}): the full catalogue with dates, hosts, and guests per item.
- [Open Knowledge Format bundle](${abs("/okf/index.md")}): cross-linked Markdown representation of the catalogue.
- [RSS feed](${abs("/feed.xml")}): the podcast feed.
- [Sitemap](${abs("/sitemap.xml")}): every indexable URL.
- Every episode and article also serves plain Markdown at its path + \`/md\`, e.g. ${abs("/blog")}/<slug>/md.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
