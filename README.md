# Ophthalmology Business Academy — Website

> **Start with [`HANDOVER.md`](HANDOVER.md).** It carries the current state of the project, what is
> safe to change, what will bite you, and who owns the open items. This file covers conventions;
> `HANDOVER.md` covers where things actually stand.

A ground-up rebuild of [obacademy.org](https://www.obacademy.org) with a modern, Qoves-inspired
UI/UX. Built with **Next.js (App Router) + TypeScript + Tailwind CSS v4**, fully statically
generated (SSG).

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

Build & serve production:

```bash
npm run build
npm run start
```

Quality gates:

```bash
npm run lint         # eslint
npx tsc --noEmit     # type-check
```

## Project structure

```
src/
├─ app/                     # App Router routes (pages, layout, sitemap, robots, 404)
├─ components/
│  ├─ ui/                   # design-system primitives (Button, Section, Card, Field, …)
│  ├─ layout/               # SiteHeader, SiteFooter, MobileNav, Logo
│  ├─ marketing/            # Hero, CTASection, PageHero, DarkHero
│  ├─ content/              # EpisodeCard, BlogCard, EventCard, LibsynPlayer, Markdown, …
│  ├─ forms/                # stubbed forms (Contact, Newsletter)
│  └─ home/                 # homepage sections
├─ content/                 # local content: episodes/*.mdx, blog/*.mdx, hosts.json, events.json
├─ lib/                     # site config, content loaders, zod schemas, utils
└─ styles → app/globals.css # @theme design tokens (colors, type scale, spacing)
scripts/scrape/             # one-off content scrapers (dev only)
```

## Design system

All tokens live in `src/app/globals.css` under `@theme` — Qoves-inspired near-monochrome
language: white canvas, cool-charcoal ink scale, **muted steel accent** (no saturated color),
hairline borders instead of decorative shadows, fluid type scale, light-weight (300) display
headlines with two-tone dim second lines (`.title-dim`), outline-chip eyebrows, dark cinematic
radial-gradient hero/CTA bands, floating frosted pill nav, giant wordmark footer. Fonts:
Inter (display + body), IBM Plex Mono (eyebrow labels). Visual reference page:
**`/styleguide`** (noindex).

> Note: `cn()` in `src/lib/utils.ts` configures `tailwind-merge` to recognize the custom
> `text-*` type-scale utilities so they don't conflict with `text-<color>` utilities.

## Content pipeline

Content is **scraped once** from the live site into local MDX/JSON, then rendered statically.
Scrapers cache raw HTML in `scripts/scrape/.cache/` (gitignored) to avoid re-hitting the live site.

```bash
npx tsx scripts/scrape/episodes.ts   # → src/content/episodes/*.mdx  (+ public/images/episodes)
npx tsx scripts/scrape/blog.ts       # → src/content/blog/*.mdx      (+ public/images/blog)
```

Content types are validated with zod (`src/lib/schemas.ts`); loaders are in `src/lib/content/`.
Podcast audio uses the direct Libsyn MP3 with a lazy custom player (`LibsynPlayer`).

Site-wide nav, CTA, and booking URL live in `src/lib/site.ts`.

## Status & follow-ups

- **No account system.** Auth pages (`/login`, `/register`, `/forgot-password`) were removed.
  Membership is free and account-free; the newsletter is the soft-conversion CTA.
- **Forms** (contact, newsletter, speaker, partnership, marketing analysis) are styled **UI
  shells** — they validate client-side and show success states but submission is stubbed
  (`// TODO`). Wire to a CRM / ESP when ready.
- **Marketing analysis** lives at `/msm` (header nav item "Marketing"). Legacy `/analyze` and
  `/marketing` 301 to it. The offer is an Ekwa service, labeled separately from OBA editorial.
- **Events** have a Fall 2026 virtual panel series in `src/content/events.json` (`EventCard` /
  `FeaturedEventCard`), rendered by a content-driven template at `/resources/events/[slug]`.
  Webinars, replays and reviews were **removed** rather than shipped hollow, and 301 in
  `next.config.ts` — do not re-add them.
- **SEO / AI SEO** are complete in code: structured data, OG cards, `llms.txt`, an OKF bundle,
  Markdown mirrors of every episode and post, and a transcript pipeline awaiting content. See
  `docs/seo-audit.md`, `docs/ai-seo.md`, and `docs/deployment.md` before hosting this.
- **Mobile layout** (hero, nav sheet, stat-bento stack, event fact chips, footer newsletter) was
  polished 2026-09-09 on `seo-ai-seo-handover`. Load-bearing notes are in `HANDOVER.md`.
- **Legal:** `/privacy` and `/terms` are linked from the footer.
- **Redirects:** legacy WordPress URLs and live-site aliases are 301-redirected in
  `next.config.ts`.
- **Imagery:** episode/blog images are the originals from the live site; some are low-resolution
  and may warrant replacement. Event cards fall back to
  `public/images/events/building-od-partnerships.webp`.
