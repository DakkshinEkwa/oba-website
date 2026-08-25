import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getAllWebinars, getWebinarBySlug } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { pageMetadata } from "@/lib/og/metadata";

export function generateStaticParams() {
  return getAllWebinars().map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const w = getWebinarBySlug(slug);
  if (!w) return {};
  return pageMetadata({
    title: w.title,
    description: w.excerpt,
    path: `/resources/webinars/${slug}`,
  });
}

export default async function WebinarPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const w = getWebinarBySlug(slug);
  if (!w) notFound();

  return (
    <Section spacing="tight" containerSize="narrow">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Webinars", href: "/resources/webinars" },
          { label: w.title },
        ]}
      />
      <h1 className="mt-6 text-h1 font-light tracking-tight text-ink-900">{w.title}</h1>
      {w.date ? <p className="mt-2 text-small text-ink-400">{formatDate(w.date)}</p> : null}
      {w.embedUrl ? (
        <div className="mt-8 aspect-video overflow-hidden rounded-xl border border-line">
          <iframe
            src={w.embedUrl}
            title={w.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="size-full"
          />
        </div>
      ) : null}
      <p className="mt-8 text-body-lg text-ink-600">{w.excerpt}</p>
    </Section>
  );
}
