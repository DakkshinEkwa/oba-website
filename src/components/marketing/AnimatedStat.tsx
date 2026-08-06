"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

/**
 * Counts up from 0 to the numeric portion of `value` once it scrolls into
 * view. Splits off any non-numeric prefix/suffix (e.g. "75+", "100%") so
 * those render statically while only the digits animate.
 */
export function AnimatedStat({ value }: { value: string }) {
  const [prefix, target, suffix] = useMemo(() => {
    const match = value.match(/^(\D*)(\d+)(\D*)$/);
    return match ? [match[1], Number(match[2]), match[3]] : [value, null, ""];
  }, [value]);

  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || target === null) return;
    const controls = animate(0, target, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return controls.stop;
  }, [inView, target]);

  if (target === null) return <span ref={ref}>{prefix}</span>;

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
