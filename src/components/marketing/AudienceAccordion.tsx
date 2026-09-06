"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/Section";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

type Audience = { title: string; body: string };

const EASE = [0.16, 1, 0.3, 1] as const;

/** Plus that becomes a minus: the upright stroke collapses into the bar. */
function PlusMinus({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative flex size-6 shrink-0 items-center justify-center rounded-[7px] transition-colors duration-300",
        open ? "bg-white/20" : "bg-white/10",
      )}
    >
      <span
        className={cn(
          "absolute h-px w-2.5 rounded-full transition-colors duration-300",
          open ? "bg-white" : "bg-white/70",
        )}
      />
      <span
        className={cn(
          "absolute h-2.5 w-px rounded-full transition-[transform,background-color] duration-300 ease-out",
          open ? "scale-y-0 bg-white" : "scale-y-100 bg-white/70",
        )}
      />
    </span>
  );
}

type AudienceAccordionProps = {
  items: Audience[];
  eyebrow: string;
  title: React.ReactNode;
  titleDim?: React.ReactNode;
  lede?: React.ReactNode;
  /**
   * Let the page's own scrolling walk the cards, and offer the pin where there
   * is room for it. True on the homepage; false on interior pages, which borrow
   * this layout vocabulary but not its motion — there the accordion opens on
   * click alone, starting on the first card.
   */
  scrollDriven?: boolean;
};

/**
 * A set of audience cards as an accordion, one open at a time.
 *
 * Two callers, one component: the homepage's "Who it's for" runs it
 * `scrollDriven`, and `/speak`'s "Who we invite" runs it as a plain click
 * accordion. Everything below the driver — the glass cards, the plus/minus, the
 * 5/7 split against the section header — is shared, which is the point: the two
 * sections ask the reader the same question and should look like they do.
 *
 * While `scrollDriven`, and where there is room for it (see `.audience-pin` in
 * globals.css), the section pins to the viewport and each screen of scroll opens
 * the next card, so the reader passes through all of them before the page moves
 * on. Everywhere else — narrow, short, or reduced-motion — the same markup is a
 * plain stacked section and the cards advance as it passes the viewport.
 *
 * One driver covers both, because it measures instead of re-testing the media
 * query: a wrapper taller than the viewport *is* a pinned wrapper, and the
 * distance it has left to travel is the progress through the pin. CSS stays the
 * only place the pin is decided.
 *
 * The bodies stay mounted and are clipped by the height animation rather than
 * unmounted, unlike the bento tile this borrows its motion from: that one is
 * proof-by-mark, this is content that has to stay in the DOM for search and for
 * a screen reader walking the list. Emphasis only ever adds contrast — the
 * resting title is an accessible white/80 on the smoked ground and opening
 * raises it to white — so no card is dimmed below the floor to make its
 * neighbour stand out.
 */
export function AudienceAccordion({
  items,
  eyebrow,
  title,
  titleDim,
  lede,
  scrollDriven = true,
}: AudienceAccordionProps) {
  const reduceMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  // A card opened by hand holds only while the section scrolls past under its
  // own steam. Under the pin, scroll has to keep winning — the reader is three
  // screens deep in a section that cannot move on, and a card frozen by an
  // earlier click would strand them there.
  const picked = useRef(false);
  const panelId = useId();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!scrollDriven || !wrapper) return;
    let frame = 0;

    const read = () => {
      frame = 0;
      const rect = wrapper.getBoundingClientRect();
      const viewport = window.innerHeight;
      const travel = rect.height - viewport;
      const pinned = travel > 8;
      if (!pinned && picked.current) return;
      // Pinned: how far through the pin's travel we are. Loose: how far the
      // section has moved across the viewport, from first entering to last
      // leaving. Both run 0 → 1 and split evenly into one bucket per card.
      const progress = pinned
        ? -rect.top / travel
        : (viewport - rect.top) / (viewport + rect.height);
      const index = Math.floor(Math.min(Math.max(progress, 0), 0.999) * items.length);
      setActive((prev) => (prev === index ? prev : index));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items.length, scrollDriven]);

  return (
    <div
      ref={wrapperRef}
      className={cn("relative", scrollDriven && "audience-pin")}
      style={{ "--audience-steps": items.length } as React.CSSProperties}
    >
      <div
        className={cn(
          "relative grid gap-10 lg:grid-cols-12 lg:gap-16",
          scrollDriven && "audience-pin-panel",
        )}
      >
        <div className="lg:col-span-5">
          <SectionHeader eyebrow={eyebrow} title={title} titleDim={titleDim} lede={lede} />
          {/* Progress rail: a pinned section has to say how much of it is left,
              or the reader reads the stall as a broken page. State only — the
              cards already carry it in `aria-expanded`. It is mounted only for
              the scroll driver, since the pin is the only thing it reports on. */}
          {scrollDriven ? (
            <div aria-hidden className="audience-rail mt-8 hidden gap-1.5">
              {items.map((a, i) => (
                <span
                  key={a.title}
                  className={cn(
                    "h-0.5 w-10 rounded-full transition-colors duration-500",
                    i === active ? "bg-accent-500" : "bg-line-strong",
                  )}
                />
              ))}
            </div>
          ) : null}
        </div>

        <ul className="flex flex-col gap-2.5 lg:col-span-7">
          {items.map((a, i) => {
            const open = i === active;
            return (
              <li
                key={a.title}
                className={cn(
                  "relative overflow-hidden rounded-lg border p-4 backdrop-brightness-[0.38] transition-[transform,border-color] duration-500 ease-(--ease-out) sm:p-5",
                  open ? "scale-100 border-white/20" : "scale-[0.99] border-white/10",
                )}
              >
                {/* The site's hero gradient, held translucent so the washes
                    behind still bend through it. The fill is a layer rather than
                    the element's own background because gradients do not
                    interpolate — opacity does, so open and resting cross-fade
                    with everything else on the 500ms.
                    `backdrop-brightness` on the card is what makes this work on
                    a light section: it darkens the ground *under* the glass, so
                    white type clears 4.5:1 without an opaque fill closing the
                    glass up. Translucency alone over the light canvas would
                    land the composite near #75848e — about 3:1.
                    It is the only backdrop filter here on purpose. The panel's
                    ground is flat `canvas-subtle`, and blurring one flat colour
                    returns that colour — a `backdrop-blur` would cost a
                    compositing layer per card and paint nothing. Put a varied
                    ground back behind the panel and the blur earns its place
                    again. */}
                <span
                  aria-hidden
                  style={{ background: "var(--gradient-hero)" }}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-500",
                    open ? "opacity-[0.78]" : "opacity-[0.62]",
                  )}
                />
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/12 to-transparent"
                />
                <h3 className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      picked.current = true;
                      setActive(i);
                    }}
                    aria-expanded={open}
                    aria-controls={`${panelId}-${i}`}
                    className={cn(
                      "flex w-full items-center gap-2.5 text-left text-h4 font-normal transition-colors duration-500",
                      open ? "text-white" : "text-white/80 hover:text-white",
                    )}
                  >
                    <PlusMinus open={open} />
                    <span className="text-balance">{a.title}</span>
                  </button>
                </h3>
                <motion.div
                  id={`${panelId}-${i}`}
                  initial={false}
                  animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.4, ease: EASE }}
                  className="relative overflow-hidden"
                >
                  <p className="pl-[2.125rem] pt-2.5 text-body text-white/75">{a.body}</p>
                </motion.div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
