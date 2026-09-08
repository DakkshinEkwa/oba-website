import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { DarkHero } from "@/components/marketing/DarkHero";
import { CTASection } from "@/components/marketing/CTASection";
import { EventCountdown } from "@/components/content/EventCountdown";
import { EventFactsStrip, hasEventFacts } from "@/components/content/EventFactsStrip";
import { EventHeroPanelists } from "@/components/content/EventHeroPanelists";
import { EventRegisterCard } from "@/components/content/EventRegisterCard";
import { EventPanelists } from "@/components/content/EventPanelists";
import { getAllEvents, getEventBySlug } from "@/lib/content";
import { cn, formatDate } from "@/lib/utils";
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

  // The clock only runs toward a start instant that is still ahead.
  const showCountdown = Boolean(event.startDateTime) && !isPast;

  // A past panel never shows a register link: the form on the other end is
  // either closed or would take a signup for something that already happened.
  const registerHref = isPast ? undefined : event.registrationUrl;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLdData) }}
      />

      <DarkHero
        size="band"
        containerSize="default"
        eyebrow={`${event.isVirtual ? "Live virtual panel" : "Live panel"}${
          registerHref ? " · Free to attend" : ""
        }`}
        eyebrowDot
        title={event.title}
        /* One step down from the cinematic h1: the registration form takes a
           wide aside, and a panel title set at the display step wrapped to four
           lines in what is left. */
        titleSize="h2"
        /* The claim, then the facts it is offering: chips directly under the
           title, the clock directly under those. */
        titleMeta={
          hasEventFacts(event) || showCountdown ? (
            <div className="space-y-6">
              <EventFactsStrip event={event} />
              {showCountdown && event.startDateTime ? (
                <EventCountdown target={event.startDateTime} tone="dark" />
              ) : null}
            </div>
          ) : null
        }
        lede={event.lede || PANEL_LEDE}
        proof={
          event.panelists.length > 0 ? <EventHeroPanelists panelists={event.panelists} /> : null
        }
        aside={registerHref ? <EventRegisterCard event={event} /> : null}
        asideWidth="wide"
        asideAlign="start"
      />

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
          {/* `divide-x` is wrong on a wrapped grid: it draws a right edge on
              every cell but the last, so cell [2] — the end of row one — got a
              hairline hanging off the band's right edge. The vertical rule is
              therefore drawn per cell, on column-one cells that actually have a
              neighbour to their right. `divide-y` is fine as-is: its extra rule
              under the last full row lands exactly on the container's own
              bottom border. */}
          <ol className="mt-14 grid divide-y divide-line border-y border-line sm:grid-cols-2">
            {event.topics.map((topic, i) => (
              /* odd/even, not first/last: `ProblemAreas` is a single row of
                 four, so first/last is enough there. This wraps to 2x2, where
                 every odd cell is in column one and every even cell in
                 column two. */
              <li
                key={topic}
                className={cn(
                  "px-0 py-10 sm:px-8 sm:odd:pl-0 sm:even:pr-0",
                  i % 2 === 0 && i + 1 < event.topics.length && "sm:border-r sm:border-line",
                )}
              >
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

      {/* A registerable panel ends after the panel itself: the ask is the form
          in the hero, and a second CTA band under it was the same ask twice.
          A panel with nowhere to register keeps the site's standing
          contributor CTA, which is the only ask that page has. */}
      {registerHref ? null : <CTASection secondary={null} />}
    </>
  );
}
