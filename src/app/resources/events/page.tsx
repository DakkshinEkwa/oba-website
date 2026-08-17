import type { Metadata } from "next";
import { CalendarDays, MapPin } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { DarkHero } from "@/components/marketing/DarkHero";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getAllEvents } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Events",
  description: "Live panels, meetups, and events for the ophthalmology business community.",
};

export default function EventsPage() {
  const events = getAllEvents();
  return (
    <>
      <DarkHero
        size="band"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "Events" }]}
        eyebrow="Connect & learn"
        eyebrowDot
        title="Events &"
        titleDim="live panels"
        lede="Live discussions of the problems ophthalmology practices are navigating right now — with the people navigating them."
      />
      <Section spacing="default">
        {events.length === 0 ? (
          <EmptyState
            level="h2"
            icon={CalendarDays}
            title="No events are currently scheduled"
            body="Newsletter subscribers hear about new panels first. In the meantime, the conversation library is open."
            action={{ label: "Join the Newsletter", href: "/resources/newsletter" }}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {events.map((e) => (
              <Card key={e.slug}>
                <CardBody>
                  <div className="flex items-center gap-2">
                    <Badge tone="accent">{e.isVirtual ? "Virtual" : "In person"}</Badge>
                    <span className="text-small text-ink-400">{formatDate(e.startDate)}</span>
                  </div>
                  <h3 className="mt-3 text-h3 font-normal">{e.title}</h3>
                  {e.location ? (
                    <p className="mt-1 inline-flex items-center gap-1.5 text-small text-ink-500">
                      <MapPin className="size-4" aria-hidden /> {e.location}
                    </p>
                  ) : null}
                  <p className="mt-2 text-body text-ink-500">{e.excerpt}</p>
                  {e.registrationUrl ? (
                    <Button href={e.registrationUrl} variant="primary" size="sm" className="mt-4">
                      Register
                    </Button>
                  ) : null}
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
