import type { Metadata } from "next";
import { Section, SectionHeader } from "@/components/ui/Section";
import { DarkHero } from "@/components/marketing/DarkHero";
import { HostCard } from "@/components/content/HostCard";
import { CTASection } from "@/components/marketing/CTASection";
import { getAllHosts, getAllEpisodes, getEpisodeStats } from "@/lib/content";

export const metadata: Metadata = {
  title: "About OBA",
  description:
    "What the Ophthalmology Business Academy is, why it exists, and the editorial principles behind every conversation we publish.",
};

const values = [
  {
    title: "Experience over theory",
    body: "Every conversation is led by someone with firsthand experience of the problem — people who run practices, lead teams, and have made the decisions being discussed.",
  },
  {
    title: "Decisions, not tips",
    body: "We're less interested in generic advice than in real choices: what was decided, what it cost, what the trade-offs were, and what the person would do differently.",
  },
  {
    title: "Specific to ophthalmology",
    body: "Referral patterns, surgical service lines, premium conversion, co-management — our conversations start from eye care's realities, not generic business advice with a logo swapped in.",
  },
  {
    title: "Education, not promotion",
    body: "Nobody's participation is a purchase. Speakers are invited for their experience, not their sponsorship, and no conversation is scripted by a commercial interest.",
  },
];

export default function AboutPage() {
  const hosts = getAllHosts();
  const count = getAllEpisodes().length;
  const stats = getEpisodeStats();

  return (
    <>
      <DarkHero
        size="band"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        eyebrow="About OBA"
        eyebrowDot
        title="A forum for the decisions clinical"
        titleDim="training never covered"
        lede="The Ophthalmology Business Academy convenes experienced ophthalmology leaders to examine, on the record, the business of running a stronger practice."
        proof={
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            <div>
              <p className="text-h4 font-medium text-white">{stats.count}+</p>
              <p className="mt-1 font-mono text-micro uppercase tracking-wide text-white/50">Conversations</p>
            </div>
            <div>
              <p className="text-h4 font-medium text-white">Since {stats.firstYear}</p>
              <p className="mt-1 font-mono text-micro uppercase tracking-wide text-white/50">Recording</p>
            </div>
            <div>
              <p className="text-h4 font-medium text-white">{stats.hostCount}</p>
              <p className="mt-1 font-mono text-micro uppercase tracking-wide text-white/50">Named hosts</p>
            </div>
          </div>
        }
      />

      <Section spacing="default" containerSize="narrow">
        <div className="text-body-lg text-ink-600">
          <p>
            Medical training produces excellent clinicians. It says almost nothing about the
            decisions that follow: how to grow a referral network, when to add a service line,
            how to lead a team through change, whether to adopt a new technology, what to do
            when private equity calls. Those decisions increasingly determine whether a
            practice thrives — and most ophthalmologists are left to figure them out alone.
          </p>
          <p className="mt-5">
            OBA exists so they don&apos;t have to. Since 2022 we&apos;ve recorded {count}+
            conversations with the people who have actually faced these decisions — practice
            owners, administrators, physicians, educators, and industry experts — and made
            every one of them freely available. The format is deliberately simple: a real
            problem, someone with firsthand experience of it, and a candid discussion of what
            worked, what didn&apos;t, and why.
          </p>
          <p className="mt-5">
            A note on transparency: OBA was founded by Naren Arulrajah, CEO of Ekwa Marketing,
            as a way to give back to the ophthalmology community. Ekwa separately offers
            practices a complimentary marketing analysis — that is a service, clearly labeled
            as one, and it is kept apart from OBA&apos;s educational content. No conversation
            we publish is a pitch for it, or for anyone else.
          </p>
        </div>
      </Section>

      <Section tone="subtle" spacing="default">
        <SectionHeader eyebrow="What we believe" title="The principles behind everything we publish" />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {values.map((v) => (
            <div key={v.title} className="rounded-lg border border-line bg-canvas p-7">
              <h3 className="text-h3 font-normal">{v.title}</h3>
              <p className="mt-2 text-body text-ink-500">{v.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {hosts.length > 0 ? (
        <Section spacing="default">
          <SectionHeader eyebrow="The team" title="Hosts & regular contributors" />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
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
