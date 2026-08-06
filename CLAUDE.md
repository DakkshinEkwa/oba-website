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

Ground-up rebuild of obacademy.org (Ophthalmology Business Academy): **Next.js App Router + TypeScript + Tailwind CSS v4, fully statically generated**. No database, no API routes — all content is local files rendered at build time.

**Content pipeline:** content was scraped once from the live site into `src/content/` (episodes/*.mdx, blog/*.mdx, hosts.json, events.json). Frontmatter is validated with zod schemas in `src/lib/schemas.ts`; loaders in `src/lib/content/index.ts` read + parse + memoize collections (`getAllEpisodes()`, `getAllBlogPosts()`, etc.). To add/edit content, edit the MDX/JSON files — the schema will fail the build on invalid frontmatter.

**Site-wide config lives in `src/lib/site.ts`:** site metadata, nav structure (`primaryNav`), and the primary macro-conversion CTA (`primaryCta`). Change navigation or the site-wide CTA there, not in components.

**Component layers** (`src/components/`): `ui/` design-system primitives → `layout/` (SiteHeader/SiteFooter/MobileNav) → `marketing/` (Hero, CTASection, PageHero) → `content/` (EpisodeCard, LibsynPlayer, Markdown) → `forms/`. Podcast audio plays via the direct Libsyn MP3 URL through the lazy custom `LibsynPlayer`.

**Design system:** all tokens are in `src/app/globals.css` under `@theme` — Qoves-inspired near-monochrome (white canvas, cool-charcoal ink scale, muted steel accent, hairline borders, no shadows or saturated color). Fonts: Inter, IBM Plex Mono (eyebrow labels). Visual reference at `/styleguide` (noindex). `cn()` in `src/lib/utils.ts` configures tailwind-merge to recognize the custom `text-*` type-scale utilities — use it for class merging.

**SEO/redirects:** legacy WordPress URLs are 301-redirected in `next.config.ts`; `sitemap.ts`/`robots.ts` are in `src/app/`.

## Known stubs (intentional)

- Auth pages (`/login`, `/register`, `/forgot-password`) and all forms (contact, newsletter, register) are styled UI shells: they validate client-side (react-hook-form + zod) and show success states, but submission is stubbed with `// TODO`.
- Webinars and events render honest empty states until real content exists (`src/content/webinars/*.mdx`, `src/content/events.json`).

## Messaging rules

`docs/messaging-strategy.md` governs all copy. Key rules: OBA is positioned as a professional platform for experienced ophthalmology leaders — not a lead-gen funnel; speaker ("Contribute") and partner conversions are the primary CTAs, and the marketing-analysis offer (`/analyze`) is deliberately demoted; never add unsupported claims ("thousands of practices", "weekly content") — use only verifiable proof (75+ episodes, six named hosts, since 2022, 100% ophthalmology). Describe empty sections honestly. Consult that doc before writing or changing any site copy.
