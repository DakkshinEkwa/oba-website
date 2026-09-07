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

  /**
   * Sections are `string | null`, and only `null` is dropped. An earlier version
   * filtered on `!== ""`, which also deleted every intended blank line — so all
   * 93 files shipped with the frontmatter, heading and body run together.
   */
  const sections: (string | null)[] = [
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
    // A markdown list, not a comma-join: names carry their own commas
    // ("Sarah Duval, COE, COA"), so a joined line cannot be split back apart.
    item.people.length
      ? ["## People", "", ...item.people.map((p) => `- ${p}`), ""].join("\n")
      : null,
    metaList(item),
    (item.body ?? item.description).trim(),
    "",
    related.length
      ? ["## Related", "", ...related.map((r) => `- [${r.title}](./${fileName(r)})`), ""].join("\n")
      : null,
    `[Back to index](./index.md)`,
    "",
  ];

  return sections.filter((s): s is string => s !== null).join("\n");
}

/**
 * Machine pointers an agent would otherwise have to guess: the audio file, the
 * plain-Markdown mirror, and the full transcript when one exists. Rendered as a
 * list so each is a separate, parseable line.
 */
function metaList(item: AgentItem): string | null {
  const lines = [
    item.audioUrl ? `- Audio: ${item.audioUrl}` : null,
    item.fileUrl ? `- Download: ${abs(item.fileUrl)}` : null,
    item.alternates?.markdown ? `- Markdown: ${abs(item.alternates.markdown)}` : null,
    item.alternates?.transcript
      ? `- Full transcript: ${abs(item.alternates.transcript)}`
      : null,
  ].filter((l): l is string => l !== null);
  return lines.length ? ["## Source", "", ...lines, ""].join("\n") : null;
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

/**
 * The whole bundle as a path → file-contents map.
 *
 * Memoized: the route calls this once per generated file, so without the cache a
 * build would re-serialize all 94 documents 94 times.
 */
let _bundle: Map<string, string> | null = null;

export function okfBundle(): Map<string, string> {
  if (_bundle) return _bundle;
  const items = allAgentItems();
  const files = new Map<string, string>();
  files.set("index.md", indexDocument(items));
  for (const item of items) {
    files.set(fileName(item), itemDocument(item, items));
  }
  _bundle = files;
  return files;
}
