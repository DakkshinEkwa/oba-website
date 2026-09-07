import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

const brandImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: siteConfig.name,
};

export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  section,
  tags,
  image = "brand",
  noindex = false,
  markdown,
  llmsIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
  /**
   * "brand" — use the site-wide brand card at /opengraph-image.
   * "route" — omit images here and let this segment's own opengraph-image.tsx
   *   file convention supply og:image *and* the derived twitter:image tags.
   *   (Next merges the file-convention image only when openGraph.images is absent.)
   */
  image?: "brand" | "route";
  noindex?: boolean;
  /**
   * Path to this page's plain-Markdown mirror (the `/md` route convention), e.g.
   * "/podcast/episodes/<slug>/md". Advertised as <link rel="alternate"
   * type="text/markdown">, which is the only machine-discoverable pointer those
   * routes have — nothing else in the site links an individual one.
   */
  markdown?: string;
  /** Advertise /llms.txt from this page. Site-level, so only the homepage sets it. */
  llmsIndex?: boolean;
}): Metadata {
  const url = path === "/" ? siteConfig.url : `${siteConfig.url}${path}`;
  const images = image === "brand" ? [brandImage] : undefined;
  const isArticle = type === "article";
  return {
    title,
    description,
    /**
     * `types` must be restated here, not inherited. Next replaces `alternates`
     * wholesale rather than merging it, so the root layout's RSS link was being
     * dropped from every page that called this helper — i.e. all of them.
     */
    alternates: {
      canonical: path,
      types: {
        "application/rss+xml": `${siteConfig.url}/feed.xml`,
        ...(markdown ? { "text/markdown": `${siteConfig.url}${markdown}` } : {}),
        ...(llmsIndex ? { "text/plain": `${siteConfig.url}/llms.txt` } : {}),
      },
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type,
      siteName: siteConfig.name,
      locale: "en_US",
      title,
      description,
      url,
      ...(images ? { images } : {}),
      ...(isArticle && publishedTime ? { publishedTime } : {}),
      ...(isArticle && modifiedTime ? { modifiedTime } : {}),
      ...(isArticle && authors?.length ? { authors } : {}),
      ...(isArticle && section ? { section } : {}),
      ...(isArticle && tags?.length ? { tags } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images ? { images: [{ url: brandImage.url, alt: brandImage.alt }] } : {}),
    },
  };
}
