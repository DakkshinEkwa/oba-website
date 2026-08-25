import { Users } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { DarkHero } from "@/components/marketing/DarkHero";
import { HeroHostStack } from "@/components/marketing/HeroHostStack";
import { HostCard } from "@/components/content/HostCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { getAllHosts } from "@/lib/content";
import { pageMetadata } from "@/lib/og/metadata";
import { personListJsonLd, pageJsonLd } from "@/lib/jsonld";

export const metadata = pageMetadata({
  title: "Hosts",
  description: "Meet the hosts and regular guests of the Ophthalmology Business Podcast.",
  path: "/podcast/hosts",
});

export default function HostsPage() {
  const hosts = getAllHosts();
  const personListJsonLdData = personListJsonLd(hosts);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            pageJsonLd({
              type: "CollectionPage",
              name: "Hosts",
              description: "Meet the hosts and regular guests of the Ophthalmology Business Podcast.",
              path: "/podcast/hosts",
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personListJsonLdData) }}
      />
      <DarkHero
        size="band"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Podcast", href: "/podcast" }, { label: "Hosts" }]}
        eyebrow="The people behind the show"
        eyebrowDot
        title="Hosts & regular"
        titleDim="contributors"
        lede="Practice operators, physicians, and industry experts: people who have personally made the decisions these conversations examine."
        aside={hosts.length > 0 ? <HeroHostStack hosts={hosts} /> : null}
      />
      <Section spacing="default">
        <h2 className="sr-only">All hosts</h2>
        {hosts.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Host profiles are on the way"
            body="Meet the people behind the show once their profiles are published."
          />
        ) : (
          <div className="hosts-reveal grid gap-6 md:grid-cols-2">
            {hosts.map((h) => (
              <HostCard key={h.slug} host={h} />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
