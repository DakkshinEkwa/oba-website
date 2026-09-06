import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

type CTASectionProps = {
  eyebrow?: string;
  title?: string;
  titleDim?: string;
  body?: string;
  primary?: { label: string; href: string };
  /** `null` renders a single-ask band — required on first-touch content,
   *  where the guidelines allow exactly one CTA per asset. */
  secondary?: { label: string; href: string } | null;
  /**
   * Ground the band sits on. "ink" is the dark cinematic default.
   *
   * "light" is a flat CHIPBG well — the brand's "chip and light-well fill" —
   * and carries **no gradient at all**. Guidelines ch.1 is explicit: "There is
   * one gradient - the hero lobe, STEEL through INK900 at the fixed stops. Any
   * other gradient is not OBA," because "a second gradient reads as a second
   * brand." So a pale gradient is not available; white as a flat surface is,
   * since ch.1 also states "White is the accent."
   *
   * The two-tone headline still applies, in its light-ground form: INK900 for
   * the claim, INK600 for the turn — ch.1 assigns INK600 to "the dimmed half of
   * a two-tone title", so this is that rule's own value rather than the site's
   * `.title-dim` UI grey.
   */
  tone?: "ink" | "light";
};

/**
 * Off-site CTA targets (a booking link) open in a new tab; internal routes must
 * not, or the back button stops working for ordinary navigation.
 */
function linkProps(href: string) {
  return href.startsWith("http")
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};
}

/** Full-bleed dark cinematic CTA band (Qoves-style). */
export function CTASection({
  eyebrow = "Join the conversation",
  title = "Have you solved a problem",
  titleDim = "your peers are still facing?",
  body = "OBA's panels, webinars, and podcast conversations are built on firsthand experience. If you've navigated a difficult decision in ophthalmology, your perspective belongs in the discussion.",
  primary = siteConfig.primaryCta,
  secondary = { label: "Browse Episodes", href: "/podcast/episodes" },
  tone = "ink",
}: CTASectionProps) {
  const isLight = tone === "light";

  return (
    <section
      className={cn(
        "relative overflow-hidden",
        isLight
          ? "border-y border-line bg-chip-bg"
          : "border-t border-white/10 bg-ink-900",
      )}
    >
      {/* Dark: the cinematic wash. Light: the 18px dot field instead — the
          guidelines' own way of keeping a flat fill alive (ch.5), and the
          texture the light band gets in place of a gradient it may not have. */}
      {isLight ? (
        <div aria-hidden className="dot-field-light absolute inset-0" />
      ) : (
        <div aria-hidden className="absolute inset-0" style={{ background: "var(--gradient-cta)" }} />
      )}
      <Container className="relative">
        <div className="flex flex-col items-start py-20 sm:py-28 lg:py-36">
          {/* ink-600, not the default ink-500: on CHIPBG the lighter grey
              measures 4.39:1, which fails AA at the eyebrow's 12px. ink-600 is
              6.5:1 and is the palette's own "muted ink". */}
          <Eyebrow
            tone={isLight ? "default" : "onDark"}
            className={isLight ? "text-ink-600" : undefined}
          >
            {eyebrow}
          </Eyebrow>
          <h2
            className={cn(
              "mt-5 text-h2 font-light tracking-tight",
              isLight ? "text-ink-900" : "text-white",
            )}
          >
            {title}
            <br />
            <span className={isLight ? "text-ink-600" : "text-white/45"}>{titleDim}</span>
          </h2>
          <p className={cn("mt-4 max-w-lg text-body", isLight ? "text-ink-600" : "text-white/60")}>
            {body}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              href={primary.href}
              variant={isLight ? "primary" : "onDark"}
              {...linkProps(primary.href)}
            >
              {primary.label}
            </Button>
            {secondary ? (
              <Button
                href={secondary.href}
                variant={isLight ? "outline" : "frosted"}
                {...linkProps(secondary.href)}
              >
                {secondary.label}
              </Button>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
