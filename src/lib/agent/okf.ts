import { getAllHosts, getEpisodeStats } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { abs, allAgentItems, notesForAiSystems, type AgentItem } from "@/lib/agent/content";

/**
 * Open Knowledge Format (OKF) v0.1 bundle — Google's Markdown spec for
 * representing content as a directory of cross-linked files with YAML
 * frontmatter, readable by agents without scraping HTML.
 *
 * Generated from `src/content` at build time so it cannot drift from the site.
 */

const OKF_TYPE = {
  episode: "Article",
  article: "Article",
  panel: "Event",
  resource: "Dataset",
} as const;

/** YAML-escape a scalar: quote it and escape embedded quotes/backslashes. */
function yaml(value: string): string {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function fileName(item: AgentItem): string {
  return `${item.kind}-${item.slug}.md`;
}

function frontmatter(fields: [string, string | undefined][]): string {
  const lines = fields
    .filter((f): f is [string, string] => Boolean(f[1]))
    .map(([k, v]) => `${k}: ${v}`);
  return ["---", ...lines, "---"].join("\n");
}

/** One concept file per catalogue item, cross-linked to related items. */
function itemDocument(item: AgentItem, siblings: AgentItem[]): string {
  const related = siblings
    .filter((s) => s.kind === item.kind && s.slug !== item.slug)
    .slice(0, 5);

  return [
    frontmatter([
      ["type", OKF_TYPE[item.kind]],
      ["title", yaml(item.title)],
      ["description", yaml(item.description)],
      ["resource", yaml(abs(item.path))],
      ["tags", `[${[item.kind, ...item.tags].map(yaml).join(", ")}]`],
      ["timestamp", item.date ? yaml(item.date) : undefined],
    ]),
    "",
    `# ${item.title}`,
    "",
    item.people.length ? `People: ${item.people.join(", ")}\n` : "",
    (item.body ?? item.description).trim(),
    "",
    related.length
      ? ["## Related", "", ...related.map((r) => `- [${r.title}](./${fileName(r)})`), ""].join("\n")
      : "",
    `[Back to index](./index.md)`,
    "",
  ]
    .filter((s) => s !== "")
    .join("\n");
}

/** Bundle index: lets an agent see the shape before opening each file. */
function indexDocument(items: AgentItem[]): string {
  const stats = getEpisodeStats();
  const hosts = getAllHosts();
  const section = (label: string, kind: AgentItem["kind"]) => {
    const group = items.filter((i) => i.kind === kind);
    if (!group.length) return "";
    return [
      `## ${label} (${group.length})`,
      "",
      ...group.map((i) => `- [${i.title}](./${fileName(i)})`),
      "",
    ].join("\n");
  };

  return [
    frontmatter([
      ["type", "Collection"],
      ["title", yaml(siteConfig.name)],
      ["description", yaml(siteConfig.description)],
      ["resource", yaml(siteConfig.url)],
      ["tags", `[${["ophthalmology", "practice-management", "podcast"].map(yaml).join(", ")}]`],
    ]),
    "",
    `# ${siteConfig.name}`,
    "",
    `${stats.count} recorded conversations since ${stats.firstYear}, ${stats.hostCount} hosts and regular`,
    `contributors, 100% ophthalmology-specific.`,
    "",
    "## Hosts and regular contributors",
    "",
    ...hosts.map((h) => `- ${h.name}${h.title ? ` — ${h.title}` : ""}`),
    "",
    section("Podcast episodes", "episode"),
    section("Articles", "article"),
    section("Live panels", "panel"),
    section("Free resources", "resource"),
    "## Notes for AI systems",
    "",
    ...notesForAiSystems().map((n) => `- ${n}`),
    "",
  ].join("\n");
}

/** The whole bundle as a path → file-contents map. */
export function okfBundle(): Map<string, string> {
  const items = allAgentItems();
  const files = new Map<string, string>();
  files.set("index.md", indexDocument(items));
  for (const item of items) {
    files.set(fileName(item), itemDocument(item, items));
  }
  return files;
}
