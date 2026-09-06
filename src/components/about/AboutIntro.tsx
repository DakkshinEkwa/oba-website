import { Section, SectionHeader } from "@/components/ui/Section";

/**
 * The page's opening argument, in a 5/7 split.
 *
 * This was three headless paragraphs of ~192 words in a 760px column — the only
 * body block on the site with no heading above it, and the densest thing on any
 * page. It is now ~90 words under a real h2.
 *
 * The Ekwa disclosure that used to be a third paragraph here is gone: it was
 * restated almost point-for-point in `ABOUT_FAQS`. The one sentence below keeps
 * the attribution the messaging strategy requires, and the FAQ carries the
 * detail — said once, properly, rather than twice.
 */
export function AboutIntro({ count }: { count: number }) {
  return (
    <Section spacing="default">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeader
            eyebrow="Why we exist"
            title="Training makes clinicians."
            titleDim="It does not make owners."
          />
        </div>

        <div className="text-body-lg text-ink-600 lg:col-span-7">
          <p>
            How to grow a referral network. When to add a service line. Whether to adopt a new
            technology. What to do when private equity calls. These decisions increasingly
            determine whether a practice thrives, and most ophthalmologists face them alone.
          </p>
          <p className="mt-5">
            Since 2022 we have recorded {count}+ conversations with people who have actually
            made those calls, and made every one of them free. The format is deliberately
            simple: a real problem, someone who has lived it, and a candid account of what
            worked and what did not.
          </p>
          <p className="mt-5 text-body text-ink-500">
            OBA was founded by Naren Arulrajah, CEO of Ekwa Marketing. Ekwa&apos;s services are
            kept separate from this content, and no conversation we publish is a pitch for them.
          </p>
        </div>
      </div>
    </Section>
  );
}
