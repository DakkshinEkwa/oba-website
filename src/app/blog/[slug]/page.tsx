import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Markdown } from "@/components/content/Markdown";
import { CopyMarkdownButton } from "@/components/content/CopyMarkdownButton";
import { RelatedArticles } from "@/components/content/RelatedArticles";
import { CTASection } from "@/components/marketing/CTASection";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/content";
import { formatDate, metaDescription } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import { pageMetadata } from "@/lib/og/metadata";
import { ORG_ID } from "@/lib/jsonld";

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
    description: metaDescription(post),
    path: `/blog/${slug}`,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt ?? post.publishedAt,
    authors: [post.author],
    ...(post.tags.length ? { tags: post.tags } : {}),
    image: "route",
    markdown: `/blog/${slug}/md`,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  // The raw `excerpt` on every post is the first ~20 words of the body with a
  // WordPress "[…]" marker still attached. `metaDescription` prefers whole
  // sentences off the body and strips that marker, so it is the only safe
  // source for a visible lede.
  const lede = metaDescription(post);

  // Recency, excluding this post. No tags exist to do anything smarter.
  const related = getAllBlogPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    description: metaDescription(post),
    // `author` defaults to the Academy itself, so the node is an Organization
    // unless a post names a real byline — typing a person as an Organization
    // would put the wrong entity behind the article.
    author:
      post.author === siteConfig.name
        ? { "@id": ORG_ID }
        : { "@type": "Person", name: post.author },
    publisher: { "@id": ORG_ID },
    url: `${siteConfig.url}/blog/${post.slug}`,
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
    ...(post.coverImage ? { image: `${siteConfig.url}${post.coverImage}` } : {}),
    ...(post.tags.length ? { keywords: post.tags.join(", ") } : {}),
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

        {lede ? <p className="mt-5 text-lede text-ink-500">{lede}</p> : null}

        <div className="mt-7 border-t border-line pt-6">
          <CopyMarkdownButton markdown={post.body} />
        </div>

        {post.coverImage ? (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl border border-line">
            <Image
              src={post.coverImage}
              alt={post.title}
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

      <RelatedArticles posts={related} />
      <CTASection />
    </>
  );
}
