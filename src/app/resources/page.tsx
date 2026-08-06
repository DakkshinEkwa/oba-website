import type { Metadata } from "next";
import Link from "next/link";
import { Headphones, FileText, Video, CalendarDays, Mail, ArrowUpRight } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { PageHero } from "@/components/marketing/PageHero";
import { EpisodeCard } from "@/components/content/EpisodeCard";
import { BlogCard } from "@/components/content/BlogCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { CTASection } from "@/components/marketing/CTASection";
import { getAllEpisodes, getAllBlogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Expert Insights Hub",
  description:
    "Podcasts, articles, webinars, and events — every OB Academy resource for growing your ophthalmology practice, in one place.",
};

const hubLinks = [
  { icon: Headphones, title: "Podcast", body: "Recorded conversations with practice leaders.", href: "/podcast/episodes" },
  { icon: FileText, title: "Blog", body: "Practical articles on practice growth.", href: "/blog" },
  { icon: Video, title: "Webinars", body: "On-demand expert sessions.", href: "/resources/webinars" },
  { icon: CalendarDays, title: "Events", body: "Live panels and discussions.", href: "/resources/events" },
  { icon: Mail, title: "Newsletter", body: "New conversations to your inbox.", href: "/resources/newsletter" },
];

export default function ResourcesPage() {
  const episodes = getAllEpisodes().slice(0, 3);
  const posts = getAllBlogPosts().slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow="Expert Insights Hub"
        title="Every OBA resource, in one place"
        lede="Conversations, articles, webinars, and events — organized for ophthalmologists and the people who run their practices."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Resources" }]}
      />

      <Section spacing="default">
        <SectionHeader eyebrow="Explore" title="Browse the hub" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {hubLinks.map((l) => (
            <Link
              key={l.title}
              href={l.href}
              className="group flex items-start gap-4 rounded-lg border border-line p-6 transition-colors hover:border-ink-300"
            >
              <div className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
                <l.icon className="size-5" aria-hidden />
              </div>
              <div>
                <h3 className="flex items-center gap-1 text-h3 font-normal group-hover:text-accent-700">
                  {l.title}
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                </h3>
                <p className="mt-1 text-body text-ink-500">{l.body}</p>
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
              body="The conversation library is being built — the first episodes are on the way."
            />
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {episodes.map((ep) => (
              <EpisodeCard key={ep.slug} episode={ep} />
            ))}
          </div>
        )}
      </Section>

      {posts.length > 0 ? (
        <Section spacing="default">
          <SectionHeader eyebrow="From the blog" title="Latest articles" />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </Section>
      ) : null}

      <CTASection />
    </>
  );
}
