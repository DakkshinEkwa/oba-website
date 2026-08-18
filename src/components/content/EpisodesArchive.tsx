import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { DarkHero } from "@/components/marketing/DarkHero";
import { EpisodeList } from "@/components/content/EpisodeList";
import { FeaturedEpisodeCard } from "@/components/content/FeaturedEpisodeCard";
import { Pagination } from "@/components/ui/Pagination";
import { Waveform } from "@/components/ui/Waveform";
import { getAllEpisodes, getEpisodeStats, getFeaturedEpisode } from "@/lib/content";
import { paginate } from "@/lib/utils";

export const EPISODES_PER_PAGE = 20;

export function episodeHref(page: number) {
  return page <= 1 ? "/podcast/episodes" : `/podcast/episodes/page/${page}`;
}

export function EpisodesArchive({ page }: { page: number }) {
  const all = getAllEpisodes();
  const stats = getEpisodeStats();
  const featured = getFeaturedEpisode();
  const result = paginate(all, page, EPISODES_PER_PAGE);
  if (page > result.totalPages) notFound();

  return (
    <>
      <DarkHero
        size="band"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Podcast", href: "/podcast" },
          { label: "Episodes" },
        ]}
        eyebrow="The Ophthalmology Business Podcast"
        eyebrowDot
        title="Every conversation,"
        titleDim="on demand"
        lede="The full library: candid discussions of growth, operations, patient experience, leadership, and technology with the people who have lived them."
        aside={featured ? <FeaturedEpisodeCard episode={featured} /> : null}
        proof={
          <div className="flex flex-col gap-6">
            <Waveform bars={16} baseHeight={26} className="text-white/40" animated />
            <div className="flex flex-wrap gap-x-10 gap-y-4">
              <div>
                <p className="text-h4 font-medium text-white">{stats.count}+</p>
                <p className="mt-1 font-mono text-micro uppercase tracking-wide text-white/50">Episodes</p>
              </div>
              <div>
                <p className="text-h4 font-medium text-white">Since {stats.firstYear}</p>
                <p className="mt-1 font-mono text-micro uppercase tracking-wide text-white/50">Recording</p>
              </div>
              <div>
                <p className="text-h4 font-medium text-white">Free</p>
                <p className="mt-1 font-mono text-micro uppercase tracking-wide text-white/50">To stream</p>
              </div>
            </div>
          </div>
        }
      />
      <Section spacing="loose" className="py-24 sm:py-32 lg:py-44">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-h2 font-light tracking-tight text-ink-900">All episodes</h2>
          {result.total > 0 ? (
            <p className="text-small text-ink-500">
              {result.total} conversations · {stats.firstYear}–{stats.latestYear} · Page{" "}
              {result.page} of {result.totalPages}
            </p>
          ) : null}
        </div>
        <EpisodeList episodes={result.items} />
        <div className="mt-14">
          <Pagination page={result.page} totalPages={result.totalPages} hrefFor={episodeHref} />
        </div>
      </Section>
    </>
  );
}
