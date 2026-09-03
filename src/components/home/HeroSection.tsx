import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { HeroHostStack } from "@/components/marketing/HeroHostStack";
import { HeroGlobeMount } from "./HeroGlobeMount";
import type { Host } from "@/lib/schemas";

/** Full-bleed dark cinematic hero (Qoves-style). */
export function HeroSection({ hosts }: { hosts: Host[] }) {
  return (
    <section className="relative -mt-(--header-offset) flex min-h-[92svh] flex-col overflow-hidden bg-ink-900">
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
        <div className="pointer-events-auto max-w-2xl">
          <p className="text-body text-white/60">The Ophthalmology Business Academy</p>
          <h1 className="mt-6 text-h1 font-light tracking-tight text-white">
            <span className="whitespace-nowrap">Where practice strategy</span>
            <br />
            {" "}
            <span className="text-white/45">meets execution.</span>
          </h1>
          <p className="mt-6 max-w-md text-body-lg text-white/65">
            Personalized business education for ophthalmologists: strategies, expert
            interviews, and training built on what actually grows practices.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/podcast/episodes" variant="onDark" size="lg">
              Browse Episodes
            </Button>
            <Button href="/msm" variant="frosted" size="lg" className="rounded-lg">
              Free Strategy Call
            </Button>
          </div>
          <div className="mt-10">
            <HeroHostStack hosts={hosts} />
          </div>
        </div>
      </Container>

      {/* Bottom micro-label row with hairline dividers */}
      <Container size="wide" className="pointer-events-none relative z-10 pb-10">
        <div className="grid max-w-2xl grid-cols-3 divide-x divide-white/15">
          {[
            { t: "Experience-led", s: "Hosted by operators and physicians" },
            { t: "Ophthalmology-specific", s: "Built on eye-care realities" },
            { t: "Non-promotional", s: "Conversations, not sales pitches" },
          ].map((m) => (
            <div key={m.t} className="pr-6 pl-6 first:pl-0">
              <p className="text-body text-white/90">{m.t}</p>
              <p className="mt-1 text-small text-white/45">{m.s}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
