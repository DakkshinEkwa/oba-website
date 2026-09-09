"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

/* --------------------------------- clock --------------------------------- */

/**
 * A one-second clock as an external store.
 *
 * `useSyncExternalStore` rather than `useState` + `useEffect` because that is
 * literally what this is — a subscription to something outside React — and it
 * is the only shape that gets hydration right for free: `getServerSnapshot`
 * returns 0, so the server HTML and the first client paint both render
 * placeholders, and the real time arrives on the render after hydration.
 *
 * The timer is lazy and shared: one interval no matter how many countdowns are
 * mounted, and none at all when the page has no countdown on it.
 */
let now = 0;
let timer: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  if (!timer) {
    now = Date.now();
    timer = setInterval(() => {
      now = Date.now();
      for (const listener of listeners) listener();
    }, 1000);
  }
  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

/** Cached between ticks, as the store contract requires. */
const getSnapshot = () => now;
/** 0 is the "clock not running" sentinel: no server render knows the time. */
const getServerSnapshot = () => 0;

/* ------------------------------- countdown ------------------------------- */

type Remaining = { days: number; hours: number; mins: number; secs: number };

function remaining(targetMs: number, nowMs: number): Remaining | null {
  const delta = targetMs - nowMs;
  if (delta <= 0) return null;
  const total = Math.floor(delta / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    mins: Math.floor((total % 3600) / 60),
    secs: total % 60,
  };
}

const UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "mins", label: "Mins" },
  { key: "secs", label: "Secs" },
] as const;

/**
 * Time remaining until a panel starts.
 *
 * The site is fully statically generated, so a countdown computed at build
 * time would be wrong the moment the page was cached. The server therefore
 * renders em-dash placeholders — the same shape, none of the numbers — and the
 * figures fill in once the clock is running in the browser.
 *
 * **The per-second tick is not decoration** and is not an exception to the
 * no-motion rule: it is the value changing. `prefers-reduced-motion` is
 * deliberately not consulted, because the only alternative is a clock that
 * silently lies about the time. Nothing else here animates.
 *
 * Once the start instant passes, the component renders a plain line instead of
 * a row of zeroes — and does so live, so a viewer holding the page across the
 * start time sees it change rather than a frozen "00".
 */
export function EventCountdown({
  /** Exact start instant, e.g. "2026-09-17T16:00:00Z". */
  target,
  /** Ground this sits on. The hero is dark; a light section passes "light". */
  tone = "dark",
  className,
}: {
  target: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  const nowMs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const targetMs = new Date(target).getTime();

  if (Number.isNaN(targetMs)) return null;

  const running = nowMs !== 0;
  const left = running ? remaining(targetMs, nowMs) : null;
  const isDark = tone === "dark";

  if (running && !left) {
    return (
      <p className={cn("text-small", isDark ? "text-white/60" : "text-ink-500", className)}>
        This panel has already started.
      </p>
    );
  }

  return (
    <div className={className}>
      {/* aria-hidden: the grid duplicates the sentence below it, which is what
          a screen reader actually gets. */}
      <ul className="grid max-w-md grid-cols-4 gap-2 sm:gap-3" aria-hidden>
        {UNITS.map(({ key, label }) => (
          <li
            key={key}
            className={cn(
              "rounded-(--radius-md) border px-2 py-3 text-center",
              isDark ? "border-white/15 bg-white/5" : "border-line bg-canvas",
            )}
          >
            <span
              className={cn(
                "block font-mono text-h4 tabular-nums",
                isDark ? "text-white" : "text-ink-900",
              )}
            >
              {left ? String(left[key]).padStart(2, "0") : "—"}
            </span>
            <span
              className={cn(
                "mt-1 block font-mono text-micro uppercase tracking-wide",
                isDark ? "text-white/50" : "text-ink-400",
              )}
            >
              {label}
            </span>
          </li>
        ))}
      </ul>
      {/* One sentence, announced once. A live region on a per-second clock
          would make the page unusable with a screen reader. */}
      <p className="sr-only">
        {left
          ? `Starts in ${left.days} days, ${left.hours} hours and ${left.mins} minutes.`
          : "Loading time remaining."}
      </p>
    </div>
  );
}
