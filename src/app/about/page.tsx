import { Section, SectionHeader } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DarkHero } from "@/components/marketing/DarkHero";
import { HostCard } from "@/components/content/HostCard";
import { CTASection } from "@/components/marketing/CTASection";
import { FaqSection } from "@/components/marketing/FaqSection";
import { AboutIntro } from "@/components/about/AboutIntro";
import { AboutTimeline } from "@/components/about/AboutTimeline";
import { AboutValues } from "@/components/about/AboutValues";
import { getAllHosts, getAllEpisodes, getEpisodeStats } from "@/lib/content";
import { ABOUT_FAQS } from "@/content/faqs";
import { pageMetadata } from "@/lib/og/metadata";
import { pageJsonLd } from "@/lib/jsonld";

const description =
  "What the Ophthalmology Business Academy is, why it exists, and the editorial principles behind every conversation we publish.";

export const metadata = pageMetadata({
  title: "About OBA",
  description,
  path: "/about",
});

export default function AboutPage() {
  const hosts = getAllHosts();
  const count = getAllEpisodes().length;
  const stats = getEpisodeStats();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            pageJsonLd({ type: "AboutPage", name: "About OBA", description, path: "/about" }),
          ),
        }}
      />

      <DarkHero
        size="band"
        containerSize="default"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        eyebrow="About OBA"
        eyebrowDot
        title="A forum for the decisions clinical"
        titleDim="training never covered"
        lede="Experienced ophthalmology leaders, examining the business of a stronger practice on the record."
        proof={
          <dl className="flex flex-wrap gap-x-10 gap-y-4">
            {[
              { value: `${stats.count}+`, label: "Conversations" },
              { value: `Since ${stats.firstYear}`, label: "Recording" },
              { value: `${stats.hostCount}`, label: "Named hosts" },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-h4 font-medium text-white">{stat.value}</span>
                  <span className="mt-1 block font-mono text-micro uppercase tracking-wide text-white/50">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        }
      />

      <AboutIntro count={count} />
      <AboutTimeline />

      {/* The one dark mid-page band on the site. Kept: it is this page's best moment. */}
      <Section tone="ink" spacing="default" containerSize="narrow">
        <div className="text-center">
          <Eyebrow tone="onDark">Our mission</Eyebrow>
          <p className="mt-6 text-h3 font-light tracking-tight text-white">
            To help every ophthalmologist find personal, professional, and financial success
            by making world-class business education free and accessible.
          </p>
        </div>
      </Section>

      <AboutValues />

      {hosts.length > 0 ? (
        <Section tone="subtle" spacing="default">
          <SectionHeader
            eyebrow="The team"
            title="Hosts &"
            titleDim="regular contributors."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {hosts.map((h) => (
              <HostCard key={h.slug} host={h} />
            ))}
          </div>
        </Section>
      ) : null}

      <FaqSection items={ABOUT_FAQS} title="About the" titleDim="academy" />
      {/* Light well, matching /resources and /podcast/speakers. It also protects
          the mission band above: that is the one dark mid-page moment on the
          site, and a second dark ground before the footer competed with it. */}
      <CTASection tone="light" />
    </>
  );
}
