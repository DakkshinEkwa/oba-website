import type { Metadata } from "next";
import { Search, LineChart, Target, ShieldCheck } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { IconCard } from "@/components/ui/IconCard";
import { FaqAccordion } from "@/components/ui/Accordion";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Practice Marketing Analysis",
  description:
    "A complimentary, no-obligation review of your ophthalmology practice's digital marketing, provided by Ekwa Marketing — a service offered alongside, and separate from, OBA's educational content.",
};

const steps = [
  { icon: Search, title: "They review your presence", body: "Website, search visibility, reviews, and how you compare to nearby practices." },
  { icon: LineChart, title: "You get a clear report", body: "A plain-language breakdown of what's working and where you're losing patients." },
  { icon: Target, title: "You get an action plan", body: "Specific, prioritized recommendations you can act on — with or without them." },
];

const faqs = [
  {
    question: "Who actually performs the analysis?",
    answer:
      "Ekwa Marketing — the practice-marketing firm led by OBA's founder, Naren Arulrajah. It works with medical practices, including ophthalmology. This is a commercial service offered alongside OBA, not part of OBA's educational programming.",
  },
  {
    question: "Is this really free?",
    answer: "Yes. The analysis is complimentary and there is no obligation to buy anything.",
  },
  {
    question: "How long does it take?",
    answer: "The review takes a few business days, after which an advisor walks you through the findings.",
  },
  {
    question: "What do you need from me?",
    answer: "Just your practice name and website. The more context you share, the more tailored the analysis.",
  },
];

export default function AnalyzePage() {
  return (
    <>
      <section className="border-b border-line bg-canvas-subtle">
        <Container>
          <div className="grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-20">
            <div>
              <Eyebrow>A service from Ekwa Marketing</Eyebrow>
              <h1 className="mt-4 text-h1 font-light tracking-tight text-ink-900">
                See where your practice marketing stands
              </h1>
              <p className="mt-4 text-lede text-ink-500">
                A complimentary, no-obligation review of your digital marketing from Ekwa
                Marketing, the practice-marketing firm led by OBA&apos;s founder. Know
                what&apos;s working, what isn&apos;t, and what to fix first.
              </p>
              <p className="mt-3 text-body text-ink-400">
                To be clear: this is a commercial service offered alongside OBA — it is not
                part of the academy&apos;s educational content, and no OBA conversation
                promotes it.
              </p>
              <ul className="mt-6 space-y-2.5">
                {["No cost, no obligation", "Specific to medical practices", "A clear, prioritized action plan"].map(
                  (b) => (
                    <li key={b} className="flex items-center gap-2.5 text-body text-ink-600">
                      <ShieldCheck className="size-5 text-accent-600" aria-hidden />
                      {b}
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div id="request" className="rounded-xl border border-line bg-canvas p-6 sm:p-8">
              <h2 className="text-h3 font-normal">Request the complimentary analysis</h2>
              <p className="mt-1 text-body text-ink-500">Takes under a minute.</p>
              <div className="mt-6">
                <ContactForm variant="analyze" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Section tone="subtle" spacing="default">
        <SectionHeader eyebrow="How it works" title="Three simple steps" align="center" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <IconCard
              key={s.title}
              icon={s.icon}
              title={s.title}
              body={s.body}
              meta={<span className="font-mono text-eyebrow uppercase text-ink-300">0{i + 1}</span>}
            />
          ))}
        </div>
      </Section>

      <Section tone="subtle" spacing="default" containerSize="narrow">
        <SectionHeader eyebrow="Questions" title="Frequently asked" align="center" />
        <div className="mt-10">
          <FaqAccordion items={faqs} />
        </div>
      </Section>
    </>
  );
}
