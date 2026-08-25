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
import { DarkHero } from "@/components/marketing/DarkHero";
import { SpeakMicrophone } from "@/components/marketing/SpeakMicrophone";
import { Button } from "@/components/ui/Button";
import { IconCard } from "@/components/ui/IconCard";
import { ChecklistItem } from "@/components/ui/ChecklistItem";
import { ContactForm } from "@/components/forms/ContactForm";
import { FaqSection } from "@/components/marketing/FaqSection";
import { SPEAK_FAQS } from "@/content/faqs";
import { pageMetadata } from "@/lib/og/metadata";
import { pageJsonLd } from "@/lib/jsonld";

export const metadata = pageMetadata({
  title: "Become a Speaker",
  description:
    "OBA convenes experienced ophthalmology professionals for candid, non-promotional conversations. If you've navigated a problem your peers are still facing, share your area of expertise.",
  path: "/speak",
});

const expertiseGroups = [
  {
    icon: Stethoscope,
    title: "Clinicians & subspecialists",
    body: "Cataract, glaucoma, retina, cornea, dry eye, and low-vision specialists who have changed how care is delivered.",
  },
  {
    icon: Building2,
    title: "Owners, directors & administrators",
    body: "Practice owners, partners, medical directors, and administrators who have led growth, transitions, or hard operational calls.",
  },
  {
    icon: GraduationCap,
    title: "Educators & academic leaders",
    body: "Professors, program directors, and curriculum leaders preparing the next generation for practice.",
  },
  {
    icon: HeartHandshake,
    title: "Patient-experience & care leaders",
    body: "People who rebuilt patient education, counseling, follow-up, or care coordination, and can speak to what changed.",
  },
  {
    icon: Cpu,
    title: "Technology & industry experts",
    body: "Leaders in diagnostics, imaging, surgical tech, AI, and workflow who understand implementation, not just features.",
  },
];

const process = [
  {
    icon: MessageSquareQuote,
    step: "Before",
    title: "We shape the topic with you",
    body: "A short conversation to find the problem your experience speaks to best, then a guided outline of the discussion, so nothing is sprung on you.",
  },
  {
    icon: Mic,
    step: "During",
    title: "A conversation, not a performance",
    body: "Recorded remotely at a time that works for you, hosted by people who run practices. No script, no slides: just a candid discussion of decisions you've made.",
  },
  {
    icon: CalendarCheck,
    step: "After",
    title: "Professionally produced and shareable",
    body: "We handle editing and production. You receive the finished piece and assets to share with your network.",
  },
];

const standards = [
  "No product pitches: conversations are framed around problems and decisions, never around anything for sale.",
  "You're invited for your experience, not your sponsorship; participation costs nothing and sells nothing.",
  "Lessons, trade-offs, and even failures are welcome. Polish is not required; candor is.",
  "Your name stays associated with your judgment; every conversation stays educational.",
];

export default function SpeakPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd({
          name: "Become a Speaker",
          description:
            "OBA convenes experienced ophthalmology professionals for candid, non-promotional conversations. If you've navigated a problem your peers are still facing, share your area of expertise.",
          path: "/speak",
        })) }}
      />
      <DarkHero
        size="band"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Become a Speaker" }]}
        eyebrow="Become a speaker"
        eyebrowDot
        title="Lend your experience to"
        titleDim="the conversation"
        lede="OBA's podcast episodes, panels, and webinars are built on firsthand experience. If you've navigated a decision your peers are still facing, your perspective belongs here, and contributing is straightforward."
        aside={<SpeakMicrophone />}
      >
        <Button href="#interest" variant="onDark" size="lg">
          <Send className="size-4" aria-hidden /> Share your area of expertise
        </Button>
        <Button href="/podcast/episodes" variant="frosted" size="lg">
          Listen to past conversations
        </Button>
      </DarkHero>

      <Section spacing="default" containerSize="narrow">
        <p className="text-body-lg text-ink-600">
          Each OBA conversation starts with a problem facing modern ophthalmology and finds
          the person who has lived it. The invitation is a well-prepared, professionally
          produced discussion of a decision you understand deeply: not a promotional
          appearance, and never a sales environment.
        </p>
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
          title="What we protect, including your name"
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
            lede="Tell us the problem or decision you could speak to. A member of the OBA team reads every note and follows up personally; there's no committee and no formal application."
          />
          <div className="mt-10 rounded-xl border border-line bg-canvas p-6 sm:p-8">
            <ContactForm variant="speaker" />
          </div>
        </div>
      </Section>
      <FaqSection
        items={SPEAK_FAQS}
        title="Questions from"
        titleDim="prospective speakers"
      />
    </>
  );
}
