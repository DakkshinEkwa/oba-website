import { EpisodesArchive } from "@/components/content/EpisodesArchive";
import { pageMetadata } from "@/lib/og/metadata";

export const metadata = pageMetadata({
  title: "Podcast Episodes",
  description:
    "Every episode of the Ophthalmology Business Podcast: practice growth, marketing, operations, and leadership for eye care.",
  path: "/podcast/episodes",
});

export default function EpisodesPage() {
  return <EpisodesArchive page={1} />;
}
