import Link from "next/link";
import { Headphones, FileText, Video, CalendarDays, Mail, Download, ArrowUpRight } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { DarkHero } from "@/components/marketing/DarkHero";
import { EpisodeCard } from "@/components/content/EpisodeCard";
import { BlogCard } from "@/components/content/BlogCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { CTASection } from "@/components/marketing/CTASection";
import { getAllEpisodes, getAllBlogPosts } from "@/lib/content";
import { pageMetadata } from "@/lib/og/metadata";

export const metadata = pageMetadata({
  title: "Expert Insights Hub",
  description:
    "Podcasts, articles, webinars, and events: every OB Academy resource for growing your ophthalmology practice, in one place.",
  path: "/resources",
});

const hubLinks = [
  { icon: Headphones, title: "Podcast", body: "Recorded conversations with practice leaders.", href: "/podcast/episodes" },
  { icon: FileText, title: "Blog", body: "Practical articles on practice growth.", href: "/blog" },
  { icon: Download, title: "Free Resources", body: "Guides, templates, and checklists.", href: "/resources/free-resources" },
  { icon: Video, title: "Webinars", body: "On-demand expert sessions.", href: "/resources/webinars" },
  { icon: CalendarDays, title: "Events", body: "Live panels and discussions.", href: "/resources/events" },
  { icon: Mail, title: "Newsletter", body: "New conversations to your inbox.", href: "/resources/newsletter" },
];

export default function ResourcesPage() {
  const episodes = getAllEpisodes().slice(0, 3);
  const posts = getAllBlogPosts().slice(0, 3);

  return (
    <>
      <DarkHero
        size="band"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Resources" }]}
        eyebrow="Expert Insights Hub"
        eyebrowDot
        title="Every OBA resource,"
        titleDim="in one place"
        lede="Conversations, articles, webinars, and events, organized for ophthalmologists and the people who run their practices."
      />

      <Section spacing="default">
        <SectionHeader eyebrow="Explore" title="Browse the hub" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {hubLinks.map((l) => (
            <Link
              key={l.title}
              href={l.href}
              className="group flex items-start gap-4 rounded-[20px] border border-line p-7 transition-colors duration-200 ease-in-out hover:bg-canvas-subtle"
            >
              <div className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
                <l.icon className="size-5" aria-hidden />
              </div>
              <div className="min-w-0 transition-transform duration-200 ease-in-out group-hover:translate-x-2">
                <h3 className="flex items-center gap-1 text-h3 font-normal text-ink-900">
                  {l.title}
                  <ArrowUpRight className="size-4 opacity-0 transition-[opacity,transform] duration-200 ease-in-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" aria-hidden />
                </h3>
                <p className="mt-1 text-body font-light text-ink-400">{l.body}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section tone="subtle" spacing="default">
        <SectionHeader eyebrow="From the podcast" title="Latest episodes" />
        {episodes.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              icon={Headphones}
              title="No episodes yet"
              body="The conversation library is being built; the first episodes are on the way."
            />
          </div>
        ) : (
          <div className="panel-grid mt-10">
            {episodes.map((ep) => (
              <EpisodeCard key={ep.slug} episode={ep} variant="panel" />
            ))}
          </div>
        )}
      </Section>

      {posts.length > 0 ? (
        <Section spacing="default">
          <SectionHeader eyebrow="From the blog" title="Latest articles" />
          <div className="panel-grid mt-10">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} variant="panel" />
            ))}
          </div>
        </Section>
      ) : null}

      <CTASection />
    </>
  );
}
