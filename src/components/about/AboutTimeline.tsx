import { Section, SectionHeader } from "@/components/ui/Section";

const milestones = [
  {
    year: "2022",
    title: "The podcast launches",
    body: "Founder Naren Arulrajah debuts the show with Guido Piquet, COO of Mann Eye Institute.",
  },
  {
    year: "2023",
    title: "The faculty grows",
    body: "Surgeons, refractive specialists and certified ophthalmic executives join as hosts.",
  },
  {
    year: "2024",
    title: "The library matures",
    body: "The catalog passes 75 recorded conversations across the business of eye care.",
  },
  {
    year: "2026",
    title: "The relaunch",
    body: "OBA returns on a rebuilt platform, with the full library and a live panel season.",
  },
];

/**
 * Four milestones as a divided strip rather than four bordered cards.
 *
 * The cards were `rounded-lg border border-line bg-canvas p-6` — the same
 * treatment as the values grid below at `p-7`, so the page ran two nearly
 * identical card systems back to back. Hairlines cost less and let the years,
 * which are the actual content, carry the section.
 */
export function AboutTimeline() {
  return (
    <Section tone="subtle" spacing="default">
      <SectionHeader
        eyebrow="Our story"
        title="One podcast,"
        titleDim="then a growing academy."
        lede="It started with a pattern we couldn't ignore: strong clinicians held back by the business side."
      />
      {/*
        At md this is two columns, so the third item starts a row and `divide-x`
        would leave a stray left border on it; clearing odd children fixes that.
        At lg all four sit in one row and the third needs its rule back.
      */}
      <ol className="mt-14 grid divide-y divide-line border-y border-line md:grid-cols-2 md:divide-x md:[&>li:nth-child(odd)]:border-l-0 lg:grid-cols-4 lg:divide-y-0 lg:[&>li:nth-child(3)]:border-l">
        {milestones.map((m) => (
          <li key={m.year} className="px-0 py-10 md:px-8 md:first:pl-0 md:last:pr-0">
            <span className="font-mono text-eyebrow uppercase text-accent-600">{m.year}</span>
            <h3 className="mt-4 text-h4 font-normal text-ink-900">{m.title}</h3>
            <p className="mt-3 text-body text-ink-500">{m.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
