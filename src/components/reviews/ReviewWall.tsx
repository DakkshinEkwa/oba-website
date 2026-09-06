import { Section, SectionHeader } from "@/components/ui/Section";
import type { Review } from "@/lib/schemas";

function Attribution({ review, tone = "dark" }: { review: Review; tone?: "dark" | "light" }) {
  return (
    <footer className="mt-6">
      <p className={tone === "light" ? "text-body text-white" : "text-body text-ink-900"}>
        {review.name}
      </p>
      <p
        className={
          tone === "light"
            ? "mt-1 font-mono text-small uppercase tracking-wide text-white/50"
            : "mt-1 font-mono text-small uppercase tracking-wide text-ink-400"
        }
      >
        {review.role}
        {review.practice ? ` · ${review.practice}` : ""}
      </p>
    </footer>
  );
}

/**
 * Testimonials as type, not as cards.
 *
 * Every other page on the site sets its content in bordered tiles or image
 * cards; this one is purely typographic, which is what makes it read as its own
 * page rather than another grid. One featured quote at `text-h2`, the rest in a
 * two-column hairline-divided list.
 *
 * Placeholder entries render a visible notice. That is deliberate: a plausible
 * fabricated testimonial is the one kind of stand-in that causes real harm if it
 * ships, so it must be impossible to mistake for the real thing.
 */
export function ReviewWall({ reviews }: { reviews: Review[] }) {
  // The page renders an empty state instead of this component, but the featured
  // lookup below dereferences `reviews[0]`, so the guard travels with it.
  if (reviews.length === 0) return null;

  const featured = reviews.find((r) => r.featured) ?? reviews[0];
  const rest = reviews.filter((r) => r.slug !== featured.slug);
  const hasPlaceholders = reviews.some((r) => r.placeholder);

  return (
    <>
      <Section spacing="default">
        {hasPlaceholders ? (
          <p
            role="status"
            className="mb-12 rounded-md border border-dashed border-line-strong bg-canvas-subtle px-5 py-4 font-mono text-small uppercase tracking-wide text-ink-500"
          >
            Placeholder content — these are not real reviews. Replace{" "}
            <code className="font-mono">src/content/reviews.json</code> before launch.
          </p>
        ) : null}

        <figure className="max-w-4xl">
          <blockquote className="text-h2 font-light tracking-tight text-ink-900">
            <p>&ldquo;{featured.quote}&rdquo;</p>
          </blockquote>
          <Attribution review={featured} />
        </figure>
      </Section>

      {rest.length > 0 ? (
        <Section tone="subtle" spacing="default">
          <SectionHeader
            eyebrow="More from listeners"
            title="What else people"
            titleDim="tell us."
          />
          {/* Odd children are column one; clearing their left border stops
              `divide-x` drawing a stray rule on whichever quote starts a row. */}
          <ul className="mt-12 grid divide-y divide-line border-y border-line md:grid-cols-2 md:divide-x md:[&>li:nth-child(odd)]:border-l-0">
            {rest.map((review) => (
              <li key={review.slug} className="px-0 py-10 md:px-8 md:odd:pl-0 md:even:pr-0">
                <figure>
                  <blockquote className="text-lede font-light text-ink-700">
                    <p>&ldquo;{review.quote}&rdquo;</p>
                  </blockquote>
                  <Attribution review={review} />
                </figure>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  );
}
