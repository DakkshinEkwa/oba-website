import { getAllEpisodes } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { metaDescription } from "@/lib/utils";

/** Fully static: render the feed once at build time (SSG). */
export const dynamic = "force-static";

/** Minimal XML escaping for RSS text nodes and attributes. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function rfc822(iso: string): string {
  const d = new Date(iso);
  return d.toUTCString();
}

function itunesDuration(seconds?: number): string {
  if (!seconds || seconds <= 0) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Podcast RSS 2.0 feed generated from the episode library at build time.
 * Exposed as /feed.xml and advertised via <link rel="alternate"> in the layout.
 *
 * NOT YET SUBMITTABLE to Apple Podcasts or Spotify: <itunes:image> must be a
 * square 1400-3000px JPEG/PNG, and the only artwork in the repo is the 1200x630
 * OG card. That is an asset gap, not a code gap — see PODCAST_ARTWORK below.
 * <enclosure length> is likewise omitted until durationSec/byte sizes are
 * backfilled, since a wrong length is worse than an absent one.
 */
const PODCAST_ARTWORK = `${siteConfig.url}/opengraph-image`;
export function GET() {
  const episodes = getAllEpisodes();
  const items = episodes
    .map((ep) => {
      const url = `${siteConfig.url}/podcast/episodes/${ep.slug}`;
      const enclosure = ep.audioUrl
        ? `<enclosure url="${escapeXml(ep.audioUrl)}" type="audio/mpeg" />`
        : "";
      const duration = itunesDuration(ep.durationSec);
      const summary = metaDescription(ep);
      return `    <item>
      <title>${escapeXml(ep.title)}</title>
      <itunes:title>${escapeXml(ep.title)}</itunes:title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${rfc822(ep.publishedAt)}</pubDate>
      <description>${escapeXml(summary)}</description>
      <itunes:summary>${escapeXml(summary)}</itunes:summary>
      <itunes:explicit>false</itunes:explicit>${
        ep.episodeNumber ? `\n      <itunes:episode>${ep.episodeNumber}</itunes:episode>` : ""
      }
      ${enclosure}${duration ? `<itunes:duration>${duration}</itunes:duration>` : ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml("The Ophthalmology Business Podcast")}</title>
    <atom:link href="${escapeXml(`${siteConfig.url}/feed.xml`)}" rel="self" type="application/rss+xml" />
    <link>${escapeXml(siteConfig.url)}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${rfc822(episodes[0]?.publishedAt ?? new Date().toISOString())}</lastBuildDate>
    <itunes:author>${escapeXml(siteConfig.name)}</itunes:author>
    <itunes:type>episodic</itunes:type>
    <itunes:explicit>false</itunes:explicit>
    <itunes:summary>${escapeXml(siteConfig.description)}</itunes:summary>
    <itunes:subtitle>${escapeXml("The business of eye care, discussed by the people who run it.")}</itunes:subtitle>
    <itunes:image href="${escapeXml(PODCAST_ARTWORK)}" />
    <itunes:category text="Business">
      <itunes:category text="Management" />
    </itunes:category>
    <itunes:owner>
      <itunes:name>${escapeXml(siteConfig.name)}</itunes:name>
      <itunes:email>${escapeXml(siteConfig.email)}</itunes:email>
    </itunes:owner>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
