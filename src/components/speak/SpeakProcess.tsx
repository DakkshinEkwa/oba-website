import { Section, SectionHeader } from "@/components/ui/Section";

const steps = [
  {
    step: "Before",
    title: "We shape the topic with you",
    body: "A short call to agree the topic, then an outline. Nothing is sprung on you.",
  },
  {
    step: "During",
    title: "A conversation, not a performance",
    body: "Recorded remotely, hosted by people who run practices. No script, no slides.",
  },
  {
    step: "After",
    title: "Produced and ready to share",
    body: "We handle editing and production, then send you the finished piece and assets.",
  },
];

/**
 * The page's spine, and deliberately its first section.
 *
 * "What to expect" used to close the page, below the expertise grid — which put
 * the reassurance after the ask. Someone deciding whether to sit for a recording
 * wants to know what the recording involves first, so it leads.
 *
 * Large mono ordinals rather than the eyebrow-sized `Before/During/After` labels
 * this replaced: at `text-h2` the numerals carry the section on their own, which
 * is what lets the copy underneath stay at ~14 words a step.
 */
export function SpeakProcess() {
  return (
    <Section tone="subtle" spacing="default">
      <SectionHeader
        eyebrow="What to expect"
        title="Prepared with you,"
        titleDim="produced for you."
      />
      <ol className="mt-14 grid divide-y divide-line border-y border-line md:grid-cols-3 md:divide-x md:divide-y-0">
        {steps.map((s, i) => (
          <li key={s.step} className="px-0 py-10 md:px-8 md:first:pl-0 md:last:pr-0">
            <span className="block font-mono text-h2 font-light leading-none text-ink-200" aria-hidden>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="mt-5 block font-mono text-eyebrow uppercase text-ink-400">
              {s.step}
            </span>
            <h3 className="mt-3 text-h4 font-normal text-ink-900">{s.title}</h3>
            <p className="mt-3 text-body text-ink-500">{s.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
