import { notFound } from "next/navigation";
import { EpisodesArchive, EPISODES_PER_PAGE } from "@/components/content/EpisodesArchive";
import { getAllEpisodes } from "@/lib/content";
import { pageMetadata } from "@/lib/og/metadata";

export function generateStaticParams() {
  const total = Math.ceil(getAllEpisodes().length / EPISODES_PER_PAGE);
  // Page 1 lives at /podcast/episodes, so generate 2..total here.
  return Array.from({ length: Math.max(0, total - 1) }, (_, i) => ({ page: String(i + 2) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const n = Number(page);
  const total = getAllEpisodes().length;
  const from = (n - 1) * EPISODES_PER_PAGE + 1;
  const to = Math.min(n * EPISODES_PER_PAGE, total);
  return pageMetadata({
    title: `Podcast Episodes: Page ${page}`,
    // Name the range so each paginated page has its own description.
    description: `Episodes ${from}\u2013${to} of ${total} from the Ophthalmology Business Podcast: practice growth, marketing, operations, and leadership for eye care.`,
    path: `/podcast/episodes/page/${page}`,
  });
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
