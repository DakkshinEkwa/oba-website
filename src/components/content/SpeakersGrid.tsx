"use client";

import { useEffect, useState } from "react";
import type { Speaker } from "@/lib/content";
import { SpeakerCard } from "./SpeakerCard";

/**
 * The speaker grid, which owns the open/closed state rather than the cards.
 *
 * Opening a card opens every card on its row, so a row expands as one band and
 * the bento never leaves one tall card standing beside short ones. That means
 * knowing how many columns are on screen, which only CSS knows — so the grid
 * classes and the breakpoints that mirror them are declared together here, and
 * must be changed together. Row indices mean something different at a different
 * column count, so a breakpoint change closes whatever was open.
 */
const BREAKPOINTS = [
  { query: "(min-width: 1024px)", columns: 3 },
  { query: "(min-width: 640px)", columns: 2 },
];

export function SpeakersGrid({ speakers }: { speakers: Speaker[] }) {
  // One column until the effect reads the viewport. Nothing is open on the
  // first paint, so the server and client agree regardless of the real count.
  const [columns, setColumns] = useState(1);
  const [openRow, setOpenRow] = useState<number | null>(null);

  useEffect(() => {
    const lists = BREAKPOINTS.map((b) => window.matchMedia(b.query));
    const sync = () => {
      setColumns(BREAKPOINTS.find((_, i) => lists[i].matches)?.columns ?? 1);
      setOpenRow(null);
    };
    sync();
    lists.forEach((l) => l.addEventListener("change", sync));
    return () => lists.forEach((l) => l.removeEventListener("change", sync));
  }, []);

  return (
    <div className="bento-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {speakers.map((speaker, i) => {
        const row = Math.floor(i / columns);
        return (
          <SpeakerCard
            key={speaker.name}
            speaker={speaker}
            open={openRow === row}
            onToggle={() => setOpenRow((current) => (current === row ? null : row))}
          />
        );
      })}
    </div>
  );
}
