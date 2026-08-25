import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Register our custom type-scale utilities so tailwind-merge treats them as
// font-sizes (not as conflicting with text-<color> utilities like text-ink-900).
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["display", "h1", "h2", "h3", "lede", "body-lg", "body", "small", "eyebrow"] },
      ],
    },
  },
});

/** Merge conditional class names, de-duplicating conflicting Tailwind utilities. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const EVENT_PLACEHOLDER_IMAGE = "/images/events/building-od-partnerships.webp";

export function eventImage(image?: string): string {
  return image ?? EVENT_PLACEHOLDER_IMAGE;
}

export const FREE_RESOURCE_PLACEHOLDER_IMAGE = "/images/free-resources/website-impact.webp";

export function resourceImage(image?: string): string {
  return image ?? FREE_RESOURCE_PLACEHOLDER_IMAGE;
}

/** Format an ISO date string as e.g. "July 11, 2026". */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Format a duration in seconds as "1h 04m" / "42m 10s". */
export function formatDuration(seconds?: number): string | null {
  if (!seconds || seconds <= 0) return null;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

/** Format a duration in seconds as an ISO 8601 duration ("PT34M12S") for schema.org. */
export function isoDuration(seconds?: number): string | null {
  if (!seconds || seconds <= 0) return null;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `PT${h > 0 ? `${h}H` : ""}${m > 0 ? `${m}M` : ""}${s > 0 ? `${s}S` : ""}`;
}

const META_DESCRIPTION_MAX = 155;

/**
 * Build a meta description for a piece of content.
 *
 * The scraped `excerpt` fields are WordPress teasers that end mid-sentence in
 * "…" or "[…]", which reads badly in a SERP snippet. Prefer, in order:
 *   1. a hand-written `seoDescription`
 *   2. whole sentences taken from the top of the body
 *   3. the excerpt, with its truncation marker cleaned up
 *
 * The visible `excerpt` shown on cards is never modified.
 */
export function metaDescription(item: {
  seoDescription?: string;
  excerpt?: string;
  body?: string;
}): string {
  const manual = item.seoDescription?.trim();
  if (manual) return manual;

  const derived = deriveDescription(item.body);
  if (derived) return derived;

  return stripTruncation(item.excerpt ?? "");
}

/** Drop a trailing "…" / "[…]" / "..." and any dangling punctuation. */
function stripTruncation(text: string): string {
  return text
    .replace(/\s*(\[\s*(\u2026|\.\.\.)\s*\]|\u2026|\.\.\.)\s*$/, "")
    .replace(/[\s,;:\u2013\u2014-]+$/, "")
    .trim();
}

/**
 * Titles and abbreviations whose trailing period is not a sentence boundary.
 * Without these, "In this episode, Dr. Smith explains..." truncates at "Dr.".
 */
const ABBREVIATIONS = [
  "Dr", "Drs", "Mr", "Mrs", "Ms", "Prof", "Sr", "Jr", "St",
  "Inc", "Ltd", "LLC", "Co", "vs", "etc", "eg", "ie", "approx",
  "Ph", "MD", "OD", "DO", "MBA", "COE", "COA", "No", "Fig",
];
const ABBREV_RE = new RegExp(`\\b(${ABBREVIATIONS.join("|")})\\.`, "gi");
const DOT = "\u0000";

/** Take whole sentences from the start of a Markdown body, up to ~155 chars. */
function deriveDescription(body?: string): string | null {
  if (!body) return null;

  // First real prose paragraph: skip headings, images, blockquotes and lists.
  const paragraph = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .find((p) => p.length > 0 && !/^[#>\-*\d!|]/.test(p));
  if (!paragraph) return null;

  // Flatten inline Markdown so links and emphasis don't leak into the tag.
  const plain = paragraph
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!plain) return null;

  // Mask abbreviation periods so they don't read as sentence boundaries.
  const masked = plain.replace(ABBREV_RE, (m) => m.slice(0, -1) + DOT);
  const unmask = (t: string) => t.split(DOT).join(".").trim();

  const sentences = masked.match(/[^.!?]+[.!?]+(?=\s|$)/g)?.map(unmask) ?? [];

  // Greedily take whole sentences while they fit.
  let out = "";
  for (const sentence of sentences) {
    const next = (out ? `${out} ` : "") + sentence;
    if (next.length > META_DESCRIPTION_MAX) break;
    out = next;
  }
  if (out.length >= 60) return out;

  // Nothing fit (or only a stub did): prefer the first whole sentence, even a
  // slightly long one — a complete thought beats a clipped fragment.
  const first = sentences[0];
  if (first && first.length <= 200) return first;

  // Last resort: trim on a word boundary. This is the only path that ellipsizes.
  const source = unmask(masked);
  if (source.length <= META_DESCRIPTION_MAX) return stripTruncation(source);
  const cut = source.slice(0, META_DESCRIPTION_MAX);
  const lastSpace = cut.lastIndexOf(" ");
  return `${stripTruncation(lastSpace > 80 ? cut.slice(0, lastSpace) : cut)}\u2026`;
}

/** Split an array into pages of a given size. */
export function paginate<T>(items: T[], page: number, perPage: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    page: current,
    totalPages,
    total: items.length,
    hasPrev: current > 1,
    hasNext: current < totalPages,
  };
}
