import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Host } from "@/lib/schemas";

/**
 * Host card with a reveal interaction, built on first principles:
 * information materializes in place rather than travelling in from off-screen.
 *
 * - lg+: hovering (or keyboard-focusing) the card fades the bio up in place,
 *   all at once (label, name, and bio appear together), with the face as a
 *   stable anchor. The card's size never changes, so there's no layout shift.
 * - <lg: the card is a horizontal scroll-snap strip; the bio's opacity is tied
 *   to scroll progress (scroll-driven animation), so it fades in as the user
 *   swipes it into view. Browsers without support simply show it once swiped.
 *
 * The bio stays in the accessibility tree even when visually hidden (clipped by
 * overflow), so screen readers always get it.
 */
export function HostCard({ host }: { host: Host }) {
  const initials = host.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");

  // No bio — nothing to reveal, render a plain card.
  if (!host.bio) {
    return (
      <article className="flex h-full flex-col items-center justify-center gap-4 rounded-lg border border-line bg-canvas px-6 py-8 text-center">
        {host.avatar ? (
          <Image
            src={host.avatar}
            alt=""
            width={80}
            height={80}
            className="size-20 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-accent-50 font-display text-h4 font-normal text-accent-700">
            {initials}
          </div>
        )}
        <div>
          <h3 className="text-h3 font-normal leading-tight text-ink-900">{host.name}</h3>
          {host.title ? <p className="mt-1 text-small text-ink-500">{host.title}</p> : null}
        </div>
      </article>
    );
  }

  return (
    <article
      tabIndex={0}
      role="group"
      aria-label={`${host.name}, host — hover or swipe to read the bio`}
      className="group relative snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-lg border border-line bg-canvas transition-colors duration-200 hover:border-ink-300 lg:h-84 lg:snap-none lg:overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {/* Track: face + mobile swipe panel */}
      <div className="flex h-full w-full">
        {/* Face — name & title only, stable anchor */}
        <div className="flex w-full shrink-0 snap-start flex-col items-center justify-center gap-4 px-6 py-8 text-center">
          {host.avatar ? (
            <Image
              src={host.avatar}
              alt=""
              width={80}
              height={80}
              className="size-20 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-accent-50 font-display text-h4 font-normal text-accent-700">
              {initials}
            </div>
          )}
          <div>
            <h3 className="text-h3 font-normal leading-tight text-ink-900">{host.name}</h3>
            {host.title ? <p className="mt-1 text-small text-ink-500">{host.title}</p> : null}
          </div>
          <p className="flex items-center gap-1.5 font-mono text-micro font-light uppercase tracking-wide text-ink-400">
            <span className="lg:hidden">Swipe to read</span>
            <span className="hidden lg:inline">Hover to read</span>
            <ArrowRight className="size-3.5" aria-hidden />
          </p>
        </div>

        {/* Bio — mobile: swiped into view, fades in with scroll progress */}
        <div className="host-card__bio-panel flex max-h-[32rem] w-full shrink-0 snap-start overflow-y-auto bg-ink-700 px-6 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="my-auto flex flex-col py-8">
            <p className="font-mono text-eyebrow font-light uppercase tracking-wide text-accent-300">
              About
            </p>
            <h3 className="mt-2 text-h4 font-medium text-white">{host.name}</h3>
            <p className="mt-3 text-body font-light text-ink-200">{host.bio}</p>
          </div>
        </div>
      </div>

      {/* Bio — desktop: fades up in place, staggered, on hover/focus */}
      <div className="pointer-events-none absolute inset-0 hidden translate-y-3 items-center overflow-y-auto bg-ink-700 px-6 opacity-0 transition-[opacity,transform] duration-500 ease-out group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 lg:flex [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="my-auto flex flex-col py-6">
          <p className="translate-y-2 font-mono text-eyebrow font-light uppercase tracking-wide text-accent-300 opacity-0 transition-[opacity,transform] duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            About
          </p>
          <h3 className="mt-2 translate-y-2 text-h4 font-medium text-white opacity-0 transition-[opacity,transform] duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            {host.name}
          </h3>
          <p className="mt-3 translate-y-2 text-body font-light text-ink-200 opacity-0 transition-[opacity,transform] duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            {host.bio}
          </p>
        </div>
      </div>
    </article>
  );
}
