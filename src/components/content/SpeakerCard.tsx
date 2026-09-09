"use client";

import { useId } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Plus } from "lucide-react";
import type { Speaker } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Speaker card, built in the stat bento's language: a light steel tile with a
 * hairline border, a frosted slate monogram, and episode rows that read like
 * the accordion's sub-rows.
 *
 * Guests with a headshot in `public/images/headshots` get the photograph;
 * the rest fall back to the monogram, which the brand guidelines already
 * sanction where no headshot exists. Every episode is a real link, so the card
 * is a route into the catalog rather than a dead directory entry.
 *
 * The card collapses to its header and expands on click, with the `Plus` that
 * turns 45° borrowed from `FaqAccordion` so the affordance reads the same
 * everywhere. Open state is owned by `SpeakersGrid`, which opens a whole row at
 * once, so the card is controlled rather than self-managing. It is hand-rolled rather than Radix because Radix unmounts closed
 * content: the episode links are this page's whole contribution to internal
 * linking, so they have to stay in the static HTML whether the card is open or
 * not. Collapsed content is therefore clipped by a 0fr grid row (animatable,
 * unlike `height: auto`) and marked `inert`, which keeps it out of the tab
 * order and the accessibility tree without removing it from the document.
 */

function initials(name: string) {
  return name
    .replace(/^(Dr|Mr|Mrs|Ms|Prof)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function SpeakerCard({
  speaker,
  open,
  onToggle,
}: {
  speaker: Speaker;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = useId();
  const count = speaker.episodes.length;

  return (
    <article
      className={cn(
        "bento-cell relative flex flex-col rounded-2xl border border-line",
        "bg-linear-to-b from-accent-50 to-accent-100 p-4",
      )}
    >
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="group flex w-full items-center gap-4 text-left"
        >
          {/* Headshot where we have one; otherwise the frosted slate monogram —
              the host chips' treatment at portrait scale. Both sit in the same
              24-square, so a card's layout never depends on which it got. */}
          <span className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl backdrop-blur-md">
            {speaker.image ? (
              <Image
                src={speaker.image}
                alt=""
                width={192}
                height={192}
                className="size-full object-cover object-top"
              />
            ) : (
              <>
                <span
                  aria-hidden
                  className="absolute inset-0 opacity-70"
                  style={{ background: "var(--gradient-hero)" }}
                />
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/12 to-transparent"
                />
                <span className="relative font-mono text-body-lg font-semibold tracking-wide text-white">
                  {initials(speaker.name)}
                </span>
              </>
            )}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-body-lg font-medium text-ink-900">
              {speaker.name}
            </span>
            <span className="mt-0.5 block text-small text-ink-400">
              {count} {count === 1 ? "episode" : "episodes"}
            </span>
          </span>
          <Plus
            aria-hidden
            className={cn(
              "mr-1 size-5 shrink-0 text-ink-400 transition-[transform,color] duration-300 group-hover:text-ink-600",
              open && "rotate-45",
            )}
          />
        </button>
      </h3>

      <div
        id={panelId}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden" inert={!open}>
          <ul className="mt-4 space-y-0.5 border-t border-line pt-3">
            {speaker.episodes.map((episode) => (
              <li key={episode.slug}>
                <Link
                  href={`/podcast/episodes/${episode.slug}`}
                  className="group/row relative isolate flex items-start justify-between gap-2 rounded-lg px-3 py-2.5 text-left"
                >
                  {/* Frosted glass on hover: the hero gradient the panel cards
                      use, but held far off full strength so it reads as a
                      translucent pane over the card rather than a dark slate
                      block, with a sheen across the top. */}
                  <span
                    aria-hidden
                    className="absolute inset-0 -z-10 rounded-lg opacity-0 backdrop-blur-[8px] transition-opacity duration-300 group-hover/row:opacity-20 group-focus-visible/row:opacity-20"
                    style={{ background: "var(--gradient-hero)" }}
                  />
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 -z-10 h-1/2 rounded-t-lg bg-linear-to-b from-white/25 to-transparent opacity-0 transition-opacity duration-300 group-hover/row:opacity-100 group-focus-visible/row:opacity-100"
                  />
                  <span className="min-w-0 flex-1 text-small leading-relaxed text-ink-500 transition-colors duration-300 group-hover/row:text-ink-900 group-focus-visible/row:text-ink-900">
                    {episode.title}
                  </span>
                  <ChevronRight
                    aria-hidden
                    className="mt-1 size-3.5 shrink-0 text-ink-300 transition-colors duration-300 group-hover/row:text-ink-600 group-focus-visible/row:text-ink-600"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
