import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Markdown } from "@/components/content/Markdown";
import { CTASection } from "@/components/marketing/CTASection";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import { pageMetadata } from "@/lib/og/metadata";

export function generateStaticParams() {
  return getAllBlogPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    type: "article",
    publishedTime: post.publishedAt,
    image: "none",
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    description: post.excerpt,
    author: { "@type": "Organization", name: post.author },
    url: `${siteConfig.url}/blog/${post.slug}`,
    ...(post.coverImage ? { image: `${siteConfig.url}${post.coverImage}` } : {}),
  };

  return (
    <>
      {/* JSON-LD rendered in the body is Next.js's documented pattern for structured data. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Section spacing="tight" containerSize="narrow">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.title }]}
        />
        <div className="mt-6 flex items-center gap-2 font-mono text-eyebrow uppercase text-ink-400">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          {post.readingTimeMin ? (
            <>
              <span aria-hidden>·</span>
              <span>{post.readingTimeMin} min read</span>
            </>
          ) : null}
        </div>
        <h1 className="mt-3 text-h1 font-light tracking-tight text-ink-900">{post.title}</h1>

        {post.coverImage ? (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl border border-line">
            <Image
              src={post.coverImage}
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 100vw, 760px"
              className="object-cover"
            />
          </div>
        ) : null}

        <div className="mt-10">
          <Markdown>{post.body}</Markdown>
        </div>

        <div className="mt-10 border-t border-line pt-8">
          <Button href="/blog" variant="ghost">
            <ArrowLeft className="size-4" aria-hidden /> All articles
          </Button>
        </div>
      </Section>
      <CTASection />
    </>
  );
}
