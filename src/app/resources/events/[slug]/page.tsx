import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { DarkHero } from "@/components/marketing/DarkHero";
import { CTASection } from "@/components/marketing/CTASection";
import { EventCountdown } from "@/components/content/EventCountdown";
import { EventFactsStrip } from "@/components/content/EventFactsStrip";
import { EventHeroPanelists } from "@/components/content/EventHeroPanelists";
import { EventRegisterCard } from "@/components/content/EventRegisterCard";
import { EventPanelists } from "@/components/content/EventPanelists";
import { getAllEvents, getEventBySlug } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { pageMetadata } from "@/lib/og/metadata";
import { eventJsonLd } from "@/lib/jsonld";

/**
 * The panel landing-page template.
 *
 * One route renders every event in `events.json` at whatever depth its content
 * supports. Each section is switched on by its own field and renders nothing
 * when that field is empty, so the page scales from the bare title-and-date
 * entries most of the Fall 2026 series still has, up to a full registration
 * landing page — without ever inventing a speaker, an agenda or a promise to
 * fill a gap. Adding a panel is editing JSON; no code changes per event.
 *
 * Registration is always an outbound link (`registrationUrl`) and never a form
 * on this site: signups live on the registration host, which owns the list.
 * Repointing an event is one field.
 */
const PANEL_LEDE =
  "A live virtual panel for the ophthalmology business community — candid, non-promotional discussions of the business decisions behind stronger eye-care practices.";

/**
 * When this build ran. Read at module load rather than during render, because
 * a render must be pure — and because build time is genuinely the value we
 * mean: on a statically generated site, a rebuild is what moves a panel into
 * the past. The countdown re-checks live in the browser, so a stale build
 * still shows a correct clock.
 */
const BUILT_AT_MS = Date.now();

export function generateStaticParams() {
  return getAllEvents().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return {};
  return pageMetadata({
    title: event.title,
    // Derived per event so the seven panel pages don't share one description.
    // PANEL_LEDE stays as the visible on-page copy.
    description:
      event.excerpt ||
      `${event.title} — a live virtual OBA panel on ${formatDate(event.startDate)}. Candid, non-promotional discussion for ophthalmology practice leaders.`,
    path: `/resources/events/${slug}`,
    // A panel is a dated thing. Without `type: "article"` the page shipped
    // `og:type=website` and the start date never reached Open Graph at all.
    type: "article",
    publishedTime: event.startDateTime ?? event.startDate,
    section: "Live panels",
    // Defer to this segment's opengraph-image.tsx so each panel gets its own titled
    // card instead of the shared brand card.
    image: "route",
  });
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  const eventJsonLdData = { "@context": "https://schema.org", ...eventJsonLd(event) };

  // Without an exact start instant, a panel counts as past only once its date
  // is fully behind us — never mid-day on the day it runs.
  const startsAt = event.startDateTime ?? `${event.startDate}T23:59:59Z`;
  const isPast = new Date(startsAt).getTime() < BUILT_AT_MS;

  // A past panel never shows a register link: the form on the other end is
  // either closed or would take a signup for something that already happened.
  const registerHref = isPast ? undefined : event.registrationUrl;

  // The hero's proof block: who is on the panel, and how long until it starts.
  // Both are conditional, so a bare title+date event still gets a clean hero.
  const hasProof = event.panelists.length > 0 || Boolean(event.startDateTime);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLdData) }}
      />

      <DarkHero
        size="band"
        containerSize="default"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Events", href: "/resources/events" },
          { label: event.title },
        ]}
        eyebrow={`${event.isVirtual ? "Live virtual panel" : "Live panel"}${
          registerHref ? " · Free to attend" : ""
        }`}
        eyebrowDot
        /* The registration page's order, in this site's materials: the facts
           land before the claim, the line-up and the clock under it, and the
           ask holds the right half of the hero. */
        meta={<EventFactsStrip event={event} />}
        title={event.title}
        lede={event.lede || PANEL_LEDE}
        proof={
          hasProof ? (
            <div className="space-y-8">
              <EventHeroPanelists panelists={event.panelists} />
              {event.startDateTime && !isPast ? (
                <EventCountdown target={event.startDateTime} tone="dark" />
              ) : null}
            </div>
          ) : null
        }
        /* `mt-28` at lg only: the copy column starts a breadcrumb row lower
           than the aside, so a top-aligned card would float above the
           eyebrow it should sit level with. */
        aside={
          registerHref ? (
            <div className="lg:mt-28">
              <EventRegisterCard event={event} href={registerHref} />
            </div>
          ) : null
        }
        asideAlign="start"
      >
        {/* No second Register button when the card carries it: that would be
            the same ask twice in one viewport. */}
        <Button href="/resources/events" variant="frosted" size="lg">
          All Panels
        </Button>
      </DarkHero>

      {event.topics.length > 0 ? (
        <Section spacing="loose">
          <SectionHeader
            align="center"
            eyebrow="Key discussion topics"
            title="What we'll"
            titleDim="cover"
          />
          {/* `ProblemAreas`' band: hairlines drawn in the grid rather than on
              cards, with the homepage's bracketed mono counters. Two columns
              rather than the homepage's four — these topics run ~40 words
              against its ~15, and four would set them at a 28-character
              measure. Numbered rather than titled: they read as complete
              thoughts already, and a headline per topic would be an invention
              over copy the panel has actually committed to. */}
          <ol className="mt-14 grid divide-y divide-line border-y border-line sm:grid-cols-2 sm:divide-x">
            {event.topics.map((topic, i) => (
              /* odd/even, not first/last: `ProblemAreas` is a single row of
                 four, so first/last is enough there. This wraps to 2x2, where
                 every odd cell is in column one and every even cell in
                 column two. */
              <li key={topic} className="px-0 py-10 sm:px-8 sm:odd:pl-0 sm:even:pr-0">
                <span aria-hidden className="font-mono text-eyebrow text-ink-300">
                  [{i + 1}]
                </span>
                <p className="mt-4 text-body leading-relaxed text-ink-500">{topic}</p>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      {event.about.length > 0 || event.audience.length > 0 ? (
        <Section tone="chip" spacing="loose" className="relative overflow-hidden border-y border-line">
          <div aria-hidden className="dot-field-light absolute inset-0" />
          <div className="relative grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-20">
            {event.about.length > 0 ? (
              <div className="min-w-0">
                <SectionHeader
                  eyebrow="About this session"
                  title={event.aboutTitle ?? "About this panel"}
                />
                <div className="mt-8 space-y-6">
                  {event.about.map((paragraph) => (
                    <p key={paragraph.slice(0, 48)} className="text-body-lg leading-relaxed text-ink-600">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}

            {event.audience.length > 0 ? (
              <div className="min-w-0">
                <h3 className="text-h4 font-medium tracking-tight text-ink-900">
                  This panel is for you if…
                </h3>
                <ul className="mt-6 space-y-4">
                  {event.audience.map((line) => (
                    <li key={line} className="flex items-start gap-3">
                      <Check
                        aria-hidden
                        className="mt-1 size-4 shrink-0 text-accent-600"
                        strokeWidth={2.5}
                      />
                      <span className="text-body leading-relaxed text-ink-600">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </Section>
      ) : null}

      {event.panelists.length > 0 ? (
        <Section spacing="loose">
          {/* Eyebrow is "Panelists", not "Meet your panelists": the title
              already says "panel", and the two together said it twice. */}
          <SectionHeader
            align="center"
            eyebrow="Panelists"
            title="Who's on"
            titleDim="the panel"
          />
          <div className="mt-14">
            <EventPanelists panelists={event.panelists} />
          </div>
        </Section>
      ) : null}

      {/* One ask. Registration where there is a link to register; otherwise the
          site's standing contributor CTA, which is what this page had before. */}
      {registerHref ? (
        <CTASection
          eyebrow="Save your seat"
          title="Ready to join"
          titleDim="the conversation?"
          body={
            event.registrationNote ??
            "Registration is complimentary. Bring the question you want the panel to answer."
          }
          primary={{ label: "Register Free", href: registerHref }}
          secondary={null}
        />
      ) : (
        <CTASection secondary={null} />
      )}
    </>
  );
}
