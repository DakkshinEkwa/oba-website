import { Headphones, Mic, Handshake, ArrowRight } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { IconCard } from "@/components/ui/IconCard";
import { Button } from "@/components/ui/Button";

const engagements = [
  {
    icon: Headphones,
    title: "Listen & apply",
    body: "Start with the conversations closest to the decision in front of you — the full library is free.",
    cta: { label: "Browse Episodes", href: "/podcast/episodes" },
  },
  {
    icon: Mic,
    title: "Contribute your experience",
    body: "If you've navigated a problem your peers are still facing, join a conversation as a speaker or panelist.",
    cta: { label: "Become a Speaker", href: "/speak" },
  },
  {
    icon: Handshake,
    title: "Support the conversation",
    body: "Organizations serving ophthalmology can back credible education — without turning it into advertising.",
    cta: { label: "Explore Partnerships", href: "/partnerships" },
  },
];

export function Engagements() {
  return (
    <Section spacing="default">
      <SectionHeader
        eyebrow="Ways to engage"
        title="Three ways in."
        lede="Whether you're here to learn, to contribute, or to support the work — there's a clear next step."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {engagements.map((e) => (
          <IconCard
            key={e.title}
            icon={e.icon}
            title={e.title}
            body={e.body}
            chip="lg"
            bodyClassName="flex-1"
          >
            <Button href={e.cta.href} variant="link" className="mt-5">
              {e.cta.label} <ArrowRight className="size-4" aria-hidden />
            </Button>
          </IconCard>
        ))}
      </div>
    </Section>
  );
}
