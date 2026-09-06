"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Reduced-motion preference, read through `useSyncExternalStore`.
 *
 * Use this — not a hook that resolves the media query during the first client
 * render — whenever the preference decides what gets *rendered*. The server
 * snapshot (false) is what hydration matches against, and the real value lands
 * on the pass after; a hook that returns the true value during hydration makes
 * the markup disagree with the server and React throws the tree away.
 *
 * For a preference that only gates an effect (whether to start a timer, say),
 * framer-motion's `useReducedMotion` is fine — nothing rendered depends on it.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
