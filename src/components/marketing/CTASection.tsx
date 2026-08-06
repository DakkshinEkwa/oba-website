import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { siteConfig } from "@/lib/site";

type CTASectionProps = {
  eyebrow?: string;
  title?: string;
  titleDim?: string;
  body?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
};

/** Full-bleed dark cinematic CTA band (Qoves-style). */
export function CTASection({
  eyebrow = "Join the conversation",
  title = "Have you solved a problem",
  titleDim = "your peers are still facing?",
  body = "OBA's panels, webinars, and podcast conversations are built on firsthand experience. If you've navigated a difficult decision in ophthalmology, your perspective belongs in the discussion.",
  primary = siteConfig.primaryCta,
  secondary = { label: "Browse Episodes", href: "/podcast/episodes" },
}: CTASectionProps) {
  return (
    <section className="relative overflow-hidden bg-ink-900">
      <div aria-hidden className="absolute inset-0" style={{ background: "var(--gradient-cta)" }} />
      <Container className="relative">
        <div className="flex flex-col items-start py-24 sm:py-28">
          <Eyebrow tone="onDark">{eyebrow}</Eyebrow>
          <h2 className="mt-6 text-h1 font-light tracking-tight text-white">
            {title}
            <br />
            <span className="text-white/45">{titleDim}</span>
          </h2>
          <p className="mt-5 max-w-lg text-body-lg text-white/60">{body}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href={primary.href} variant="onDark" size="lg">
              {primary.label}
            </Button>
            {secondary ? (
              <Button href={secondary.href} variant="frosted" size="lg">
                {secondary.label}
              </Button>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
