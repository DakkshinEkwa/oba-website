import { Users } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { DarkHero } from "@/components/marketing/DarkHero";
import { CTASection } from "@/components/marketing/CTASection";
import { SpeakersGrid } from "@/components/content/SpeakersGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { getAllSpeakers } from "@/lib/content";
import { pageMetadata } from "@/lib/og/metadata";
import { pageJsonLd, speakerListJsonLd } from "@/lib/jsonld";

export const metadata = pageMetadata({
  title: "Speakers",
  description:
    "Every guest who has joined the Ophthalmology Business Podcast — practice owners, administrators, physicians and operators, with the episodes they appeared on.",
  path: "/podcast/speakers",
});

export default function SpeakersPage() {
  const speakers = getAllSpeakers();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            pageJsonLd({
              type: "CollectionPage",
              name: "Speakers",
              description:
                "Every guest who has joined the Ophthalmology Business Podcast, with the episodes they appeared on.",
              path: "/podcast/speakers",
            }),
          ),
        }}
      />
      {speakers.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(speakerListJsonLd(speakers)) }}
        />
      )}

      <DarkHero
        size="band"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Podcast", href: "/podcast/episodes" },
          { label: "Speakers" },
        ]}
        eyebrow="On the record"
        eyebrowDot
        title="Everyone who has"
        titleDim="joined the conversation"
        lede="Practice owners, administrators, physicians and operators who came on to talk about the business of eye care — and the episodes where they said it."
      />

      <Section spacing="default" containerSize="wide">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-h2 font-light tracking-tight text-ink-900">Every speaker</h2>
          <p className="text-small text-ink-500">
            {speakers.length} {speakers.length === 1 ? "guest" : "guests"}, most appearances first
          </p>
        </div>
        {speakers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No guests listed yet"
            body="Guest names appear here as soon as episodes credit them."
          />
        ) : (
          <SpeakersGrid speakers={speakers} />
        )}
      </Section>

      {/* Light well, matching /resources: the page already opens on the dark
          hero, and the speaker bento above is a light-steel surface, so the
          dark band closed the page on a third ground change in a short scroll. */}
      <CTASection tone="light" />
    </>
  );
}
