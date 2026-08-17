# Podcast pages — Qoves-styled redesign

## Context

The OBA podcast pages look dull, and the cause is specific. The design system in
`src/app/globals.css` already carries a rich Qoves-inspired vocabulary — three cinematic
gradients (`--gradient-hero`, `--gradient-hero-glow`, `--gradient-cta`), a two-tone
headline convention (`.title-dim`), a marquee utility, a fluid display scale — and the
**podcast pages use almost none of it**. Both render through `marketing/PageHero.tsx`, a
plain white band with a headline, then uniform grids of identical bordered cards. The
homepage by contrast opens on a full-bleed dark gradient hero, runs a ticker strip, a stat
band, and varied divider-grid layouts. The podcast section reads as a flatter, different site.

The prompt was a reference page — `https://marketing254.github.io/Ophthalmology/podcast/`,
a separate agency-built static site not in this repo — whose *structure* the user liked:
ticker → dark hero with stat row and featured-episode card → dense episode list →
pagination. We reimplement that structure in our own design language; we do not copy its
skin, and we do not inherit its bugs.

Outcome: `/podcast` and `/podcast/episodes` gain the same visual authority as the homepage,
the library reads as a real archive rather than a card grid, and mobile density improves
from ~1.6 cards per phone screen to ~9 rows.

## Decisions taken with the user

- Redesign **both** pages, kept **separate**. No IA change, no merge.
- **Dark cinematic hero** via `--gradient-hero`, then white canvas for the library.
- Adopt: featured latest-episode card, stat row, dense row list, marquee ticker.
- This plan is committed to the repo as **`docs/podcast-redesign.md`**, alongside
  `messaging-strategy.md`, `previous-copy.md` and `ui-audit.md`. The existing
  `tasks/plan.md` / `tasks/todo.md` (a completed UI-audit log) are **not** touched, and no
  index entry is added to README or CLAUDE.md.
- Fold the old todo's "browser pass — pending tooling" item in, **scoped to the podcast
  pages only** (Chrome automation is now available).

## Hard constraints

**Data.** `Episode` (`src/lib/schemas.ts`) declares `durationSec`, `guests[]`, `tags[]`,
`featured` — populated in **0 of 75** files in `src/content/episodes/`. Only `slug`, `title`,
`episodeNumber`, `publishedAt`, `excerpt`, `audioUrl`, `image`, `sourceUrl` carry real data.
Newest episode is **2024-06-07**. Every component must degrade gracefully, and **no filter
UI is buildable** in this scope.

**`episodeNumber` is not unique** — `26` appears in both
`how-to-use-local-influencers-as-brand-ambassadors.mdx` and
`the-importance-of-patient-follow-up.mdx`. Never key a React list on it.

**Copy** — `docs/messaging-strategy.md` governs all wording:
sanctioned proof only ("75+ recorded conversations", "6 hosts & regular contributors",
"since 2022", "100% ophthalmology-specific"); **banned**: cadence claims ("weekly"),
audience-size or download claims, the CTA labels "Learn More"/"Get Started"/"Join Now",
and any `/analyze` link on these pages; closing CTA is "Contribute as a Speaker" → `/speak`;
the `/podcast` H1 stays exactly *"Where ophthalmology talks business, on the record"*.

**Not deployed.** No `.github/workflows`, no `output: "export"`, no CNAME — so changing
`EPISODES_PER_PAGE` cannot break live URLs. We take 12 → 20 (75 ⇒ 4 pages) with **no
redirect needed**. `sitemap.ts` and `page/[page]/generateStaticParams` both derive from the
constant and stay consistent automatically.

## Bugs not to inherit from the reference

| Reference defect | Guard in this design |
|---|---|
| Decorative orb overflows viewport → horizontal scrollbar | Gradients absolutely positioned inside `relative overflow-hidden`; text columns use `minmax(0,1fr)` **and** `min-w-0` **and** `truncate`/`line-clamp`; no negative-margin hover bleed. Verified via `scrollWidth === clientWidth` at 320/375/768/1280 |
| "NEW" badge on 100% of items, including 2024 ones | `EpisodeRow` and `FeaturedEpisodeCard` take **no** badge prop and don't import `Badge`. Recency is structural: featured = newest, list is date-descending, every row shows a real date |
| Filter chips with one option that filters nothing | No filter ships. `tags` is empty in all 75 files. The chip slot gets a factual scope readout instead (count · year range · page N of M) |
| Episode number rendered twice, overlapping the title | Number appears in exactly one place per row — the mono meta line. No number chip on artwork |
| Pagination as `<button>`, pages 2–3 uncrawlable | Reuse `ui/Pagination.tsx`, which already emits real `hrefFor` links with `aria-current` |

## Architecture decisions

**Build `DarkHero`; do not add `tone="dark"` to `PageHero`.** `PageHero` is mounted on 12
pages — every prop is a branch to prove neutral on 10 untouched ones. More importantly it's
a different box, not a skin: the dark hero needs `-mt-(--header-offset)` to pull under the
transparent floating nav, `overflow-hidden`, two gradient layers, its own top padding, an
optional aside column and an optional footer row. ~70% different markup. And its
sub-components change too (`Breadcrumbs` is hardcoded ink, buttons become `onDark`/`frosted`).
Composition already won this argument once here — `HeroSection` (home) and `PageHero`
(interior) coexist rather than sharing a flag. `DarkHero` is the generalization of
`HeroSection`, which is the right axis.

**New `src/components/podcast/`** mirrors the existing `src/components/home/` convention for
page-composition pieces that aren't general-purpose.

**`EpisodeCard.tsx` is untouched** — still used by home `LatestContent`, `/resources`, and
the episode-detail "More episodes" grid.

### 🔴 Hard blocker

`src/components/layout/SiteHeader.tsx:14` — `const DARK_HERO_ROUTES = ["/"]` matched with
`.includes(pathname)`. A dark hero on `/podcast` **without** updating this renders the logo
and nav ink-on-ink. Fix with a regex list, deliberately excluding `/podcast/hosts` and
`/podcast/episodes/[slug]`, which keep light heroes:

```ts
const DARK_HERO_ROUTES = [/^\/$/, /^\/podcast$/, /^\/podcast\/episodes$/, /^\/podcast\/episodes\/page\/\d+$/];
const onDark = scrolled || DARK_HERO_ROUTES.some((r) => r.test(pathname));
```

## File map

| File | Action |
|---|---|
| `src/components/marketing/DarkHero.tsx` | **new** — reusable dark cinematic hero (`size: "full" \| "band"`, `aside`, `footer`, `titleDim`) |
| `src/components/marketing/StatRow.tsx` | **new** — tone-aware stat grid extracted from `StatBand` |
| `src/components/podcast/FeaturedEpisodeCard.tsx` | **new** — frosted card for the hero aside |
| `src/components/content/EpisodeRow.tsx` | **new** — one dense list row |
| `src/components/content/EpisodeList.tsx` | **new** — `<ol>` wrapper + empty state |
| `src/lib/content/index.ts` | extend — `getEpisodeStats()` |
| `src/components/ui/Breadcrumbs.tsx` | extend — additive `tone?: "default" \| "onDark"` |
| `src/components/ui/Button.tsx` | extend — `focus-visible:outline-white` on `onDark`/`frosted` |
| `src/components/layout/SiteHeader.tsx` | edit — `DARK_HERO_ROUTES` → regex (blocker above) |
| `src/components/home/StatBand.tsx` | refactor — thin wrapper over `StatRow`, DOM unchanged |
| `src/app/podcast/page.tsx` | rewrite |
| `src/components/content/EpisodesArchive.tsx` | rewrite |
| `src/components/marketing/PageHero.tsx`, `content/EpisodeCard.tsx` | **untouched** |

## Key component contracts

**`EpisodeRow`** — grid `[5rem_minmax(0,1fr)]` mobile → `[7rem_minmax(0,1fr)_auto]` at `sm`.
Exactly **one interactive element per row**: the title link, carrying the full stretched-link
triad (`relative` on the `li` which is also the `group`, plus `after:absolute after:inset-0
after:content-['']`). Thumbnail is a non-interactive `<div>`; "Listen" is an `aria-hidden`
`<span>`. Accessible name is the title alone; tab order is one stop per episode.
Degradation: no `image` → `Headphones` glyph in a fixed-width tile (no height shift); no
`guests` → support line falls back to `excerpt`; no `durationSec` → span omitted, `justify-self-end`
keeps "Listen" flush. Below `sm`, the right column and support line are hidden.
**`EpisodeList`** renders `<ol className="divide-y divide-line border-y border-line">` —
date-ordered, so screen readers announce "list, 20 items". `key={ep.slug}`, never `episodeNumber`.

**`FeaturedEpisodeCard`** — artwork + episode number + date + title, over `bg-white/10
backdrop-blur-md`. No duration, no guest, no badge, no rating (all either nonexistent or
banned). Uses `getFeaturedEpisode()`, but the page guards the eyebrow:
`featured?.slug === all[0]?.slug ? "Latest conversation" : "Featured conversation"` — because
`featured` is `false` everywhere today so it falls through to newest, and the label would
become a lie the moment an editor flags an older episode. **No embedded `LibsynPlayer`** —
each instance is an independent `<audio>` with no shared "now playing" coordination, so a
hero player could play over the detail-page one.

**`StatRow`** — the four sanctioned stats: `75+` Recorded conversations · `6` Hosts &
regular contributors · `2022` Convening leaders since · `100%` Ophthalmology-specific.
Explicitly rejected from the reference: `5.0★` (no ratings data — fabricated claim) and
download counts (banned). Values come from a new `getEpisodeStats()` deriving count /
first year / host count from the catalog at build time, removing the last hardcoded "6" from
`StatBand.tsx:8`. `AnimatedStat` is reused **unchanged** — its `^(\D*)(\d+)(\D*)$` split
already handles `75+`, `100%` and `2022`, and it's reduced-motion aware with an `sr-only` value.

**Ticker** goes on `/podcast` only, immediately below the hero, as the transition device into
the white canvas — exactly its homepage role. **Not** at the very top: our header is `fixed`
and transparent at scroll-0, and the hero pulls up under it, so a top ticker would sit behind
the nav or destroy the edge-to-edge effect. **Not** on `/podcast/episodes`: a marquee of
episode titles directly above a list of the same titles is pure redundancy, and the dense list
already *is* the proof-by-volume the ticker conveys.

## Accessibility requirements

- **Heading order `/podcast`**: `h1` hero → `h2` featured card (valid: distinct labelled region
  under the page title) → `h2` per section → `h3` per row. `/podcast/episodes`: `h1` hero →
  visible `h2` "All episodes" (replacing today's `sr-only` "Episode archive") → `h3` per row.
  `EpisodeRow`'s level is fixed at `h3`, not parameterized.
- **Focus on dark**: the global `:focus-visible` outline is `--color-accent-600` (`#3d5361`),
  ~1.4:1 on the hero — invisible. Every focusable element on `DarkHero` gets
  `focus-visible:outline-white outline-offset-2`: both `Button` variants via their cva strings,
  `Breadcrumbs` via `tone="onDark"`, the featured card link inline.
- **Contrast** is the real risk. Over the gradient's light lobe (`#5b7484`), `text-white/45`
  is ~2.2:1 and `text-white/65` ~2.8:1 — both fail. Hence `DarkHero` includes a third scrim
  layer (`linear-gradient(90deg, rgba(11,18,32,0.62) 0%, … 72%)`) pinning the left ~48% near
  `#16232c`. Rules: copy stays in `max-w-2xl` in the **left** column; `text-white/45` is used
  **only** for the `titleDim` fragment at `text-h1` (≥36px, 3:1 threshold); lede is
  `text-white/70`, stat labels `text-white/65`.
- **Reduced motion**: marquee and `AnimatedStat` are already gated — reuse unchanged, don't
  re-enable. Use `animate-fade-up` on the hero copy block **only**; do not stagger it across
  20 rows (a 2-second shimmer on every archive page).
- **Empty state**: `EpisodeList` returns `EmptyState` at 0 episodes, killing today's
  "0 episodes · Page 1 of 1" over a blank grid (`EpisodesArchive.tsx:41-49`).

---

## Task breakdown

Work is sliced so each phase leaves the site building and working. Phase 0 is shared
plumbing with **zero intended visual change** — it de-risks the two page slices that follow.

### Phase 0: Foundation (no visual change)

**Task 1 — `getEpisodeStats()` + `Breadcrumbs` tone + `Button` dark focus rings**
Add the build-time stats helper; add an additive `tone` prop to `Breadcrumbs`; append
`focus-visible:outline-white` to the `onDark` and `frosted` cva variants.
*Acceptance:* `getEpisodeStats()` returns `{count: 75, firstYear: "2022", latestYear: "2024", hostCount: 6}`;
`Breadcrumbs` default branch renders character-identical markup; focus ring is visible on the
homepage hero buttons.
*Verification:* `npx tsc --noEmit`; `npm run lint`; tab through homepage hero, confirm white ring.
*Dependencies:* None. *Files:* `src/lib/content/index.ts`, `src/components/ui/Breadcrumbs.tsx`, `src/components/ui/Button.tsx`. *Scope:* S

**Task 2 — Extract `StatRow`, rewire `StatBand`**
*Acceptance:* homepage stat band DOM is byte-identical to before (keep `text-h1` on the `<dt>`
for the homepage variant — the hero variant uses `text-h2`); `StatRow tone="light"` renders
white-on-dark; the hardcoded `6` is gone.
*Verification:* screenshot-diff the homepage band before/after; `npm run build`.
*Dependencies:* Task 1. *Files:* `src/components/marketing/StatRow.tsx` (new), `src/components/home/StatBand.tsx`. *Scope:* S

> **Checkpoint A** — `npm run lint`, `npx tsc --noEmit`, `npm run build` all clean; homepage
> visually unchanged. Nothing user-visible has moved yet.

### Phase 1: `/podcast/episodes` end-to-end

**Task 3 — `DarkHero` + `SiteHeader` route regex**
Build `DarkHero` and land it on the archive first — the simplest consumer (no aside, no footer).
*Acceptance:* archive opens on the dark gradient hero; nav/logo render light on `/podcast/episodes`
**and** `/podcast/episodes/page/2`, and still dark on `/podcast/hosts` and an episode detail page.
*Verification:* visit all five routes; `npx tsc --noEmit`.
*Dependencies:* Task 1. *Files:* `src/components/marketing/DarkHero.tsx` (new), `src/components/layout/SiteHeader.tsx`, `src/components/content/EpisodesArchive.tsx`. *Scope:* M

**Task 4 — `EpisodeRow` + `EpisodeList`, swap the grid, set page size to 20**
Add the visible `h2` "All episodes" + scope readout where the reference put its dead filter.
*Acceptance:* archive renders a dense `<ol>`; one tab stop per row with the title as accessible
name; 4 pages of 20; `scrollWidth === clientWidth` at 320/375/768/1280; no `Badge` imported.
*Verification:* `npm run build` (SSG surfaces any `page/[page]` param drift); keyboard pass; the
overflow assertion in Chrome.
*Dependencies:* Task 3. *Files:* `src/components/content/EpisodeRow.tsx` (new), `EpisodeList.tsx` (new), `EpisodesArchive.tsx`. *Scope:* M

> **Checkpoint B** — archive is done end-to-end. Build clean, no horizontal overflow, keyboard
> nav sane, pagination links real. **Review with the user before starting Phase 2.**

### Phase 2: `/podcast` end-to-end

**Task 5 — `FeaturedEpisodeCard`**
*Acceptance:* renders newest episode with number shown exactly once; eyebrow switches to
"Featured conversation" if `getFeaturedEpisode()` isn't the newest; single interactive element;
no player embedded.
*Verification:* temporarily set `featured: true` on an older MDX file, confirm the eyebrow flips, revert.
*Dependencies:* Task 3. *Files:* `src/components/podcast/FeaturedEpisodeCard.tsx` (new). *Scope:* S

**Task 6 — Rewrite `/podcast`**
`DarkHero size="full"` with `aside={<FeaturedEpisodeCard/>}` and `footer={<StatRow tone="light"/>}`
→ `EpisodeTicker` → existing three `IconCard`s → "Latest conversations" as a 6-row `EpisodeList`
(replacing the 3-up grid) → hosts → `CTASection`.
*Acceptance:* H1 is verbatim the sanctioned string; no cadence/audience-size claim; no `/analyze`
link; closing CTA is "Contribute as a Speaker"; ticker appears here and **not** on the archive;
hero doesn't push the ticker below the fold at 1280×640.
*Verification:* grep the diff for `weekly|Learn More|Get Started|Join Now|/analyze`; `npm run build`.
*Dependencies:* Tasks 2, 4, 5. *Files:* `src/app/podcast/page.tsx`. *Scope:* S

> **Checkpoint C** — both pages done. Lint, typecheck, build clean.

### Phase 3: Verification pass (closes the old todo item, podcast-scoped)

**Task 7 — Browser pass on `/podcast` + `/podcast/episodes`**
Via Chrome automation: 320/375/768/1280 screenshots; `scrollWidth === clientWidth` assertion;
full keyboard traversal with visible focus on the dark hero; `prefers-reduced-motion: reduce`
confirming the marquee pauses and stats render statically; accessibility-tree check of heading
order and that each row exposes one link named by its title; contrast spot-check of
`text-white/45` and `/70` against the scrimmed gradient.
*Acceptance:* all of the above pass; findings that don't are logged, not silently fixed.
*Verification:* is itself the verification. *Dependencies:* Task 6. *Scope:* S

### Phase 4 (optional, human-in-the-loop): backfill `guests`

Recommended but **deliberately not a dependency** — rows fall back to `excerpt`, so slipping this
costs nothing. `docs/messaging-strategy.md` §7 calls guest names *"the single strongest
speaker-attraction asset available"*, and 75 rows each reading "With <name>" is a public
contributor roster — precisely the `/speak` conversion argument.

Two-pass dev script `scripts/backfill/guests.ts`, **never auto-writes**: pass 1 reads each MDX
`sourceUrl`, recomputes the cache key exactly as `scripts/scrape/util.ts:21` does
(`sha1(sourceUrl).slice(0,16)`), extracts candidates from the cached HTML and MDX body prose via
layered regexes (the dominant pattern being `Join <host> and <Guest Name>, <title> at <org>`),
filters out the six host names from `hosts.json`, and emits
`scripts/backfill/guests.proposed.tsv` with slug / candidates / confidence / source sentence.
A human edits and approves the TSV; pass 2 rewrites **only** frontmatter via `gray-matter`
stringify, preserving body bytes. Zod already accepts `guests`, so no schema or UI change —
rows light up automatically. Budget ~1–2 hours of review.

Human review is non-negotiable: these are real named professionals and the site's only
named-person claims. A regex attributing the wrong name is a reputational error, not a data error.

**`durationSec` and `tags`: skip.** Duration exists nowhere in the scraped HTML (Libsyn renders it
client-side); the only routes are `ffprobe` over 75 MP3s or a bitrate estimate, and a wrong
duration is worse than none. `formatDuration` is already wired behind a null check, so a future
pass needs zero code changes. Leaving `tags` empty is what keeps the "no fake filter" rule honest.

## Risks

| Risk | Impact | Mitigation |
|---|---|---|
| `SiteHeader` route matching missed or over-broadened | **High** — ink-on-ink nav, or white nav on light pages | Regex list, not `startsWith`; verify all five podcast routes (Task 3 acceptance) |
| `StatBand` refactor regresses the homepage | Med | Homepage variant keeps `text-h1`; screenshot-diff at Checkpoint A |
| `Button` cva change hits every button site-wide | Low | Appends only `focus-visible:outline-*`; cva variants are appended after base so tailwind-merge resolves in the variant's favour |
| Two dark heroes back-to-back feel templated | Med | `/podcast` uses `size="full"`, archive uses `size="band"`; different H1s; ticker on only one |
| LCP regression from hero image + 20 thumbnails | Med | `priority` only on the featured card and 2–3 leading rows; explicit `sizes="(max-width:640px) 80px, 112px"`; fixed-width `aspect-video` column so no CLS |
| `StatRow` `divide-x` leaves a stray left border on wrapped rows at `grid-cols-2` | Low | `first:pl-0` + `[&>*:nth-child(2n+1)]:border-l-0 lg:[&>*:nth-child(2n+1)]:border-l`; verify at 375px |
| Archive goes dark → white → dark too fast on page 4 (15 rows) | Low | Keep a white section of real height before `CTASection` |

## Verification (end to end)

```bash
cd "/home/dakkshin/Obsidian Vaults/Ekwa Work/OBA/oba-website"
npm run lint
npx tsc --noEmit
npm run build      # SSG; surfaces page/[page] param drift and MDX schema failures
npm run dev        # then drive the checks below in Chrome
```

Manual, on `/podcast` and `/podcast/episodes` (and `/podcast/episodes/page/2`):
1. `document.documentElement.scrollWidth === document.documentElement.clientWidth` at 320/375/768/1280.
2. Tab from skip link → breadcrumbs → CTAs → featured card → first rows; visible ring at every stop.
3. Accessibility tree: heading order per §Accessibility; one link per row, named by the episode title.
4. Emulate `prefers-reduced-motion: reduce`: marquee paused, stats static, no fade-up shimmer.
5. Regression sweep: homepage stat band unchanged; `/podcast/hosts` and an episode detail page
   still render the light hero with dark nav.
6. Copy sweep of the diff: no `weekly`, `Learn More`, `Get Started`, `Join Now`, `/analyze`.

## Open questions

- None blocking. The `EPISODES_PER_PAGE` 12 → 20 change is safe **because the site is not
  deployed** (no workflows, no export config); if that changes before this lands, add a redirect
  for `/podcast/episodes/page/(5|6|7)` → `/podcast/episodes`.
- Out of scope but worth flagging: `home/HeroSection.tsx` copy is stale against
  `docs/messaging-strategy.md` §1.2 ("Personalized business education" is a claim the doc says
  to kill). Not touched here.
