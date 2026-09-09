"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(hover: hover) and (pointer: fine)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Whether the primary input can hover, mirroring `usePrefersReducedMotion`'s
 * `useSyncExternalStore` pattern. A few marketing tiles (`HostsTile`,
 * `EpisodeExpandMark`) only advance their own motion on hover/focus — on a
 * touch device that never hovers, so it needs this to fall back to running
 * continuously instead of sitting static. Nothing renders differently off
 * this value (it only gates whether a `setInterval` is allowed to run), so
 * unlike the reduced-motion hook there's no hydration-mismatch risk in
 * defaulting the server snapshot to `true` (desktop-like).
 */
export function useCanHover() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => true,
  );
}
