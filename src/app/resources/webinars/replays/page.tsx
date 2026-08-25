import { Video } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { DarkHero } from "@/components/marketing/DarkHero";
import { EmptyState } from "@/components/ui/EmptyState";
import { pageMetadata } from "@/lib/og/metadata";

export const metadata = pageMetadata({
  title: "Webinar Replays",
  description:
    "Replays of OBA webinars and expert panels will appear here as sessions are recorded. The Ophthalmology Business Podcast is the live body of work today.",
  path: "/resources/webinars/replays",
});

export default function WebinarReplaysPage() {
  return (
    <>
      <DarkHero
        size="band"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Webinars", href: "/resources/webinars" },
          { label: "Replays" },
        ]}
        eyebrow="On-demand library"
        eyebrowDot
        title="Webinar"
        titleDim="replays"
        lede="Full-length sessions from leading ophthalmic practices, free, on your schedule."
      />
      <Section spacing="default">
        <EmptyState
          level="h2"
          icon={Video}
          title="Replays are coming soon"
          body="Recordings of our live sessions will appear here after each event. The programme is being scheduled now; check back soon."
          action={{ label: "Browse the podcast", href: "/podcast/episodes" }}
        />
      </Section>
    </>
  );
}
