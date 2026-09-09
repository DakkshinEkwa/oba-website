"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { Host } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { useCanHover } from "@/lib/use-can-hover";

/**
 * Hosts tile: a rolling stack of credential chips. Three sit in the window at
 * a time and the column rolls up one chip per second while the card is hovered
 * (or keyboard-focused), so the roster runs past rather than cutting between
 * states — the chip in the middle slot is the one in focus, and the focus rolls
 * onto the next chip as the column moves.
 *
 * The roll is a two-beat cycle: translate the column up by exactly one step,
 * then advance the window and snap back to zero with no transition. Because the
 * window advanced by one, the snapped-back frame is identical to the one just
 * animated to, so the reset is invisible and the roll never has to end.
 *
 * The stack is `aria-hidden` and the full roster is carried in an `sr-only`
 * list instead — assistive tech gets every name at once rather than whichever
 * three happen to be mid-roll.
 */

/** Chips visible in the window; one more is rendered below to roll in. */
const SLOTS = 3;
const STEP_MS = 1000;
const CHIP_H = 56;
const GAP = 12;
const STEP = CHIP_H + GAP;

/**
 * Frosted slate chip: the hero gradient held under a translucent layer so the
 * light card ground reads through it, plus a top sheen. The chip out of focus
 * sits back rather than the focused one growing past its slot — scaling *up*
 * would push it through the clipped window, so full size is the focused state.
 */
function Chip({ host, focused }: { host: Host; focused: boolean }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md backdrop-blur-md transition-[transform,opacity] duration-300 ease-out",
        focused ? "scale-100 opacity-100" : "scale-95 opacity-70",
      )}
      style={{ height: CHIP_H }}
    >
      <div
        aria-hidden
        className={cn("absolute inset-0 transition-opacity duration-300", focused ? "opacity-70" : "opacity-55")}
        style={{ background: "var(--gradient-hero)" }}
      />
      <div aria-hidden className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/12 to-transparent" />
      <div className="relative flex h-full items-center gap-3 px-4">
        {host.avatar ? (
          <Image
            src={host.avatar}
            alt=""
            width={64}
            height={64}
            className="size-9 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="size-9 shrink-0 rounded-full bg-white/10" />
        )}
        <div className="min-w-0 text-left">
          <p className="truncate text-[13px] font-semibold leading-tight text-white">{host.name}</p>
          <p className="truncate text-[11px] leading-tight text-white/55">{host.title}</p>
        </div>
      </div>
    </div>
  );
}

export function HostsTile({
  hosts,
  hostCount,
  className,
}: {
  hosts: Host[];
  hostCount: number;
  className?: string;
}) {
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);
  const [rolling, setRolling] = useState(false);
  const reduceMotion = useReducedMotion();
  const canHover = useCanHover();

  const canRoll = hosts.length > SLOTS;
  // A touch device never fires the hover/focus this normally gates on, so it
  // falls back to running continuously rather than sitting static.
  const running = active || !canHover;

  useEffect(() => {
    if (!running || reduceMotion || !canRoll) return;
    const id = setInterval(() => setRolling(true), STEP_MS);
    return () => clearInterval(id);
  }, [running, reduceMotion, canRoll]);

  // One more than the window, so there is always a chip queued to roll in.
  const window_ = Array.from(
    { length: SLOTS + 1 },
    (_, k) => hosts[(index + k) % hosts.length],
  );
  // At rest the middle chip is in focus; mid-roll the focus moves with the
  // column onto the chip taking its place.
  const focusedSlot = rolling ? 2 : 1;

  return (
    <div
      className={className}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      tabIndex={0}
      role="group"
      aria-label={`${hostCount} hosts and regular contributors`}
    >
      <div className="flex w-full flex-1 items-center justify-center">
        <div
          aria-hidden
          className="mx-auto w-full max-w-64 overflow-hidden"
          style={{
            height: SLOTS * CHIP_H + (SLOTS - 1) * GAP,
            maskImage:
              "linear-gradient(to bottom, transparent 0, #000 14px, #000 calc(100% - 14px), transparent 100%)",
          }}
        >
          <motion.div
            className="flex flex-col gap-3"
            animate={{ y: rolling ? -STEP : 0 }}
            transition={rolling ? { duration: 0.52, ease: [0.16, 1, 0.3, 1] } : { duration: 0 }}
            onAnimationComplete={() => {
              if (!rolling) return;
              setIndex((i) => (i + 1) % hosts.length);
              setRolling(false);
            }}
          >
            {window_.map((host, k) => (
              <Chip key={`${index}-${k}`} host={host} focused={k === focusedSlot} />
            ))}
          </motion.div>
        </div>
      </div>

      <p className="mt-6 text-balance text-body-lg text-ink-900">
        {`${hostCount} hosts & regular contributors`}
      </p>
      <p className="mt-2 text-balance text-body text-ink-400">
        Operators and physicians, on the record.
      </p>
      <ul className="sr-only">
        {hosts.map((h) => (
          <li key={h.slug}>
            {h.name}
            {h.title ? ` — ${h.title}` : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
