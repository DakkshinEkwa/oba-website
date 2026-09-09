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
/**
 * One fact is just the date the eyebrow already carries, so the strip needs a
 * second to be worth a row. Exported because the page has to know whether the
 * block exists before it wraps it in spacing.
 */
export function hasEventFacts(event: Event) {
  return [event.startTime, event.format, event.location].filter(Boolean).length > 0;
}

export function EventFactsStrip({ event }: { event: Event }) {
  const facts: { label: string; value: React.ReactNode }[] = [
    { label: "Date", value: <time dateTime={event.startDate}>{formatDate(event.startDate)}</time> },
    ...(event.startTime ? [{ label: "Time", value: event.startTime }] : []),
    ...(event.format ? [{ label: "Format", value: event.format }] : []),
    ...(event.location ? [{ label: "Location", value: event.location }] : []),
  ];

  if (!hasEventFacts(event)) return null;

  return (
    // A grid, not a wrapped flex row: the three chips came to 542px against a
    // 536px copy column, so "Format" dropped to a second line by six pixels —
    // and narrower still below lg. Equal columns keep them one row from sm up,
    // with the value wrapping inside its own chip and the grid matching the
    // heights, which is how the countdown row directly below it is set. Below
    // sm there isn't room for a row at all, so chips stack one per line —
    // `gridTemplateColumns` is an inline style and always wins over a Tailwind
    // class, so the responsive switch has to happen through a custom property
    // instead of a plain `sm:grid-cols-N` utility.
    <dl
      className="grid grid-cols-1 gap-2 sm:grid-cols-[var(--fact-cols)] sm:gap-3"
      style={{ "--fact-cols": `repeat(${facts.length}, minmax(0, 1fr))` } as React.CSSProperties}
    >
      {facts.map((fact) => (
        <div
          key={fact.label}
          className="rounded-(--radius-md) border border-white/15 bg-white/[0.06] px-3 py-2.5 backdrop-blur-md sm:px-4"
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
