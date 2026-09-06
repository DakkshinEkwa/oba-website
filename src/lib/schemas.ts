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

export const eventSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  startDate: z.string(),
  endDate: z.string().optional(),
  location: z.string().optional(),
  isVirtual: z.boolean().default(false),
  registrationUrl: z.string().optional(),
  excerpt: z.string().default(""),
  image: z.string().optional(),
});

export const transcriptSegmentSchema = z.object({
  startSec: z.number().nonnegative(),
  endSec: z.number().nonnegative(),
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
export type FreeResourceCategory = z.infer<typeof freeResourceCategorySchema>;
export type FreeResource = z.infer<typeof freeResourceSchema>;
export type Review = z.infer<typeof reviewSchema>;
export type Transcript = z.infer<typeof transcriptSchema>;
export type TranscriptSegment = z.infer<typeof transcriptSegmentSchema>;

/** A content record combines validated frontmatter with the raw Markdown body. */
export type Episode = EpisodeMeta & { body: string };
export type BlogPost = BlogPostMeta & { body: string };
