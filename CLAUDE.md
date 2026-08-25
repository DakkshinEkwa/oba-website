# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

`AGENTS.md` is the condensed sibling of this file (for OpenCode). Keep the two in sync when
conventions change.

## Commands

```bash
npm run dev          # dev server at http://localhost:3000
npm run build        # production build (SSG) — also runs the zod content validation
npm run start        # serve the production build
npm run lint         # eslint (eslint-config-next, incl. react-hooks rules)
npx tsc --noEmit     # type-check
```

**No test suite exists.** Verify changes with `lint` + `tsc` + `build`.

Gotchas:
- `tsconfig.json` does not set `noUnusedLocals`, so `npx tsc --noEmit` misses unused
  imports/vars. Run `npx tsc --noUnusedLocals --noUnusedParameters --noEmit` to catch dead code.
- Content scrapers are one-off dev tools that hit the live site (raw HTML cached in
  `scripts/scrape/.cache/`):

```bash
npx tsx scripts/scrape/episodes.ts   # → src/content/episodes/*.mdx + public/images/episodes
npx tsx scripts/scrape/blog.ts       # → src/content/blog/*.mdx + public/images/blog
```

## Architecture

Ground-up rebuild of obacademy.org (Ophthalmology Business Academy): **Next.js 16 App Router +
React 19 + TypeScript + Tailwind CSS v4, fully statically generated**. No database, no API
routes, no account system — all content is local files rendered at build time.

**Content pipeline:** content was scraped once from the live site into `src/content/`
(`episodes/*.mdx`, `blog/*.mdx`, `hosts.json`, `events.json`, `free-resources.json`).
Frontmatter is validated with zod schemas in `src/lib/schemas.ts`; loaders in
`src/lib/content/index.ts` read + parse + memoize collections (`getAllEpisodes()`,
`getAllBlogPosts()`, `getAllEvents()`, `getAllFreeResources()`, …). To add/edit content, edit
the MDX/JSON files — invalid frontmatter fails the build. Optional `image` fields fall back via
`eventImage()` / `resourceImage()` in `src/lib/utils.ts`.

**Site-wide config lives in `src/lib/site.ts`:** `siteConfig` (metadata, email, GA4 id, address,
socials, `primaryCta` → `/speak`, `strategyMeetingUrl`), `aiSummary` (the footer "Get an AI
summary" prompt sent to external AI chats), `primaryNav`, `footerNav`. Change navigation, the
site-wide CTA, or the AI-summary prompt there, not in components. Header nav: Resources ·
Podcast · Reviews · Marketing · Participate · About · Contact.

**Component layers** (`src/components/`): `ui/` design-system primitives → `layout/`
(SiteHeader/SiteFooter/MobileNav/Logo) → `marketing/` (Hero, CTASection, PageHero, DarkHero) →
`content/` (EpisodeCard, BlogCard, EventCard, FeaturedEventCard, LibsynPlayer, Markdown) →
`forms/` → `home/` (homepage sections, split out of `src/app/page.tsx`). Podcast audio plays via
the direct Libsyn MP3 URL through the lazy custom `LibsynPlayer`.

**Design system:** all tokens are in `src/app/globals.css` under `@theme` — Qoves-inspired
near-monochrome (white canvas, cool-charcoal ink scale, muted steel accent, hairline borders, no
saturated color). Fonts: Inter, IBM Plex Mono (eyebrow labels). Visual reference at `/styleguide`
(noindex). `cn()` in `src/lib/utils.ts` configures tailwind-merge to recognize the custom
`text-*` type-scale utilities — use it for class merging.

**SEO / metadata:** every page's `metadata` goes through `pageMetadata()` in
`src/lib/og/metadata.ts` (title, description, canonical, OG, Twitter). Structured data helpers
live in `src/lib/jsonld.ts` (breadcrumb, FAQ, event, podcast series, person). OG images are
generated at build time by `opengraph-image.tsx` route files (site root, blog post, episode)
using the shared card/render helpers in `src/lib/og/`. RSS is `src/app/feed.xml`;
`sitemap.ts`/`robots.ts` are in `src/app/`. Legacy WordPress URLs and live-site aliases
(`/analyze` → `/msm`, `/marketing` → `/msm`, `/guest-speaker` → `/speak`, webinar paths) are
301-redirected in `next.config.ts`. Legal pages: `/privacy`, `/terms`.

## Conventions & constraints

- **Shadows are elevation-only** (floating/overlay surfaces: scrolled nav, dialogs, dropdowns).
  Cards use hairline borders — no decorative card shadows, no raw hex outside `@theme`.
- Tailwind v4 token-var syntax uses parens, e.g. `pt-(--header-offset)` (the token pages use to
  clear the floating header).
- Dark-hero routes must be listed in `DARK_HERO_ROUTES` in `SiteHeader` so the floating nav uses
  light text.
- **There is no auth.** Do not re-add `/login`, `/register`, or `/forgot-password`. Membership is
  account-free; the newsletter is the soft CTA.
- `LibsynPlayer` plays direct Libsyn MP3s — keep `preload="none"` and its buffering/error/
  no-audio states.

## Known stubs (intentional)

- All forms (contact, newsletter, speaker, partnership, marketing analysis) are styled UI shells:
  they validate client-side (vanilla React state) and show pending/success states, but submission
  is stubbed with `// TODO`. `ContactForm` variants: `contact` | `analyze` | `speaker` |
  `partnership`. Don't wire backends unless asked.
- Webinars (`getAllWebinars()` reads `src/content/webinars/*.mdx`, a directory that does not
  exist yet — the loader tolerates it), webinar replays (`/resources/webinars/replays`), and
  reviews (`/reviews`) render honest empty states until real content exists. Events have a Fall
  2026 series in `src/content/events.json` and still keep an empty-state fallback.

## Messaging rules

`docs/messaging-strategy.md` governs all copy. Key rules: OBA is positioned as a professional
platform for experienced ophthalmology leaders — not a lead-gen funnel; speaker ("Contribute")
and partner conversions are the primary CTAs. The marketing-analysis offer lives at `/msm`
(header item "Marketing") and must stay transparently attributed to Ekwa, separate from OBA
editorial. Never add unsupported claims ("thousands of practices", "weekly content") — use only
verifiable proof (75+ episodes, six named hosts, since 2022, 100% ophthalmology). Describe empty
sections honestly. Consult that doc before writing or changing any site copy.

## Audit status

`docs/ui-audit.md` catalogs accessibility/design findings and `docs/seo-audit.md` the SEO ones;
most remediation is committed (see `tasks/todo.md`). Two open items:
- **Nav dropdown keyboard access is intentionally deferred** — `SiteHeader` uses the legacy CSS
  hover-only menu (`group-hover`); submenus are not keyboard-reachable and the trigger has no
  `aria-expanded`. Don't "fix" this without confirming it's wanted.
- A browser pass of form screen-reader announcements and audio player states is still pending.
