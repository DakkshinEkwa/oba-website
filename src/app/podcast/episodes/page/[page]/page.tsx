import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EpisodesArchive, EPISODES_PER_PAGE } from "@/components/content/EpisodesArchive";
import { getAllEpisodes } from "@/lib/content";

export function generateStaticParams() {
  const total = Math.ceil(getAllEpisodes().length / EPISODES_PER_PAGE);
  // Page 1 lives at /podcast/episodes, so generate 2..total here.
  return Array.from({ length: Math.max(0, total - 1) }, (_, i) => ({ page: String(i + 2) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  return {
    title: `Podcast Episodes: Page ${page}`,
    description:
      "Every episode of the Ophthalmology Business Podcast: practice growth, marketing, operations, and leadership for eye care.",
  };
}

export default async function EpisodesPaginatedPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const n = Number(page);
  if (!Number.isInteger(n) || n < 2) notFound();
  return <EpisodesArchive page={n} />;
}
