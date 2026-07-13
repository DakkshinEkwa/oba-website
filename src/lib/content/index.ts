import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  episodeSchema,
  blogPostSchema,
  hostSchema,
  webinarSchema,
  eventSchema,
  type Episode,
  type BlogPost,
  type Host,
  type Webinar,
  type Event,
} from "@/lib/schemas";

const CONTENT_DIR = path.join(process.cwd(), "src", "content");

function readCollection(dir: string): { data: Record<string, unknown>; body: string; file: string }[] {
  const full = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(full, file), "utf8");
      const { data, content } = matter(raw);
      return { data, body: content, file };
    });
}

function readJson<T>(file: string, fallback: T): T {
  const full = path.join(CONTENT_DIR, file);
  if (!fs.existsSync(full)) return fallback;
  return JSON.parse(fs.readFileSync(full, "utf8")) as T;
}

function byDateDesc(a: string, b: string) {
  return new Date(b).getTime() - new Date(a).getTime();
}

/* ------------------------------- Episodes ------------------------------- */

let _episodes: Episode[] | null = null;

export function getAllEpisodes(): Episode[] {
  if (_episodes) return _episodes;
  _episodes = readCollection("episodes")
    .map(({ data, body }) => ({ ...episodeSchema.parse(data), body }))
    .sort((a, b) => byDateDesc(a.publishedAt, b.publishedAt));
  return _episodes;
}

export function getEpisodeBySlug(slug: string): Episode | undefined {
  return getAllEpisodes().find((e) => e.slug === slug);
}

export function getFeaturedEpisode(): Episode | undefined {
  const all = getAllEpisodes();
  return all.find((e) => e.featured) ?? all[0];
}

export function getRelatedEpisodes(slug: string, count = 3): Episode[] {
  return getAllEpisodes()
    .filter((e) => e.slug !== slug)
    .slice(0, count);
}

/* ------------------------------- Blog ----------------------------------- */

let _posts: BlogPost[] | null = null;

export function getAllBlogPosts(): BlogPost[] {
  if (_posts) return _posts;
  _posts = readCollection("blog")
    .map(({ data, body }) => ({ ...blogPostSchema.parse(data), body }))
    .sort((a, b) => byDateDesc(a.publishedAt, b.publishedAt));
  return _posts;
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return getAllBlogPosts().find((p) => p.slug === slug);
}

/* ------------------------------- Hosts ---------------------------------- */

export function getAllHosts(): Host[] {
  const json = readJson<unknown[]>("hosts.json", []);
  return json.map((h) => hostSchema.parse(h));
}

export function getHostBySlug(slug: string): Host | undefined {
  return getAllHosts().find((h) => h.slug === slug);
}

/* ------------------------------- Webinars -------------------------------- */

export function getAllWebinars(): Webinar[] {
  return readCollection("webinars")
    .map(({ data }) => webinarSchema.parse(data))
    .sort((a, b) => byDateDesc(a.date ?? "", b.date ?? ""));
}

export function getWebinarBySlug(slug: string): Webinar | undefined {
  return getAllWebinars().find((w) => w.slug === slug);
}

/* ------------------------------- Events ---------------------------------- */

export function getAllEvents(): Event[] {
  const json = readJson<unknown[]>("events.json", []);
  return json.map((e) => eventSchema.parse(e)).sort((a, b) => byDateDesc(b.startDate, a.startDate));
}
