import { Section, SectionHeader } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Container } from "@/components/ui/Container";
import { FaqAccordion } from "@/components/ui/Accordion";
import { DarkHero } from "@/components/marketing/DarkHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { AnimatedStat } from "@/components/marketing/AnimatedStat";
import { siteConfig } from "@/lib/site";
import { pageMetadata } from "@/lib/og/metadata";
import { faqJsonLd } from "@/lib/jsonld";
import { msmFaqs as faqs } from "@/lib/faq-data";

export const metadata = pageMetadata({
  title: "Free Marketing Analysis for Ophthalmology Practices",
  description:
    "A complimentary, no-obligation review of your ophthalmology practice's digital marketing, provided by Ekwa Marketing, a service offered alongside, and separate from, OBA's educational content.",
  path: "/msm",
});

const auditCovers = [
  {
    title: "Visibility",
    body: "Where you rank for the searches patients actually make, and which practices in your market outrank you.",
  },
  {
    title: "Conversion",
    body: "Whether your website turns visitors into booked consultations, or quietly loses them on the way.",
  },
  {
    title: "Roadmap",
    body: "A prioritized plan for your market and your stage, ordered by revenue impact rather than effort.",
  },
];

const stats = [
  { n: "16+", l: "Years marketing medical practices" },
  { n: "4.9★", l: "Average client review score" },
  { n: "1", l: "Dedicated account manager per practice" },
];


export default function MsmPage() {
  const faqJsonLdData = faqJsonLd(faqs);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLdData) }}
      />
      <DarkHero
        size="band"
        asideWidth="wide"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Marketing" }]}
        eyebrow="A service from Ekwa Marketing"
        eyebrowDot
        title={
          <>
            Where your practice is losing
            <br />
          </>
        }
        titleDim="patients online"
        lede="A free review of your website, search visibility, and reviews. From Ekwa Marketing, the practice-marketing firm led by OBA's founder."
        aside={
          <div className="rounded-[20px] border border-white/10 p-4 sm:p-5">
            <Eyebrow tone="onDark" className="text-[0.625rem]">
              Pick a time
            </Eyebrow>
            <h2 className="mt-2.5 text-h4 font-normal text-white">Book your free practice audit</h2>
            <p className="mt-1.5 text-small font-light text-white/70">
              Choose a slot that works. Most practices meet within the week.
            </p>
            <iframe
              src={`${siteConfig.strategyMeetingUrl}?embed=true`}
              title="Book your free practice audit"
              allow="payment"
              loading="lazy"
              className="mt-4 block h-[420px] w-full rounded-xl border border-white/15"
            />
          </div>
        }
      />

      <Section spacing="default">
        <SectionHeader
          eyebrow="What we review"
          title="What a practice audit"
          titleDim="actually looks at."
          lede="Before we meet, we research your practice the way a prospective patient would. In the session, we walk you through what we found."
        />
        <div className="mt-14 grid divide-y divide-line border-y border-line md:grid-cols-3 md:divide-x md:divide-y-0">
          {auditCovers.map((a, i) => (
            <div key={a.title} className="px-0 py-10 md:px-8 md:first:pl-0 md:last:pr-0">
              <span className="font-mono text-eyebrow text-ink-300">[{i + 1}]</span>
              <h3 className="mt-4 text-h4 font-normal">{a.title}</h3>
              <p className="mt-3 text-body text-ink-500">{a.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Request panel on the one gradient OBA permits — the hero lobe, STEEL→INK900
          at the fixed stops (brand ch.1: "any other gradient is not OBA"). The 18px
          dot field sits *under* the glass, which is what the backdrop blur acts on;
          over a bare gradient the blur would be invisible. */}
      <section className="relative overflow-hidden bg-ink-900 py-16 sm:py-20 lg:py-28">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{ background: "var(--gradient-hero-glow)" }}
        />
        <div aria-hidden className="dot-field absolute inset-0" />
        <Container size="narrow" className="relative">
          <div id="request" className="scroll-mt-28">
            <SectionHeader
              tone="light"
              align="center"
              eyebrow="No cost, no obligation"
              title="Request your"
              titleDim="practice audit"
              lede="Two minutes. Your practice, your website, and what you want fixed first."
            />
            <div className="mt-10 rounded-(--radius-brand) border border-white/12 bg-white/[0.07] p-8 backdrop-blur-xl sm:p-10 lg:p-12">
              <ContactForm variant="analyze" tone="onDark" />
            </div>
          </div>
        </Container>
      </section>

      {/* CHIPBG light well with the 18px dot field (guidelines ch.5). The band
          sits between the dark form above and the white FAQ below, so the
          hairline edges plus the texture are what give it its own footing. */}
      <Section
        tone="chip"
        spacing="default"
        className="dot-field-light border-y border-line"
      >
        <SectionHeader
          align="center"
          eyebrow="The team behind it"
          title="Marketing that medical"
          titleDim="practices trust."
          lede="Ekwa Marketing has spent more than 16 years helping medical practices grow."
          // SectionHeader's eyebrow and lede both default to ink-500, which
          // measures 4.39:1 on CHIPBG — under AA at the eyebrow's 12px and at
          // the lede's 18px floor. ink-600 takes both to 6.5:1.
          className="[&>span:first-child]:text-ink-600 [&>p]:text-ink-600"
        />
        <dl className="mt-12 grid grid-cols-1 divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map((s) => (
            <div key={s.l} className="px-6 py-10 text-center">
              <dt className="text-h1 font-light tracking-tight text-ink-900">
                <AnimatedStat value={s.n} />
              </dt>
              {/* ink-600, not ink-500: the paler grey measures 4.4:1 on CHIPBG. */}
              <dd className="mt-1 text-small text-ink-600">{s.l}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Canvas, not subtle: #f4f6f7 against the CHIPBG band above would read as
          one continuous surface. */}
      <Section tone="canvas" spacing="default" containerSize="narrow">
        <SectionHeader eyebrow="Questions" title="Frequently asked" align="center" />
        <div className="mt-10">
          <FaqAccordion items={faqs} />
        </div>
      </Section>
    </>
  );
}
