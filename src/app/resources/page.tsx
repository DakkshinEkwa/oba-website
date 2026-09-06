import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { DarkHero } from "@/components/marketing/DarkHero";
import { CTASection } from "@/components/marketing/CTASection";
import { ResourceDirectory } from "@/components/resources/ResourceDirectory";
import { ResourceFlagship } from "@/components/resources/ResourceFlagship";
import { BlogRow } from "@/components/content/BlogRow";
import { ArrowRight } from "lucide-react";
import {
  getAllEpisodes,
  getAllBlogPosts,
  getAllEvents,
  getAllFreeResources,
} from "@/lib/content";
import { pageMetadata } from "@/lib/og/metadata";

export const metadata = pageMetadata({
  title: "Expert Insights Hub",
  description:
    "Podcasts, articles, guides, and events: every OB Academy resource for growing your ophthalmology practice, in one place.",
  path: "/resources",
});

export default function ResourcesPage() {
  const episodes = getAllEpisodes();
  const posts = getAllBlogPosts();
  const events = getAllEvents();
  const resources = getAllFreeResources();

  // Every figure on this page is a live count off the loaders, so the hub can
  // never promise more than the library holds.
  const directory = [
    {
      title: "Podcast",
      body: "Recorded conversations with the people who run ophthalmology practices.",
      href: "/podcast/episodes",
      count: `${episodes.length} conversations`,
    },
    {
      title: "Blog",
      body: "Short, practical articles on growth, operations, and leadership.",
      href: "/blog",
      count: `${posts.length} articles`,
    },
    {
      title: "Free Resources",
      body: "Downloadable guides you can hand straight to your team.",
      href: "/resources/free-resources",
      count: `${resources.length} guides`,
    },
    {
      title: "Events",
      body: "Live virtual panels, held on the record and open to attend.",
      href: "/resources/events",
      count: `${events.length} panels`,
    },
  ];

  return (
    <>
      <DarkHero
        size="band"
        containerSize="default"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Resources" }]}
        eyebrow="Expert Insights Hub"
        eyebrowDot
        title="Every OBA resource,"
        titleDim="in one place"
        lede="Conversations, articles, guides, and panels, indexed for the people who run eye-care practices."
        proof={
          <dl className="flex flex-wrap gap-x-10 gap-y-4">
            {[
              { value: `${episodes.length}+`, label: "Conversations" },
              { value: `${posts.length}`, label: "Articles" },
              { value: `${resources.length}`, label: "Guides" },
              { value: `${events.length}`, label: "Panels" },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-h4 font-medium text-white">{stat.value}</span>
                  <span className="mt-1 block font-mono text-micro uppercase tracking-wide text-white/50">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        }
      />

      <Section spacing="default">
        <SectionHeader
          eyebrow="Explore"
          title="Four ways in,"
          titleDim="depending on what you need."
        />
        <ResourceDirectory entries={directory} />
      </Section>

      <ResourceFlagship episode={episodes[0]} />

      {posts.length > 0 ? (
        <Section spacing="default">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeader
              eyebrow="From the blog"
              title="Recent articles"
              className="max-w-xl"
            />
            <Button href="/blog" variant="link">
              All articles <ArrowRight className="size-4" aria-hidden />
            </Button>
          </div>
          <ol className="episode-list mt-10">
            {posts.slice(0, 3).map((post, i) => (
              <BlogRow key={post.slug} post={post} priority={i === 0} />
            ))}
          </ol>
        </Section>
      ) : null}

      <CTASection tone="light" />
    </>
  );
}
