import { Headphones, ArrowRight } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { EpisodeCard } from "@/components/content/EpisodeCard";
import { BlogCard } from "@/components/content/BlogCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Episode, BlogPost } from "@/lib/schemas";

/** Latest episodes + latest blog posts sections. */
export function LatestContent({ episodes, posts }: { episodes: Episode[]; posts: BlogPost[] }) {
  return (
    <>
      <Section tone="subtle" spacing="default">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader
            eyebrow="The podcast"
            title="Latest from the show"
            className="max-w-xl"
          />
          <Button href="/podcast/episodes" variant="link">
            All episodes <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
        {episodes.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              icon={Headphones}
              title="No episodes yet"
              body="The conversation library is being built; the first episodes are on the way."
            />
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {episodes.map((ep) => (
              <EpisodeCard key={ep.slug} episode={ep} />
            ))}
          </div>
        )}
      </Section>

      {posts.length > 0 ? (
        <Section spacing="default">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeader eyebrow="Insights" title="From the blog" className="max-w-xl" />
            <Button href="/blog" variant="link">
              All articles <ArrowRight className="size-4" aria-hidden />
            </Button>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
