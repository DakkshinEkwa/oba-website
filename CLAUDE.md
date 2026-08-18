# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # dev server at http://localhost:3000
npm run build        # production build (SSG)
npm run lint         # eslint
npx tsc --noEmit     # type-check (no test suite exists)
```

Content scrapers (one-off, dev only; cache raw HTML in `scripts/scrape/.cache/`):

```bash
npx tsx scripts/scrape/episodes.ts   # → src/content/episodes/*.mdx + public/images/episodes
npx tsx scripts/scrape/blog.ts       # → src/content/blog/*.mdx + public/images/blog
```

## Architecture

Ground-up rebuild of obacademy.org (Ophthalmology Business Academy): **Next.js App Router + TypeScript + Tailwind CSS v4, fully statically generated**. No database, no API routes, no account system — all content is local files rendered at build time.

**Content pipeline:** content was scraped once from the live site into `src/content/` (episodes/*.mdx, blog/*.mdx, hosts.json, events.json). Frontmatter is validated with zod schemas in `src/lib/schemas.ts`; loaders in `src/lib/content/index.ts` read + parse + memoize collections (`getAllEpisodes()`, `getAllBlogPosts()`, `getAllEvents()`, etc.). To add/edit content, edit the MDX/JSON files — the schema will fail the build on invalid frontmatter. Event cards accept an optional `image`; missing images fall back via `eventImage()` in `src/lib/utils.ts`.

**Site-wide config lives in `src/lib/site.ts`:** site metadata, nav structure (`primaryNav`), the primary macro-conversion CTA (`primaryCta` → `/speak`), and `strategyMeetingUrl`. Change navigation or the site-wide CTA there, not in components. Header nav: Resources · Podcast · Reviews · Marketing · Participate · About · Contact.

**Component layers** (`src/components/`): `ui/` design-system primitives → `layout/` (SiteHeader/SiteFooter/MobileNav) → `marketing/` (Hero, CTASection, PageHero, DarkHero) → `content/` (EpisodeCard, EventCard, FeaturedEventCard, LibsynPlayer, Markdown) → `forms/` → `home/` (homepage sections). Podcast audio plays via the direct Libsyn MP3 URL through the lazy custom `LibsynPlayer`.

**Design system:** all tokens are in `src/app/globals.css` under `@theme` — Qoves-inspired near-monochrome (white canvas, cool-charcoal ink scale, muted steel accent, hairline borders, no saturated color; restrained shadows reserved for floating/overlay surfaces only — cards use borders). Fonts: Inter, IBM Plex Mono (eyebrow labels). Visual reference at `/styleguide` (noindex). `cn()` in `src/lib/utils.ts` configures tailwind-merge to recognize the custom `text-*` type-scale utilities — use it for class merging.

**SEO/redirects:** legacy WordPress URLs and live-site aliases (`/analyze` → `/msm`, `/marketing` → `/msm`, `/guest-speaker` → `/speak`, webinar paths) are 301-redirected in `next.config.ts`; `sitemap.ts`/`robots.ts` are in `src/app/`. Legal pages: `/privacy`, `/terms`.

## Known stubs (intentional)

- All forms (contact, newsletter, speaker, partnership, marketing analysis) are styled UI shells: they validate client-side (vanilla React state) and show pending/success states, but submission is stubbed with `// TODO`. `ContactForm` variants: `contact` | `analyze` | `speaker` | `partnership`.
- Webinars (`src/content/webinars/*.mdx`), webinar replays (`/resources/webinars/replays`), and reviews (`/reviews`) render honest empty states until real content exists. Events have a Fall 2026 series in `src/content/events.json` and still keep an empty-state fallback.

## Messaging rules

`docs/messaging-strategy.md` governs all copy. Key rules: OBA is positioned as a professional platform for experienced ophthalmology leaders — not a lead-gen funnel; speaker ("Contribute") and partner conversions are the primary CTAs. The marketing-analysis offer lives at `/msm` (header item "Marketing") and must stay transparently attributed to Ekwa, separate from OBA editorial. Never add unsupported claims ("thousands of practices", "weekly content") — use only verifiable proof (75+ episodes, six named hosts, since 2022, 100% ophthalmology). Describe empty sections honestly. Consult that doc before writing or changing any site copy.
