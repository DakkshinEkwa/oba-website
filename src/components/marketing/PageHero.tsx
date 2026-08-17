import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  align?: "left" | "center";
  /** Surface behind the hero band. Default white; "subtle" = cool grey (form-led pages). */
  tone?: "canvas" | "subtle";
  children?: React.ReactNode;
};

/** Standard hero band for interior pages. */
export function PageHero({
  eyebrow,
  title,
  lede,
  breadcrumbs,
  align = "left",
  tone = "canvas",
  children,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative border-b border-line",
        tone === "subtle" ? "bg-canvas-subtle" : "bg-canvas",
      )}
    >
      <Container className="relative">
        <div
          className={
            "py-20 sm:py-24 lg:py-28 " +
            (align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl")
          }
        >
          {breadcrumbs ? (
            <div className={align === "center" ? "flex justify-center" : ""}>
              <Breadcrumbs items={breadcrumbs} />
            </div>
          ) : null}
          {eyebrow ? <Eyebrow className={breadcrumbs ? "mt-20" : ""}>{eyebrow}</Eyebrow> : null}
          <h1 className="mt-6 text-h1 font-light tracking-tight text-ink-900">{title}</h1>
          {lede ? (
            <p className={"mt-4 text-lede text-ink-500 " + (align === "center" ? "mx-auto max-w-2xl" : "")}>
              {lede}
            </p>
          ) : null}
          {children ? <div className="mt-6">{children}</div> : null}
        </div>
      </Container>
    </section>
  );
}
