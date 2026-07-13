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
