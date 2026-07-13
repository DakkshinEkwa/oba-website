import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

type PageHeroProps = {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  align?: "left" | "center";
  children?: React.ReactNode;
};

/** Standard hero band for interior pages. */
export function PageHero({
  eyebrow,
  title,
  lede,
  breadcrumbs,
  align = "left",
  children,
}: PageHeroProps) {
  return (
    <section className="relative border-b border-line bg-canvas">
      <Container className="relative">
        <div
          className={
            "py-14 sm:py-16 lg:py-20 " +
            (align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl")
          }
        >
          {breadcrumbs ? (
            <div className={align === "center" ? "flex justify-center" : ""}>
              <Breadcrumbs items={breadcrumbs} />
            </div>
          ) : null}
          {eyebrow ? <Eyebrow className={breadcrumbs ? "mt-5" : ""}>{eyebrow}</Eyebrow> : null}
          <h1 className="mt-4 text-h1 font-light tracking-tight text-ink-900">{title}</h1>
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
