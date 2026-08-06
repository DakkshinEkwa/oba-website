import type { Metadata } from "next";
import { Mic, Headphones, Users, ArrowRight } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { PageHero } from "@/components/marketing/PageHero";
import { Button } from "@/components/ui/Button";
import { EpisodeCard } from "@/components/content/EpisodeCard";
import { HostCard } from "@/components/content/HostCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { CTASection } from "@/components/marketing/CTASection";
import { getAllEpisodes, getAllHosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "About the Podcast",
  description:
    "The Ophthalmology Business Podcast — candid, non-promotional conversations about the decisions behind stronger eye-care practices.",
};

export default function PodcastPage() {
  const latest = getAllEpisodes().slice(0, 3);
  const hosts = getAllHosts().slice(0, 3);
  const count = getAllEpisodes().length;

  return (
    <>
      <PageHero
        eyebrow="The Ophthalmology Business Podcast"
        title="Where ophthalmology talks business, on the record"
        lede={`${count}+ candid conversations with the physicians, administrators, and industry experts who have faced the decisions behind modern ophthalmology practices — recorded since 2022.`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Podcast" }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/podcast/episodes" variant="primary">
            <Headphones className="size-4" aria-hidden /> Browse all episodes
          </Button>
          <Button href="/podcast/hosts" variant="outline">
            Meet the hosts
          </Button>
        </div>
      </PageHero>

      <Section spacing="default">
        <SectionHeader
          eyebrow="About the show"
          title="Three commitments, every episode"
          lede="The show is built on the same standards in every conversation."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: Mic, title: "Experience-led", body: "Hosted by operators and physicians who run real practices — and guests who have personally faced the problem being discussed." },
            { icon: Headphones, title: "Decision-focused", body: "Each conversation digs into a real choice: what was decided, what it cost, and what the trade-offs were." },
            { icon: Users, title: "Non-promotional", body: "No episode is a sales pitch. Guests are invited for their experience, not their sponsorship." },
          ].map((f) => (
            <div key={f.title} className="rounded-lg border border-line p-7">
              <div className="inline-flex size-12 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
                <f.icon className="size-6" aria-hidden />
              </div>
              <h3 className="mt-5 text-h3 font-normal">{f.title}</h3>
              <p className="mt-2 text-body text-ink-500">{f.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="subtle" spacing="default">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader eyebrow="Recent" title="Latest episodes" className="max-w-xl" />
          <Button href="/podcast/episodes" variant="link">
            All episodes <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
        {latest.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              icon={Headphones}
              title="No episodes yet"
              body="The conversation library is being built — the first episodes are on the way."
            />
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latest.map((ep) => (
              <EpisodeCard key={ep.slug} episode={ep} />
            ))}
          </div>
        )}
      </Section>

      {hosts.length > 0 ? (
        <Section spacing="default">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeader eyebrow="The voices" title="Hosts & regular contributors" className="max-w-xl" />
            <Button href="/podcast/hosts" variant="link">
              All hosts <ArrowRight className="size-4" aria-hidden />
            </Button>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {hosts.map((h) => (
              <HostCard key={h.slug} host={h} />
            ))}
          </div>
        </Section>
      ) : null}

      <CTASection />
    </>
  );
}
