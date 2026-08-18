import { z } from "zod";

/** Shared frontmatter → validated content types. Bodies (show notes, articles) are Markdown. */

export const episodeSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  episodeNumber: z.number().int().positive().optional(),
  publishedAt: z.string(), // ISO date
  excerpt: z.string().default(""),
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

export const webinarSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  date: z.string().optional(),
  presenters: z.array(z.string()).default([]),
  excerpt: z.string().default(""),
  thumbnail: z.string().optional(),
  replayUrl: z.string().optional(),
  embedUrl: z.string().optional(),
  isReplayAvailable: z.boolean().default(true),
  sourceUrl: z.string().url().optional(),
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

export type EpisodeMeta = z.infer<typeof episodeSchema>;
export type BlogPostMeta = z.infer<typeof blogPostSchema>;
export type Host = z.infer<typeof hostSchema>;
export type Webinar = z.infer<typeof webinarSchema>;
export type Event = z.infer<typeof eventSchema>;

/** A content record combines validated frontmatter with the raw Markdown body. */
export type Episode = EpisodeMeta & { body: string };
export type BlogPost = BlogPostMeta & { body: string };
