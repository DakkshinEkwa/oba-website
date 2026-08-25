import type { MetadataRoute } from "next";
import {
  getAllEpisodes,
  getAllBlogPosts,
  getAllWebinars,
  getAllEvents,
} from "@/lib/content";
import { EPISODES_PER_PAGE } from "@/components/content/EpisodesArchive";
import { siteConfig } from "@/lib/site";

/**
 * `lastModified` is only emitted where a truthful value exists. Google discounts
 * lastmod site-wide once it detects invented dates, which would devalue the
 * entries (episodes, posts, archives) where the date is real — so the static
 * marketing pages deliberately carry none.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const staticPaths = [
    "",
    "/about",
    "/speak",
    "/partnerships",
    "/contact",
    "/msm",
    "/membership",
    "/resources",
    "/resources/free-resources",
    "/resources/newsletter",
    "/resources/events",
    "/resources/webinars",
    "/resources/webinars/replays",
    "/podcast",
    "/podcast/episodes",
    "/podcast/hosts",
    "/reviews",
    "/privacy",
    "/terms",
    "/blog",
  ];

  const episodes = getAllEpisodes();
  const posts = getAllBlogPosts();
  const newestEpisode = episodes[0]?.publishedAt;
  const newestPost = posts[0] ? (posts[0].updatedAt ?? posts[0].publishedAt) : undefined;
  const newestOverall = [newestEpisode, newestPost]
    .filter((d): d is string => Boolean(d))
    .sort()
    .at(-1);

  // Archive pages genuinely change when their newest item changes.
  const derivedLastMod: Record<string, string | undefined> = {
    "": newestOverall,
    "/podcast": newestEpisode,
    "/podcast/episodes": newestEpisode,
    "/blog": newestPost,
  };

  const entries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${base}${p}`,
    ...(derivedLastMod[p] ? { lastModified: derivedLastMod[p] } : {}),
    changeFrequency: p in derivedLastMod ? "weekly" : "monthly",
    priority: p === "" ? 1 : 0.7,
  }));

  for (const ep of episodes) {
    entries.push({
      url: `${base}/podcast/episodes/${ep.slug}`,
      lastModified: ep.publishedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  const totalEpisodePages = Math.ceil(episodes.length / EPISODES_PER_PAGE);
  for (let p = 2; p <= totalEpisodePages; p++) {
    // Each paginated slice changes when the newest episode on it changes.
    const newestOnPage = episodes[(p - 1) * EPISODES_PER_PAGE]?.publishedAt;
    entries.push({
      url: `${base}/podcast/episodes/page/${p}`,
      ...(newestOnPage ? { lastModified: newestOnPage } : {}),
      changeFrequency: "monthly",
      priority: 0.4,
    });
  }

  for (const post of posts) {
    entries.push({
      url: `${base}/blog/${post.slug}`,
      lastModified: post.updatedAt ?? post.publishedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  for (const w of getAllWebinars()) {
    entries.push({ url: `${base}/resources/webinars/${w.slug}`, changeFrequency: "monthly", priority: 0.5 });
  }

  for (const e of getAllEvents()) {
    entries.push({
      url: `${base}/resources/events/${e.slug}`,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  return entries;
}
