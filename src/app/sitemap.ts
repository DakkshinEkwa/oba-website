import type { MetadataRoute } from "next";
import {
  getAllEpisodes,
  getAllBlogPosts,
  getAllWebinars,
} from "@/lib/content";
import { EPISODES_PER_PAGE } from "@/components/content/EpisodesArchive";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const staticPaths = [
    "",
    "/about",
    "/speak",
    "/partnerships",
    "/contact",
    "/analyze",
    "/membership",
    "/resources",
    "/resources/newsletter",
    "/resources/events",
    "/resources/webinars",
    "/podcast",
    "/podcast/episodes",
    "/podcast/hosts",
    "/blog",
    "/login",
    "/register",
  ];

  const entries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${base}${p}`,
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.7,
  }));

  const episodes = getAllEpisodes();
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
    entries.push({ url: `${base}/podcast/episodes/page/${p}`, changeFrequency: "weekly", priority: 0.4 });
  }

  for (const post of getAllBlogPosts()) {
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

  return entries;
}
