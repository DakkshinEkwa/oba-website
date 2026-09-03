# AGENTS.md

OpenCode guidance for the obacademy.org rebuild. Detailed companion file: `CLAUDE.md`.

## Commands

- Dev: `npm run dev` (http://localhost:3000)
- Build (SSG): `npm run build` — also validates content frontmatter against zod, so schema errors fail here
- Lint: `npm run lint` (eslint-config-next, includes react-hooks rules — they catch real bugs)
- Typecheck: `npx tsc --noEmit`
- **No test suite exists.** Verify changes with `lint` + `tsc` + `build`.

Gotchas:
- `tsconfig.json` does not set `noUnusedLocals`, so `npx tsc --noEmit` misses unused imports/vars. Run `npx tsc --noUnusedLocals --noUnusedParameters --noEmit` to catch dead code.
- Content scrapers are one-off dev tools that hit the live site (raw HTML cached in `scripts/scrape/.cache/`):
  `npx tsx scripts/scrape/episodes.ts` → `src/content/episodes/*.mdx` + `public/images/episodes`
  `npx tsx scripts/scrape/blog.ts` → `src/content/blog/*.mdx` + `public/images/blog`

## Architecture

- Next.js App Router + TypeScript + Tailwind CSS v4, **fully static (SSG)**. No database, no API routes, no account system.
- **Content is local files** in `src/content/` (episodes/*.mdx, blog/*.mdx, hosts.json, events.json, free-resources.json). Frontmatter is zod-validated (`src/lib/schemas.ts`); loaders in `src/lib/content/` are memoized. Add/edit content there — invalid frontmatter fails the build. `image` fields are optional; `eventImage()` / `resourceImage()` in `src/lib/utils.ts` supply the placeholders.
- **Site-wide config lives in `src/lib/site.ts`**: `siteConfig` (metadata, GA4 id, socials, `primaryCta` Contribute → `/speak`, `strategyMeetingUrl`), `aiSummary` (the footer "Get an AI summary" prompt), `primaryNav`, `footerNav`. Change nav/CTA there, not in components. Header: Resources · Podcast · Reviews · Marketing · Participate · About · Contact.
- Component layers (`src/components/`): `ui/` design-system primitives → `layout/` (header/footer/nav) → `marketing/` (hero, CTASection, PageHero, DarkHero) → `content/` (cards, EventCard, FeaturedEventCard, LibsynPlayer, Markdown) → `forms/`. `home/` holds homepage sections (split out of `src/app/page.tsx`).
- **Only WebGL surface:** `home/HeroGlobe.tsx` — a `three` globe bleeding off the hero's bottom-right corner, mounted via `home/HeroGlobeMount.tsx` (`next/dynamic`, `ssr: false`). `lg`-and-up only, rAF paused offscreen, frozen under `prefers-reduced-motion`. Flights use framer-motion `animate()` — don't add GSAP or OrbitControls.
- Globe layers: 6,500 white points blanketing the whole sphere (the committed `home/landmask.ts` sets a per-point `aLand` flag that lifts opacity and size rather than filtering points; ocean stays a faint grid at `OCEAN_ALPHA`), 14 bezier arcs anchored to land, and pulsing endpoint markers — the rings and people pins are the only colored elements (`MARKER_COLOR`, blue).
- No buttons on the globe: five people in `PEOPLE` are pinned at real coordinates, and the front-most pin inside the visible slice shows a circular portrait positioned from the render loop. Avatar needs `max-w-none` (the global `img { max-width: 100% }` clamps it to 0 against the zero-width anchor), and the active-index tracker must stay local to the effect — as a ref it survives effect re-runs while the DOM resets, so nothing ever shows. Names live in an `sr-only` list. Deliberately a **hollow shell** — no body, `depthTest: false` throughout; each layer fades as it turns away (`vFacing`) and that fade is the only depth cue, so don't drop it without adding an occluder. Arcs are `TubeGeometry` (`gl.lineWidth` is clamped to 1px) and use `NormalBlending` (additive saturates against `--gradient-hero-glow`). Regenerate the mask with `npx tsx scripts/generate-landmask.ts`.
- Design tokens live in `src/app/globals.css` under `@theme`. Use `cn()` (`src/lib/utils.ts`) for class merging — it's configured so the custom `text-*` type utilities don't collide with `text-<color>` utilities.
- **SEO/metadata:** page `metadata` goes through `pageMetadata()` (`src/lib/og/metadata.ts`); structured data via `src/lib/jsonld.ts`; OG images are built by `opengraph-image.tsx` routes (root, blog post, episode) on top of `src/lib/og/`. RSS is `src/app/feed.xml`; `sitemap.ts`/`robots.ts` in `src/app/`. Legacy WordPress URLs and live-site aliases 301-redirected in `next.config.ts` (`/analyze` and `/marketing` → `/msm`). Legal: `/privacy`, `/terms`.

## Conventions & constraints

- **Copy must follow `docs/messaging-strategy.md`.** OBA is positioned as a professional platform for experienced ophthalmology leaders, not a lead-gen funnel; speaker/partner conversions are the primary CTAs. The marketing-analysis offer is at `/msm` (nav label "Marketing") and must stay labeled as an Ekwa service. Only verifiable claims are allowed (75+ episodes, six named hosts, since 2022, 100% ophthalmology) — never add "thousands of practices" or "weekly content" claims, and describe empty sections honestly. Read that doc before writing or changing any site copy.
- **Shadows are elevation-only** (floating/overlay surfaces: scrolled nav, dialogs, dropdowns). Cards use hairline borders — no decorative card shadows, no raw hex outside `@theme`.
- Forms (contact, newsletter, speaker, partnership, marketing analysis) are **styled UI shells**: they validate client-side (vanilla React state) and show pending/success states, but submission is stubbed with `// TODO`. `ContactForm` variants: `contact` | `analyze` | `speaker` | `partnership`. Don't wire backends unless asked.
- There is **no auth**. Do not re-add `/login`, `/register`, or `/forgot-password`. Membership is account-free; newsletter is the soft CTA.
- Webinars (`getAllWebinars()` reads `src/content/webinars/*.mdx`, a directory that does not exist yet — the loader tolerates it), webinar replays (`/resources/webinars/replays`), and reviews (`/reviews`) render honest empty states until real content exists. Events have a Fall 2026 series in `src/content/events.json` and keep an empty-state fallback.
- `LibsynPlayer` plays direct Libsyn MP3s — keep `preload="none"` and its buffering/error/no-audio states.
- Tailwind v4 token-var syntax uses parens, e.g. `pt-(--header-offset)` (the token pages use to clear the floating header).
- Dark-hero routes must be listed in `DARK_HERO_ROUTES` in `SiteHeader` so the floating nav uses light text.

## Audit status

`docs/ui-audit.md` catalogs accessibility/design findings and `docs/seo-audit.md` the SEO ones; most remediation is committed (see `tasks/todo.md`). Two open items:
- **Nav dropdown keyboard access is intentionally deferred** — `SiteHeader` uses the legacy CSS hover-only menu (`group-hover`); submenus are not keyboard-reachable and the trigger has no `aria-expanded`. Don't "fix" this without confirming it's wanted.
- A browser pass of form screen-reader announcements and audio player states is still pending.
