import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import type { Event } from "@/lib/schemas";

/**
 * The hero aside: the registration card.
 *
 * The registration page runs its sign-up form here, in the right half of the
 * hero, and the page is laid out around that card. This site does not post the
 * form — the list lives on `reg.obacademy.org`, so `registrationUrl` is an
 * outbound link and repointing an event is one JSON field — so the card holds
 * the same slot with the ask itself: what it costs, what you get, and the
 * button. Everything in it is authored copy from `events.json`; nothing about
 * seats or scarcity is invented.
 *
 * Flat `ink-800` rather than `--gradient-hero`: the hero behind it is already
 * that gradient, and a gradient card on a gradient ground loses its edge. The
 * page mounts this only when there is somewhere to register — a panel whose
 * start instant is behind the build renders no card at all rather than a dead
 * button.
 */
export function EventRegisterCard({ event, href }: { event: Event; href: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink-800 p-6 sm:p-8">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/[0.06] to-transparent"
      />
      <div className="relative">
        <Eyebrow tone="onDark" dot>
          Save your seat
        </Eyebrow>
        <p className="mt-5 text-h4 font-normal leading-tight text-white">Reserve your free spot</p>
        {event.registrationNote ? (
          <p className="mt-4 text-small leading-relaxed text-white/60">{event.registrationNote}</p>
        ) : null}

        <Button
          href={href}
          variant="onDark"
          size="lg"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 w-full"
        >
          Register Free
        </Button>

        {/* The registration itself happens on another host; saying so is
            plainer than a lock icon and a promise about spam. */}
        <p className="mt-4 text-micro text-white/40">Registration opens on reg.obacademy.org.</p>
      </div>
    </div>
  );
}
