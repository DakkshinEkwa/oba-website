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
  image = "brand",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  image?: "brand" | "none";
}): Metadata {
  const url = path === "/" ? siteConfig.url : `${siteConfig.url}${path}`;
  const images = image === "brand" ? [brandImage] : undefined;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      siteName: siteConfig.name,
      title,
      description,
      url,
      ...(images ? { images } : {}),
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images ? { images: [brandImage.url] } : {}),
    },
  };
}
