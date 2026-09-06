import { Container } from "@/components/ui/Container";
import { StatBento } from "@/components/marketing/StatBento";

/** Verifiable proof-by-numbers band. Thin wrapper: stats derive at build time. */
export function StatBand() {
  return (
    <section className="border-b border-line bg-canvas py-12 sm:py-16 lg:py-20">
      {/* Runs wider than the site's 1240px `wide` container: the bento is a
          full-bleed proof band, so it takes the viewport rather than the
          text-column measure the reading sections align to. */}
      <Container size="wide" className="max-w-[1920px] px-4 sm:px-6 lg:px-10">
        <StatBento />
      </Container>
    </section>
  );
}
