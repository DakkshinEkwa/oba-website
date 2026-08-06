"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInView, useReducedMotion, animate } from "framer-motion";

/**
 * Counts up from 0 to the numeric portion of `value` once it scrolls into
 * view. Splits off any non-numeric prefix/suffix (e.g. "75+", "100%") so
 * those render statically while only the digits animate. Honours
 * prefers-reduced-motion and hides the intermediate digits from assistive
 * tech (a static sr-only value is announced instead).
 */
export function AnimatedStat({ value }: { value: string }) {
  const [prefix, target, suffix] = useMemo(() => {
    const match = value.match(/^(\D*)(\d+)(\D*)$/);
    return match ? [match[1], Number(match[2]), match[3]] : [value, null, ""];
  }, [value]);

  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (reduceMotion || !inView || target === null) return;
    const controls = animate(0, target, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return controls.stop;
  }, [inView, target, reduceMotion]);

  if (target === null) return <span ref={ref}>{prefix}</span>;

  // useReducedMotion() is null on first render; once it resolves to true we
  // render the final value directly instead of animating.
  const shown = reduceMotion ? target : display;

  return (
    <span ref={ref}>
      <span aria-hidden>
        {prefix}
        {shown}
        {suffix}
      </span>
      <span className="sr-only">
        {prefix}
        {target}
        {suffix}
      </span>
    </span>
  );
}
