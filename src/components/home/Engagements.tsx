import { Headphones, Mic, Handshake, CalendarDays, ArrowRight } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { IconCard } from "@/components/ui/IconCard";
import { Button } from "@/components/ui/Button";

const engagements = [
  {
    icon: Headphones,
    title: "Listen & apply",
    body: "Start with the conversations closest to the decision in front of you: the full library is free.",
    cta: { label: "Browse Episodes", href: "/podcast/episodes" },
  },
  {
    icon: Mic,
    title: "Contribute your experience",
    body: "If you've navigated a problem your peers are still facing, join a conversation as a speaker or panelist.",
    cta: { label: "Become a Speaker", href: "/speak" },
  },
  {
    icon: CalendarDays,
    title: "Attend live panels",
    body: "Expert panels are being scheduled; newsletter subscribers hear about them first, and replays follow each session.",
    cta: { label: "See Panels & Events", href: "/resources/events" },
  },
  {
    icon: Handshake,
    title: "Support the conversation",
    body: "Organizations serving ophthalmology can back credible education, without turning it into advertising.",
    cta: { label: "Explore Partnerships", href: "/partnerships" },
  },
];

export function Engagements() {
  return (
    <Section spacing="default">
      <SectionHeader
        eyebrow="Ways to engage"
        title="Four ways in."
        lede="Whether you're here to learn, to contribute, or to support the work, there's a clear next step."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
