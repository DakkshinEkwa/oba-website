import { Eyebrow } from "@/components/ui/Eyebrow";
import { EventRegisterForm } from "@/components/forms/EventRegisterForm";
import type { Event } from "@/lib/schemas";

/**
 * The hero aside: the registration card, holding the same slot the
 * registration page gives its sign-up form — eyebrow, title, sub-line, form.
 *
 * **White, not slate.** A form is the one thing on this page a visitor has to
 * work in rather than read, and the light controls are the ones the rest of the
 * site's forms use; a white card also lifts the ask off the gradient instead of
 * asking it to compete with it — which is exactly what the registration page
 * does with the same card. Its hairline is `line`, not `white/10`: the border
 * belongs to the card's own light surface now.
 *
 * `registrationUrl` remains the record of where the list actually lives, and
 * the form's payload is shaped to match that host (see `EventRegisterForm`);
 * submission itself is stubbed, as every form on this site is.
 *
 * The page mounts this only when there is somewhere to register — a panel whose
 * start instant is behind the build renders no card at all rather than a form
 * for something that already happened.
 */
export function EventRegisterCard({ event }: { event: Event }) {
  return (
    <div className="rounded-2xl border border-line bg-canvas p-6 sm:p-8">
      <Eyebrow dot>Save your seat</Eyebrow>
      <p className="mt-5 text-h4 font-normal leading-tight text-ink-900">Reserve your free spot</p>
      {event.registrationNote ? (
        <p className="mt-3 text-small leading-relaxed text-ink-500">{event.registrationNote}</p>
      ) : null}

      <div className="mt-7">
        <EventRegisterForm />
      </div>
    </div>
  );
}
