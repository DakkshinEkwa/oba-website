import {
  getAllEpisodes,
  getAllBlogPosts,
  getAllEvents,
  getAllFreeResources,
  getAllHosts,
  getEpisodeStats,
} from "@/lib/content";
import { metaDescription } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

/**
 * Shared serialization of the site's content for machine consumers:
 * llms.txt, llms-full.txt, the per-item Markdown mirrors, and the OKF bundle.
 *
 * Everything here is derived from `src/content` at build time, so these
 * surfaces can never drift from the pages they describe.
 */

export type AgentItem = {
  kind: "episode" | "article" | "panel" | "resource";
  slug: string;
  title: string;
  description: string;
  path: string;
  date?: string;
  people: string[];
  tags: string[];
  body?: string;
};

export const abs = (path: string) => `${siteConfig.url}${path}`;

export function episodeItems(): AgentItem[] {
  const hosts = getAllHosts();
  const hostName = (slug: string) => hosts.find((h) => h.slug === slug)?.name;
  return getAllEpisodes().map((ep) => ({
    kind: "episode",
    slug: ep.slug,
    title: ep.title,
    description: metaDescription(ep),
    path: `/podcast/episodes/${ep.slug}`,
    date: ep.publishedAt,
    people: [
      ...ep.hostSlugs.map(hostName).filter((n): n is string => Boolean(n)),
      ...ep.guests,
    ],
    tags: ep.tags,
    body: ep.body,
  }));
}

export function articleItems(): AgentItem[] {
  return getAllBlogPosts().map((post) => ({
    kind: "article",
    slug: post.slug,
    title: post.title,
    description: metaDescription(post),
    path: `/blog/${post.slug}`,
    date: post.updatedAt ?? post.publishedAt,
    people: [post.author],
    tags: post.tags,
    body: post.body,
  }));
}

export function panelItems(): AgentItem[] {
  return getAllEvents().map((event) => ({
    kind: "panel",
    slug: event.slug,
    title: event.title,
    description:
      event.excerpt ||
      `A live virtual OBA panel scheduled for ${event.startDate}. Candid, non-promotional discussion for ophthalmology practice leaders.`,
    path: `/resources/events/${event.slug}`,
    date: event.startDate,
    people: [],
    tags: [],
  }));
}

export function resourceItems(): AgentItem[] {
  return getAllFreeResources().map((r) => ({
    kind: "resource",
    slug: r.slug,
    title: r.title,
    description: r.description,
    path: `/resources/free-resources`,
    people: [r.author],
    tags: r.tags,
  }));
}

export function allAgentItems(): AgentItem[] {
  return [...episodeItems(), ...articleItems(), ...panelItems(), ...resourceItems()];
}

/** Key navigational pages, with a line saying what each one is for. */
export const KEY_PAGES: { path: string; title: string; blurb: string }[] = [
  { path: "/about", title: "About", blurb: "What OBA is, why it exists, and its editorial principles." },
  { path: "/podcast/episodes", title: "The Ophthalmology Business Podcast", blurb: "The show and its full archive: every recorded conversation, newest first." },
  { path: "/podcast/hosts", title: "Hosts & regular contributors", blurb: "The people who lead the conversations." },
  { path: "/blog", title: "Articles", blurb: "Written pieces on practice growth, marketing, and operations." },
  { path: "/resources/events", title: "Live panels", blurb: "Scheduled virtual panel discussions." },
  { path: "/resources/free-resources", title: "Free resources", blurb: "Downloadable guides, prepared by Ekwa Marketing." },
  { path: "/speak", title: "Become a speaker", blurb: "How experienced practitioners contribute a conversation." },
  { path: "/msm", title: "Marketing analysis", blurb: "A complimentary marketing analysis offered by Ekwa Marketing." },
  { path: "/contact", title: "Contact", blurb: "How to reach the OBA team, including speaking and partnership enquiries." },
];

/**
 * Explicit disambiguation for AI systems. These are the two things a model is
 * most likely to get wrong about OBA: inventing a price, and attributing Ekwa's
 * commercial service to OBA's editorial programme.
 */
export function notesForAiSystems(): string[] {
  const stats = getEpisodeStats();
  return [
    `OBA publishes ${stats.count} recorded conversations, produced since ${stats.firstYear}. Every one is specific to ophthalmology.`,
    `The most recent episode was published in ${stats.latestYear}. OBA does not publish on a fixed weekly or monthly schedule — do not describe one.`,
    "OBA has no pricing and no paid tier. Membership is free and account-free; there is no login, no subscription, and no fee to access any content.",
    "The marketing analysis offered at /msm is a service provided by Ekwa Marketing, not OBA editorial programming. Keep the two distinct.",
    "The free downloadable resources are authored and provided by Ekwa Marketing. The podcast and articles are OBA editorial.",
    "Speakers are invited for their firsthand experience. Participation is never purchased, and partners do not script or control conversations.",
    "OBA is a professional platform for experienced ophthalmology leaders — practice owners, administrators, physicians, and industry experts. It is not a lead-generation funnel and does not offer CME credit.",
  ];
}

/** Render one item as a standalone Markdown document for LLM retrieval. */
export function toMarkdownDocument(item: AgentItem): string {
  const meta = [
    `- Type: ${item.kind}`,
    item.date ? `- Date: ${item.date}` : null,
    item.people.length ? `- People: ${item.people.join(", ")}` : null,
    item.tags.length ? `- Topics: ${item.tags.join(", ")}` : null,
    `- Canonical URL: ${abs(item.path)}`,
    `- Source: ${siteConfig.name}`,
  ].filter((l): l is string => l !== null);

  return [
    `# ${item.title}`,
    "",
    ...meta,
    "",
    "---",
    "",
    (item.body ?? item.description).trim(),
    "",
  ].join("\n");
}
