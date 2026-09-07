import type { Event } from "@/lib/schemas";
import { formatDate } from "@/lib/utils";

/**
 * Date / Time / Format / Location as a row of chips, sitting between the
 * eyebrow and the headline — the shape the registration page opens with, where
 * the facts land before the claim rather than in a card off to one side.
 *
 * Chips are the frosted treatment the hero already uses for its secondary
 * button (`Button variant="frosted"`), so they read as the same material as
 * everything else standing on the gradient. `--radius-md` is the site's inset
 * cell, not the pill: these are labelled fields, not actions.
 *
 * Every chip is conditional, and the strip renders nothing when an event
 * carries only a date — six of the seven events in `events.json` do.
 */
export function EventFactsStrip({ event }: { event: Event }) {
  const facts: { label: string; value: React.ReactNode }[] = [
    { label: "Date", value: <time dateTime={event.startDate}>{formatDate(event.startDate)}</time> },
    ...(event.startTime ? [{ label: "Time", value: event.startTime }] : []),
    ...(event.format ? [{ label: "Format", value: event.format }] : []),
    ...(event.location ? [{ label: "Location", value: event.location }] : []),
  ];

  if (facts.length < 2) return null;

  return (
    <dl className="flex flex-wrap gap-3">
      {facts.map((fact) => (
        <div
          key={fact.label}
          className="rounded-(--radius-md) border border-white/15 bg-white/[0.06] px-4 py-2.5 backdrop-blur-md"
        >
          <dt className="font-mono text-micro uppercase tracking-wide text-white/45">
            {fact.label}
          </dt>
          <dd className="mt-1 text-small font-medium text-white">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
