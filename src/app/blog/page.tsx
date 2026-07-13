import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/marketing/PageHero";
import { BlogCard } from "@/components/content/BlogCard";
import { getAllBlogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles on marketing, operations, and leadership for the modern ophthalmology practice.",
};

export default function BlogPage() {
  const posts = getAllBlogPosts();
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="The OB Academy blog"
        lede="Practical, business-focused articles for ophthalmologists and practice owners."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
      />
      <Section spacing="default">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </Section>
    </>
  );
}
