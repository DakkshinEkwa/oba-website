import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { personSlug } from "@/lib/utils";
import {
  episodeSchema,
  blogPostSchema,
  hostSchema,
  eventSchema,
  freeResourceSchema,
  reviewSchema,
  transcriptSchema,
  type Episode,
  type BlogPost,
  type Host,
  type Event,
  type FreeResource,
  type Review,
  type Transcript,
} from "@/lib/schemas";

const CONTENT_DIR = path.join(process.cwd(), "src", "content");
const HEADSHOT_DIR = path.join(process.cwd(), "public", "images", "headshots");

let _headshots: Set<string> | null = null;

/**
 * The headshot filenames on disk. Memoized for the life of the process, which
 * is what `next build` wants — the directory is read once for 75 episode pages
 * plus the speaker index.
 *
 * In dev the cache is skipped, because adding a file under public/ touches
 * nothing in the module graph: HMR never invalidates this, so a memoized set
 * would keep showing a monogram for a headshot that is sitting right there
 * until the server is restarted.
 */
function headshotFiles(): Set<string> {
  if (_headshots && process.env.NODE_ENV === "production") return _headshots;
  const files = new Set<string>();
  if (fs.existsSync(HEADSHOT_DIR)) {
    for (const file of fs.readdirSync(HEADSHOT_DIR)) {
      if (file.endsWith(".jpg")) files.add(file.slice(0, -4));
    }
  }
  _headshots = files;
  return files;
}

/**
 * Guests the catalog credits under a name no filename can be derived from.
 * Mapped by hand rather than fuzzy-matched: putting the wrong face on a named
 * person is worse than showing a monogram.
 */
const HEADSHOT_ALIASES: Record<string, string> = {
  "alexa-montesino": "alexa-montesinos",
  // The catalog credits this guest only as "Dr. Melendez".
  melendez: "robert-melendez",
};

/**
 * Resolve a person to a headshot by name (guidelines ch.6: resolution order is
 * name, then headshots/). Guests are free-text names in episode frontmatter
 * with no image field, so the filename *is* the join key — which is exactly why
 * the naming rule (lowercase, dash-separated, first-last.jpg) is a rule.
 *
 * Matching is exact on the slug, never fuzzy: a near-miss would put the wrong
 * face on a named person, which is far worse than no face at all. A miss
 * returns undefined and the monogram tile stands in — a designed state, not an
 * error state.
 */
export function headshotFor(name: string): string | undefined {
  const slug = personSlug(name);
  const file = HEADSHOT_ALIASES[slug] ?? slug;
  return file && headshotFiles().has(file) ? `/images/headshots/${file}.jpg` : undefined;
}

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

/** Build-time catalog stats backing the sanctioned proof-by-numbers row. */
export function getEpisodeStats() {
  const all = getAllEpisodes();
  const years = all.map((e) => new Date(e.publishedAt).getUTCFullYear());
  return {
    count: all.length,
    firstYear: years.length ? String(Math.min(...years)) : "",
    latestYear: years.length ? String(Math.max(...years)) : "",
    hostCount: getAllHosts().length,
  };
}

/**
 * Speakers, derived from the episode catalog rather than a file of their own:
 * a guest exists because they appear in an episode's `guests`, so the list can
 * never drift from the recordings. Guests we have a headshot for come first —
 * the grid reads as portraits rather than a run of monograms — and within each
 * group the order is appearances, then alphabetical.
 *
 * The catalog holds no guest titles or bios, so a speaker is a name, an episode
 * list, and — for those we have a headshot for — an `image`.
 */
export type Speaker = {
  name: string;
  episodes: { slug: string; title: string; publishedAt: string; episodeNumber?: number }[];
  /** `/images/headshots/<file>.jpg`, when a headshot exists for this guest. */
  image?: string;
};

/**
 * The guests held to the opening of the speaker grid, in this order. The grid
 * is 3-up at `lg`, so these fill the first two rows; below that it reflows to
 * 2-up and 1-up and "row" stops meaning anything.
 *
 * Matched on `personSlug`, not the raw string, so a credit that gains or loses
 * an honorific ("Dr. Emilio Justo" / "Emilio Justo") keeps its place instead of
 * silently falling back into the default order.
 *
 * Everyone else keeps that default order: headshot first, then most
 * appearances, then alphabetical.
 */
const FEATURED_SPEAKERS = [
  "Naren Arulrajah",
  "Jane Shuman",
  "Dr. Emilio Justo",
  "Tony Burns",
  "Mike Guelcher",
  "Dr. Shehzad Batliwala",
].map((name) => personSlug(name));

function featuredRank(name: string): number {
  const i = FEATURED_SPEAKERS.indexOf(personSlug(name));
  return i === -1 ? Number.MAX_SAFE_INTEGER : i;
}

export function getAllSpeakers(): Speaker[] {
  const byName = new Map<string, Speaker>();
  for (const episode of getAllEpisodes()) {
    for (const raw of episode.guests) {
      const name = raw.trim();
      if (!name) continue;
      const entry = byName.get(name) ?? { name, episodes: [] };
      entry.episodes.push({
        slug: episode.slug,
        title: episode.title,
        publishedAt: episode.publishedAt,
        episodeNumber: episode.episodeNumber,
      });
      byName.set(name, entry);
    }
  }
  return [...byName.values()]
    .map((speaker) => {
      const image = headshotFor(speaker.name);
      return image ? { ...speaker, image } : speaker;
    })
    .sort((a, b) => {
      // Unfeatured speakers all share one rank, so they fall through to the
      // default comparators rather than to Infinity - Infinity.
      const ra = featuredRank(a.name);
      const rb = featuredRank(b.name);
      return (
        ra - rb ||
        Number(Boolean(b.image)) - Number(Boolean(a.image)) ||
        b.episodes.length - a.episodes.length ||
        a.name.localeCompare(b.name)
      );
    });
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

/* ------------------------------- Events ---------------------------------- */

export function getAllEvents(): Event[] {
  const json = readJson<unknown[]>("events.json", []);
  return json.map((e) => eventSchema.parse(e)).sort((a, b) => byDateDesc(b.startDate, a.startDate));
}

export function getEventBySlug(slug: string): Event | undefined {
  return getAllEvents().find((e) => e.slug === slug);
}

/* --------------------------- Free Resources ------------------------------ */

export function getAllFreeResources(): FreeResource[] {
  const json = readJson<unknown[]>("free-resources.json", []);
  return json.map((r) => freeResourceSchema.parse(r));
}

/* ------------------------------- Reviews --------------------------------- */

export function getAllReviews(): Review[] {
  const json = readJson<unknown[]>("reviews.json", []);
  return json.map((r) => reviewSchema.parse(r));
}

let _transcripts: Map<string, Transcript> | null = null;

export function getTranscriptBySlug(slug: string): Transcript | undefined {
  if (_transcripts) return _transcripts.get(slug);
  const dir = path.join(CONTENT_DIR, "transcripts");
  _transcripts = new Map();
  if (!fs.existsSync(dir)) return undefined;
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".json")) continue;
    const raw = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8")) as unknown;
    const transcript = transcriptSchema.parse(raw);
    _transcripts.set(transcript.slug, transcript);
  }
  return _transcripts.get(slug);
}
