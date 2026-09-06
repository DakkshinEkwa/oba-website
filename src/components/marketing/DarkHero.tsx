import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { cn } from "@/lib/utils";

type DarkHeroProps = {
  eyebrow?: string;
  /** Render a small leading dot on the eyebrow label. */
  eyebrowDot?: boolean;
  title: React.ReactNode;
  /** Trailing headline fragment rendered dim (Qoves two-tone pattern). */
  titleDim?: React.ReactNode;
  lede?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  /** "full" = full-bleed cinematic hero (podcast home); "band" = compact interior hero. */
  size?: "full" | "band";
  /** Optional right-hand column (featured episode card). */
  aside?: React.ReactNode;
  /** Wider aside column for embeds that need horizontal room (e.g. booking calendars). */
  asideWidth?: "narrow" | "wide";
  /** Optional content rendered directly under the lede, before children/CTA (e.g. waveform + stat row). */
  proof?: React.ReactNode;
  /** Optional bottom row (proof-by-numbers stat band). */
  footer?: React.ReactNode;
  /**
   * Measure of the hero's own container. Defaults to "wide" (1240px), which is
   * what the cinematic `size="full"` heroes want. Interior pages whose sections
   * below run at the 1160px default should pass "default", or the hero's text
   * edge sits 40px outboard of every section beneath it on wide screens.
   */
  containerSize?: "wide" | "default";
  /** CTA row, rendered under the lede. */
  children?: React.ReactNode;
};

/**
 * Full-bleed dark cinematic hero (Qoves-style) — the generalization of the
 * home `HeroSection` for interior pages. Same gradient vocabulary, plus
 * breadcrumbs, an optional aside column and an optional footer row. Pulls up
 * under the transparent floating nav via the header-offset token, so pages
 * using it must be listed in `SiteHeader`'s DARK_HERO_ROUTES.
 *
 * Overflow discipline: gradients are absolutely positioned inside the
 * `overflow-hidden` section, copy columns use `minmax(0,1fr)` + `min-w-0`, and
 * the scrim pins the left copy column dark so white/45–70 text clears 3:1.
 */
export function DarkHero({
  eyebrow,
  eyebrowDot,
  title,
  titleDim,
  lede,
  breadcrumbs,
  size = "full",
  aside,
  asideWidth = "narrow",
  proof,
  footer,
  containerSize = "wide",
  children,
}: DarkHeroProps) {
  const isFull = size === "full";
  return (
    <section
      className={cn(
        "relative -mt-(--header-offset) overflow-hidden bg-ink-900",
        isFull && "flex min-h-[92svh] flex-col",
      )}
    >
      {/* Cinematic slate backdrop + glow lobe */}
      <div aria-hidden className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div aria-hidden className="absolute inset-0 opacity-45" style={{ background: "var(--gradient-hero-glow)" }} />
      {/* Scrim: holds the left ~half near #16232c so dim/lede text keeps 3:1 */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(11,18,32,0.62) 0%, rgba(11,18,32,0.62) 34%, rgba(11,18,32,0.4) 55%, rgba(11,18,32,0.16) 72%, rgba(11,18,32,0) 90%)",
        }}
      />

      <Container
        size={containerSize}
        className={cn(
          "relative",
          isFull
            ? "flex flex-1 flex-col justify-center pb-16 pt-40 sm:pt-44"
            : "pt-[calc(var(--header-offset)+2.5rem)] pb-32 sm:pt-[calc(var(--header-offset)+3.5rem)] sm:pb-44",
        )}
      >
        <div
          className={cn(
            "min-w-0",
            aside &&
              (asideWidth === "wide"
                ? "grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)]"
                : "grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]"),
          )}
        >
          <div className="max-w-2xl min-w-0 animate-fade-up">
            {breadcrumbs ? <Breadcrumbs tone="onDark" items={breadcrumbs} /> : null}
            {eyebrow ? (
              <Eyebrow tone="onDark" dot={eyebrowDot} className={breadcrumbs ? "mt-24" : undefined}>
                {eyebrow}
              </Eyebrow>
            ) : null}
            <h1 className="mt-8 text-h1 font-light tracking-tight text-white">
              {title}
              {titleDim ? <span className="text-white/45"> {titleDim}</span> : null}
            </h1>
            {lede ? <p className="mt-6 max-w-xl text-body-lg text-white/70">{lede}</p> : null}
            {proof ? <div className="mt-8">{proof}</div> : null}
            {children ? (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">{children}</div>
            ) : null}
          </div>
          {aside ? <div className="min-w-0">{aside}</div> : null}
        </div>
      </Container>

      {footer ? (
        <Container size={containerSize} className="relative pb-10">
          {footer}
        </Container>
      ) : null}
    </section>
  );
}
