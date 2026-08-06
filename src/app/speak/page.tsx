import type { Metadata } from "next";
import {
  Stethoscope,
  Building2,
  GraduationCap,
  HeartHandshake,
  Cpu,
  MessageSquareQuote,
  CalendarCheck,
  Mic,
  Send,
  ShieldCheck,
} from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { PageHero } from "@/components/marketing/PageHero";
import { Button } from "@/components/ui/Button";
import { IconCard } from "@/components/ui/IconCard";
import { ChecklistItem } from "@/components/ui/ChecklistItem";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Become a Speaker",
  description:
    "OBA convenes experienced ophthalmology professionals for candid, non-promotional conversations. If you've navigated a problem your peers are still facing, share your area of expertise.",
};

const expertiseGroups = [
  {
    icon: Stethoscope,
    title: "Clinicians & subspecialists",
    body: "Cataract, glaucoma, retina, cornea, dry eye, low vision, and aging-eye specialists with experience building or changing how care is delivered.",
  },
  {
    icon: Building2,
    title: "Owners, directors & administrators",
    body: "Practice owners, managing partners, medical directors, and administrators who have led growth, transitions, or hard operational decisions.",
  },
  {
    icon: GraduationCap,
    title: "Educators & academic leaders",
    body: "Professors, program directors, and curriculum leaders shaping how the next generation prepares for practice — clinically and beyond.",
  },
  {
    icon: HeartHandshake,
    title: "Patient-experience & care leaders",
    body: "People who have rebuilt patient education, counseling, follow-up, adherence, or care coordination — and can speak to what changed.",
  },
  {
    icon: Cpu,
    title: "Technology & industry experts",
    body: "Leaders in diagnostics, imaging, surgical technology, AI, remote monitoring, and workflow who understand implementation, not just features.",
  },
];

const process = [
  {
    icon: MessageSquareQuote,
    step: "Before",
    title: "We shape the topic with you",
    body: "A short conversation to find the problem your experience speaks to most directly, followed by a guided outline of the discussion — so you know what will be asked and nothing is sprung on you.",
  },
  {
    icon: Mic,
    step: "During",
    title: "A conversation, not a performance",
    body: "Recorded remotely at a time that works for you, hosted by people who run practices themselves. No script, no slides required — just a candid discussion of decisions you've actually made.",
  },
  {
    icon: CalendarCheck,
    step: "After",
    title: "Professionally produced and shareable",
    body: "We handle editing and production, and you receive the finished piece and assets you're welcome to share with your own network and colleagues.",
  },
];

const standards = [
  "No product pitches — conversations are framed around problems and decisions, never around anything for sale.",
  "You're invited for your experience, not your sponsorship. Participation costs nothing and sells nothing.",
  "Lessons, trade-offs, and even failures are welcome; polish is not required. Candor is the format.",
  "Your name is associated with your judgment — we protect that by keeping every conversation educational.",
];

export default function SpeakPage() {
  return (
    <>
      <PageHero
        eyebrow="Become a speaker"
        title="Lend your experience to the conversation"
        lede="OBA's podcast episodes, panels, and webinars are built on firsthand experience. If you've navigated a decision your peers are still facing, your perspective would add genuine value — and we make contributing straightforward."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Become a Speaker" }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="#interest" variant="primary">
            <Send className="size-4" aria-hidden /> Share your area of expertise
          </Button>
          <Button href="/podcast/episodes" variant="outline">
            Listen to past conversations
          </Button>
        </div>
      </PageHero>

      <Section spacing="default" containerSize="narrow">
        <div className="text-body-lg text-ink-600">
          <p>
            We don&apos;t book speakers to fill a calendar. Each OBA conversation starts with a
            meaningful problem facing modern ophthalmology — growing without compromising care,
            leading a team through change, adopting technology responsibly, rebuilding a patient
            experience — and then finds someone who has personally faced it.
          </p>
          <p className="mt-5">
            That&apos;s the whole invitation: a well-prepared, professionally produced discussion
            of a decision you understand deeply, alongside hosts who run practices themselves.
            Not a promotional appearance, and never a sales environment.
          </p>
        </div>
      </Section>

      <Section tone="subtle" spacing="default">
        <SectionHeader
          eyebrow="Who we invite"
          title="The expertise we look for"
          lede="Titles matter less than firsthand experience. If you've owned a hard decision in one of these areas, you're the kind of contributor we invite."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {expertiseGroups.map((g) => (
            <IconCard key={g.title} icon={g.icon} title={g.title} body={g.body} />
          ))}
        </div>
      </Section>

      <Section spacing="default">
        <SectionHeader
          eyebrow="What to expect"
          title="Prepared with you,"
          titleDim="produced for you."
          lede="Participation is deliberately low-friction. Here's what happens before, during, and after a session."
        />
        <div className="mt-14 grid divide-y divide-line border-y border-line md:grid-cols-3 md:divide-x md:divide-y-0">
          {process.map((p) => (
            <div key={p.step} className="px-0 py-10 md:px-8 md:first:pl-0 md:last:pr-0">
              <span className="font-mono text-eyebrow uppercase text-ink-300">{p.step}</span>
              <h3 className="mt-4 text-h3 font-normal">{p.title}</h3>
              <p className="mt-3 text-body text-ink-500">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="subtle" spacing="default" containerSize="narrow">
        <SectionHeader
          eyebrow="Our editorial standard"
          title="What we protect — including your name"
          lede="A conversation is only worth your reputation if the platform protects it. These commitments apply to every session."
        />
        <ul className="mt-10 space-y-4">
          {standards.map((s) => (
            <ChecklistItem key={s} icon={ShieldCheck}>
              {s}
            </ChecklistItem>
          ))}
        </ul>
      </Section>

      <Section spacing="default" containerSize="narrow">
        <div id="interest" className="scroll-mt-28">
          <SectionHeader
            eyebrow="Express interest"
            title="Share your area of expertise"
            lede="Tell us the problem or decision you could speak to. A member of the OBA team reads every note and follows up personally — there's no committee and no formal application."
          />
          <div className="mt-10 rounded-xl border border-line bg-canvas p-6 sm:p-8">
            <ContactForm variant="speaker" />
          </div>
        </div>
      </Section>
    </>
  );
}
