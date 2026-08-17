import { Container } from "@/components/ui/Container";
import { StatRow } from "@/components/marketing/StatRow";

/** Verifiable proof-by-numbers band. Thin wrapper: stats derive at build time. */
export function StatBand() {
  return (
    <section className="border-b border-line bg-canvas">
      <Container size="wide">
        <StatRow />
      </Container>
    </section>
  );
}
