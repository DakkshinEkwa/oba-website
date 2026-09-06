import { EpisodesArchive } from "@/components/content/EpisodesArchive";
import { getAllHosts } from "@/lib/content";
import { pageMetadata } from "@/lib/og/metadata";
import { podcastSeriesJsonLd } from "@/lib/jsonld";

export const metadata = pageMetadata({
  title: "Podcast Episodes",
  description:
    "Every episode of the Ophthalmology Business Podcast: practice growth, marketing, operations, and leadership for eye care.",
  path: "/podcast/episodes",
});

export default function EpisodesPage() {
  // The archive is the podcast's hub page, so it carries the PodcastSeries
  // entity that every episode's `partOfSeries` points back at. Page 1 only:
  // the paginated slices are not the series' canonical URL.
  const seriesJsonLd = podcastSeriesJsonLd(
    getAllHosts(),
    "Candid, non-promotional conversations with the physicians, administrators, and industry experts behind modern ophthalmology practices."
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(seriesJsonLd) }}
      />
      <EpisodesArchive page={1} />
    </>
  );
}
