"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * An accordion of episodes: each row carries a +/− box, and the open row
 * expands to show what that episode covers. At rest the first row sits open;
 * hovering the card walks the accordion down the list, opening each row in
 * turn. The mark's argument is that every row you open is ophthalmology.
 *
 * The detail is the episode's own summary and guest, straight from the catalog.
 * There is no per-episode topic list to draw on — no episode carries `tags`,
 * and the MDX bodies are unstructured prose — so rather than invent bullet
 * points this shows the real summary. If `topics: []` is ever added to the
 * episode frontmatter, feed it in as `points` and the rows get sharper at no
 * cost to the animation.
 */

export type EpisodeCardItem = {
  slug: string;
  title: string;
  episodeNumber?: number;
  summary: string;
  guest?: string;
};

const STEP_MS = 2000;
const EASE = [0.16, 1, 0.3, 1] as const;

/** Plus that becomes a minus: the upright stroke collapses into the bar. */
function PlusMinus({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative flex size-5 shrink-0 items-center justify-center rounded-[6px] transition-colors duration-300",
        open ? "bg-white/20" : "bg-white/10",
      )}
    >
      <span className="absolute h-px w-2 rounded-full bg-white/80" />
      <span
        className={cn(
          "absolute h-2 w-px rounded-full bg-white/80 transition-transform duration-300 ease-out",
          open ? "scale-y-0" : "scale-y-100",
        )}
      />
    </span>
  );
}

function SubRow({ children, clamp = 1 }: { children: React.ReactNode; clamp?: 1 | 2 }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <p
        className={cn(
          "min-w-0 flex-1 text-[11px] leading-relaxed text-white/55",
          clamp === 2 ? "line-clamp-2" : "truncate",
        )}
      >
        {children}
      </p>
      <ChevronRight aria-hidden className="mt-0.5 size-3 shrink-0 text-white/35" />
    </div>
  );
}

export function EpisodeExpandMark({
  episodes,
  title,
  sub,
  className,
}: {
  episodes: EpisodeCardItem[];
  title: string;
  sub: string;
  className?: string;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion || !active || episodes.length === 0) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % episodes.length), STEP_MS);
    return () => clearInterval(id);
  }, [active, reduceMotion, episodes.length]);

  if (episodes.length === 0) return null;

  return (
    <div
      className={className}
      onMouseEnter={() => setActive(true)}
      // Returning to the first row on the way out keeps the resting state the
      // same one every time.
      onMouseLeave={() => {
        setActive(false);
        setIndex(0);
      }}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      tabIndex={0}
      role="group"
      aria-label="Recent episodes"
    >
      <div className="flex w-full flex-1 items-center justify-center">
        <div className="flex w-full max-w-80 flex-col gap-1.5">
      {episodes.map((episode, i) => {
        const open = i === index;
        return (
          <div
            key={episode.slug}
            className={cn(
              "relative overflow-hidden rounded-md text-left backdrop-blur-md transition-[transform,opacity] duration-300 ease-out",
              open ? "scale-100 opacity-100" : "scale-[0.97] opacity-75",
            )}
          >
            <div
              aria-hidden
              className={cn(
                "absolute inset-0 transition-opacity duration-300",
                open ? "opacity-70" : "opacity-50",
              )}
              style={{ background: "var(--gradient-hero)" }}
            />
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/12 to-transparent"
            />
            <div className="relative flex items-center gap-2.5 px-3 py-2.5">
              <PlusMinus open={open} />
              <p
                className={cn(
                  "min-w-0 flex-1 truncate text-[12px] leading-tight transition-colors duration-300",
                  open ? "font-semibold text-white" : "text-white/70",
                )}
              >
                {episode.title}
              </p>
            </div>

            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  key="detail"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="relative overflow-hidden"
                >
                  <div className="space-y-1 pb-2.5 pl-11 pr-3">
                    <SubRow clamp={2}>{episode.summary}</SubRow>
                    {/* The summary usually names the guest already — only add
                        the credit row when it does not. */}
                    {episode.guest && !episode.summary.includes(episode.guest) ? (
                      <SubRow>With {episode.guest}</SubRow>
                    ) : null}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
        </div>
      </div>
      <p className="mt-6 text-balance text-body-lg text-ink-900">{title}</p>
      <p className="mt-2 text-balance text-body text-ink-400">{sub}</p>
    </div>
  );
}
