import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";

type SectionProps = Omit<React.ComponentProps<"section">, "children"> & {
  tone?: "canvas" | "subtle" | "ink" | "accent";
  containerSize?: "wide" | "default" | "narrow";
  spacing?: "tight" | "default" | "loose";
  /** Render children edge-to-edge without the inner Container. */
  bleed?: boolean;
  children?: React.ReactNode;
};

const tones = {
  canvas: "bg-canvas text-ink-700",
  subtle: "bg-canvas-subtle text-ink-700",
  ink: "bg-ink-900 text-ink-200",
  accent: "bg-accent-900 text-accent-50",
};

const spacings = {
  tight: "py-12 sm:py-16",
  default: "py-16 sm:py-20 lg:py-28",
  loose: "py-20 sm:py-28 lg:py-36",
};

export function Section({
  tone = "canvas",
  containerSize = "default",
  spacing = "default",
  bleed = false,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn(tones[tone], spacings[spacing], className)} {...props}>
      {bleed ? children : <Container size={containerSize}>{children}</Container>}
    </section>
  );
}

type SectionHeaderProps = {
  eyebrow?: string;
  title: React.ReactNode;
  /** Optional trailing headline fragment rendered dimmed (Qoves two-tone pattern). */
  titleDim?: React.ReactNode;
  lede?: React.ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
};

/** Standard eyebrow chip + light-weight heading + lede block used at the top of most sections. */
export function SectionHeader({
  eyebrow,
  title,
  titleDim,
  lede,
  align = "left",
  tone = "dark",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "mx-auto max-w-2xl items-center text-center",
        className,
      )}
    >
      {eyebrow ? <Eyebrow tone={tone === "light" ? "onDark" : "default"}>{eyebrow}</Eyebrow> : null}
      <h2
        className={cn(
          "text-h2 font-light tracking-tight",
          tone === "light" ? "text-white" : "text-ink-900",
        )}
      >
        {title}
        {titleDim ? (
          <>
            <br />
            <span className={tone === "light" ? "text-white/45" : "title-dim"}>{titleDim}</span>
          </>
        ) : null}
      </h2>
      {lede ? (
        <p className={cn("text-lede", tone === "light" ? "text-white/60" : "text-ink-500")}>
          {lede}
        </p>
      ) : null}
    </div>
  );
}
