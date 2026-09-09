import fs from "node:fs";
import path from "node:path";
import { CONTENT_DIR, PUBLIC_DIR, downloadAsset, writeMdx } from "../scrape/util";
import { cell, parseCsv } from "./csv";
import { transcriptFromText } from "./transcript-text";

const CACHE_DIR = path.join(process.cwd(), "scripts", "publish", ".cache");
const EPISODES_DIR = path.join(CONTENT_DIR, "episodes");
const TRANSCRIPTS_DIR = path.join(CONTENT_DIR, "transcripts");

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

/**
 * Write the transcript for a row, if the sheet carries one.
 *
 * Deliberately independent of whether the episode MDX already exists: the whole
 * back catalogue is already published, so a transcript added to the sheet today
 * has to be able to land on an episode from 2023. Returns true when a file was
 * written.
 */
function syncTranscript(slug: string, row: Record<string, string>, audioUrl: string): boolean {
  const text = cell(row, "transcript", "transcriptText", "fullTranscript");
  if (!text.trim()) return false;

  const dest = path.join(TRANSCRIPTS_DIR, `${slug}.json`);
  const statusRaw = cell(row, "transcriptStatus", "transcriptState").toLowerCase();
  const status = statusRaw === "machine" ? "machine" : "reviewed";

  const transcript = transcriptFromText({ slug, text, status, audioUrl });
  if (!transcript) {
    console.warn(`skip transcript for ${slug}: no usable lines`);
    return false;
  }

  const body = JSON.stringify(transcript, null, 2) + "\n";
  // `generatedAt` moves on every run, so compare everything else — otherwise
  // each import would rewrite all 75 files and churn the diff for nothing.
  if (fs.existsSync(dest)) {
    const strip = (t: string) => t.replace(/^\s*"generatedAt".*$/m, "");
    if (strip(fs.readFileSync(dest, "utf8")) === strip(body)) return false;
  }

  fs.mkdirSync(TRANSCRIPTS_DIR, { recursive: true });
  fs.writeFileSync(dest, body);
  console.log(`transcript ${slug} (${transcript.segments.length} segments, ${status})`);
  return true;
}

/**
 * The MP3's size in bytes, read off the server rather than guessed, for
 * `<enclosure length>`. Apple and Spotify both want it and a wrong value is
 * worse than none, so a failed or absent header simply yields nothing.
 */
async function audioBytesOf(audioUrl: string): Promise<number | undefined> {
  try {
    const res = await fetch(audioUrl, { method: "HEAD", redirect: "follow" });
    const len = Number(res.headers.get("content-length"));
    return res.ok && Number.isFinite(len) && len > 0 ? len : undefined;
  } catch {
    return undefined;
  }
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
  const transcribed: string[] = [];

  for (const row of rows) {
    const title = cell(row, "title");
    const audioUrl = cell(row, "audioUrl", "audio", "soundtrack", "mp3");
    if (!title || !audioUrl) continue;

    const slug = slugify(cell(row, "slug") || title);
    const dest = path.join(EPISODES_DIR, `${slug}.mdx`);

    // Transcripts sync first and unconditionally. Every one of the 75 episodes
    // already has an MDX file, so gating this behind "new episodes only" would
    // mean a transcript could never be added to anything already published.
    if (syncTranscript(slug, row, audioUrl)) transcribed.push(slug);

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
        audioBytes: await audioBytesOf(audioUrl),
        sourceUrl: cell(row, "sourceUrl", "source") || undefined,
      },
      cell(row, "showNotes", "body", "notes") || cell(row, "excerpt", "summary"),
    );
    imported.push(slug);
    console.log(`imported ${slug}`);
  }

  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(path.join(CACHE_DIR, "imported-slugs.json"), JSON.stringify(imported, null, 2));
  console.log(
    `done: ${imported.length} new episode(s), ${transcribed.length} transcript(s) written`,
  );
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
