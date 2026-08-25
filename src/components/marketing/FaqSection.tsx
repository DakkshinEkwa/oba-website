import { Section, SectionHeader } from "@/components/ui/Section";
import { FaqAccordion, type FaqItem } from "@/components/ui/Accordion";
import { faqJsonLd } from "@/lib/jsonld";

/**
 * A page's FAQ block. Renders the visible accordion and emits the matching
 * FAQPage structured data from the same array, so the two can never disagree.
 */
export function FaqSection({
  items,
  eyebrow = "Common questions",
  title,
  titleDim,
  lede,
  spacing = "default",
}: {
  items: FaqItem[];
  eyebrow?: string;
  title: string;
  titleDim?: string;
  lede?: string;
  spacing?: React.ComponentProps<typeof Section>["spacing"];
}) {
  if (items.length === 0) return null;
  return (
    <Section spacing={spacing} containerSize="narrow">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(items)) }}
      />
      <SectionHeader eyebrow={eyebrow} title={title} titleDim={titleDim} lede={lede} />
      <FaqAccordion items={items} className="mt-10" />
    </Section>
  );
}
