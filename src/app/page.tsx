import { EpisodeTicker } from "@/components/marketing/EpisodeTicker";
import { CTASection } from "@/components/marketing/CTASection";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedEpisode } from "@/components/home/FeaturedEpisode";
import { StatBand } from "@/components/home/StatBand";
import { ProblemAreas } from "@/components/home/ProblemAreas";
import { Audiences } from "@/components/home/Audiences";
import { Engagements } from "@/components/home/Engagements";
import { LatestContent } from "@/components/home/LatestContent";
import { getAllEpisodes, getFeaturedEpisode, getAllBlogPosts } from "@/lib/content";
import { pageMetadata } from "@/lib/og/metadata";
import { siteConfig } from "@/lib/site";

const homeTitle = `${siteConfig.name} | The Business of Eye Care`;

export const metadata = {
  ...pageMetadata({ title: homeTitle, description: siteConfig.description, path: "/" }),
  // The root layout sets a "%s · OB Academy" template; the homepage title is the
  // brand line itself, so it must opt out of the suffix.
  title: { absolute: homeTitle },
};

export default function HomePage() {
  const featured = getFeaturedEpisode();
  const allEpisodes = getAllEpisodes();
  const latest = allEpisodes.slice(0, 3);
  const posts = getAllBlogPosts().slice(0, 3);

  return (
    <>
      <HeroSection />
      <EpisodeTicker episodes={allEpisodes} />
      <FeaturedEpisode featured={featured} />
      <StatBand />
      <ProblemAreas />
      <Audiences />
      <Engagements />
      <LatestContent episodes={latest} posts={posts} />
      <CTASection />
    </>
  );
}
