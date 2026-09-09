import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { HeroGlobeMount } from "./HeroGlobeMount";

/** Full-bleed dark cinematic hero (Qoves-style). */
export function HeroSection() {
  return (
    <section className="relative -mt-(--header-offset) flex min-h-svh flex-col overflow-hidden bg-ink-900">
      {/* Cinematic slate backdrop */}
      <div aria-hidden className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      {/* Dialled back from 45: the glow lobe sits at 72% 42%, right where the globe is,
          and a backdrop brighter than the planet made it read as a silhouette. */}
      <div aria-hidden className="absolute inset-0 opacity-25" style={{ background: "var(--gradient-hero-glow)" }} />

      <HeroGlobeMount />

      <Container
        size="wide"
        className="pointer-events-none relative z-10 flex flex-1 flex-col justify-center pb-16 pt-40 sm:pt-44"
      >
        <div className="pointer-events-auto max-w-2xl pb-24">
          <p className="text-small text-white/60">The Ophthalmology Business Academy</p>
          <h1 className="mt-6 text-h1 font-light tracking-tight text-white">
            <span className="sm:whitespace-nowrap">Where practice strategy</span>
            <br />
            {" "}
            <span className="text-white/45">meets execution.</span>
          </h1>
          <p className="mt-6 max-w-md text-body text-white/65">
            Personalized business education for ophthalmologists: strategies, expert
            interviews, and training built on what actually grows practices.
          </p>
          <div className="mt-8 flex flex-row items-start gap-3">
            <Button href="/podcast/episodes" variant="onDark" size="md">
              Episodes
            </Button>
            <Button href="/msm" variant="frosted" size="md" className="rounded-lg">
              Practice Audit
            </Button>
          </div>
        </div>
      </Container>

      {/* Bottom micro-label row with hairline dividers */}
      <Container size="wide" className="pointer-events-none relative z-10 pb-10">
        {/* From sm up, columns size to their own content rather than splitting
            the row in equal thirds: the three labels are different lengths, so
            equal columns left "Experience-led" floating a long way short of its
            divider while "Ophthalmology-specific" nearly touched the next one.
            Below sm there's no room for three columns at all, so it stacks into
            a single list with a horizontal hairline between rows instead. */}
        <div className="grid max-w-2xl grid-cols-1 divide-y divide-white/15 sm:flex sm:w-fit sm:max-w-3xl sm:divide-x sm:divide-y-0">
          {[
            { t: "Experience-led", s: "Hosted by operators and physicians" },
            { t: "Ophthalmology-specific", s: "Built on eye-care realities" },
            { t: "Non-promotional", s: "Conversations, not sales pitches" },
          ].map((m) => (
            <div
              key={m.t}
              className="py-3 first:pt-0 last:pb-0 sm:px-6 sm:py-0 sm:first:pl-0 sm:first:pt-0 sm:last:pr-0 sm:last:pb-0"
            >
              <p className="text-small text-white/90">{m.t}</p>
              <p className="mt-1 text-small text-white/45">{m.s}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
