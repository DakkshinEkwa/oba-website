import { Section, SectionHeader } from "@/components/ui/Section";

const audiences = [
  {
    title: "Practice owners & partners",
    body: "The decisions that come with the name on the door: growth, profitability, succession, and protecting clinical standards while the business scales.",
  },
  {
    title: "Administrators & operations leaders",
    body: "The systems behind a practice that runs well: staffing, patient flow, technology, and the day-to-day judgment calls that never make the textbooks.",
  },
  {
    title: "Industry & technology leaders",
    body: "The implementation reality behind diagnostics, imaging, AI, and workflow tools: what adoption actually looks like inside a practice.",
  },
  {
    title: "Emerging leaders",
    body: "Residents, fellows, and employed ophthalmologists preparing for responsibilities that clinical training touches only briefly.",
  },
];

export function Audiences() {
  return (
    <Section tone="subtle" spacing="default">
      <SectionHeader
        eyebrow="Who it's for"
        title="Different seats,"
        titleDim="the same hard decisions."
        lede="OBA's conversations are made for the people responsible for how an ophthalmology practice actually runs."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {audiences.map((a) => (
          <div key={a.title} className="rounded-lg border border-line bg-canvas p-7">
            <h3 className="text-h3 font-normal">{a.title}</h3>
            <p className="mt-2 text-body text-ink-500">{a.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
