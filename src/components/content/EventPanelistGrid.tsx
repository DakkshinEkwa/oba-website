"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { cn, initials } from "@/lib/utils";
import type { EventPanelist } from "@/lib/schemas";

/**
 * The interactive half of `EventPanelists`: the tiles, and the open/closed
 * state above them.
 *
 * Each tile collapses to its header — portrait, name, role, org — and expands
 * to the bio, with `SpeakerCard`'s hand-rolled disclosure rather than Radix:
 * the bio is content, so it stays in the static HTML whether the tile is open
 * or not. Collapsed content is clipped by a `0fr` grid row (animatable, unlike
 * `height: auto`) and marked `inert`, which keeps it out of the tab order and
 * the accessibility tree without removing it from the document. The `Plus` that
 * turns 45° is `FaqAccordion`'s, so the affordance reads the same site-wide.
 *
 * Open state lives here, not in the tile, because opening one tile opens its
 * whole row — otherwise the bento is left with one tall card standing beside a
 * short one, which is the exact raggedness the tile ground was introduced to
 * fix. That means knowing the column count, which only CSS knows, so the grid
 * classes and the breakpoint mirroring them are declared together and must be
 * changed together. A row index means something different at a different column
 * count, so a breakpoint change closes whatever was open.
 *
 * A panelist with no bio has nothing to disclose: that tile renders its header
 * as plain text, not a dead button.
 */
type ResolvedPanelist = EventPanelist & { avatar?: string };

const COLUMNS_QUERY = "(min-width: 640px)";

/** `StatBento`'s light tile: hairline border, the `accent-50 → accent-100` steel. */
const TILE =
  "bento-cell relative flex flex-col rounded-2xl border border-line bg-linear-to-b from-accent-50 to-accent-100 p-7 sm:p-8";

function Portrait({ panelist }: { panelist: ResolvedPanelist }) {
  if (panelist.avatar) {
    return (
      <Image
        src={panelist.avatar}
        alt=""
        width={256}
        height={256}
        className="size-28 shrink-0 rounded-xl object-cover object-top"
      />
    );
  }
  // No headshot: `SpeakerCard`'s frosted slate monogram, the one fallback that
  // still reads on a pale tile.
  return (
    <span className="relative flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-xl backdrop-blur-md">
      <span
        aria-hidden
        className="absolute inset-0 opacity-70"
        style={{ background: "var(--gradient-hero)" }}
      />
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/12 to-transparent"
      />
      <span className="relative font-mono text-body-lg font-semibold tracking-wide text-white">
        {initials(panelist.name)}
      </span>
    </span>
  );
}

/**
 * Name, role and org. A button's content model is phrasing content, so the
 * heading has to sit outside it (`h3 > button`, as `SpeakerCard` does) and the
 * lines inside become spans; a tile with no bio has no button and keeps the
 * real elements.
 */
function Identity({
  panelist,
  standalone,
}: {
  panelist: ResolvedPanelist;
  standalone?: boolean;
}) {
  const Box = standalone ? "div" : "span";
  const Name = standalone ? "h3" : "span";
  const Line = standalone ? "p" : "span";

  return (
    <Box className="min-w-0 flex-1 pt-1">
      <Name className="block text-h4 font-normal leading-tight text-ink-900">{panelist.name}</Name>
      {panelist.role ? (
        <Line className="mt-2 block text-small leading-snug text-ink-500">{panelist.role}</Line>
      ) : null}
      {panelist.org ? (
        <Line className="mt-1.5 block font-mono text-micro uppercase tracking-wide text-ink-400">
          {panelist.org}
        </Line>
      ) : null}
    </Box>
  );
}

function PanelistTile({
  panelist,
  open,
  onToggle,
}: {
  panelist: ResolvedPanelist;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = useId();

  if (!panelist.bio) {
    return (
      <li className={TILE}>
        <div className="flex items-start gap-5">
          <Portrait panelist={panelist} />
          <Identity panelist={panelist} standalone />
        </div>
      </li>
    );
  }

  return (
    <li className={TILE}>
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="group flex w-full items-start gap-5 text-left"
        >
          <Portrait panelist={panelist} />
          <Identity panelist={panelist} />
          <Plus
            aria-hidden
            className={cn(
              "mt-1 size-5 shrink-0 text-ink-400 transition-[transform,color] duration-300 group-hover:text-ink-600",
              open && "rotate-45",
            )}
          />
        </button>
      </h3>

      {/* `flex-auto`, so the pane below fills the tile rather than leaving a
          band of bare steel under it: a row opens as one band, and its tiles
          are height-matched to the longest bio. The track is still sized from
          content, so this grows into leftover space without contributing a
          basis of 0 — `flex-1` would collapse the tile to its header. Closed,
          the 0fr row takes none of that space and the bio stays clipped. */}
      <div
        id={panelId}
        className={cn(
          "grid flex-auto transition-[grid-template-rows] duration-300 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="flex flex-col overflow-hidden" inert={!open}>
          {/* The bio gets its own inset pane rather than sitting loose under a
              hairline: `rounded-(--radius-md) border-line bg-canvas` is the
              site's inset-cell treatment on a light ground (`EventCountdown`'s
              digit cells), and white on the tile's pale steel is what makes the
              disclosed content read as a second surface inside the card. */}
          <div className="mt-6 flex-1 rounded-(--radius-md) border border-line bg-canvas p-5 sm:p-6">
            <p className="text-body leading-relaxed text-ink-500">{panelist.bio}</p>
          </div>
        </div>
      </div>
    </li>
  );
}

export function EventPanelistGrid({ panelists }: { panelists: ResolvedPanelist[] }) {
  // One column until the effect reads the viewport. Nothing is open on the
  // first paint, so the server and client agree whatever the real count is.
  const [columns, setColumns] = useState(1);
  const [openRow, setOpenRow] = useState<number | null>(null);

  useEffect(() => {
    const list = window.matchMedia(COLUMNS_QUERY);
    const sync = () => {
      setColumns(list.matches ? 2 : 1);
      setOpenRow(null);
    };
    sync();
    list.addEventListener("change", sync);
    return () => list.removeEventListener("change", sync);
  }, []);

  return (
    <ul className="bento-grid sm:grid-cols-2">
      {panelists.map((panelist, i) => {
        const row = Math.floor(i / columns);
        return (
          <PanelistTile
            key={panelist.name}
            panelist={panelist}
            open={openRow === row}
            onToggle={() => setOpenRow((current) => (current === row ? null : row))}
          />
        );
      })}
    </ul>
  );
}
