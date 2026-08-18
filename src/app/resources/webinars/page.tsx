import type { Metadata } from "next";
import Link from "next/link";
import { Video, ArrowUpRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { DarkHero } from "@/components/marketing/DarkHero";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getAllWebinars, getAllEpisodes } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Webinar Archive",
  description: "On-demand webinars with experts on growing your ophthalmology practice.",
};

export default function WebinarsPage() {
  const webinars = getAllWebinars();
  const episodeCount = getAllEpisodes().length;
  return (
    <>
      <DarkHero
        size="band"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "Webinars" }]}
        eyebrow="On-demand sessions"
        eyebrowDot
        title="Webinar"
        titleDim="archive"
        lede="Deep-dive sessions on the operational, leadership, and growth decisions facing eye-care practices."
      />
      <Section spacing="default">
        {webinars.length === 0 ? (
          <EmptyState
            level="h2"
            icon={Video}
            title="The webinar archive is empty for now"
            body={`The podcast library is the best place to start: ${episodeCount}+ recorded conversations on the same problems webinars will examine.`}
            action={{ label: "Browse Episodes", href: "/podcast/episodes" }}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {webinars.map((w) => (
              <Card key={w.slug} interactive>
                <Link href={`/resources/webinars/${w.slug}`}>
                  <CardBody>
                    <Badge tone="accent">{w.isReplayAvailable ? "Replay available" : "Upcoming"}</Badge>
                    <h3 className="mt-3 text-h3 font-normal">{w.title}</h3>
                    {w.date ? <p className="mt-1 text-small text-ink-400">{formatDate(w.date)}</p> : null}
                    <p className="mt-2 line-clamp-2 text-body text-ink-500">{w.excerpt}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-small font-semibold text-accent-600">
                      Watch replay <ArrowUpRight className="size-4" aria-hidden />
                    </span>
                  </CardBody>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
