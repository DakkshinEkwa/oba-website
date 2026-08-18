import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const ROOT = process.cwd();
export const CACHE_DIR = path.join(ROOT, "scripts", "scrape", ".cache");
export const CONTENT_DIR = path.join(ROOT, "src", "content");
export const PUBLIC_DIR = path.join(ROOT, "public");
export const BASE = "https://www.obacademy.org";
export const UA = "Mozilla/5.0 (compatible; OBA-rebuild/1.0; +https://www.obacademy.org)";

export function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Fetch a URL as text, caching the raw response on disk to avoid re-hitting the live site. */
export async function fetchCached(url: string, { force = false } = {}): Promise<string> {
  ensureDir(CACHE_DIR);
  const key = crypto.createHash("sha1").update(url).digest("hex").slice(0, 16);
  const cacheFile = path.join(CACHE_DIR, `${key}.html`);
  if (!force && fs.existsSync(cacheFile)) {
    return fs.readFileSync(cacheFile, "utf8");
  }
  await sleep(400); // polite delay
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
  const text = await res.text();
  fs.writeFileSync(cacheFile, text);
  return text;
}

/** Download a binary asset to a destination path (skips if it already exists). */
export async function downloadAsset(url: string, destAbs: string): Promise<boolean> {
  if (fs.existsSync(destAbs)) return true;
  try {
    await sleep(200);
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) return false;
    const buf = Buffer.from(await res.arrayBuffer());
    ensureDir(path.dirname(destAbs));
    fs.writeFileSync(destAbs, buf);
    return true;
  } catch {
    return false;
  }
}

export function slugFromUrl(url: string): string {
  const clean = url.replace(/\/+$/, "");
  return clean.split("/").pop() ?? "";
}

/** Serialize frontmatter + body to an MDX file. */
export function writeMdx(destAbs: string, frontmatter: Record<string, unknown>, body: string) {
  ensureDir(path.dirname(destAbs));
  const lines: string[] = ["---"];
  for (const [k, v] of Object.entries(frontmatter)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) {
      if (v.length === 0) continue;
      lines.push(`${k}:`);
      for (const item of v) lines.push(`  - ${quote(String(item))}`);
    } else if (typeof v === "boolean" || typeof v === "number") {
      lines.push(`${k}: ${v}`);
    } else {
      lines.push(`${k}: ${quote(String(v))}`);
    }
  }
  lines.push("---", "", body.trim(), "");
  fs.writeFileSync(destAbs, lines.join("\n"));
}

function quote(s: string): string {
  return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

export function decodeEntities(s: string): string {
  return s
    .replace(/&#8217;|&#039;|&#39;/g, "’")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#8230;|&hellip;/g, "…")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#([0-9]+);/g, (_, n) => String.fromCharCode(Number(n)))
    .trim();
}

const CONTACT_LABELS = [
  "Email", "Phone", "Mobile Number", "Direct Line", "Cell", "Fax",
  "Website", "Practice website", "Instagram", "Intergram", "Threads",
  "YouTube", "iDocSocial", "IOR Partners",
];
const CONTACT_LABEL_RE = CONTACT_LABELS.map((l) =>
  l.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
).join("|");
const SPLIT_RE = new RegExp(`(?=(?:${CONTACT_LABEL_RE})\\s*:)`, "g");
// Fresh regexes per use — a shared /g regex carries lastIndex state across
// .test()/.matchAll() calls and intermittently misses lines.
const URL_SRC = "(?:https?:\\/\\/)?(?:www\\.)?linkedin\\.com\\/(?:in|company)\\/[a-z0-9\\-_.]+";
const hasLinkedInUrl = (line: string) => new RegExp(URL_SRC).test(line);
const linkedInUrls = (seg: string) => [...seg.matchAll(new RegExp(URL_SRC, "g"))];

function linkedInLabel(prefix: string): { text: string; short: boolean } {
  const p = prefix.replace(/LinkedIn\s*:?\s*$/i, "").replace(/[:\s,]+$/, "").trim();
  if (!p) return { text: "Connect on LinkedIn", short: false };
  if (/ on$/.test(p)) return { text: p.slice(0, -3), short: true };
  if (/['’]s$/.test(p)) return { text: p, short: true };
  return { text: `${p} on LinkedIn`, short: false };
}

function normalizeLinkedInUrl(raw: string): string {
  const p = raw
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/^linkedin\.com\//, "")
    .replace(/\/+$/, "");
  return `https://www.linkedin.com/${p}`;
}

/** Convert raw "LinkedIn: linkedin.com/in/…" contact text into markdown links
 *  with human-readable labels. Only affects lines containing a linkedin.com URL.
 *  Mirrors the one-off migration applied to existing episode show notes. */
export function linkifyLinkedIn(text: string): string {
  if (!hasLinkedInUrl(text)) return text;

  const segs = text.split(SPLIT_RE);
  const out: string[] = [];
  let pendingConnect: string | null = null;

  for (const s of segs) {
    const matches = linkedInUrls(s);

    if (matches.length === 0) {
      const trimmed = s.trim();
      if (!trimmed) continue;
      if (/^Connect with /.test(trimmed)) {
        pendingConnect = trimmed.replace(/[,:]+$/, "");
        continue;
      }
      out.push(trimmed);
      continue;
    }

    let cursor = 0;
    for (const m of matches) {
      const url = normalizeLinkedInUrl(m[0]);
      const prefix = s.slice(cursor, m.index);
      if (pendingConnect) {
        out.push(`[${pendingConnect} on LinkedIn](${url})`);
        pendingConnect = null;
      } else if (new RegExp(`^(?:${CONTACT_LABEL_RE})\\s*:\\s*\\S`).test(prefix)) {
        out.push(prefix.replace(/LinkedIn\s*:?\s*$/i, "").trim());
        out.push(`[Connect on LinkedIn](${url})`);
      } else {
        const { text: label, short } = linkedInLabel(prefix);
        out.push(short ? `${label} [LinkedIn](${url})` : `[${label}](${url})`);
      }
      cursor = m.index + m[0].length;
    }
    const tail = s.slice(cursor).trim();
    if (tail && !/^\/+$/.test(tail)) out.push(tail);
  }

  return out.join("\n");
}
