import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import matter from "gray-matter";
import pLimit from "p-limit";
import { CONTENT_DIR } from "../scrape/util";
import { episodeSchema } from "../../src/lib/schemas";

const execFileAsync = promisify(execFile);
const EPISODES_DIR = path.join(CONTENT_DIR, "episodes");

/**
 * Backfill `durationSec` and `audioBytes` for the existing episode catalogue.
 *
 * These two fields are the only thing standing between `/feed.xml` and being
 * submittable to Apple and Spotify: without them there is no `<enclosure length>`
 * and no `<itunes:duration>`, and schema.org `duration` never renders on any
 * episode either.
 *
 * **Both values are measured, never estimated.** The byte size comes from the
 * server's `Content-Length` and the runtime from ffprobe reading the real file;
 * a field is left untouched if its measurement fails. A wrong `length` is worse
 * than a missing one — podcast clients use it to size the download, and a bad
 * value produces a broken player rather than a degraded one.
 *
 * One-off, in the spirit of `scripts/generate-landmask.ts`: run it when the
 * catalogue gains episodes that predate the sheet pipeline. New episodes coming
 * through `from-sheet.ts` already carry `audioBytes`.
 *
 *   npx tsx scripts/publish/measure-audio.ts          # only missing fields
 *   npx tsx scripts/publish/measure-audio.ts --force  # re-measure everything
 *
 * Requires ffprobe (ships with ffmpeg) on PATH.
 */

type Episode = { file: string; slug: string; audioUrl?: string; hasDuration: boolean; hasBytes: boolean };

function listEpisodes(): Episode[] {
  return fs
    .readdirSync(EPISODES_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(EPISODES_DIR, file), "utf8");
      const data = episodeSchema.parse(matter(raw).data);
      return {
        file,
        slug: data.slug,
        audioUrl: data.audioUrl,
        hasDuration: Boolean(data.durationSec),
        hasBytes: Boolean(data.audioBytes),
      };
    });
}

/** Size in bytes from the server, following Libsyn's redirect to the object. */
async function measureBytes(url: string): Promise<number | undefined> {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    const len = Number(res.headers.get("content-length"));
    return res.ok && Number.isFinite(len) && len > 0 ? len : undefined;
  } catch {
    return undefined;
  }
}

/** Runtime in whole seconds, read off the stream itself. */
async function measureDuration(url: string): Promise<number | undefined> {
  try {
    const { stdout } = await execFileAsync(
      "ffprobe",
      ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", url],
      { timeout: 120_000 },
    );
    const secs = Number(stdout.trim());
    return Number.isFinite(secs) && secs > 0 ? Math.round(secs) : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Surgical frontmatter edit. A gray-matter round-trip would requote and reorder
 * every key in all 75 files, burying two real changes in cosmetic churn.
 */
function upsertFields(file: string, fields: Record<string, number>) {
  const full = path.join(EPISODES_DIR, file);
  let raw = fs.readFileSync(full, "utf8");
  for (const [key, value] of Object.entries(fields)) {
    if (new RegExp(`^${key}:`, "m").test(raw)) {
      raw = raw.replace(new RegExp(`^${key}:.*$`, "m"), `${key}: ${value}`);
    } else {
      // Anchored after audioUrl, which every episode has, so the key lands
      // inside the frontmatter block rather than at the top of the body.
      raw = raw.replace(/^(audioUrl:.*)$/m, `$1\n${key}: ${value}`);
    }
  }
  fs.writeFileSync(full, raw);
}

async function main() {
  const force = process.argv.includes("--force");
  const episodes = listEpisodes();
  const todo = episodes.filter(
    (e) => e.audioUrl && (force || !e.hasDuration || !e.hasBytes),
  );

  if (!todo.length) {
    console.log(`nothing to measure (${episodes.length} episodes already complete)`);
    return;
  }
  console.log(`measuring ${todo.length} of ${episodes.length} episode(s)…`);

  const limit = pLimit(6);
  let written = 0;
  let failed = 0;

  await Promise.all(
    todo.map((ep) =>
      limit(async () => {
        const [bytes, duration] = await Promise.all([
          measureBytes(ep.audioUrl!),
          measureDuration(ep.audioUrl!),
        ]);

        const fields: Record<string, number> = {};
        if (duration && (force || !ep.hasDuration)) fields.durationSec = duration;
        if (bytes && (force || !ep.hasBytes)) fields.audioBytes = bytes;

        if (!Object.keys(fields).length) {
          failed += 1;
          console.warn(`  ✗ ${ep.slug}: no measurement succeeded`);
          return;
        }
        upsertFields(ep.file, fields);
        written += 1;
        const mins = duration ? `${Math.floor(duration / 60)}m${duration % 60}s` : "—";
        const mb = bytes ? `${(bytes / 1_048_576).toFixed(1)}MB` : "—";
        console.log(`  ✓ ${ep.slug}: ${mins}, ${mb}`);
      }),
    ),
  );

  console.log(`done: ${written} updated, ${failed} could not be measured`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
