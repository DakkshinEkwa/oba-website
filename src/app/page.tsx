import { CTASection } from "@/components/marketing/CTASection";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedEpisode } from "@/components/home/FeaturedEpisode";
import { StatBand } from "@/components/home/StatBand";
import { ProblemAreas } from "@/components/home/ProblemAreas";
import { Audiences } from "@/components/home/Audiences";
import { LatestContent } from "@/components/home/LatestContent";
import { Faq } from "@/components/home/Faq";
import { getAllEpisodes, getFeaturedEpisode, getAllBlogPosts } from "@/lib/content";
import { pageMetadata } from "@/lib/og/metadata";
import { faqJsonLd } from "@/lib/jsonld";
import { getGeneralFaqs } from "@/lib/faq-data";
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
  const faqJsonLdData = faqJsonLd(getGeneralFaqs());

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLdData) }}
      />
      <HeroSection />
      <FeaturedEpisode featured={featured} />
      <StatBand />
      <ProblemAreas />
      <Audiences />
      <CTASection />
      <LatestContent episodes={latest} posts={posts} />
      <Faq />
    </>
  );
}
