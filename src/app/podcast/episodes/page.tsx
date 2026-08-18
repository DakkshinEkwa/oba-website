import type { Metadata } from "next";
import { EpisodesArchive } from "@/components/content/EpisodesArchive";

export const metadata: Metadata = {
  title: "Podcast Episodes",
  description:
    "Every episode of the Ophthalmology Business Podcast: practice growth, marketing, operations, and leadership for eye care.",
};

export default function EpisodesPage() {
  return <EpisodesArchive page={1} />;
}
