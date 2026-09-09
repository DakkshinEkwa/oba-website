# HANDOVER — start here

**Updated 2026-09-09.** Single source of truth for where this project stands, what is
safe to change, and what will bite you. If you are picking this repo up, read this file before
anything else. Current branch: **`seo-ai-seo-handover`**.

---

## What this is

A ground-up rebuild of obacademy.org — Next.js 16 App Router, React 19, TypeScript, Tailwind v4,
**fully statically generated**. No database, no API routes, no auth. All content is local files in
`src/content/` rendered at build time.

```bash
npm ci
npm run dev          # http://localhost:3000
npm run build        # SSG + zod content validation; invalid content fails the build
```

**Gates — there is no test suite.** All four were green as of 2026-09-07; lint + tsc still
pass after the 2026-09-09 mobile commit:

```bash
npm run lint && npx tsc --noEmit && npm run build
npx tsc --noUnusedLocals --noUnusedParameters --noEmit   # tsconfig omits these; catches dead code
```

---

## Where to look

| You want to… | Read |
|---|---|
| Deploy this site | **`docs/deployment.md`** — host requirements, verification checklist |
| Understand the codebase in depth | `CLAUDE.md` (long) or `AGENTS.md` (condensed) — keep them in sync |
| Write or change any copy | `docs/messaging-strategy.md` — governs all of it |
| Understand the SEO state | `docs/seo-audit.md` |
| Understand the AI/agent layer | `docs/ai-seo.md` |
| Style episode pages | `brand-guidelines.md` |
| See what the copy used to say | `docs/previous-copy.md` (historical) |
| Fix accessibility | `docs/ui-audit.md` — **stale, re-verify before working it** |

---

## Status

| Track | State |
|---|---|
| Site build, design system, content pipeline | Complete |
| Mobile layout (hero, nav, bento, facts, newsletter) | Complete as of 2026-09-09 |
| OpenGraph, icons, manifest, favicon | Complete |
| SEO — technical + structured data | Complete in code |
| AI SEO — agent layer | Complete in code |
| Podcast RSS feed | **Submittable.** All 75 episodes carry measured duration + byte size |
| On-page copy | **Frozen by the client.** Findings recorded, never applied |
| Transcripts | Pipeline built, **deliberately empty** — deferred |
| Deployment | **Handed off.** No domain access on this side |

Everything achievable inside the repo is done. The two things that decide whether it produces
results — being deployed, and having content worth citing — sit outside it.

---

## The one thing that will bite whoever deploys this

`www.obacademy.org` currently serves a **stale GitHub Pages build** pointing at
`marketing254.github.io/Ophthalmology`. Its routes don't match this repo — `/msm/`, `/speak/` and
`/podcast/episodes/` all 404.

That matters more than "it's out of date". The current host is *static*, and this repo declares
**28 permanent 301s** plus all its security headers through `next.config.ts`. A pure static host
applies neither. Deployed that way:

- every indexed legacy WordPress URL 404s instead of redirecting, and
- ~180 machine-readable mirrors lose their `X-Robots-Tag: noindex` and start competing with the
  pages they mirror

…with no error, no warning, and no visibly broken page. `next.config.ts` now **throws at build time**
if anyone sets `output: "export"`, because that's the usual accidental route in. Vercel is
zero-config here and `vercel.json` is committed.

`docs/deployment.md` has the full brief and copy-pasteable verification commands.

---

## Picking up the work

**Safe to change freely:** components, styles, tokens, new routes, structured data, the agent layer.

**Change carefully — these are load-bearing and documented in `CLAUDE.md`:**

- **`pageMetadata()` must keep restating `alternates.types`.** Next replaces `alternates` wholesale
  rather than merging, so the root layout's RSS link silently vanishes from every page that sets its
  own canonical — which is all of them. It shipped broken that way for months.
- **`AgentItem` (`src/lib/agent/content.ts`) is a public contract.** Crawlers cache and diff these
  files. Extend it; never reshape it. Every field added after v1 is optional for that reason.
- **Transcript text and `okfBundle()` are memoized.** Both are rebuilt once per generated file;
  removing the cache re-serializes the whole catalogue hundreds of times per build.
- **`DARK_HERO_ROUTES` in `SiteHeader`** — any page with a dark hero must be listed, or the floating
  nav renders white-on-white.
- **`HeroGlobe`** — hollow dot shell with no depth writes; the per-layer fade *is* the depth cue.
  Don't add GSAP or OrbitControls.
- **`NewsletterForm`** — email and Subscribe are both `h-12`. The input needs `appearance-none
  min-h-12 py-0 leading-none` or mobile Safari renders it shorter than the button. `rounded-md`
  below `lg`, pill on desktop. Don't bump mobile to `h-16` — that made the button tall and the
  field still short.
- **`StatBento` below `sm`** — tiles wrap in `.bento-stack-item` and stick as a deck. Wrappers are
  `display: contents` from `sm` up so grid placement is unchanged. Mobile `.bento-cell` uses
  `--shadow-lg` because the cards overlay each other (elevation, not decoration). Don't strip the
  wrappers or the shadow.
- **`useCanHover()`** (`src/lib/use-can-hover.ts`) — `HostsTile`, `EpisodeExpandMark`, and
  `BlindSpotGrid` never get hover on touch, so they run continuously. Server snapshot is `true`
  (desktop-like). Don't gate them on hover-only again.
- **`EventFactsStrip`** — inline `gridTemplateColumns` always beats Tailwind, so the sm+ equal
  columns go through `--fact-cols`. Below `sm` the chips stack. Don't put `gridTemplateColumns`
  back on the style attribute.
- **`MobileNav`** — sheet comes in from the **left**. Trigger is three CSS bars, not lucide `Menu`.

**Don't re-add:** `/login`, `/register`, `/forgot-password`, `/podcast`, `/membership`,
`/partnerships`, `/reviews`, `/resources/webinars`, `/resources/newsletter`, `/faq`. All are
deliberately removed and 301'd in `next.config.ts`.

**Don't "fix" these — they're decisions, not bugs:**

- `WebSite.potentialAction` omits `SearchAction`. There is no site search; declaring one is a false
  capability claim to search engines.
- `not-found.tsx` hand-rolls its metadata and emits **no** canonical. A 404 must not claim one.
- `sitemap.ts` emits `lastModified` only where a truthful date exists. Google discounts lastmod
  site-wide once it detects invented values.
- Six of seven events carry only a title and date and render the short page that supports. Nothing
  is invented to fill a gap.
- All forms are styled shells with stubbed submission. Don't wire backends unless asked.

---

## Content pipeline

Content lives in `src/content/` and is validated by zod (`src/lib/schemas.ts`). To add or edit
content, edit the files — invalid frontmatter fails the build.

New episodes arrive from a **Google Sheet**, daily via
`.github/workflows/publish-episodes.yml` or manually:

```bash
EPISODE_SHEET_CSV_URL="<csv export url>" npm run publish:episodes
```

**Transcripts are authored by hand in that same sheet** — paste into a `transcript` column.
WhisperX was evaluated and dropped: a fabricated quote attributed to a named physician is an
unbounded reputational risk on a site whose entire positioning is credibility.

The parser (`scripts/publish/transcript-text.ts`) accepts what people actually paste —
`[00:12] Name: text`, `12:34 Name: text`, or bare `Name: text` — and timestamps are optional
throughout. The importer syncs transcripts onto **already-published** episodes, idempotently, which
matters because all 75 already exist. `transcriptStatus` defaults to `reviewed`; set `machine` for
un-read-through ASR output and the page says so.

Once a transcript lands it automatically reaches the episode page, `/md`, `/transcript.md`,
`llms.txt`, `llms-full.txt`, the OKF bundle and the `PodcastEpisode` JSON-LD. **No further code.**

One-off tools (run only when needed):

```bash
npx tsx scripts/publish/measure-audio.ts    # backfill durationSec + audioBytes from the real MP3s
npx tsx scripts/generate-brand-icons.ts     # every square brand raster, from the committed logo
npx tsx scripts/generate-landmask.ts        # HeroGlobe's continent mask
```

---

## Open items, by owner

**Whoever deploys** — `docs/deployment.md`
- Host somewhere that honours `redirects()` and `headers()`. Vercel is zero-config.
- Point `www.obacademy.org` at it; apex → www, http → https, no trailing slash.
- Run the §4 verification commands. Check 1 (legacy 301s) matters most.
- Search Console + Bing verification (`NEXT_PUBLIC_GSC_TOKEN` / `NEXT_PUBLIC_BING_TOKEN`), then
  submit the sitemap.
- Enable HSTS once HTTPS is stable — written and commented out in `next.config.ts`.
- Submit `/feed.xml` to Apple Podcasts and Spotify. It is now complete enough to accept.

**Content owner**
- **Transcripts.** 0 of 75, deferred. When restarting, do **10–15 episodes, not 75** — sheet entry
  costs real hours and you want evidence it moves first. Weight toward high-intent topics: PE offers
  and succession, EMR switching, co-management compliance, staffing, office-based surgery economics.
- **Publishing cadence.** Nothing since 2024-06-07. Not fixable in code. The site correctly never
  claims a cadence — don't let copy start.
- Real reviews, if they ever exist: `reviews.json`, `reviewSchema`, `getAllReviews()` and
  `ReviewWall.tsx` are kept unused so `/reviews` can return whole.

**Needs a decision**
- Per-episode `tags`: 0 of 83 files carry them, leaving six render branches permanently dead. They
  render as visible chips, so populating them is a copy decision.
- Lifting the copy freeze for titles and meta descriptions (`docs/seo-audit.md` P-01, P-02, P-05)
  and for image `alt` text (P-06 — 16 of 19 `<Image>` call sites are `alt=""`).

**Settled — do not re-raise**
- P-03 (over-160-character meta descriptions) and P-04 (homepage H1 and primary CTA) were both put
  to the client and declined in favour of the existing copy.

---

## What changed recently

### 2026-09-09 — mobile layout

Commit `191ec21` on `seo-ai-seo-handover`. Conventions for the bits below also landed in
`AGENTS.md` / `CLAUDE.md` so agents don't "fix" them.

- Footer newsletter: email field and Subscribe matched at 48px (`h-12`) on mobile.
- Mobile nav sheet slides in from the left; hamburger morphs to an X.
- Hero CTAs stay a row; the three proof labels stack below `sm`.
- Event fact chips stack below `sm` (via `--fact-cols`, not an inline `gridTemplateColumns`).
- Stat bento becomes a sticky five-card deck below `sm`.
- Host / episode / blind-spot tiles keep animating on touch (`useCanHover`).

### 2026-09-07 — SEO / agent layer

Detail in `docs/ai-seo.md` and `docs/seo-audit.md`. The parts worth knowing:

**Four defects that only appeared by diffing the build output against what the code claimed.**
Nobody had compared them:

1. The RSS `<link rel="alternate">` was emitted on **0 of 110 pages** (the `alternates` clobber
   above). Now on all 108 real pages.
2. Every OKF item document had its blank lines stripped and no trailing newline — a filter meant to
   drop empty sections was deleting the separators too.
3. The 83 `/md` mirrors were undiscoverable, despite their own comments claiming otherwise.
4. `/llms.txt` was linked from nowhere, so the whole agent layer hung off a filename a crawler had
   to guess.

**The entity graph.** 59 named guests were bare strings with no `@id` — one person credited on four
episodes was four anonymous mentions. They're now `Person` entities with stable ids on
`/podcast/speakers`, and each episode's `actor` entries reference the same id.

**The podcast feed became submittable.** `measure-audio.ts` filled `durationSec` and `audioBytes`
for all 75 episodes from the real files, unblocking `<enclosure length>`, `<itunes:duration>` and
schema.org `duration`. Measured, never guessed — a wrong length breaks podcast clients outright.

**The transcript pipeline**, built and left idle by decision.

---

## Repo conventions

- Two GitHub accounts are separated by directory. This repo pushes to **DakkshinEkwa** over SSH.
  **Never set `user.name` / `user.email`** — `~/.gitconfig` `includeIf` rules derive the right
  identity from the path and global hooks enforce it.
- `.claude/` holds `commands/` (worth committing) plus `settings.local.json` and `launch.json`
  (not).
- **Ground truth for anything SEO-related is the build output** — `.next/server/app/**/*.{html,body}`
  — never the live domain, which serves a different build. `docs/ai-seo.md` and `docs/seo-audit.md`
  both end with copy-pasteable verification blocks.
