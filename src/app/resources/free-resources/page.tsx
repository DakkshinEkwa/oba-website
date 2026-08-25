import { Section } from "@/components/ui/Section";
import { DarkHero } from "@/components/marketing/DarkHero";
import { CTASection } from "@/components/marketing/CTASection";
import { FreeResourceCard } from "@/components/content/FreeResourceCard";
import { getAllFreeResources } from "@/lib/content";
import { pageMetadata } from "@/lib/og/metadata";

export const metadata = pageMetadata({
  title: "Free Resources",
  description:
    "Free, downloadable articles and guides for ophthalmology practice leaders — website, marketing, and patient-conversion fundamentals.",
  path: "/resources/free-resources",
});

const CATEGORY_ORDER = ["guide", "template", "checklist"] as const;

export default function FreeResourcesPage() {
  const resources = [...getAllFreeResources()].sort(
    (a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category),
  );

  return (
    <>
      <DarkHero
        size="band"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Free Resources" },
        ]}
        eyebrow="Downloadable tools"
        eyebrowDot
        title="Free resources,"
        titleDim="built for practice leaders"
        lede="Practical, downloadable articles on the digital decisions behind a stronger practice — from website fundamentals to turning visitors into booked appointments. Prepared by Ekwa Marketing."
      />

      <Section spacing="loose" className="py-24 sm:py-32 lg:py-44">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-h2 font-light tracking-tight text-ink-900">All resources</h2>
          <p className="text-small text-ink-500">
            {resources.length} downloadable {resources.length === 1 ? "article" : "articles"}
          </p>
        </div>
        <div className="event-grid">
          {resources.map((r) => (
            <FreeResourceCard key={r.slug} resource={r} />
          ))}
        </div>
      </Section>

      <CTASection />
    </>
  );
}
