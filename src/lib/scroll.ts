import type { MouseEvent } from "react";

/**
 * Jump straight to an in-page anchor, bypassing the global smooth scroll.
 *
 * `html { scroll-behavior: smooth }` in `globals.css` is the right nudge for a
 * short hop, but the browser animates at a fixed duration regardless of
 * distance: a nav click that has to travel the whole homepage crawls down
 * through every section instead of landing on its target. Nav anchors are
 * destination jumps, not nudges, so they opt out.
 *
 * `behavior: "instant"` is load-bearing — `"auto"` means "use the computed
 * `scroll-behavior`", which is exactly the smooth we are trying to escape.
 *
 * Returns false when the target is not on this page, so the caller can fall
 * through to the browser's own anchor handling.
 */
export function jumpToHash(hash: string): boolean {
  const el = document.getElementById(hash.replace(/^#/, ""));
  if (!el) return false;

  el.scrollIntoView({ behavior: "instant", block: "start" });

  // Keep the URL shareable without letting a hashchange re-trigger the scroll.
  if (window.location.hash !== hash) history.pushState(null, "", hash);

  // Anchor targets are plain layout elements; give keyboard users somewhere to
  // carry on from, the way a real hash navigation would.
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });

  return true;
}

/** True for a plain left-click, i.e. one we may hijack from the browser. */
export function isPlainClick(event: MouseEvent): boolean {
  return (
    !event.defaultPrevented &&
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}
