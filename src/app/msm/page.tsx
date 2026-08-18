import type { Metadata } from "next";
import {
  Search,
  LineChart,
  Target,
  ShieldCheck,
  MonitorSmartphone,
  Star,
  TrendingUp,
  Clock,
  ClipboardList,
  FileSearch,
  UserCheck,
  Zap,
  BadgeCheck,
} from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { IconCard } from "@/components/ui/IconCard";
import { ChecklistItem } from "@/components/ui/ChecklistItem";
import { FaqAccordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { DarkHero } from "@/components/marketing/DarkHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { AnimatedStat } from "@/components/marketing/AnimatedStat";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free Marketing Analysis for Ophthalmology Practices",
  description:
    "A complimentary, no-obligation review of your ophthalmology practice's digital marketing, provided by Ekwa Marketing, a service offered alongside, and separate from, OBA's educational content.",
};

const heroChecklist = [
  {
    icon: Search,
    title: "Full digital presence audit",
    body: "Website, local search visibility, Google Business Profile, reviews, and social presence. We tell you exactly what's working and what isn't.",
  },
  {
    icon: Target,
    title: "Competitive analysis",
    body: "Which practices in your market outrank you, what they're doing well, and where you can take the lead.",
  },
  {
    icon: TrendingUp,
    title: "Customized growth roadmap",
    body: "A prioritized, actionable plan built for your practice, your market, and your growth stage, not a generic template.",
  },
  {
    icon: ShieldCheck,
    title: "No sales pitch. No pressure.",
    body: "A genuine strategy session. If we're a good fit, great, but there's no obligation to work with us.",
  },
];

const steps = [
  {
    icon: ClipboardList,
    title: "Submit your request",
    body: "The short form above: your practice details, website, and biggest marketing challenge. Takes about two minutes.",
    meta: "~2 minutes",
  },
  {
    icon: FileSearch,
    title: "We do the homework",
    body: "Our team researches your website, local search rankings, reviews, and top competitors in your market before we even meet.",
    meta: "Research first",
  },
  {
    icon: UserCheck,
    title: "Your strategy session",
    body: "A focused call with an Ekwa advisor who walks you through the findings and your prioritized action plan.",
    meta: "Advisor-led call",
  },
];

const focusAreas = [
  {
    icon: Search,
    title: "Google visibility",
    body: "Where you rank for the high-value searches in your market (“cataract surgeon near me,” LASIK, premium lens options) and who outranks you.",
  },
  {
    icon: MonitorSmartphone,
    title: "Website conversion",
    body: "Whether your site turns visitors into booked consultations: speed, mobile experience, and the click-to-consultation journey.",
  },
  {
    icon: Star,
    title: "Reviews & reputation",
    body: "How your ratings, review volume, and responses compare to the practices competing for your patients.",
  },
  {
    icon: TrendingUp,
    title: "Growth opportunities",
    body: "The specific gaps worth fixing first, prioritized by revenue impact, so you know exactly where to start.",
  },
];

const sessionOutcomes = [
  {
    icon: Search,
    title: "Where you're losing patients online",
    body: "The specific gaps in your digital presence that are costing you new-patient inquiries right now.",
  },
  {
    icon: LineChart,
    title: "Your exact keyword opportunities",
    body: "The searches your local market makes that your practice isn't ranking for yet, and how to capture them.",
  },
  {
    icon: Target,
    title: "How your competitors are winning",
    body: "A real breakdown of what the top-ranked practices in your area are doing, and how to outperform them.",
  },
  {
    icon: Zap,
    title: "Your 90-day quick-win plan",
    body: "Three to five specific actions you can take in the next 90 days to start booking more consultations.",
  },
  {
    icon: TrendingUp,
    title: "A 12-month growth roadmap",
    body: "A long-term plan that builds sustainable patient flow and local authority for your practice in your market.",
  },
];

const stats = [
  { n: "16+", l: "Years marketing medical practices" },
  { n: "4.9★", l: "Average client review score" },
  { n: "1", l: "Dedicated account manager per practice" },
];

const ekwaBullets = [
  "Exclusively focused on medical practice marketing, including ophthalmology.",
  "No long-term contracts required.",
  "A dedicated account manager for every practice.",
  "Transparent reporting: you always know what we're doing.",
  "Full-service: SEO, paid search, social, web design & content.",
];

const faqs = [
  {
    question: "Who actually performs the analysis?",
    answer:
      "Ekwa Marketing, the practice-marketing firm led by OBA's founder, Naren Arulrajah. It works with medical practices, including ophthalmology. This is a commercial service offered alongside OBA, not part of OBA's educational programming.",
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
    answer:
      "Just your name, your practice website, and a contact email. The more context you share, the more tailored the analysis.",
  },
  {
    question: "Will this be promoted inside OBA's content?",
    answer:
      "No. OBA's panels, podcasts, and webinars stay non-promotional by design. This service is never promoted inside the academy's conversations.",
  },
];

export default function MsmPage() {
  return (
    <>
      <DarkHero
        size="band"
        asideWidth="wide"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Marketing" }]}
        eyebrow="A service from Ekwa Marketing"
        eyebrowDot
        title="The only strategy meeting your"
        titleDim="ophthalmology practice needs"
        lede="A complimentary, no-obligation review of your digital marketing from Ekwa Marketing, the practice-marketing firm led by OBA's founder. Know what's working, what isn't, and what to fix first."
        aside={
          <div className="rounded-[20px] border border-white/10 p-6 sm:p-7">
            <Eyebrow tone="onDark" className="text-[0.625rem]">
              Pick a time
            </Eyebrow>
            <h2 className="mt-3 text-h4 font-normal text-white">Book your free strategy meeting</h2>
            <p className="mt-1.5 text-small font-light text-white/70">
              Choose a slot that works. Most practices meet within the week.
            </p>
            <iframe
              src={`${siteConfig.strategyMeetingUrl}?embed=true`}
              title="Book your free strategy meeting"
              allow="payment"
              loading="lazy"
              className="mt-5 block h-[360px] w-full rounded-xl border border-white/15"
            />
            <p className="mt-4 text-small text-white/60">
              Calendar not loading?{" "}
              <a
                href={siteConfig.strategyMeetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-white/80 underline underline-offset-2 hover:text-white"
              >
                Open the booking page instead
              </a>
            </p>
          </div>
        }
      />

      <Section spacing="default">
        <div id="request" className="scroll-mt-28">
          <SectionHeader
            eyebrow="No cost, no obligation"
            title="What the session includes"
            lede="A complimentary review of your digital presence, followed by a focused session with an Ekwa advisor. Here's what you get."
          />
          <div className="mt-10 grid items-start gap-10 lg:grid-cols-2">
            <div>
              <ul className="space-y-3">
                {heroChecklist.map((c) => (
                  <ChecklistItem key={c.title} icon={c.icon}>
                    <span className="font-semibold text-ink-800">{c.title}.</span> {c.body}
                  </ChecklistItem>
                ))}
              </ul>
              <div className="mt-6 flex items-start gap-3 rounded-lg border border-line bg-canvas-subtle p-5">
                <Clock className="mt-0.5 size-5 shrink-0 text-accent-600" aria-hidden />
                <p className="text-body text-ink-600">
                  <span className="font-semibold text-ink-800">4–5 hours of preparation.</span>{" "}
                  The Ekwa team invests 4–5 hours researching your practice, your market, and
                  your competitors before your call.
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-line bg-canvas p-6 sm:p-8">
              <h3 className="text-h3 font-normal">Book your free strategy meeting</h3>
              <p className="mt-1 text-body text-ink-500">
                About two minutes, no back-and-forth.
              </p>
              <div className="mt-6">
                <ContactForm variant="analyze" />
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="subtle" spacing="default">
        <SectionHeader
          eyebrow="How it works"
          title="From request to roadmap in a few business days"
          align="center"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <IconCard
              key={s.title}
              icon={s.icon}
              title={s.title}
              body={s.body}
              meta={
                <span className="font-mono text-eyebrow uppercase text-ink-500">{s.meta}</span>
              }
            />
          ))}
        </div>
      </Section>

      <Section id="review" spacing="default" className="scroll-mt-24">
        <SectionHeader
          eyebrow="What we review"
          title="A complete picture of your digital presence"
          lede="Before the meeting, our team researches your practice the way a prospective patient would. In the session, we walk you through what we found."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {focusAreas.map((a) => (
            <IconCard key={a.title} icon={a.icon} title={a.title} body={a.body} />
          ))}
        </div>
      </Section>

      <Section tone="subtle" spacing="default">
        <SectionHeader
          eyebrow="In your session"
          title="What you'll learn"
          lede="Every session ends with specific answers to the questions that matter most for your practice."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {sessionOutcomes.map((o, i) => (
            <IconCard
              key={o.title}
              icon={o.icon}
              title={o.title}
              body={o.body}
              className={i === sessionOutcomes.length - 1 ? "md:col-span-2" : undefined}
            />
          ))}
        </div>
      </Section>

      <Section tone="ink" spacing="default">
        <SectionHeader
          tone="light"
          align="center"
          eyebrow="The team behind it"
          title="Marketing that medical practices trust"
          lede="Ekwa Marketing has spent more than 16 years helping medical practices grow. Here's what that experience means for your practice."
        />
        <dl className="mt-12 grid grid-cols-1 divide-y divide-white/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map((s) => (
            <div key={s.l} className="px-6 py-10 text-center">
              <dt className="text-h1 font-light tracking-tight text-white">
                <AnimatedStat value={s.n} />
              </dt>
              <dd className="mt-1 text-small text-white/65">{s.l}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section spacing="default">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeader
              eyebrow="Who we are"
              title="The team behind your growth"
              lede="Powered by Ekwa Marketing, the practice-marketing firm led by OBA's founder, Naren Arulrajah. We help medical practices, including ophthalmology, build stronger digital presences."
            />
            <ul className="mt-8 space-y-3">
              {ekwaBullets.map((b) => (
                <ChecklistItem key={b} icon={BadgeCheck}>
                  {b}
                </ChecklistItem>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-line bg-canvas-subtle p-6 sm:p-8">
            <Eyebrow>A note on transparency</Eyebrow>
            <p className="mt-4 text-body text-ink-600">
              This is a commercial service offered alongside OBA; it is not part of the
              academy&apos;s educational content, and no OBA conversation promotes it. OBA&apos;s
              panels, podcasts, and webinars stay non-promotional by design.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button href="https://www.ekwa.com" variant="primary" size="md">
                Explore Ekwa Marketing
              </Button>
              <Button href="/about" variant="outline" size="md">
                How OBA stays non-promotional
              </Button>
            </div>
          </div>
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
