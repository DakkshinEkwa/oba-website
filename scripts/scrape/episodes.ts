import path from "node:path";
import * as cheerio from "cheerio";
import pLimit from "p-limit";
import {
  BASE,
  CONTENT_DIR,
  PUBLIC_DIR,
  fetchCached,
  downloadAsset,
  slugFromUrl,
  writeMdx,
  decodeEntities,
} from "./util";

const ARCHIVE = `${BASE}/podcast-show/`;
const MAX_PAGES = 12;

const BOILERPLATE =
  /^(podcast:|by\s|play in new window|download|subscribe:|rss|apple podcasts|spotify|google podcasts|share|embed|©|\|)/i;
const NOISE =
  /(schedule a complimentary|marketing strategy meeting|digital marketing advisor|ekwa)/i;

async function collectEpisodeUrls(): Promise<string[]> {
  const urls = new Set<string>();
  for (let page = 1; page <= MAX_PAGES; page++) {
    const url = page === 1 ? ARCHIVE : `${ARCHIVE}page/${page}/`;
    let html: string;
    try {
      html = await fetchCached(url);
    } catch {
      break; // no more pages
    }
    const $ = cheerio.load(html);
    let found = 0;
    $('a[href*="/podcast-show/"]').each((_, el) => {
      const href = $(el).attr("href") ?? "";
      const m = href.match(/\/podcast-show\/([^/]+)\/?$/);
      if (m && m[1] !== "page") {
        const clean = `${BASE}/podcast-show/${m[1]}/`;
        if (!urls.has(clean)) found++;
        urls.add(clean);
      }
    });
    console.log(`  archive page ${page}: +${found} (total ${urls.size})`);
    if (found === 0 && page > 1) break;
  }
  return [...urls];
}

function extractBody($: cheerio.CheerioAPI): string {
  const seen = new Set<string>();
  const paras: string[] = [];
  $("p").each((_, el) => {
    const text = decodeEntities($(el).text().replace(/\s+/g, " ").trim());
    if (text.length < 60) return;
    if (BOILERPLATE.test(text)) return;
    if (NOISE.test(text)) return;
    if (seen.has(text)) return;
    seen.add(text);
    paras.push(text);
  });
  return paras.join("\n\n");
}

async function scrapeEpisode(url: string) {
  const html = await fetchCached(url);
  const $ = cheerio.load(html);
  const slug = slugFromUrl(url);

  const title = decodeEntities($("h1").first().text().trim());
  const excerpt = decodeEntities($('meta[property="og:description"]').attr("content") ?? "").replace(
    /\s*…?\s*\[?…?\]?\s*$/,
    "…",
  );

  // date from JSON-LD or article:published_time
  let publishedAt =
    $('meta[property="article:published_time"]').attr("content") ??
    (html.match(/"datePublished":"([^"]+)"/)?.[1] ?? "");
  publishedAt = publishedAt ? publishedAt.slice(0, 10) : "";

  // libsyn mp3 + episode number.
  // Every page embeds TWO players: its own episode and a sitewide "latest episode"
  // widget. The page's own player has id="audio-<postId>-…", where postId comes
  // from the WP shortlink (?p=<id>) — match on that, never on first-mp3-in-page.
  const postId = html.match(/\?p=(\d+)/)?.[1];
  let mp3: string | undefined;
  if (postId) {
    mp3 = $(`audio[id^="audio-${postId}-"] source`).attr("src")?.replace(/\?.*$/, "");
  }
  mp3 ??= html.match(/https?:\/\/traffic\.libsyn\.com\/[^\s"')?]+\.mp3/)?.[0];
  // filenames vary: oba64.mp3, oba26a.mp3, obp56.mp3, ep39.mp3, e4.mp3, e1-1.mp3
  const epNum = mp3?.match(/\/(?:oba|obp|ep|e)(\d+)[a-z]?(?:-\d+)?\.mp3$/i)?.[1];

  // featured image
  const ogImage = $('meta[property="og:image"]').attr("content");
  let image: string | undefined;
  if (ogImage) {
    const ext = path.extname(new URL(ogImage).pathname) || ".jpg";
    const rel = `/images/episodes/${slug}${ext}`;
    const ok = await downloadAsset(ogImage, path.join(PUBLIC_DIR, rel));
    if (ok) image = rel;
  }

  const body = extractBody($);

  writeMdx(
    path.join(CONTENT_DIR, "episodes", `${slug}.mdx`),
    {
      slug,
      title,
      episodeNumber: epNum ? Number(epNum) : undefined,
      publishedAt: publishedAt || "2023-01-01",
      excerpt,
      audioUrl: mp3,
      image,
      sourceUrl: url,
    },
    body || excerpt,
  );
  return { slug, title, hasAudio: Boolean(mp3), epNum };
}

async function main() {
  console.log("Collecting episode URLs…");
  const urls = await collectEpisodeUrls();
  console.log(`Found ${urls.length} episodes. Scraping…`);

  const limit = pLimit(5);
  const results = await Promise.allSettled(urls.map((u) => limit(() => scrapeEpisode(u))));

  let ok = 0;
  let noAudio = 0;
  for (const r of results) {
    if (r.status === "fulfilled") {
      ok++;
      if (!r.value.hasAudio) noAudio++;
    } else {
      console.error("  ✗", r.reason?.message ?? r.reason);
    }
  }
  console.log(`\nDone: ${ok}/${urls.length} written, ${noAudio} without audio.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
