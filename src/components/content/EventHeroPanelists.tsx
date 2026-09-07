import Image from "next/image";
import { headshotFor } from "@/lib/content";
import { initials } from "@/lib/utils";
import type { EventPanelist } from "@/lib/schemas";

/**
 * The panel line-up in the hero: face, name and role, one row.
 *
 * The registration page puts the people in the hero rather than making a
 * visitor scroll for them, and it is the right call — on a panel page the
 * line-up *is* the offer. This is the compact version of that; the full tiles
 * with bios are still the section further down (`EventPanelists`).
 *
 * Squares at `rounded-xl`, not circles: the square portrait is this site's
 * people idiom (`HostCard`, `SpeakerCard`, and the tiles below use the same).
 * Photos resolve by name through the exact-match `headshotFor()`, with the
 * frosted monogram for a miss — the same contract as everywhere else, so
 * dropping `first-last.jpg` into `public/images/headshots/` fills the face in
 * both places at once.
 */
export function EventHeroPanelists({ panelists }: { panelists: EventPanelist[] }) {
  if (panelists.length === 0) return null;

  return (
    /* A grid, not a wrapped flex row: names and roles vary in length by a
       factor of two, so a flex row breaks unevenly — one person per line,
       then two sharing the next. Two columns hold the hero copy measure. */
    <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
      {panelists.map((p) => {
        const avatar = headshotFor(p.name);
        return (
          <li key={p.name} className="flex min-w-0 items-center gap-3">
            {avatar ? (
              <Image
                src={avatar}
                alt=""
                width={128}
                height={128}
                className="size-12 shrink-0 rounded-xl object-cover object-top"
              />
            ) : (
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] font-mono text-micro font-semibold tracking-wide text-white backdrop-blur-md">
                {initials(p.name)}
              </span>
            )}
            <div className="min-w-0">
              <p className="text-small font-medium text-white">{p.name}</p>
              {p.role || p.org ? (
                <p className="mt-0.5 text-micro text-white/50">
                  {[p.role, p.org].filter(Boolean).join(" · ")}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
