import { Mic, Headphones, Users, ArrowRight } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { DarkHero } from "@/components/marketing/DarkHero";
import { Button } from "@/components/ui/Button";
import { EpisodeCard } from "@/components/content/EpisodeCard";
import { HostCard } from "@/components/content/HostCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconCard } from "@/components/ui/IconCard";
import { CTASection } from "@/components/marketing/CTASection";
import { Waveform } from "@/components/ui/Waveform";
import { getAllEpisodes, getAllHosts, getEpisodeStats } from "@/lib/content";
import { pageMetadata } from "@/lib/og/metadata";

export const metadata = pageMetadata({
  title: "About the Podcast",
  description:
    "The Ophthalmology Business Podcast: candid, non-promotional conversations about the decisions behind stronger eye-care practices.",
  path: "/podcast",
});

export default function PodcastPage() {
  const latest = getAllEpisodes().slice(0, 3);
  const hosts = getAllHosts().slice(0, 3);
  const stats = getEpisodeStats();
  const count = getAllEpisodes().length;

  return (
    <>
      <DarkHero
        size="full"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Podcast" }]}
        eyebrow="The Ophthalmology Business Podcast"
        eyebrowDot
        title="Where ophthalmology talks business,"
        titleDim="on the record"
        lede={`${count}+ candid conversations with the physicians, administrators, and industry experts who have faced the decisions behind modern ophthalmology practices, recorded since 2022.`}
        proof={
          <Waveform bars={16} baseHeight={26} className="text-white/40" animated />
        }
        footer={
          <div className="grid max-w-2xl grid-cols-3 divide-x divide-white/15">
            {[
              { t: `${stats.count}+`, s: "Conversations recorded" },
              { t: `Since ${stats.firstYear}`, s: "And still recording" },
              { t: `${stats.hostCount}`, s: "Named hosts & contributors" },
            ].map((m) => (
              <div key={m.t} className="pr-6 pl-6 first:pl-0">
                <p className="text-h4 font-medium text-white">{m.t}</p>
                <p className="mt-1 text-small text-white/45">{m.s}</p>
              </div>
            ))}
          </div>
        }
      >
        <Button href="/podcast/episodes" variant="onDark" size="lg">
          <Headphones className="size-4" aria-hidden /> Browse all episodes
        </Button>
        <Button href="/podcast/hosts" variant="frosted" size="lg">
          Meet the hosts
        </Button>
      </DarkHero>

      <Section spacing="default">
        <SectionHeader
          eyebrow="About the show"
          title="Three commitments, every episode"
          lede="The show is built on the same standards in every conversation."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: Mic, title: "Experience-led", body: "Hosted by operators and physicians who run real practices, and guests who have personally faced the problem being discussed." },
            { icon: Headphones, title: "Decision-focused", body: "Each conversation digs into a real choice: what was decided, what it cost, and what the trade-offs were." },
            { icon: Users, title: "Non-promotional", body: "No episode is a sales pitch. Guests are invited for their experience, not their sponsorship." },
          ].map((f) => (
            <IconCard key={f.title} icon={f.icon} title={f.title} body={f.body} chip="lg" />
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
              body="The conversation library is being built; the first episodes are on the way."
            />
          </div>
        ) : (
          <div className="panel-grid mt-10">
            {latest.map((ep) => (
              <EpisodeCard key={ep.slug} episode={ep} variant="panel" />
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
