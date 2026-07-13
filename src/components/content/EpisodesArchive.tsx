import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/marketing/PageHero";
import { EpisodeCard } from "@/components/content/EpisodeCard";
import { Pagination } from "@/components/ui/Pagination";
import { getAllEpisodes } from "@/lib/content";
import { paginate } from "@/lib/utils";

export const EPISODES_PER_PAGE = 12;

export function episodeHref(page: number) {
  return page <= 1 ? "/podcast/episodes" : `/podcast/episodes/page/${page}`;
}

export function EpisodesArchive({ page }: { page: number }) {
  const all = getAllEpisodes();
  const result = paginate(all, page, EPISODES_PER_PAGE);
  if (page > result.totalPages) notFound();

  return (
    <>
      <PageHero
        eyebrow="The Ophthalmology Business Podcast"
        title="Every conversation, on demand"
        lede="The full library — candid discussions of growth, operations, patient experience, leadership, and technology with the people who have lived them."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Podcast", href: "/podcast" }, { label: "Episodes" }]}
      />
      <Section spacing="default">
        <div className="mb-8 flex items-center justify-between">
          <p className="text-small text-ink-400">
            {result.total} episodes · Page {result.page} of {result.totalPages}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {result.items.map((ep) => (
            <EpisodeCard key={ep.slug} episode={ep} />
          ))}
        </div>
        <div className="mt-14">
          <Pagination page={result.page} totalPages={result.totalPages} hrefFor={episodeHref} />
        </div>
      </Section>
    </>
  );
}
