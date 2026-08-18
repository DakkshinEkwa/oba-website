import type { Metadata } from "next";
import { Star } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { DarkHero } from "@/components/marketing/DarkHero";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "What listeners and members say about the Ophthalmology Business Academy.",
};

export default function ReviewsPage() {
  return (
    <>
      <DarkHero
        size="band"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Reviews" }]}
        eyebrow="Testimonials"
        eyebrowDot
        title="What listeners &"
        titleDim="members say"
        lede="Real words from the ophthalmologists and teams who tune in and take part."
      />
      <Section spacing="default">
        <EmptyState
          level="h2"
          icon={Star}
          title="Reviews are on their way"
          body="We're collecting feedback from our listeners and members right now. Check back soon, or be one of the first to share yours."
          action={{ label: "Share your feedback", href: "/contact" }}
        />
      </Section>
    </>
  );
}
