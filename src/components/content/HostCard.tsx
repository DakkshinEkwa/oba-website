import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Host } from "@/lib/schemas";
import { nameTokens } from "@/lib/utils";

/**
 * The bio panel's ground: the one sanctioned gradient, held legible.
 *
 * The scrim is not decoration. `--gradient-hero`'s light lobe is #5b7484, and
 * the bio's `ink-200` measures 3.2:1 against it — a fail. Pulling the whole
 * panel back toward INK900 at 40% brings that to ~6:1 while keeping the
 * name/bio tonal split, which lightening the copy to white would have
 * flattened. `DarkHero` solves the same problem with a horizontal scrim; that
 * shape assumes a wide copy column, so a flat one is right here.
 *
 * All three layers are background images on the panel itself, not absolutely
 * positioned children. The panel scrolls (`overflow-y-auto`), and an abspos
 * child scrolls with it — a long bio would slide off its own scrim and lose
 * the contrast the scrim exists to provide. Backgrounds stay put.
 */
const PANEL_BG = [
  // Sheen across the top, as on every other gradient surface in the repo.
  "linear-gradient(to bottom, rgb(255 255 255 / 0.10), rgb(255 255 255 / 0) 50%)",
  // Scrim — see above. This is a contrast requirement, not a tint.
  "linear-gradient(color-mix(in srgb, var(--color-ink-900) 40%, transparent), color-mix(in srgb, var(--color-ink-900) 40%, transparent))",
  "var(--gradient-hero)",
].join(", ");

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
 *
 * Portraits render in full colour. The six source headshots were shot against
 * unrelated backgrounds (white studio, foliage, autumn grass, flat charcoal),
 * so they do not read as one set — but these are real named professionals and
 * showing them as they are outranks palette consistency here. Keep the tile
 * modest in size for the same reason: the larger the face, the louder the
 * background behind it.
 */

export function HostCard({ host }: { host: Host }) {
  // The face, sized once. Source art is ~500px square (public/images/hosts),
  // so 112px is comfortably inside 2x; the request is 256 rather than the
  // rendered size because Next emits exactly what it is asked for, and asking
  // for 112 hands every retina display an upscale.
  const portrait = host.avatar ? (
    <Image
      src={host.avatar}
      alt=""
      width={256}
      height={256}
      className="size-28 shrink-0 rounded-xl object-cover"
    />
  ) : (
    <div className="flex size-28 shrink-0 items-center justify-center rounded-xl bg-accent-50 font-display text-h3 font-normal text-accent-700">
      {initials(host.name)}
    </div>
  );

  // No bio — nothing to reveal, render a plain card.
  if (!host.bio) {
    return (
      <article className="group flex h-full flex-col items-start justify-center gap-5 rounded-lg border border-line bg-canvas px-6 py-8 text-left">
        {portrait}
        <div>
          <h3 className="text-h3 font-normal leading-tight text-ink-900">{host.name}</h3>
          {host.title ? <p className="mt-1 text-small text-ink-400">{host.title}</p> : null}
        </div>
      </article>
    );
  }

  return (
    <article
      tabIndex={0}
      role="group"
      aria-label={`${host.name}, host — hover or swipe to read the bio`}
      className="group relative snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-lg border border-line bg-canvas transition-colors duration-200 hover:border-ink-300 lg:h-96 lg:snap-none lg:overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {/* Track: face + mobile swipe panel */}
      <div className="flex h-full w-full">
        {/* Face — name & title only, stable anchor */}
        <div className="flex w-full shrink-0 snap-start flex-col items-start justify-center gap-5 px-6 py-8 text-left">
          {portrait}
          <div>
            <h3 className="text-h3 font-normal leading-tight text-ink-900">{host.name}</h3>
            {host.title ? <p className="mt-1 text-small text-ink-400">{host.title}</p> : null}
          </div>
          <p className="flex items-center gap-1.5 font-mono text-micro font-light uppercase tracking-wide text-ink-400">
            <span className="lg:hidden">Swipe to read</span>
            <span className="hidden lg:inline">Hover to read</span>
            <ArrowRight className="size-3.5" aria-hidden />
          </p>
        </div>

        {/* Bio — mobile: swiped into view, fades in with scroll progress */}
        <div
          className="host-card__bio-panel relative flex max-h-[32rem] w-full shrink-0 snap-start overflow-y-auto bg-ink-900 px-6 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ backgroundImage: PANEL_BG }}
        >
          <div className="relative my-auto flex flex-col py-8">
            <p className="font-mono text-eyebrow font-light uppercase tracking-wide text-accent-300">
              About
            </p>
            {/* Not a heading: the face already carries the h3, and repeating it
                here would put two identical headings in the tree per card. */}
            <p className="mt-2 text-h4 font-medium text-white">{host.name}</p>
            <p className="mt-3 text-body font-light text-ink-200">{host.bio}</p>
          </div>
        </div>
      </div>

      {/* Bio — desktop: fades up in place, on hover/focus.
          Every layer carries both group-hover: and group-focus-within: — the
          container used to fade in on focus while its contents stayed at
          opacity-0, so keyboard users got a blank dark panel.

          Timing is asymmetric: 1400ms in, 1000ms out. A transition's duration is
          read from the state being entered, so the base duration is the exit and
          the variants are the entry. Both are deliberately long — the panel is a
          slow dissolve, not a snap. Do not collapse these back to one value. */}
      <div
        className="pointer-events-none absolute inset-0 hidden translate-y-3 items-center overflow-y-auto bg-ink-900 px-6 opacity-0 transition-[opacity,transform] duration-1000 ease-out group-hover:duration-[1400ms] group-focus-within:duration-[1400ms] group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 lg:flex [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ backgroundImage: PANEL_BG }}
      >
        <div className="relative my-auto flex flex-col py-6">
          <p className="translate-y-2 font-mono text-eyebrow font-light uppercase tracking-wide text-accent-300 opacity-0 transition-[opacity,transform] duration-1000 ease-out group-hover:duration-[1400ms] group-focus-within:duration-[1400ms] group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
            About
          </p>
          <p className="mt-2 translate-y-2 text-h4 font-medium text-white opacity-0 transition-[opacity,transform] duration-1000 ease-out group-hover:duration-[1400ms] group-focus-within:duration-[1400ms] group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
            {host.name}
          </p>
          <p className="mt-3 translate-y-2 text-body font-light text-ink-200 opacity-0 transition-[opacity,transform] duration-1000 ease-out group-hover:duration-[1400ms] group-focus-within:duration-[1400ms] group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
            {host.bio}
          </p>
        </div>
      </div>
    </article>
  );
}

/** First letters of the two identifying tokens — sharing nameTokens() with the
 *  headshot resolver, so a monogram and a filename never disagree on a name.
 *  Splitting on spaces instead would read "Omar R. Shakir, MD, MBA" as "OR". */
function initials(name: string): string {
  return nameTokens(name)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}
