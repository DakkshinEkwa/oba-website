# Ophthalmology Business Academy — Website

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
│  ├─ marketing/            # Hero, CTASection, PageHero
│  ├─ content/              # EpisodeCard, BlogCard, LibsynPlayer, Markdown, …
│  └─ forms/                # stubbed forms (Register, Login, Contact, Newsletter, …)
├─ content/                 # local content: episodes/*.mdx, blog/*.mdx, hosts.json, …
├─ lib/                     # site config, content loaders, zod schemas, utils
└─ styles → app/globals.css # @theme design tokens (colors, type scale, spacing)
scripts/scrape/             # one-off content scrapers (dev only)
```

## Design system

All tokens live in `src/app/globals.css` under `@theme` — Qoves-inspired near-monochrome
language: white canvas, cool-charcoal ink scale, **muted steel accent** (no saturated color),
hairline borders instead of shadows, fluid type scale, light-weight (300) display headlines
with two-tone dim second lines (`.title-dim`), outline-chip eyebrows, dark cinematic
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

## Status & follow-ups

- **Auth** (`/login`, `/register`, `/forgot-password`) and all **forms** (contact, newsletter,
  analyze, register) are styled **UI shells** — they validate client-side and show success states
  but submission is stubbed (`// TODO`). Wire to an auth provider / CRM / ESP when ready.
- **Webinars** and **events** render honest empty states until real content is added
  (`src/content/webinars/*.mdx`, `src/content/events.json`).
- **Redirects**: legacy WordPress URLs are 301/308-redirected in `next.config.ts`. Expand from the
  live sitemap before launch.
- **Imagery**: episode/blog images are the originals from the live site; some are low-resolution
  and may warrant replacement.
```
