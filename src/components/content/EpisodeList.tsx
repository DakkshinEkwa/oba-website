import { Headphones } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { EpisodeRow } from "./EpisodeRow";
import type { Episode } from "@/lib/schemas";

/**
 * Dense date-ordered archive list; screen readers announce the count
 * ("list, 20 items"). Rows are keyed by slug — `episodeNumber` is not unique
 * in the catalog. Renders an honest empty state at zero episodes.
 */
export function EpisodeList({ episodes }: { episodes: Episode[] }) {
  if (episodes.length === 0) {
    return (
      <EmptyState
        icon={Headphones}
        title="No episodes yet"
        body="The conversation library is being built; the first episodes are on the way."
      />
    );
  }

  return (
    <ol className="episode-list">
      {episodes.map((ep, i) => (
        <EpisodeRow key={ep.slug} episode={ep} priority={i < 3} />
      ))}
    </ol>
  );
}
