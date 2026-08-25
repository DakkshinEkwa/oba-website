import { Check } from "lucide-react";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/ui/Section";
import { DarkHero } from "@/components/marketing/DarkHero";
import { Button } from "@/components/ui/Button";
import { FaqAccordion } from "@/components/ui/Accordion";
import { CTASection } from "@/components/marketing/CTASection";
import { pageMetadata } from "@/lib/og/metadata";

export const metadata = pageMetadata({
  title: "Membership",
  description:
    "Free membership in the Ophthalmology Business Academy: the full conversation library, articles, the newsletter, and invitations to upcoming panels and events.",
  path: "/membership",
});

const included = [
  "The full podcast library: every conversation, on demand",
  "Articles on practice growth, operations, and leadership",
  "The OBA newsletter: new conversations and event invitations",
  "Invitations to upcoming panels and webinars as they're scheduled",
  "First word when new programming is announced",
];

const faqs = [
  {
    question: "How much does membership cost?",
    answer:
      "Nothing. Membership is free: join the newsletter and the full library of conversations and resources is yours, with no account required.",
  },
  {
    question: "Who is membership for?",
    answer:
      "Ophthalmologists, practice owners, administrators, operations and patient-experience leaders, and anyone responsible for the business side of an eye-care practice, including residents and fellows preparing for those responsibilities.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes, there's no commitment of any kind. Unsubscribe from the newsletter whenever you like.",
  },
];

export default function MembershipPage() {
  return (
    <>
      <DarkHero
        size="band"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Membership" }]}
        eyebrow="Join the academy"
        eyebrowDot
        title="Free membership,"
        titleDim="full library"
        lede="Every OBA conversation and resource, free, plus invitations to panels and webinars as new programming is scheduled."
      />

      <Section spacing="default">
        <div className="mx-auto max-w-lg rounded-xl border border-line bg-canvas p-8">
          <p className="font-mono text-eyebrow uppercase text-accent-600">Free membership</p>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-display font-light tracking-tight text-ink-900">$0</span>
            <span className="text-body text-ink-400">/ forever</span>
          </div>
          <p className="mt-2 text-body text-ink-500">
            Full access to the academy&apos;s educational resources.
          </p>
          <ul className="mt-6 space-y-3">
            {included.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-body text-ink-600">
                <Check className="mt-0.5 size-5 shrink-0 text-accent-600" aria-hidden />
                {f}
              </li>
            ))}
          </ul>
          <Button href="/resources/newsletter" variant="primary" size="lg" className="mt-8 w-full">
            Join the newsletter
          </Button>
          <p className="mt-3 text-center text-small text-ink-400">
            No account needed: membership is free and open. Prefer to explore first?{" "}
            <Link href="/podcast/episodes" className="text-accent-600 hover:text-accent-700">
              Browse the episode library
            </Link>
          </p>
        </div>
      </Section>

      <Section tone="subtle" spacing="default" containerSize="narrow">
        <SectionHeader eyebrow="Questions" title="Membership FAQ" align="center" />
        <div className="mt-10">
          <FaqAccordion items={faqs} />
        </div>
      </Section>

      <CTASection />
    </>
  );
}
