import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Event } from "@/lib/schemas";
import { eventImage, formatDate } from "@/lib/utils";

export function EventCard({ event, priority = false }: { event: Event; priority?: boolean }) {
  // The card always links to the internal detail page: routing it straight to
  // an external registrationUrl would orphan that page while it stays in the
  // sitemap. Registration is offered as a secondary action instead.
  const actionLabel = event.registrationUrl ? "Reserve" : "Details";
  const href = `/resources/events/${event.slug}`;
  const label = `Details for ${event.title}`;
  const hitClassName = "absolute inset-0 z-[1] cursor-pointer rounded-[28px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

  return (
    <article className="event-card group flex cursor-pointer flex-col rounded-[28px] p-2">
      <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-canvas">
        <Image
          src={eventImage(event.image)}
          alt=""
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>

      <div className="relative mt-6 min-w-0 px-4 sm:px-5 transition-transform duration-200 ease-in-out group-hover:translate-x-4 group-focus-within:translate-x-4">
        <p className="font-mono text-small font-light uppercase tracking-wide text-ink-400 transition-colors duration-200 ease-in-out group-hover:text-white group-focus-within:text-white">
          {event.isVirtual ? "Virtual" : "In person"}
          <span aria-hidden> · </span>
          <time dateTime={event.startDate}>{formatDate(event.startDate)}</time>
        </p>
        <h3 className="mt-3 text-body-lg font-medium leading-snug text-ink-900 transition-colors duration-200 ease-in-out group-hover:text-white group-focus-within:text-white">
          {event.title}
        </h3>
      </div>

      <div className="relative mt-auto flex items-center justify-between gap-4 px-4 pt-6 pb-4 sm:px-5 sm:pb-5">
        {event.registrationUrl ? (
          <a
            href={event.registrationUrl}
            className="relative z-[2] inline-flex h-9 items-center rounded-pill border border-line-strong px-4 text-small font-semibold text-ink-800 transition-colors duration-200 ease-in-out group-hover:border-white/30 group-hover:text-white group-focus-within:border-white/30 group-focus-within:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            {actionLabel}
          </a>
        ) : (
          <span className="inline-flex h-9 items-center rounded-pill border border-line-strong px-4 text-small font-semibold text-ink-800 transition-colors duration-200 ease-in-out group-hover:border-white/30 group-hover:text-white group-focus-within:border-white/30 group-focus-within:text-white">
            {actionLabel}
          </span>
        )}
        <ArrowRight
          className="size-5 -translate-x-4 text-white opacity-0 transition-[opacity,transform] duration-[50ms] ease-in-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:opacity-100"
          aria-hidden
        />
      </div>

      <Link href={href} className={hitClassName} aria-label={label} />
    </article>
  );
}
