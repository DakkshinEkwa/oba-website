import { Container } from "@/components/ui/Container";
import { AnimatedStat } from "@/components/marketing/AnimatedStat";

/** Verifiable proof-by-numbers band. */
export function StatBand({ episodeCount }: { episodeCount: number }) {
  const stats = [
    { n: `${episodeCount}+`, l: "Recorded conversations" },
    { n: "6", l: "Hosts & regular contributors" },
    { n: "2022", l: "Convening leaders since" },
    { n: "100%", l: "Ophthalmology-specific" },
  ];

  return (
    <section className="border-b border-line bg-canvas">
      <Container size="wide">
        <dl className="grid grid-cols-2 divide-x divide-line lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={i} className="px-6 py-10">
              <dt className="text-h1 font-light tracking-tight text-ink-900">
                <AnimatedStat value={s.n} />
              </dt>
              <dd className="mt-1 text-small text-ink-500">{s.l}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
