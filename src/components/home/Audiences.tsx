import { Section } from "@/components/ui/Section";
import { AudienceAccordion } from "@/components/marketing/AudienceAccordion";

const audiences = [
  {
    title: "Owners & Partners",
    body: "The decisions that come with the name on the door: growth, profitability, succession, and protecting clinical standards while the business scales.",
  },
  {
    title: "Administrators",
    body: "The systems behind a practice that runs well: staffing, patient flow, technology, and the day-to-day judgment calls that never make the textbooks.",
  },
  {
    title: "Industry Leaders",
    body: "The implementation reality behind diagnostics, imaging, AI, and workflow tools: what adoption actually looks like inside a practice.",
  },
  {
    title: "Emerging Leaders",
    body: "Residents, fellows, and employed ophthalmologists preparing for responsibilities that clinical training touches only briefly.",
  },
];

export function Audiences() {
  return (
    <Section tone="subtle" spacing="default" className="border-t border-line">
      {/* Header, cards, and the scroll math all live in the client component:
          the pin needs them inside one wrapper it can measure. */}
      <AudienceAccordion
        items={audiences}
        eyebrow="Who it's for"
        title="Different seats,"
        titleDim="the same hard decisions."
        lede="OBA's conversations are made for the people responsible for how an ophthalmology practice actually runs."
      />
    </Section>
  );
}
