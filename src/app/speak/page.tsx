import { CalendarCheck } from "lucide-react";
import { DarkHero } from "@/components/marketing/DarkHero";
import { CTASection } from "@/components/marketing/CTASection";
import { Button } from "@/components/ui/Button";
import { SpeakProcess } from "@/components/speak/SpeakProcess";
import { SpeakExpertise } from "@/components/speak/SpeakExpertise";
import { pageMetadata } from "@/lib/og/metadata";
import { pageJsonLd } from "@/lib/jsonld";
import { siteConfig } from "@/lib/site";

const description =
  "OBA convenes experienced ophthalmology professionals for candid, non-promotional conversations. If you've navigated a problem your peers are still facing, share your area of expertise.";

export const metadata = pageMetadata({
  title: "Become a Speaker",
  description,
  path: "/speak",
});

/** Credibility line under the hero, before any body copy. Each claim is one the catalog supports. */
const assurances = [
  { label: "No pitch", note: "Conversations, not sales pitches" },
  { label: "No prep burden", note: "We shape the topic with you" },
  { label: "Remote", note: "Recorded wherever you are" },
];

export default function SpeakPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            pageJsonLd({ name: "Become a Speaker", description, path: "/speak" }),
          ),
        }}
      />

      <DarkHero
        size="band"
        containerSize="default"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Become a Speaker" }]}
        eyebrow="Become a speaker"
        eyebrowDot
        title="Lend your experience to"
        titleDim="the conversation"
        lede="If you have navigated a decision your peers are still facing, your perspective belongs here."
        footer={
          <div className="grid max-w-2xl grid-cols-3 divide-x divide-white/15 sm:flex sm:w-fit sm:max-w-3xl">
            {assurances.map((a) => (
              <div key={a.label} className="px-6 first:pl-0 last:pr-0">
                <p className="text-small text-white/90">{a.label}</p>
                <p className="mt-1 text-small text-white/45">{a.note}</p>
              </div>
            ))}
          </div>
        }
      >
        <Button
          href={siteConfig.speakerCallUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="onDark"
          size="lg"
        >
          <CalendarCheck className="size-4" aria-hidden /> Book a call
        </Button>
        <Button href="/podcast/episodes" variant="frosted" size="lg">
          Conversations
        </Button>
      </DarkHero>

      <SpeakProcess />
      <SpeakExpertise />

      {/*
        Custom copy, not the default band. The site-wide default restates this
        page's own hero lede almost verbatim, which reads as a stutter on the one
        page it points at.
      */}
      <CTASection
        tone="light"
        eyebrow="Next step"
        title="One call decides"
        titleDim="whether there's an episode in it."
        body="Twenty minutes to talk through the topic. If it isn't a fit, we'll say so."
        primary={{ label: "Book a call", href: siteConfig.speakerCallUrl }}
        secondary={{ label: "Browse episodes", href: "/podcast/episodes" }}
      />
    </>
  );
}
