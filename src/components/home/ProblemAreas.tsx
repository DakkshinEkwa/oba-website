import { Section, SectionHeader } from "@/components/ui/Section";

const problemAreas = [
  {
    title: "Growth & referrals",
    body: "Building referral relationships, developing service lines, and growing a practice without compromising the standard of care that built its reputation.",
  },
  {
    title: "Patient experience & care",
    body: "The decisions behind better patient experiences — education, counseling, follow-up, adherence, and coordinating care across a growing team.",
  },
  {
    title: "Leadership & teams",
    body: "Hiring, retention, culture, and accountability — and the transition from clinician to leader that training never prepared anyone for.",
  },
  {
    title: "Technology & innovation",
    body: "Adopting new technology responsibly: what to implement, when, and how — from EMR transitions to AI, imaging, and workflow tools.",
  },
];

export function ProblemAreas() {
  return (
    <Section spacing="default">
      <SectionHeader
        eyebrow="What we talk about"
        title="The decisions that determine"
        titleDim="whether a practice thrives."
        lede="Clinical training builds excellent physicians. It rarely covers the decisions that follow — and those decisions are what OBA's conversations are for."
      />
      <div className="mt-14 grid divide-y divide-line border-y border-line md:grid-cols-2 md:divide-x lg:grid-cols-4 lg:divide-y-0">
        {problemAreas.map((f, i) => (
          <div key={f.title} className="px-0 py-10 md:px-8 md:first:pl-0 md:last:pr-0">
            <span className="font-mono text-eyebrow text-ink-300">[{i + 1}]</span>
            <h3 className="mt-4 text-h3 font-normal">{f.title}</h3>
            <p className="mt-3 text-body text-ink-500">{f.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
