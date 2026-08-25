import { FileText } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { DarkHero } from "@/components/marketing/DarkHero";
import { BlogCard } from "@/components/content/BlogCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { getAllBlogPosts } from "@/lib/content";
import { pageMetadata } from "@/lib/og/metadata";

export const metadata = pageMetadata({
  title: "Blog",
  description:
    "Articles on marketing, operations, and leadership for the modern ophthalmology practice.",
  path: "/blog",
});

export default function BlogPage() {
  const posts = getAllBlogPosts();
  return (
    <>
      <DarkHero
        size="band"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
        eyebrow="Insights"
        eyebrowDot
        title="The OB Academy blog"
        lede="Practical, business-focused articles for ophthalmologists and practice owners."
      />
      <Section spacing="default">
        <SectionHeader eyebrow="Articles" title="All articles" />
        {posts.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              icon={FileText}
              title="No articles published yet"
              body="New articles on practice growth, operations, and leadership are on the way."
            />
          </div>
        ) : (
          <div className="panel-grid mt-10">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} variant="panel" />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
