import { AudienceAccordion } from "@/components/marketing/AudienceAccordion";
import { Section } from "@/components/ui/Section";

const groups = [
  {
    title: "Clinicians & subspecialists",
    body: "Cataract, glaucoma, retina, cornea, dry eye and low-vision specialists.",
  },
  {
    title: "Owners, directors & administrators",
    body: "Anyone who has led practice growth, or made the hard operational calls.",
  },
  {
    title: "Educators & academic leaders",
    body: "Professors, program directors and curriculum leaders preparing the next generation.",
  },
  {
    title: "Patient-experience & care leaders",
    body: "Anyone who rebuilt patient education, counseling, follow-up or care coordination.",
  },
  {
    title: "Technology & industry experts",
    body: "Diagnostics, imaging, surgical tech, AI and workflow leaders who have run implementations.",
  },
];

/**
 * Five expertise groups in the homepage `Audiences` accordion.
 *
 * The two sections ask the reader the same question — *is one of these me?* — so
 * they answer it in the same shape: the 5/7 split, the glass cards, the
 * plus/minus. Sharing `AudienceAccordion` is what keeps that a fact rather than
 * a resemblance that drifts.
 *
 * What it does not borrow is the motion. `scrollDriven` is off here: no pin, and
 * scrolling does not walk the cards. Five cards at a screen of scroll each is a
 * homepage device, and this section sits two-thirds of the way down a page whose
 * job is a booked call, not a passage the reader is meant to be held inside.
 *
 * On `canvas`, not `subtle`. `SpeakProcess` above it is already `subtle`, and
 * the two bands would read as one continuous surface; the cards' own
 * `backdrop-brightness` darkens whatever ground it is given, so the white canvas
 * costs them nothing.
 */
export function SpeakExpertise() {
  return (
    <Section spacing="default">
      <AudienceAccordion
        items={groups}
        scrollDriven={false}
        eyebrow="Who we invite"
        title="Titles matter less than"
        titleDim="having done the thing."
        lede="If you have navigated a decision your peers are still facing, you qualify."
      />
    </Section>
  );
}
