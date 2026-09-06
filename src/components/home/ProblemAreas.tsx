import { Section, SectionHeader } from "@/components/ui/Section";

const problemAreas = [
  {
    title: "Growth",
    body: "Referral relationships and new service lines, built without trading away the standard of care.",
  },
  {
    title: "Patient Experience",
    body: "Education, counseling, follow-up, and adherence, coordinated across a team that keeps growing.",
  },
  {
    title: "Leadership",
    body: "Hiring, retention, culture, and the transition from clinician to leader that training never covered.",
  },
  {
    title: "Technology",
    body: "What to adopt and when, from EMR transitions to imaging, AI, and workflow tools.",
  },
];

export function ProblemAreas() {
  return (
    <Section spacing="default">
      <SectionHeader
        align="center"
        eyebrow="What we talk about"
        title="What determines"
        titleDim="whether a practice thrives."
      />
      <div className="mt-14 grid divide-y divide-line border-y border-line md:grid-cols-2 md:divide-x lg:grid-cols-4 lg:divide-y-0">
        {problemAreas.map((f, i) => (
          <div key={f.title} className="px-0 py-10 md:px-8 md:first:pl-0 md:last:pr-0">
            <span className="font-mono text-eyebrow text-ink-300">[{i + 1}]</span>
            <h3 className="mt-4 text-h4 font-normal">{f.title}</h3>
            <p className="mt-3 text-body text-ink-500">{f.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
