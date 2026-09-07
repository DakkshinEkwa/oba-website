import { headshotFor } from "@/lib/content";
import { EventPanelistGrid } from "./EventPanelistGrid";
import type { EventPanelist } from "@/lib/schemas";

/**
 * The people on a panel, in the homepage's bento vocabulary.
 *
 * This is `StatBento`'s light tile — `rounded-2xl`, hairline border, the
 * `accent-50 → accent-100` gradient — laid out on a `bento-grid` so the
 * separator hairlines are drawn in the gaps rather than on the cards. The
 * content inside is `SpeakerCard`'s: a square `rounded-xl` portrait beside the
 * name, which is the light-ground people idiom across this site (`HostCard`
 * uses the same square). The 4:5 `--radius-tile` portrait belongs to the dark
 * episode hero and would be a borrowed accent here.
 *
 * It borrows `SpeakerCard`'s disclosure too: the tile shows the person, and the
 * bio expands. See `EventPanelistGrid` for how that and the row-at-once open
 * state work.
 *
 * **The tile ground is what makes equal heights read as intentional.** An
 * earlier pass laid these out as bare text blocks in a grid, and because
 * panel bios vary in length by a factor of two, the shorter ones left holes and
 * the section read as ragged. Filled tiles turn that same height-matching into
 * the bento's own rhythm — which is why this is a grid again and not the
 * divided list it briefly was.
 *
 * Portrait size follows the reasoning `HostCard` documents: the source
 * headshots were shot against unrelated backgrounds — white studio, office,
 * flat charcoal, one saturated magenta — so they never read as one set, and the
 * larger the face, the louder the background behind it. `object-top` keeps the
 * crop on the face rather than the centre of the frame.
 *
 * Panelists carry no image field: they resolve by name out of
 * `public/images/headshots/` (ch.6: lowercase, dash-separated, `first-last.jpg`)
 * through the same exact-match `headshotFor()` the episode portraits use —
 * never fuzzy, because a near-miss puts the wrong face on a named person. A
 * miss falls through to `SpeakerCard`'s frosted slate monogram, which is a
 * designed state and the one thing on a pale tile that still reads. That lookup
 * reads the filesystem, so it happens here, on the server, and the grid below
 * receives plain resolved paths.
 *
 * Renders nothing when nobody is credited; most events in `events.json` have
 * no panelists announced yet.
 */
export function EventPanelists({ panelists }: { panelists: EventPanelist[] }) {
  if (panelists.length === 0) return null;

  const resolved = panelists.map((p) => {
    const avatar = headshotFor(p.name);
    return avatar ? { ...p, avatar } : p;
  });

  return <EventPanelistGrid panelists={resolved} />;
}
