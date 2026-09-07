import Image from "next/image";
import { cn, initials } from "@/lib/utils";
import { headshotFor } from "@/lib/content";
import type { Host } from "@/lib/schemas";

/** `role` no longer prints — it orders the tiles (guests first) and keys them. */
export type Person = { name: string; role: string; avatar?: string };

/** Everyone on the episode, guests first, capped at the quad. Lifted out of the
 *  component because the hero sizes its own column from the count. */
export function episodePeople(guests: string[], hosts: Host[]): Person[] {
  return [
    ...guests.map((name) => ({ name, role: "Guest", avatar: headshotFor(name) })),
    ...hosts.map((h) => ({ name: h.name, role: "Host", avatar: h.avatar })),
  ].slice(0, 4);
}

/** One row, always — the tiles divide the column rather than wrapping into it,
 *  so a lone portrait gets the full width instead of a quarter of it. Four up
 *  only earns its row at lg; narrower than that it folds to 2x2, because a
 *  four-wide row in a tablet-width column puts each face at ~84px. */
const ROW: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

/**
 * The people on the recording, as portrait tiles in the hero — the guidelines'
 * portrait-quad, sized to however many are actually on the episode. 4:5 at
 * radius 18 (ch.4/6), object-cover, never letterboxed or stretched.
 *
 * Hosts carry their own avatar; guests are free-text names with no image
 * field, so they resolve by name out of public/images/headshots (ch.6). Where
 * that misses, the monogram tile stands in — TILEBG, a .16 hairline, initials
 * in Inter 300 — because the fallback is a designed state, not an error state.
 *
 * Each tile carries the person's name. That is content, not a label, so it is
 * set in Inter — mono is reserved for eyebrows, tokens, counters and footers.
 * The names being here is also why the hero has no byline: it would set the
 * same names twice, 40px apart.
 *
 * Renders nothing when nobody is credited: an empty shell is never placed bare.
 */
export function EpisodePortraits({ people }: { people: Person[] }) {
  if (people.length === 0) return null;

  return (
    <ul className={cn("grid gap-4", ROW[people.length] ?? ROW[4])}>
      {people.map((p) => (
        <li key={`${p.role}-${p.name}`}>
          <div className="relative aspect-4/5 overflow-hidden rounded-(--radius-tile) bg-tile-bg ring-1 ring-inset ring-white/[0.16]">
            {p.avatar ? (
              <Image
                src={p.avatar}
                alt={p.name}
                fill
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 288px"
                className="object-cover"
              />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-h2 font-light text-mono-ink">
                {initials(p.name)}
              </span>
            )}
          </div>
          <p className="mt-3 text-small leading-snug font-medium text-white">{p.name}</p>
        </li>
      ))}
    </ul>
  );
}
