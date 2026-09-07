import { z } from "zod";

/** Shared frontmatter → validated content types. Bodies (show notes, articles) are Markdown. */

export const episodeSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  episodeNumber: z.number().int().positive().optional(),
  publishedAt: z.string(), // ISO date
  updatedAt: z.string().optional(),
  excerpt: z.string().default(""),
  /** Optional hand-written meta description. Overrides the derived one. */
  seoDescription: z.string().optional(),
  durationSec: z.number().int().positive().optional(),
  /**
   * Size of the MP3 in bytes, for <enclosure length>. Apple and Spotify both
   * want it, and a wrong value is worse than none — so it is only ever written
   * by the publish pipeline from the file it actually downloaded, never guessed.
   */
  audioBytes: z.number().int().positive().optional(),
  libsynId: z.string().optional(),
  audioUrl: z.string().url().optional(),
  guests: z.array(z.string()).default([]),
  hostSlugs: z.array(z.string()).default([]),
  image: z.string().optional(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  sourceUrl: z.string().url().optional(),
});

export const blogPostSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  publishedAt: z.string(),
  updatedAt: z.string().optional(),
  excerpt: z.string().default(""),
  /** Optional hand-written meta description. Overrides the derived one. */
  seoDescription: z.string().optional(),
  author: z.string().default("Ophthalmology Business Academy"),
  authorSlug: z.string().optional(),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).default([]),
  readingTimeMin: z.number().optional(),
  sourceUrl: z.string().url().optional(),
});

export const hostSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  title: z.string().default(""),
  bio: z.string().default(""),
  avatar: z.string().optional(),
  socials: z
    .object({
      linkedin: z.string().url().optional(),
      x: z.string().url().optional(),
      website: z.string().url().optional(),
    })
    .default({}),
});

/**
 * A listener or contributor testimonial.
 *
 * `placeholder` marks an entry as scaffolding rather than a real review. The
 * page renders those with a visible notice, so unreplaced copy can never pass
 * itself off as genuine proof — testimonials are the one content type where a
 * convincing stand-in is worse than an empty section.
 */
export const reviewSchema = z.object({
  slug: z.string().min(1),
  quote: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
  practice: z.string().optional(),
  featured: z.boolean().default(false),
  placeholder: z.boolean().default(false),
});

export const freeResourceCategorySchema = z.enum(["guide", "template", "checklist"]);

export const freeResourceSchema = z.object({
  slug: z.string().min(1),
  category: freeResourceCategorySchema,
  title: z.string().min(1),
  description: z.string().min(1),
  author: z.string().min(1),
  tags: z.array(z.string()).default([]),
  pdfUrl: z.string().min(1),
  image: z.string().optional(),
});

/**
 * A person on a panel. `name` is the only required field — everything else is
 * an optional line the page simply omits.
 *
 * There is no `image`: panelists resolve to a headshot by name out of
 * `public/images/headshots/` via `headshotFor()`, the same join the episode
 * portraits use, so a filename and a monogram can never disagree about a
 * person. Drop `first-last.jpg` in that directory and the card fills itself.
 */
export const eventPanelistSchema = z.object({
  name: z.string().min(1),
  /** Job title, e.g. "Founder & Chief Commercial Officer". */
  role: z.string().optional(),
  /** Company or organization, printed after the role on a middot. */
  org: z.string().optional(),
  bio: z.string().optional(),
});

/**
 * A scheduled panel.
 *
 * Everything past `image` is the **landing-page layer**: optional fields that
 * each switch on one section of `/resources/events/[slug]`. An event with only
 * the base fields renders the short honest page it always did; an event that
 * carries the full set renders the complete template. Nothing is invented to
 * fill a gap — a section with no data does not render at all.
 */
export const eventSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  /** ISO date, e.g. "2026-09-17". Drives the visible date and the sort order. */
  startDate: z.string(),
  endDate: z.string().optional(),
  location: z.string().optional(),
  isVirtual: z.boolean().default(false),
  /** Off-site registration. Swap this per event; the page never posts a form. */
  registrationUrl: z.string().optional(),
  excerpt: z.string().default(""),
  image: z.string().optional(),

  /* ----------------------- landing-page layer ----------------------- */

  /**
   * Exact start instant with a UTC offset, e.g. "2026-09-17T16:00:00Z".
   * Required for the countdown and for a precise `startDate` in the JSON-LD;
   * without it the page falls back to the date alone and shows no countdown,
   * because a countdown to an unknown hour would be a guess.
   */
  startDateTime: z.string().optional(),
  /** Human-readable clock time including the zone, e.g. "12:00 PM EDT". */
  startTime: z.string().optional(),
  /** Short format line for the meta row, e.g. "Live panel + Q&A". */
  format: z.string().optional(),
  /** Hero lede. Falls back to the shared series lede when absent. */
  lede: z.string().optional(),
  /** Heading for the about section, e.g. "Turn OD relationships into volume". */
  aboutTitle: z.string().optional(),
  /** About-section body, one string per paragraph. */
  about: z.array(z.string()).default([]),
  /**
   * "What we'll cover" — one sentence per topic, numbered on the page.
   * Deliberately plain strings: a title/body pair invites an invented headline
   * over copy that already reads as a complete thought.
   */
  topics: z.array(z.string()).default([]),
  /** "This panel is for you if…" qualifiers, one per line. */
  audience: z.array(z.string()).default([]),
  panelists: z.array(eventPanelistSchema).default([]),
  /** Fine print under the registration CTA, e.g. "Replay sent to registrants". */
  registrationNote: z.string().optional(),
});

/**
 * One turn in a transcript.
 *
 * `startSec`/`endSec` are optional because transcripts are authored by hand in
 * the episode sheet, and a pasted transcript may carry timestamps or not. The
 * panel renders the timestamp only where one exists rather than printing a
 * misleading 0:00 for every turn.
 */
export const transcriptSegmentSchema = z.object({
  startSec: z.number().nonnegative().optional(),
  endSec: z.number().nonnegative().optional(),
  speaker: z.string().min(1),
  text: z.string().min(1),
});

export const transcriptSpeakerSchema = z.object({
  id: z.string().min(1),
  name: z.string().optional(),
});

export const transcriptSchema = z.object({
  slug: z.string().min(1),
  status: z.enum(["machine", "reviewed"]),
  language: z.string().default("en"),
  model: z.string().optional(),
  generatedAt: z.string(),
  audioUrl: z.string().url().optional(),
  speakers: z.array(transcriptSpeakerSchema).default([]),
  segments: z.array(transcriptSegmentSchema),
});

export type EpisodeMeta = z.infer<typeof episodeSchema>;
export type BlogPostMeta = z.infer<typeof blogPostSchema>;
export type Host = z.infer<typeof hostSchema>;
export type Event = z.infer<typeof eventSchema>;
export type EventPanelist = z.infer<typeof eventPanelistSchema>;
export type FreeResourceCategory = z.infer<typeof freeResourceCategorySchema>;
export type FreeResource = z.infer<typeof freeResourceSchema>;
export type Review = z.infer<typeof reviewSchema>;
export type Transcript = z.infer<typeof transcriptSchema>;
export type TranscriptSegment = z.infer<typeof transcriptSegmentSchema>;

/** A content record combines validated frontmatter with the raw Markdown body. */
export type Episode = EpisodeMeta & { body: string };
export type BlogPost = BlogPostMeta & { body: string };
