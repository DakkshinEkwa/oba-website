import { Section, SectionHeader } from "@/components/ui/Section";
import { BlogRow } from "./BlogRow";
import type { BlogPost } from "@/lib/schemas";

/**
 * Three more articles, closing a post.
 *
 * Rows rather than cards on purpose: the `/blog` index is a card grid, and
 * repeating it here would make the end of an article look like a second index.
 *
 * "Related" is by recency, not by topic. Posts carry no tags — all eight have an
 * empty `tags` array and there is no verifiable topic source to derive one from
 * — so anything claiming topical relevance would be inventing it.
 */
export function RelatedArticles({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <Section tone="subtle" spacing="default">
      <SectionHeader eyebrow="Keep reading" title="More from the blog" />
      <ol className="episode-list mt-10">
        {posts.map((post) => (
          <BlogRow key={post.slug} post={post} />
        ))}
      </ol>
    </Section>
  );
}
