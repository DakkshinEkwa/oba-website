import fs from "node:fs";
import path from "node:path";
import { CONTENT_DIR, PUBLIC_DIR, downloadAsset, writeMdx } from "../scrape/util";
import { cell, parseCsv } from "./csv";

const CACHE_DIR = path.join(process.cwd(), "scripts", "publish", ".cache");
const EPISODES_DIR = path.join(CONTENT_DIR, "episodes");

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function splitList(value: string): string[] {
  return value
    .split(/[,;|]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function truthy(value: string): boolean {
  return /^(true|yes|1)$/i.test(value.trim());
}

async function main() {
  const csvUrl = process.env.EPISODE_SHEET_CSV_URL;
  if (!csvUrl) {
    throw new Error("Set EPISODE_SHEET_CSV_URL to a Google Sheet CSV export URL.");
  }

  const res = await fetch(csvUrl);
  if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`);
  const rows = parseCsv(await res.text());
  const imported: string[] = [];

  for (const row of rows) {
    const title = cell(row, "title");
    const audioUrl = cell(row, "audioUrl", "audio", "soundtrack", "mp3");
    if (!title || !audioUrl) continue;

    const slug = slugify(cell(row, "slug") || title);
    const dest = path.join(EPISODES_DIR, `${slug}.mdx`);
    if (fs.existsSync(dest) && process.env.FORCE_OVERWRITE !== "1") continue;

    const thumbnailUrl = cell(row, "thumbnailUrl", "thumbnail", "image", "imageUrl");
    let image: string | undefined;
    if (thumbnailUrl.startsWith("/")) {
      image = thumbnailUrl;
    } else if (thumbnailUrl.startsWith("http")) {
      const ext = path.extname(new URL(thumbnailUrl).pathname) || ".jpg";
      const rel = `/images/episodes/${slug}${ext}`;
      const ok = await downloadAsset(thumbnailUrl, path.join(PUBLIC_DIR, rel));
      if (ok) image = rel;
    }

    const episodeNumberRaw = cell(row, "episodeNumber", "episode", "number");
    const durationRaw = cell(row, "durationSec", "duration");
    const episodeNumber = episodeNumberRaw ? Number(episodeNumberRaw) : Number.NaN;
    const durationSec = durationRaw ? Number(durationRaw) : Number.NaN;
    const publishedAt = cell(row, "publishedAt", "date", "published").slice(0, 10);

    writeMdx(
      dest,
      {
        slug,
        title,
        episodeNumber: Number.isFinite(episodeNumber) ? episodeNumber : undefined,
        publishedAt: publishedAt || new Date().toISOString().slice(0, 10),
        excerpt: cell(row, "excerpt", "summary"),
        audioUrl,
        image,
        guests: splitList(cell(row, "guests", "guest")),
        hostSlugs: splitList(cell(row, "hostSlugs", "hosts", "host")),
        tags: splitList(cell(row, "tags")),
        featured: truthy(cell(row, "featured")) ? true : undefined,
        durationSec: Number.isFinite(durationSec) ? durationSec : undefined,
        sourceUrl: cell(row, "sourceUrl", "source") || undefined,
      },
      cell(row, "showNotes", "body", "notes") || cell(row, "excerpt", "summary"),
    );
    imported.push(slug);
    console.log(`imported ${slug}`);
  }

  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(path.join(CACHE_DIR, "imported-slugs.json"), JSON.stringify(imported, null, 2));
  console.log(`done: ${imported.length} new episode(s)`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
