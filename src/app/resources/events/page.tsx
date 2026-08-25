import { CalendarDays } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { DarkHero } from "@/components/marketing/DarkHero";
import { EmptyState } from "@/components/ui/EmptyState";
import { EventCard } from "@/components/content/EventCard";
import { FeaturedEventCard } from "@/components/content/FeaturedEventCard";
import { getAllEvents } from "@/lib/content";
import { pageMetadata } from "@/lib/og/metadata";

export const metadata = pageMetadata({
  title: "Events",
  description: "Live panels, meetups, and events for the ophthalmology business community.",
  path: "/resources/events",
});

export default function EventsPage() {
  const events = getAllEvents().slice().sort((a, b) => a.startDate.localeCompare(b.startDate));
  const next = events[0];

  return (
    <>
      <DarkHero
        size="band"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "Events" }]}
        eyebrow="Connect & learn"
        eyebrowDot
        title="Events &"
        titleDim="live panels"
        lede="Live discussions of the problems ophthalmology practices are navigating right now, with the people navigating them."
        aside={next ? <FeaturedEventCard event={next} /> : null}
        proof={
          events.length > 0 ? (
            <div className="flex flex-wrap gap-x-10 gap-y-4">
              <div>
                <p className="text-h4 font-medium text-white">{events.length}</p>
                <p className="mt-1 font-mono text-micro uppercase tracking-wide text-white/50">Panels</p>
              </div>
              <div>
                <p className="text-h4 font-medium text-white">Fall 2026</p>
                <p className="mt-1 font-mono text-micro uppercase tracking-wide text-white/50">Season</p>
              </div>
              <div>
                <p className="text-h4 font-medium text-white">Live</p>
                <p className="mt-1 font-mono text-micro uppercase tracking-wide text-white/50">Virtual</p>
              </div>
            </div>
          ) : null
        }
      />
      <Section spacing="loose" className="py-24 sm:py-32 lg:py-44">
        {events.length === 0 ? (
          <EmptyState
            level="h2"
            icon={CalendarDays}
            title="No events are currently scheduled"
            body="Newsletter subscribers hear about new panels first. In the meantime, the conversation library is open."
            action={{ label: "Join the Newsletter", href: "/resources/newsletter" }}
          />
        ) : (
          <>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-h2 font-light tracking-tight text-ink-900">All panels</h2>
              <p className="text-small text-ink-500">{events.length} live sessions · Fall 2026</p>
            </div>
            <div className="event-grid">
              {events.map((e, i) => (
                <EventCard key={e.slug} event={e} priority={i === 0} />
              ))}
            </div>
          </>
        )}
      </Section>
    </>
  );
}
