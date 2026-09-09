import {
  getAllEpisodes,
  getAllBlogPosts,
  getAllEvents,
  getAllFreeResources,
  getAllHosts,
  getEpisodeStats,
  getTranscriptBySlug,
} from "@/lib/content";
import { metaDescription } from "@/lib/utils";
import type { Event } from "@/lib/schemas";
import { siteConfig } from "@/lib/site";

/**
 * Shared serialization of the site's content for machine consumers:
 * llms.txt, llms-full.txt, the per-item Markdown mirrors, and the OKF bundle.
 *
 * Everything here is derived from `src/content` at build time, so these
 * surfaces can never drift from the pages they describe.
 */

/**
 * The shape every machine surface is built from. Crawlers cache and diff these
 * files, so this is a public contract: **extend it, never reshape it.** Every
 * field added since v1 is optional for that reason.
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
  /** Episodes: the direct MP3, so an agent has an audio pointer without the RSS feed. */
  audioUrl?: string;
  durationSec?: number;
  episodeNumber?: number;
  /**
   * Full transcript text, when one has been generated. Read lazily — a 40-minute
   * episode is far longer than the show notes, so surfaces that list the whole
   * catalogue link to it rather than inlining it.
   */
  transcript?: string;
  /** Alternate representations of this item, as site-absolute paths. */
  alternates?: { markdown?: string; transcript?: string };
  /** Direct download, for items that are a file rather than a page. */
  fileUrl?: string;
};

export const abs = (path: string) => `${siteConfig.url}${path}`;

/**
 * Transcript text as one plain-text block, speaker-labelled, timestamps dropped.
 *
 * Memoized because a full transcript is tens of KB and `episodeItems()` is
 * rebuilt by every agent surface — including once per generated `/md` file — so
 * an unmemoized join would rebuild the entire catalogue's transcripts hundreds
 * of times during a build.
 */
const _transcriptText = new Map<string, string | undefined>();

function transcriptText(slug: string): string | undefined {
  if (_transcriptText.has(slug)) return _transcriptText.get(slug);
  const t = getTranscriptBySlug(slug);
  const text = t?.segments.length
    ? t.segments
        .map((seg) => `${t.speakers.find((s) => s.id === seg.speaker)?.name ?? seg.speaker}: ${seg.text.trim()}`)
        .join("\n")
    : undefined;
  _transcriptText.set(slug, text);
  return text;
}

/**
 * A panel's body, assembled from the landing-page fields the event already
 * carries. Six of seven events have none of them, and those keep the single
 * templated sentence rather than gaining invented copy.
 */
function panelBody(event: Event): string | undefined {
  const sections = [
    event.lede,
    event.about.length ? event.about.join("\n\n") : undefined,
    event.topics.length
      ? ["What this panel covers:", ...event.topics.map((t) => `- ${t}`)].join("\n")
      : undefined,
    event.audience.length
      ? ["Who it is for:", ...event.audience.map((a) => `- ${a}`)].join("\n")
      : undefined,
    event.panelists.length
      ? [
          "Panelists:",
          ...event.panelists.map((p) =>
            `- ${p.name}${p.role ? ` — ${p.role}` : ""}${p.org ? `, ${p.org}` : ""}`,
          ),
        ].join("\n")
      : undefined,
  ].filter((s): s is string => Boolean(s));
  return sections.length ? sections.join("\n\n") : undefined;
}

export function episodeItems(): AgentItem[] {
  const hosts = getAllHosts();
  const hostName = (slug: string) => hosts.find((h) => h.slug === slug)?.name;
  return getAllEpisodes().map((ep) => {
    const transcript = transcriptText(ep.slug);
    return {
    kind: "episode" as const,
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
    audioUrl: ep.audioUrl,
    durationSec: ep.durationSec,
    episodeNumber: ep.episodeNumber,
    transcript,
    alternates: {
      markdown: `/podcast/episodes/${ep.slug}/md`,
      ...(transcript ? { transcript: `/podcast/episodes/${ep.slug}/transcript.md` } : {}),
    },
    };
  });
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
    alternates: { markdown: `/blog/${post.slug}/md` },
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
    people: event.panelists.map((p) => p.name),
    tags: event.topics,
    body: panelBody(event),
  }));
}

export function resourceItems(): AgentItem[] {
  return getAllFreeResources().map((r) => ({
    kind: "resource",
    slug: r.slug,
    title: r.title,
    description: r.description,
    // Free resources have no detail page, so the fragment is what makes each one
    // individually addressable. Without it all three shared a single URL and were
    // indistinguishable to anything reading llms.txt or the OKF bundle.
    path: `/resources/free-resources#${r.slug}`,
    people: [r.author],
    tags: r.tags,
    fileUrl: r.pdfUrl,
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
    item.episodeNumber ? `- Episode: ${item.episodeNumber}` : null,
    item.audioUrl ? `- Audio: ${item.audioUrl}` : null,
    item.fileUrl ? `- Download: ${abs(item.fileUrl)}` : null,
    item.alternates?.transcript
      ? `- Full transcript: ${abs(item.alternates.transcript)}`
      : null,
    `- Canonical URL: ${abs(item.path)}`,
    `- Source: ${siteConfig.name}`,
  ].filter((l): l is string => l !== null);

  /**
   * Show notes are a teaser — the median episode body is ~250 words, while the
   * conversation itself runs ~40 minutes. Where a transcript exists we open it
   * here so this document carries real substance, and link the rest rather than
   * inlining tens of thousands of words into every mirror.
   */
  const excerpt =
    item.transcript && item.transcript.length > TRANSCRIPT_EXCERPT_CHARS
      ? `${item.transcript.slice(0, TRANSCRIPT_EXCERPT_CHARS).trimEnd()}…`
      : item.transcript;

  return [
    `# ${item.title}`,
    "",
    ...meta,
    "",
    "---",
    "",
    (item.body ?? item.description).trim(),
    ...(excerpt
      ? [
          "",
          "## Transcript",
          "",
          item.alternates?.transcript && excerpt !== item.transcript
            ? `Opening of the conversation. Full transcript: ${abs(item.alternates.transcript)}`
            : "Full transcript.",
          "",
          excerpt,
        ]
      : []),
    "",
  ].join("\n");
}

/** How much of a transcript a per-item mirror carries before linking the rest. */
const TRANSCRIPT_EXCERPT_CHARS = 4000;
