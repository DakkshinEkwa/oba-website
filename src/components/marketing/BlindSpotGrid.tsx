"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/**
 * `visual-field-grid` from the brand asset library, inlined rather than loaded
 * as a file so the individual cells can move — an `<img>` seals its own DOM off
 * from the page, so the mark had to become a component to animate at all.
 *
 * At rest the field is fully plotted: every cell at its measured sensitivity,
 * pixel-for-pixel the still mark. Hovering the card replays the test — the grid
 * drops to an unplotted lattice and a probe ring sweeps outward from fixation,
 * each cell settling to its own value as the ring passes it. The dim cells stay
 * dim once the sweep is done, which is the whole argument: the test is what
 * finds them. Because the resting state is the finished plot, nobody has to
 * hover to read the mark.
 *
 * OPACITIES are lifted verbatim from `public/images/marks/visual-field-grid.svg`
 * rather than recomputed from its `data-value` sensitivities — the file's
 * value-to-opacity mapping is not a clean linear ramp, and re-deriving one would
 * redraw the field. Geometry likewise follows the file: 16px cells on an 18px
 * pitch, inset 1px, in a 180 box.
 */

/** Measured sensitivity per cell, as ink opacity. Row-major, 10x10. */
const OPACITIES = [
  [0.16, 0.18, 0.21, 0.24, 0.28, 0.30, 0.28, 0.26, 0.21, 0.16],
  [0.17, 0.18, 0.20, 0.24, 0.29, 0.34, 0.34, 0.31, 0.27, 0.21],
  [0.18, 0.18, 0.17, 0.23, 0.30, 0.36, 0.38, 0.35, 0.31, 0.26],
  [0.21, 0.20, 0.19, 0.25, 0.32, 0.39, 0.41, 0.38, 0.34, 0.28],
  [0.25, 0.25, 0.27, 0.31, 0.36, 0.42, 0.42, 0.39, 0.35, 0.30],
  [0.29, 0.31, 0.33, 0.37, 0.41, 0.44, 0.42, 0.39, 0.35, 0.30],
  [0.28, 0.34, 0.38, 0.41, 0.42, 0.42, 0.41, 0.38, 0.34, 0.28],
  [0.26, 0.31, 0.35, 0.38, 0.39, 0.39, 0.38, 0.35, 0.31, 0.26],
  [0.21, 0.27, 0.31, 0.34, 0.35, 0.35, 0.34, 0.31, 0.27, 0.21],
  [0.16, 0.21, 0.26, 0.28, 0.30, 0.30, 0.28, 0.26, 0.21, 0.16],
];

const SIZE = 180;
const PITCH = 18;
const CELL = 16;
const INSET = 1;
/** Cell centre of the 10x10 field, in cell units. */
const MID = 4.5;

/** Fade of a single cell once the probe reaches it. */
const CELL_MS = 300;
/** Spread of the sweep from fixation out to the corners. */
const SWEEP_MS = 620;
/** Hold the finished plot before the test replays. */
const HOLD_MS = 900;
const CYCLE_MS = SWEEP_MS + CELL_MS + HOLD_MS;

/** Unmeasured lattice: below the faintest real reading (0.16) but still there. */
const FLOOR = 0.08;
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * Probe radius in SVG units at the two ends of the sweep — the distance to the
 * nearest and furthest cell centres, so the ring meets each cell exactly as that
 * cell's delay elapses.
 */
const PROBE_FROM = Math.hypot(0.5, 0.5) * PITCH;
const PROBE_TO = Math.hypot(MID, MID) * PITCH;

/** Share of the sweep a cell waits, by its distance out from fixation. */
function rank(row: number, col: number) {
  const d = Math.hypot(row - MID, col - MID);
  const near = Math.hypot(0.5, 0.5);
  const far = Math.hypot(MID, MID);
  return (d - near) / (far - near);
}

export function BlindSpotGrid({
  title,
  sub,
  className,
}: {
  title: string;
  sub: string;
  className?: string;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(false);
  // False is the unplotted lattice; the sweep is what turns it back on. Kept
  // separate from `active` so the blank state gets a paint of its own before
  // the transitions are armed — set both at once and the browser coalesces
  // them and nothing moves.
  const [sweeping, setSweeping] = useState(false);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!active || reduceMotion) return;
    let cancelled = false;
    let blankFrame = 0;
    let armFrame = 0;
    let timer = 0;

    const run = () => {
      setSweeping(false);
      blankFrame = requestAnimationFrame(() => {
        armFrame = requestAnimationFrame(() => {
          if (cancelled) return;
          setCycle((c) => c + 1);
          setSweeping(true);
          timer = window.setTimeout(run, CYCLE_MS);
        });
      });
    };
    run();

    return () => {
      cancelled = true;
      cancelAnimationFrame(blankFrame);
      cancelAnimationFrame(armFrame);
      window.clearTimeout(timer);
    };
  }, [active, reduceMotion]);

  // Idle and reduced motion both rest on the finished plot; only a live sweep
  // ever shows the lattice.
  const running = active && !reduceMotion;
  const blank = running && !sweeping;

  return (
    <div
      className={className}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <div className="flex flex-1 items-center justify-center">
        <svg
          aria-hidden
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          fill="none"
          className="size-44 text-ink-900"
        >
          {OPACITIES.map((row, r) =>
            row.map((opacity, c) => (
              <rect
                key={`${r}-${c}`}
                x={INSET + c * PITCH}
                y={INSET + r * PITCH}
                width={CELL}
                height={CELL}
                rx={2}
                fill="currentColor"
                fillOpacity={blank ? FLOOR : opacity}
                style={{
                  transitionProperty: "fill-opacity",
                  transitionTimingFunction: EASE,
                  // Off outside the sweep so the drop to the lattice snaps
                  // rather than playing the plot backwards.
                  transitionDuration: sweeping ? `${CELL_MS}ms` : "0ms",
                  transitionDelay: sweeping ? `${Math.round(rank(r, c) * SWEEP_MS)}ms` : "0ms",
                }}
              />
            )),
          )}
          {running && sweeping ? (
            <motion.circle
              key={cycle}
              cx={SIZE / 2}
              cy={SIZE / 2}
              stroke="currentColor"
              strokeWidth={1}
              initial={{ r: PROBE_FROM, strokeOpacity: 0.28 }}
              animate={{ r: PROBE_TO, strokeOpacity: 0 }}
              // Linear, because the per-cell delays ramp linearly with distance
              // — any easing here and the ring drifts off the cells it lights.
              transition={{ duration: SWEEP_MS / 1000, ease: "linear" }}
            />
          ) : null}
        </svg>
      </div>
      <p className="mt-6 text-balance text-body-lg text-ink-900">{title}</p>
      <p className="mt-2 text-balance text-body text-ink-400">{sub}</p>
    </div>
  );
}
