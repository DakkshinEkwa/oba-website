import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { LibsynPlayer } from "./LibsynPlayer";
import { EpisodePortraits, episodePeople } from "./EpisodePortraits";
import { formatDate } from "@/lib/utils";
import type { Episode, Host } from "@/lib/schemas";

/**
 * The episode hero: brand artwork rather than a page section.
 *
 * It stands on PAGEBG — the design system's dark *post* ground, not the site's
 * ink-900 marketing ground — under the 18px dot field, with the one sanctioned
 * gradient held back so the ground and the texture stay the dominant surface.
 *
 * The headline stands as a single claim in white. There is no dimmed turn line
 * (guidelines ch.2): the portraits carry the names, so a byline would only set
 * them twice, and these titles are real scraped strings with no authored break
 * to dim. An authored `subtitle` on the episode frontmatter would be the honest
 * source for a turn if one is ever wanted — not a split invented at render time.
 *
 * Nothing animates in. Guidelines ch.10: the only motion in the system is the
 * live dot, and it lives inside the transport where there is genuine state.
 */
/**
 * The portrait column grows with the number of faces, so the row divides a
 * wider column instead of a fixed one — four tiles in a 22rem column would be
 * 76px each, which is how a "bigger" layout ends up smaller. Full literal class
 * strings, because Tailwind extracts them statically.
 */
const ASIDE: Record<number, string> = {
  1: "sm:grid-cols-[minmax(0,1fr)_14rem] lg:grid-cols-[minmax(0,1fr)_18rem]",
  2: "sm:grid-cols-[minmax(0,1fr)_18rem] lg:grid-cols-[minmax(0,1fr)_26rem]",
  3: "sm:grid-cols-[minmax(0,1fr)_21rem] lg:grid-cols-[minmax(0,1fr)_30rem]",
  4: "sm:grid-cols-[minmax(0,1fr)_24rem] lg:grid-cols-[minmax(0,1fr)_34rem]",
};

export function EpisodeHero({ episode, hosts }: { episode: Episode; hosts: Host[] }) {
  const people = episodePeople(episode.guests, hosts);

  return (
    <section className="relative -mt-(--header-offset) overflow-hidden bg-page-bg">
      {/* The one gradient OBA has, held to a third so PAGEBG still reads as the
          ground and the dot field survives on top of it. */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.35]"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-25"
        style={{ background: "var(--gradient-hero-glow)" }}
      />
      <div aria-hidden className="dot-field absolute inset-0" />
      {/* Scrim holds the copy column near PAGEBG so GLOW/.72 and the mono
          captions keep their measured contrast over the lit edge of the lobe. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(11,18,32,0.72) 0%, rgba(11,18,32,0.66) 38%, rgba(11,18,32,0.38) 62%, rgba(11,18,32,0.12) 82%, rgba(11,18,32,0) 96%)",
        }}
      />

      <Container
        size="wide"
        className="relative pt-[calc(var(--header-offset)+2.5rem)] pb-12 sm:pt-[calc(var(--header-offset)+3.5rem)] sm:pb-16"
      >
        <Breadcrumbs
          tone="onDark"
          items={[
            { label: "Episodes", href: "/podcast/episodes" },
            { label: episode.title },
          ]}
        />

        <div
          className={cn(
            "mt-12 grid gap-10 sm:items-end lg:mt-16 lg:gap-14",
            // No faces, no second column — the copy simply spans the hero.
            ASIDE[people.length],
          )}
        >
          <div className="min-w-0 max-w-3xl">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-eyebrow uppercase tracking-[0.12em] text-pale-accent">
              <span
                aria-hidden
                className="size-1.5 shrink-0 rounded-pill bg-white"
                style={{ opacity: "var(--alpha-eyebrowDot)" }}
              />
              {episode.episodeNumber ? (
                <>
                  <span>Episode {episode.episodeNumber}</span>
                  <span aria-hidden>·</span>
                </>
              ) : null}
              <time dateTime={episode.publishedAt}>{formatDate(episode.publishedAt)}</time>
            </p>

            <h1 className="mt-6 text-h1 font-light tracking-tight text-white">{episode.title}</h1>
          </div>

          {/* The people, not the thumbnail. A podcast episode's most
              characteristic image is who is on it. The scraped 16:9 artwork
              still fronts the episode cards in listings; it is not used here. */}
          <EpisodePortraits people={people} />
        </div>

        <div className="mt-12 border-t border-white/[0.14] pt-10 sm:mt-14">
          <LibsynPlayer
            audioUrl={episode.audioUrl}
            title={episode.title}
            episodeNumber={episode.episodeNumber}
            seed={episode.slug}
          />
        </div>
      </Container>
    </section>
  );
}
