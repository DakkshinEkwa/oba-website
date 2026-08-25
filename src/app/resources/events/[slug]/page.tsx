import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { getAllEvents, getEventBySlug } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { pageMetadata } from "@/lib/og/metadata";
import { eventJsonLd } from "@/lib/jsonld";

/**
 * Fall 2026 live panel series. Pages are intentionally honest: only the
 * scheduled title/date exist in `events.json` today, so we don't invent
 * speakers, agendas, or registration links.
 */
const PANEL_LEDE =
  "A live virtual panel for the ophthalmology business community — candid, non-promotional discussions of the business decisions behind stronger eye-care practices.";

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

  const eventJsonLdData = {
    "@context": "https://schema.org",
    ...eventJsonLd(event),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLdData) }}
      />
      <Section spacing="tight" containerSize="narrow">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Resources", href: "/resources" },
            { label: "Events", href: "/resources/events" },
            { label: event.title },
          ]}
        />
        <div className="mt-6 flex items-center gap-2 font-mono text-eyebrow uppercase text-ink-400">
          <span>{event.isVirtual ? "Live virtual panel" : "Live panel"}</span>
          <span aria-hidden>·</span>
          <time dateTime={event.startDate}>{formatDate(event.startDate)}</time>
        </div>
        <h1 className="mt-3 text-h1 font-light tracking-tight text-ink-900">{event.title}</h1>
        <p className="mt-5 max-w-prose text-body-lg text-ink-500">{PANEL_LEDE}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/resources/newsletter" variant="primary" size="lg">
            Join the Newsletter
          </Button>
          <Button href="/resources/events" variant="outline" size="lg">
            All Panels
          </Button>
        </div>
      </Section>
    </>
  );
}
