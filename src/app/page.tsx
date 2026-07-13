import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, Mic, Headphones, Handshake } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { EpisodeCard } from "@/components/content/EpisodeCard";
import { BlogCard } from "@/components/content/BlogCard";
import { CTASection } from "@/components/marketing/CTASection";
import { getAllEpisodes, getFeaturedEpisode, getAllBlogPosts } from "@/lib/content";
import { formatDate } from "@/lib/utils";

const problemAreas = [
  {
    title: "Growth & referrals",
    body: "Building referral relationships, developing service lines, and growing a practice without compromising the standard of care that built its reputation.",
  },
  {
    title: "Patient experience & care",
    body: "The decisions behind better patient experiences — education, counseling, follow-up, adherence, and coordinating care across a growing team.",
  },
  {
    title: "Leadership & teams",
    body: "Hiring, retention, culture, and accountability — and the transition from clinician to leader that training never prepared anyone for.",
  },
  {
    title: "Technology & innovation",
    body: "Adopting new technology responsibly: what to implement, when, and how — from EMR transitions to AI, imaging, and workflow tools.",
  },
];

const audiences = [
  {
    title: "Practice owners & partners",
    body: "The decisions that come with the name on the door — growth, profitability, succession, and protecting clinical standards while the business scales.",
  },
  {
    title: "Administrators & operations leaders",
    body: "The systems behind a practice that runs well — staffing, patient flow, technology, and the day-to-day judgment calls that never make the textbooks.",
  },
  {
    title: "Industry & technology leaders",
    body: "The implementation reality behind diagnostics, imaging, AI, and workflow tools — what adoption actually looks like inside a practice.",
  },
  {
    title: "Emerging leaders",
    body: "Residents, fellows, and employed ophthalmologists preparing for responsibilities that clinical training touches only briefly.",
  },
];

const engagements = [
  {
    icon: Headphones,
    title: "Listen & apply",
    body: "Start with the conversations closest to the decision in front of you — the full library is free.",
    cta: { label: "Browse Episodes", href: "/podcast/episodes" },
  },
  {
    icon: Mic,
    title: "Contribute your experience",
    body: "If you've navigated a problem your peers are still facing, join a conversation as a speaker or panelist.",
    cta: { label: "Become a Speaker", href: "/speak" },
  },
  {
    icon: Handshake,
    title: "Support the conversation",
    body: "Organizations serving ophthalmology can back credible education — without turning it into advertising.",
    cta: { label: "Explore Partnerships", href: "/partnerships" },
  },
];

export default function HomePage() {
  const featured = getFeaturedEpisode();
  const latest = getAllEpisodes().slice(0, 3);
  const posts = getAllBlogPosts().slice(0, 3);
  const episodeCount = getAllEpisodes().length;

  return (
    <>
      {/* ---------------- Hero: full-bleed dark cinematic (Qoves-style) ---------------- */}
      <section className="relative -mt-24 flex min-h-[92svh] flex-col overflow-hidden bg-ink-900">
        {/* Cinematic slate backdrop */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(115% 90% at 78% 30%, #5b7484 0%, #3e5361 34%, #263743 62%, #16232c 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-45"
          style={{
            background:
              "radial-gradient(60% 55% at 72% 42%, rgba(214,228,235,0.5) 0%, rgba(214,228,235,0) 70%)",
          }}
        />

        <Container size="wide" className="relative flex flex-1 flex-col justify-center pb-16 pt-40 sm:pt-44">
          <div className="max-w-2xl">
            <p className="text-body text-white/60">The Ophthalmology Business Academy</p>
            <h1 className="mt-6 text-h1 font-light tracking-tight text-white">
              <span className="whitespace-nowrap">Where practice strategy</span>
              <br />
              <span className="text-white/45">meets execution.</span>
            </h1>
            <p className="mt-7 max-w-md text-body-lg text-white/65">
              Personalized business education for ophthalmologists — strategies, expert
              interviews, and training built on what actually grows practices.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href="/podcast/episodes" variant="onDark" size="lg">
                Browse Episodes
              </Button>
              <Button href="/speak" variant="frosted" size="lg">
                Contribute
              </Button>
            </div>
          </div>
        </Container>

        {/* Bottom micro-label row with hairline dividers */}
        <Container size="wide" className="relative pb-10">
          <div className="grid max-w-2xl grid-cols-3 divide-x divide-white/15">
            {[
              { t: "Experience-led", s: "Hosted by operators and physicians" },
              { t: "Ophthalmology-specific", s: "Built on eye-care realities" },
              { t: "Non-promotional", s: "Conversations, not sales pitches" },
            ].map((m) => (
              <div key={m.t} className="pr-6 pl-6 first:pl-0">
                <p className="text-body text-white/90">{m.t}</p>
                <p className="mt-1 text-small text-white/45">{m.s}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- Featured episode strip ---------------- */}
      {featured ? (
        <section className="border-b border-line bg-canvas">
          <Container size="wide">
            <div className="grid items-center gap-8 py-14 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
              <div>
                <Eyebrow>Latest conversation</Eyebrow>
                <h2 className="mt-5 text-h2 font-light text-ink-900">
                  <Link href={`/podcast/episodes/${featured.slug}`} className="hover:text-ink-500">
                    {featured.title}
                  </Link>
                </h2>
                <p className="mt-3 font-mono text-eyebrow uppercase text-ink-400">
                  {featured.episodeNumber ? `Episode ${featured.episodeNumber} · ` : ""}
                  {formatDate(featured.publishedAt)}
                </p>
                <p className="mt-4 max-w-xl text-body text-ink-500">{featured.excerpt}</p>
                <Link
                  href={`/podcast/episodes/${featured.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-body text-ink-900 underline-offset-4 hover:underline"
                >
                  <Play className="size-4" aria-hidden /> Listen to this episode
                </Link>
              </div>
              {featured.image ? (
                <Link
                  href={`/podcast/episodes/${featured.slug}`}
                  className="relative block aspect-video overflow-hidden rounded-lg border border-line"
                >
                  <Image
                    src={featured.image}
                    alt=""
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover"
                  />
                </Link>
              ) : null}
            </div>
          </Container>
        </section>
      ) : null}

      {/* ---------------- Stat band ---------------- */}
      <section className="border-b border-line bg-canvas">
        <Container size="wide">
          <dl className="grid grid-cols-2 divide-x divide-line lg:grid-cols-4">
            {[
              { n: `${episodeCount}+`, l: "Recorded conversations" },
              { n: "6", l: "Hosts & regular contributors" },
              { n: "2022", l: "Convening leaders since" },
              { n: "100%", l: "Ophthalmology-specific" },
            ].map((s, i) => (
              <div key={i} className="px-6 py-10">
                <dt className="text-h1 font-light tracking-tight text-ink-900">{s.n}</dt>
                <dd className="mt-1 text-small text-ink-400">{s.l}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ---------------- The problems we examine ---------------- */}
      <Section spacing="default">
        <SectionHeader
          eyebrow="What we talk about"
          title="The decisions that determine"
          titleDim="whether a practice thrives."
          lede="Clinical training builds excellent physicians. It rarely covers the decisions that follow — and those decisions are what OBA's conversations are for."
        />
        <div className="mt-14 grid divide-y divide-line border-y border-line md:grid-cols-2 md:divide-x lg:grid-cols-4 lg:divide-y-0">
          {problemAreas.map((f, i) => (
            <div key={f.title} className="px-0 py-10 md:px-8 md:first:pl-0 md:last:pr-0">
              <span className="font-mono text-eyebrow text-ink-300">[{i + 1}]</span>
              <h3 className="mt-4 text-h3 font-normal">{f.title}</h3>
              <p className="mt-3 text-body text-ink-500">{f.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------- Who it's for ---------------- */}
      <Section tone="subtle" spacing="default">
        <SectionHeader
          eyebrow="Who it's for"
          title="Different seats,"
          titleDim="the same hard decisions."
          lede="OBA's conversations are made for the people responsible for how an ophthalmology practice actually runs."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {audiences.map((a) => (
            <div key={a.title} className="rounded-lg border border-line bg-canvas p-7">
              <h3 className="text-h3 font-normal">{a.title}</h3>
              <p className="mt-2 text-body text-ink-500">{a.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------- Ways to engage ---------------- */}
      <Section spacing="default">
        <SectionHeader
          eyebrow="Ways to engage"
          title="Three ways in."
          lede="Whether you're here to learn, to contribute, or to support the work — there's a clear next step."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {engagements.map((e) => (
            <div key={e.title} className="flex flex-col rounded-lg border border-line p-7">
              <div className="inline-flex size-12 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
                <e.icon className="size-6" aria-hidden />
              </div>
              <h3 className="mt-5 text-h3 font-normal">{e.title}</h3>
              <p className="mt-2 flex-1 text-body text-ink-500">{e.body}</p>
              <Button href={e.cta.href} variant="link" className="mt-5">
                {e.cta.label} <ArrowRight className="size-4" aria-hidden />
              </Button>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------- Latest episodes ---------------- */}
      <Section tone="subtle" spacing="default">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader
            eyebrow="The podcast"
            title="Latest from the show"
            className="max-w-xl"
          />
          <Button href="/podcast/episodes" variant="link">
            All episodes <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {latest.map((ep) => (
            <EpisodeCard key={ep.slug} episode={ep} />
          ))}
        </div>
      </Section>

      {/* ---------------- From the blog ---------------- */}
      {posts.length > 0 ? (
        <Section spacing="default">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeader eyebrow="Insights" title="From the blog" className="max-w-xl" />
            <Button href="/blog" variant="link">
              All articles <ArrowRight className="size-4" aria-hidden />
            </Button>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </Section>
      ) : null}

      {/* ---------------- CTA ---------------- */}
      <CTASection />
    </>
  );
}
