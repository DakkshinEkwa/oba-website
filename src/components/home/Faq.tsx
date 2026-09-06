import { Section, SectionHeader } from "@/components/ui/Section";
import { FaqAccordion } from "@/components/ui/Accordion";
import { getGeneralFaqs } from "@/lib/faq-data";

export function Faq() {
  const faqs = getGeneralFaqs();
  return (
    <Section id="faq" spacing="default" containerSize="default" className="scroll-mt-24 border-t border-line">
      <SectionHeader eyebrow="Questions" title="Frequently asked questions" align="center" />
      <div className="mt-10">
        <FaqAccordion items={faqs} />
      </div>
    </Section>
  );
}
