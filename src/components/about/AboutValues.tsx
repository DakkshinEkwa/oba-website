import { Section, SectionHeader } from "@/components/ui/Section";

const values = [
  {
    title: "Experience over theory",
    body: "Every conversation is led by someone who has actually faced the problem being discussed.",
  },
  {
    title: "Decisions, not tips",
    body: "What was decided, what it cost, and what the person would do differently next time.",
  },
  {
    title: "Specific to ophthalmology",
    body: "Referrals, service lines, premium conversion, co-management — not generic advice rebadged.",
  },
  {
    title: "Education, not promotion",
    body: "Speakers are invited for their experience, never for sponsorship. Nobody buys a seat.",
  },
];

/**
 * Four principles in a 2x2 divided grid.
 *
 * Bodies were 29–41 words each and the first one restated "firsthand
 * experience", which the intro and the closing CTA band both already say. Cut to
 * ~14 words apiece, which is where the homepage's card blurbs sit.
 *
 * Hairlines rather than bordered cards, so this does not repeat the timeline
 * above — the two used to be the same card at different padding.
 */
export function AboutValues() {
  return (
    <Section spacing="default">
      <SectionHeader
        eyebrow="What we believe"
        title="Four rules,"
        titleDim="applied to everything we publish."
      />
      {/*
        `divide-x` puts a left border on every item but the first, which in a
        two-column grid leaves a stray vertical rule on whichever item starts a
        new row. Odd children are always column one, so clearing their left
        border removes it without touching the real interior rules.
      */}
      <ul className="mt-14 grid divide-y divide-line border-y border-line md:grid-cols-2 md:divide-x md:[&>li:nth-child(odd)]:border-l-0">
        {values.map((v) => (
          <li key={v.title} className="px-0 py-10 md:px-8 md:odd:pl-0 md:even:pr-0">
            <h3 className="text-h4 font-normal text-ink-900">{v.title}</h3>
            <p className="mt-3 text-body text-ink-500">{v.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
