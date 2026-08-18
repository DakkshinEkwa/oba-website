import path from "node:path";
import * as cheerio from "cheerio";
import pLimit from "p-limit";
import readingTime from "reading-time";
import {
  BASE,
  CONTENT_DIR,
  PUBLIC_DIR,
  fetchCached,
  downloadAsset,
  slugFromUrl,
  writeMdx,
  decodeEntities,
  linkifyLinkedIn,
} from "./util";

const ARCHIVE = `${BASE}/blog/`;

const NAV_SLUGS = new Set([
  "blog",
  "podcast-show",
  "contact",
  "about",
  "events",
  "newsletter",
  "webinar-archive",
  "expert-insights-hub",
  "hosts",
  "login",
  "register",
  "special-offers",
  "about-podcast",
  "privacy-policy",
  "terms",
  "wp-json",
  "wp-login.php",
]);

const BOILERPLATE = /^(by\s|posted|share this|read more|subscribe|©|\|)/i;
const NOISE = /(schedule a complimentary|marketing strategy meeting|digital marketing advisor|ekwa)/i;

async function collectPostUrls(): Promise<string[]> {
  const html = await fetchCached(ARCHIVE);
  const $ = cheerio.load(html);
  const urls = new Set<string>();
  $('a[href^="https://www.obacademy.org/"]').each((_, el) => {
    const href = $(el).attr("href") ?? "";
    const m = href.match(/^https:\/\/www\.obacademy\.org\/([a-z0-9-]+)\/$/);
    if (m && !NAV_SLUGS.has(m[1]) && !m[1].startsWith("page")) {
      urls.add(`${BASE}/${m[1]}/`);
    }
  });
  return [...urls];
}

function extractBody($: cheerio.CheerioAPI): string {
  const seen = new Set<string>();
  const paras: string[] = [];
  $("p").each((_, el) => {
    const text = decodeEntities($(el).text().replace(/\s+/g, " ").trim());
    if (text.length < 50) return;
    if (BOILERPLATE.test(text) || NOISE.test(text)) return;
    if (seen.has(text)) return;
    seen.add(text);
    paras.push(linkifyLinkedIn(text));
  });
  return paras.join("\n\n");
}

async function scrapePost(url: string) {
  const html = await fetchCached(url);
  const $ = cheerio.load(html);
  const slug = slugFromUrl(url);

  const title = decodeEntities($("h1").first().text().trim());
  const excerpt = decodeEntities($('meta[property="og:description"]').attr("content") ?? "");
  let publishedAt =
    $('meta[property="article:published_time"]').attr("content") ??
    (html.match(/"datePublished":"([^"]+)"/)?.[1] ?? "");
  publishedAt = publishedAt ? publishedAt.slice(0, 10) : "2023-01-01";

  const ogImage = $('meta[property="og:image"]').attr("content");
  let coverImage: string | undefined;
  if (ogImage) {
    const ext = path.extname(new URL(ogImage).pathname) || ".jpg";
    const rel = `/images/blog/${slug}${ext}`;
    if (await downloadAsset(ogImage, path.join(PUBLIC_DIR, rel))) coverImage = rel;
  }

  const body = extractBody($);
  const rt = Math.max(1, Math.round(readingTime(body).minutes));

  writeMdx(
    path.join(CONTENT_DIR, "blog", `${slug}.mdx`),
    {
      slug,
      title,
      publishedAt,
      excerpt: excerpt || body.slice(0, 155) + "…",
      coverImage,
      readingTimeMin: rt,
      sourceUrl: url,
    },
    body || excerpt,
  );
  return { slug, title };
}

async function main() {
  console.log("Collecting blog post URLs…");
  const urls = await collectPostUrls();
  console.log(`Found ${urls.length} posts. Scraping…`);
  const limit = pLimit(4);
  const results = await Promise.allSettled(urls.map((u) => limit(() => scrapePost(u))));
  let ok = 0;
  for (const r of results) {
    if (r.status === "fulfilled") ok++;
    else console.error("  ✗", r.reason?.message ?? r.reason);
  }
  console.log(`Done: ${ok}/${urls.length} posts written.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
