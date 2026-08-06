import { EpisodeTicker } from "@/components/marketing/EpisodeTicker";
import { CTASection } from "@/components/marketing/CTASection";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedEpisode } from "@/components/home/FeaturedEpisode";
import { StatBand } from "@/components/home/StatBand";
import { ProblemAreas } from "@/components/home/ProblemAreas";
import { Audiences } from "@/components/home/Audiences";
import { Engagements } from "@/components/home/Engagements";
import { LatestContent } from "@/components/home/LatestContent";
import { getAllEpisodes, getFeaturedEpisode, getAllBlogPosts, getAllHosts } from "@/lib/content";

export default function HomePage() {
  const featured = getFeaturedEpisode();
  const allEpisodes = getAllEpisodes();
  const latest = allEpisodes.slice(0, 3);
  const posts = getAllBlogPosts().slice(0, 3);
  const episodeCount = allEpisodes.length;
  const hosts = getAllHosts();

  return (
    <>
      <HeroSection hosts={hosts} />
      <EpisodeTicker episodes={allEpisodes} />
      <FeaturedEpisode featured={featured} />
      <StatBand episodeCount={episodeCount} />
      <ProblemAreas />
      <Audiences />
      <Engagements />
      <LatestContent episodes={latest} posts={posts} />
      <CTASection />
    </>
  );
}
