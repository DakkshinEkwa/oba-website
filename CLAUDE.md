# CLAUDE.md

> **Start with [`HANDOVER.md`](HANDOVER.md).** It carries the current state of the project, what is
> safe to change, what will bite you, and who owns the open items. This file covers conventions;
> `HANDOVER.md` covers where things actually stand.

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

# Sheet sync: new episodes AND transcripts for already-published ones.
EPISODE_SHEET_CSV_URL="<csv export url>" npm run publish:episodes
```

`scripts/generate-landmask.ts` is the same kind of one-off tool: it rasterizes Natural Earth
1:50m land polygons into `src/components/home/landmask.ts` (a committed 512×256 packed 1-bit
mask, ~21KB base64) that `HeroGlobe` samples to place its particles over continents. Re-run only
to change resolution or source data. Its `world-atlas` / `topojson-client` deps are dev-only.

```bash
npx tsx scripts/generate-landmask.ts
```

`scripts/generate-brand-icons.ts` is likewise one-off: it derives every square brand raster from
the committed logo — the app icons (`src/app/icon.png`, `apple-icon.png`), the manifest icons,
`oba-logo-square.png` (Organization JSON-LD), and `podcast-artwork.png` (the feed's
`itunes:image`). The logo is a 3.59:1 lockup, so anything square uses the **eye glyph alone**; only
`oba-logo-square.png` keeps the full lockup. The script locates the glyph by finding the alpha
gutter at runtime and throws if it moves, so a logo swap fails loudly rather than cropping wrong.

**Ground: the white mark on the hero gradient**, the same tile the OG cards use — `heroGradientSvg()`
reproduces `--gradient-hero` as an SVG (the CSS ellipse becomes an SVG circle scaled about its
centre), so the icons stand on the ground the CSS paints. Sources follow from that: glyph crops read
`oba-logo-white.png`, and the glyph box is derived from that same file so the gutter assertion guards
the artwork actually being cropped. The one exception is `oba-logo-square.png` — the full colour
lockup on white, because Google renders `Organization.logo` on light knowledge-panel cards.
sharp has no ICO encoder, so `src/app/favicon.ico` is packed separately from the `.icon-src/` PNGs
(16/32/48 only — ImageMagick writes ICO entries as raw BMP, and a 256px entry costs 270KB for a
size no browser reads).

**The favicon is the one icon not cropped from the logo.** The glyph is four concentric bands —
ring 262→312, ring 165→212, iris r114, at a ~50px stroke on a 778px glyph — so at 16–48px each
band lands on ~1px and they fill in; `brand-guidelines.md` ch.8 says the same thing from the other
side ("minimum on screen 1250 px wide"). `MARK` in the script is a purpose-drawn small-size
version: every figure was *measured* off `oba-logo-white.png` (eye centre, both ring bands, the
iris, the two circular edges the lash sweep runs between, and the pupil being a circle internally
tangent to the iris — hence a notch that opens outward, not a hole), and the reduction is three
moves only — drop the inner ring, open the remaining stroke 50→72, grow the iris 114→176. Nothing
is re-typeset and no curve is invented, which is what keeps it inside ch.8's "use the file" rule.
The **pupil is dropped at 16px** because the notch there eats enough of the iris that the disc
reads as a "C"; 32 and 48 keep it, and Next declares the `.ico` as `sizes="48x48"`, so that is the
entry most browsers actually pick. Everything larger — `icon.png`, `apple-icon.png`, the manifest
icons, `podcast-artwork.png` — still carries the **full four-band glyph**, which is legible at
those sizes; do not "unify" them onto the simplified mark without deciding that as a brand change.
The script also writes `scripts/assets/oba-eye-mark.svg` from those same constants — the mark's
first vector original, since `brand-guidelines.md` records that none exists. It is a build input
and is deliberately **not served**, so it cannot be mistaken for the logo.

The favicon tile is the **only** icon with rounded corners (`MARK_RADIUS`, 1/8 — whole pixels at
all three ICO sizes: 16→2, 32→4, 48→6; a fractional radius at 16px spends its entire corner on
antialiasing and reads as grime). It is therefore also the only icon that **keeps its alpha
channel** — the corners must be transparent because the tile sits on browser chrome whose colour
is unknown. Everything else stays square and opaque, each for its own reason: iOS masks
`apple-icon.png` into its own ~22% superellipse and would clip a pre-rounded tile twice, Android
crops the maskable manifest icon, and `podcast-artwork.png` / `oba-logo-square.png` are read as
flat artwork by the podcast directories and Google.

```bash
npx tsx scripts/generate-brand-icons.ts
magick public/images/.icon-src/{16,32,48}.png src/app/favicon.ico
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
Podcast · Marketing · Ask AI · Participate · About · Contact.

**Component layers** (`src/components/`): `ui/` design-system primitives → `layout/`
(SiteHeader/SiteFooter/MobileNav/Logo) → `marketing/` (Hero, CTASection, PageHero, DarkHero) →
`content/` (EpisodeCard, BlogCard, EventCard, FeaturedEventCard, LibsynPlayer, Markdown) →
`forms/` → `home/` (homepage sections, split out of `src/app/page.tsx`). Podcast audio plays via
the direct Libsyn MP3 URL through the lazy custom `LibsynPlayer`.

**WebGL:** `home/HeroGlobe.tsx` is the site's only WebGL surface — a `three` globe sitting whole
in the gap to the right of the homepage hero copy (`GLOBE_BOX`; it used to bleed off the
bottom-right corner). It is loaded through `home/HeroGlobeMount.tsx`
(`next/dynamic`, `ssr: false`) so `three` stays out of the server bundle, renders only at `xl`
and up — below that the copy column leaves no room beside it — pauses its rAF loop offscreen, and freezes under `prefers-reduced-motion`. Camera
flights reuse framer-motion's `animate()` — do not add GSAP, and do not add OrbitControls.

It is a **hollow dot shell** — deliberately no solid body, so the far hemisphere shows through.
Nothing writes depth (`depthTest: false` everywhere); instead each layer fades itself out as it
turns away, via `vFacing` (the view-space normal's z). That fade *is* the depth cue — don't
remove it without adding an occluder back. Three layers, over one shared view-space light:
2,800 points blanketing the whole sphere, 14 `QuadraticBezierCurve3` arcs, and the pulsing rings
on the five people pins. The arcs' own endpoint markers were removed — arcs simply fade out at
their ends.

`landmask.ts` does not filter the points — every point is drawn, and the mask only sets a
per-point `aLand` flag. Every dot is the same white (`PARTICLE_COLOR`); the flag only raises
opacity and size, so continents surface out of an even lattice while ocean dots stay a faint grid
at `OCEAN_ALPHA`. The globe is fully monochrome: the people pins pulse in the same
`PIN_COLOR` white as the dot shell, so no saturated color appears anywhere on it. Arcs still start
and end on land points only.

Two constraints worth knowing before editing: arcs are `TubeGeometry`, not lines, because
`gl.lineWidth` is clamped to 1px on every browser; and blending is `NormalBlending`, not
additive, because additive saturates against the bright `--gradient-hero-glow` behind the globe.
Five people are pinned at real coordinates (`PEOPLE`). Each frame the loop picks the front-most
pin that is also inside the visible slice of the canvas and positions a circular portrait at its
projected 3D point. Three gotchas are load-bearing there: the avatar needs `max-w-none`, because
the global `img { max-width: 100% }` resolves against the zero-width positioning anchor and
clamps it to 0; the active-index tracker must be a local inside the effect, not a ref, or it
survives effect re-runs while the DOM resets and no portrait ever shows; and the visibility test
is loose with the result clamped, since exact margins let each pin qualify for only ~2s per
87s rotation. The globe has no controls, so the names are carried in an `sr-only` list.

**Panel pages (`/resources/events/[slug]`) are a content-driven template.** One route renders
every entry in `events.json` at whatever depth its content supports: each section is switched on
by its own field and renders nothing when that field is empty, so a bare `slug`/`title`/
`startDate` entry gets the short honest page it always had, while a fully described event gets a
registration landing page. Adding or upgrading a panel is editing JSON — never a code change per
event. The optional "landing-page layer" in `eventSchema` is `startDateTime`, `startTime`,
`format`, `lede`, `aboutTitle`, `about[]`, `topics[]`, `audience[]`, `panelists[]` and
`registrationNote`. **Nothing is invented to fill a gap** — an event with no announced panelists
shows no panelist section rather than a placeholder, which is the same rule the rest of the site
follows.

`registrationUrl` is always an **outbound link** and this page never posts a form: signups live
on the registration host (`reg.obacademy.org`), which owns the list, so repointing an event is
one JSON field. `FeaturedEventCard` deliberately links to the panel page and *not* straight to
`registrationUrl` — the panel page is the landing page, and it carries the register link itself.
A panel whose start instant is behind the build drops both register CTAs (`isPast`, computed
from the module-level `BUILT_AT_MS`, because a render must stay pure).

`EventCountdown` is the site's only clock. It is a
`useSyncExternalStore` subscription to one shared 1s interval: `getServerSnapshot` returns 0, so
the static HTML and the first client paint both render em-dash placeholders and the real figures
arrive after hydration — a countdown computed at build time would be wrong the moment the page
was cached. **The per-second tick is not an exception to the no-motion rule** — it is the value
changing, which is why `prefers-reduced-motion` is deliberately not consulted here (the
alternative is a clock that lies). The digit grid is `aria-hidden` with one `sr-only` sentence
beside it; a live region on a per-second clock would make the page unusable. Past the start
instant it renders a line, not a row of zeroes, and it does so live.

**Both content sections speak the homepage's design language, not their own.** The topics band is
`ProblemAreas`' pattern — hairlines drawn in the grid (`divide-y divide-line border-y border-line`)
rather than on cards, bracketed mono counters (`[1]`), and a centred two-tone `SectionHeader`, the
way every homepage content band is set. It runs two columns where the homepage runs four, because
these topics are ~40 words against its ~15 and four would set them at a 28-character measure. The
cell padding is `odd:pl-0 / even:pr-0`, not `first:/last:` — the homepage band is a single row of
four, this one wraps to 2x2, where every odd cell is in column one. The **vertical** rule is drawn
per cell rather than with `divide-x`, which on a wrapped grid gives every cell but the last a right
edge — hanging a hairline off the band's right side at the end of row one. Each column-one cell
that has a neighbour draws it instead: `i % 2 === 0 && i + 1 < topics.length`.

`EventPanelists` is `StatBento`'s light tile — `rounded-2xl`, hairline border, the
`accent-50 → accent-100` gradient — on a `bento-grid`, so the separator hairlines fall in the gaps
instead of on the cards. `bento-cell` only works inside `bento-grid`, whose `overflow: hidden`
clips the half-gap that would otherwise poke past the last row. The content inside is
`SpeakerCard`'s: a square `rounded-xl` portrait beside the name, which is the light-ground people
idiom everywhere on this site (`HostCard` uses the same square) — the 4:5 `--radius-tile` portrait
belongs to the dark episode hero and is a borrowed accent here. A slate version of this tile was
tried and reverted: these sit in a light `Section`, and a dark band of four cards took the page
over.

**The tile ground is what lets these be a grid at all.** Panel bios vary in length by a factor of
two, and an earlier pass laid them out as bare text blocks in a grid: the short ones left holes and
the section read as ragged, which is why it briefly became a divided list. A filled tile turns the
same height-matching into the bento's own rhythm. Don't strip the tile ground and keep the grid.

**The tiles disclose, the way `SpeakerCard` does**: a tile shows the person and expands to the
bio. `headshotFor()` reads the filesystem, so the split is `EventPanelists` (server: resolves each
name to a headshot path) → `EventPanelistGrid` (`"use client"`: the tiles and the open state). The
disclosure is hand-rolled rather than Radix for `SpeakerCard`'s reason — the bio is content and has
to stay in the static HTML whether the tile is open or not, so collapsed content is clipped by a
`0fr` grid row (animatable, unlike `height: auto`) and marked `inert`, which takes it out of the
tab order and the accessibility tree without removing it from the document. The `Plus` that turns
45° is `FaqAccordion`'s. A button's content model is phrasing content, so the heading sits outside
it (`h3 > button`) and the lines inside are spans; a panelist with **no bio** has nothing to
disclose and gets a plain header with the real `h3`/`p` elements, not a dead button.

Open state lives in the grid, not the tile, because opening one tile opens its whole row —
otherwise the bento is left with one tall card beside a short one, which is the raggedness the tile
ground exists to prevent. That needs the column count, which only CSS knows, so the grid classes
and the `(min-width: 640px)` query mirroring them are declared together and must change together;
a breakpoint change closes whatever was open, since a row index means something else at a
different column count. Nothing is open on first paint, so SSR and hydration agree.

The bio sits in its own inset pane rather than loose under a hairline: `rounded-(--radius-md)
border-line bg-canvas`, the site's inset-cell treatment on a light ground (`EventCountdown`'s digit
cells), and white on the tile's pale steel is what makes the disclosed content read as a second
surface inside the card. The pane stretches to the tile's bottom padding — the disclosure wrapper
is `flex-auto` and the pane `flex-1` — because a row opens as one band and its tiles are
height-matched to the longest bio, so without it the shorter card ends in a band of bare steel
below a floating edge. `flex-auto`, not `flex-1`: a basis of 0 would drop the bio out of the tile's
intrinsic height and collapse it to the header. Closed, the `0fr` row takes none of that space and
the bio stays clipped at zero.

Portrait size is deliberate rather than timid, for the reason `HostCard` already documents: the
source headshots were shot against unrelated backgrounds (white studio, office, flat charcoal,
one saturated magenta), so they never read as one set, and **the larger the face, the louder the
background behind it**; `object-top` keeps the crop on the face. Panelists carry no image field —
they resolve by name through the same exact-match `headshotFor()` the episode portraits use, so
dropping `first-last.jpg` into `public/images/headshots/` is the whole of "adding a photo", and a
miss falls through to `SpeakerCard`'s frosted slate monogram, the one fallback that still reads on
a pale tile.

**The hero takes the registration page's parts in this site's materials**, ordered claim-first:
eyebrow → h1 → `EventFactsStrip` (Date / Time / Format / Location as frosted chips) →
`EventCountdown` → lede → `EventHeroPanelists` (face, name, role — the line-up is the offer on a
panel page, so it is not made scroll-bound) → `EventRegisterCard` holding the right half with the
registration form in it. The chips and the clock ride `DarkHero`'s `titleMeta` slot (added for
this: a row between the h1 and the lede), the line-up its `proof` slot. Both are passed `null`
rather than an empty wrapper when the event has nothing to put in them — an element that renders
nothing still gets its slot's `mt-8`.

The chips are an equal-column grid, not a wrapped flex row: the three came to 542px against a
536px copy column, so "Format" dropped to a second line by six pixels, and narrower still below
`lg`. Equal columns hold them in one row at every width, with the value wrapping inside its own
chip and the grid matching heights — which is how the countdown row directly beneath them is set.

**This hero carries no breadcrumbs**, deliberately: the copy column is long and the trail cost it
~200px of vertical space at the top. Nothing else depended on them — this page emits no
`BreadcrumbList` JSON-LD — so removing the row removed the whole feature rather than leaving markup
disagreeing with the page. `DarkHero` gained `titleSize="h2"` for the same reason it gained
`asideAlign="start"`: a wide form aside narrows the copy column, and the display step set this
title at four lines where `text-h2` sets it at two.

`EventRegisterCard` holds the slot the registration page gives its sign-up form, and now carries
the form itself (`forms/EventRegisterForm`): the same nine fields in the same order — first/last
name, email, phone, job title, practice name, the two yes/no selects (text reminder, practice
owner) and the question for the panel — then the submit, the security line and the
Moderated Q&A / Replay included / Practical playbooks tags. **Submission is stubbed like every
other form on this site.** The live page POSTs `{event_key, first_name, last_name, email, phone,
job_title, practice_name, text_reminder, practice_owner, question, source_id}` as `no-cors` JSON to
a Google Apps Script endpoint, so wiring it is that POST plus an `eventKey` on the event; the
payload shape is recorded in the component. `registrationUrl` stays the record of where the list
lives. **Nothing about seats or scarcity is invented** — no ticker, no "limited seats", no emoji;
the reg page's lock and arrow are lucide icons here.

Because the form is the ask, the hero has **no action row** (the "All Panels" button was removed)
and a registerable panel ends after the panelists — **no closing CTA band**. A panel with nowhere
to register still gets the site's standing contributor `CTASection`, which is then the only ask on
the page. **The card is white**, at the bento radius on a `line` hairline, with the light form controls the
rest of the site's forms use, one step down on `canvas-subtle` so the fields read against the white
card, carrying the registration page's own placeholders: a form is the one thing on this page a visitor works in rather than
reads, and a white card lifts it off the gradient instead of asking it to compete — which is what
the registration page does with the same card. The aside runs `asideWidth="wide"` — nine fields do
not fit a 26rem column.

Every one of those pieces is conditional, so the six bare title+date events still render the short
honest page they always had: no chips (the strip needs a second fact to be worth a row), no
line-up, no clock, no card. `EventHeroPanelists` is a two-column grid rather than a wrapped flex
row — names and roles vary in length by a factor of two, and a flex row broke unevenly, one person
on one line and two sharing the next.

**Episode pages (`/podcast/episodes/[slug]`)** are the one part of the site built as brand
artwork rather than site UI, per `brand-guidelines.md`. `EpisodeHero` stands on `PAGEBG`
(the design system's dark *post* ground, not the site's ink-900 marketing ground) under the 18px
`.dot-field`, with the hero lobe held to 35% so the ground and texture stay dominant. The hero's right
column is `EpisodePortraits`, not the episode artwork: 4:5 tiles at radius 18 for whoever is on
the episode (monogram fallback on `TILEBG` for guests, who have no headshots), always laid out as a
**single row**, capped at four and omitted entirely when nobody is credited. The tiles divide the
column rather than wrapping into it, so the hero's aside width scales with the count
(`ASIDE` in `EpisodeHero`: 18/26/30/34rem at lg) — a fixed column is how a "bigger" layout ends up
smaller, since four tiles in 22rem would be 76px each. Both maps must stay full literal class
strings so Tailwind extracts them. Four-up only earns its row at lg and folds to 2x2 below.
Each tile carries the person's **name**, set in Inter — a name is content, not a label, so mono
would be wrong. Hosts use their own `avatar`; guests are free-text names with no image field, so
`headshotFor()` resolves them by name out of `public/images/headshots/` (ch.6: lowercase,
dash-separated, `first-last.jpg`), sharing `nameTokens()` in `src/lib/utils.ts` with the monogram
so a filename and a monogram can never disagree about a name. **Matching is exact on the slug and
must stay that way** — a fuzzy near-miss puts the wrong face on a named person, which is worse
than no face. Drop a correctly-named file in that directory and the tile fills itself; a miss
falls through to the monogram, which is a designed state. Because the tiles name everyone, the hero has **no byline**, and so no dimmed
turn line: the h1 stands as a single claim in white. Do not restore a turn by splitting a title
at render time; if one is wanted, add an authored `subtitle` to the episode frontmatter. Do not add an
`EP n / total` counter: episode numbers run 1–124 across 75 episodes, so a fraction would be an
invented figure. Nothing animates in; the only motion is the playhead and `animate-live-dot`,
which is mounted solely while audio is actually playing. The page carries one CTA
(`<CTASection secondary={null} />`) because episode pages are first-touch content.

**Design system:** all tokens are in `src/app/globals.css` under `@theme` — Qoves-inspired
near-monochrome (white canvas, cool-charcoal ink scale, muted steel accent, hairline borders, no
saturated color). Fonts: Inter, IBM Plex Mono (eyebrow labels). Visual reference at `/styleguide`
(noindex). `cn()` in `src/lib/utils.ts` configures tailwind-merge to recognize the custom
`text-*` type-scale utilities — use it for class merging.

**SEO / metadata:** every page's `metadata` goes through `pageMetadata()` in
`src/lib/og/metadata.ts` (title, description, canonical, OG, Twitter). Structured data helpers
live in `src/lib/jsonld.ts` (breadcrumb, FAQ, event, podcast series, person). OG images are
generated at build time by `opengraph-image.tsx` route files (site root, blog post, episode,
event) using the shared card/render helpers in `src/lib/og/`. Both cards are the white lockup on
`OG_GRADIENT` — `--gradient-hero` transcribed into `src/lib/og/size.ts`, which satori renders
verbatim. `OG_BG` is that gradient's terminal stop and remains the value wherever only a flat colour
is possible (`theme-color`, the manifest, the opaque flatten behind generated rasters). A page that wants its segment's
own card must pass `image: "route"` to `pageMetadata()` — otherwise the site-wide brand card
wins, since Next merges the file-convention image only when `openGraph.images` is absent.
Two pages deliberately sit outside this: `/styleguide` uses `pageMetadata`'s `noindex`, and
`not-found.tsx` hand-rolls its metadata because `pageMetadata` always sets a canonical and a 404
must have none. Icons (`icon.png`, `apple-icon.png`, `favicon.ico`), `manifest.ts` and the
`theme-color` viewport export complete the set; their rasters come from
`scripts/generate-brand-icons.ts`. RSS is `src/app/feed.xml`;
`sitemap.ts`/`robots.ts` are in `src/app/`. Legacy WordPress URLs and live-site aliases
(`/analyze` → `/msm`, `/marketing` → `/msm`, `/guest-speaker` → `/speak`) and the routes
removed since (webinars, newsletter, `/faq`, `/podcast`, `/partnerships`, `/membership`,
`/reviews`) are 301-redirected in `next.config.ts`. Legal pages: `/privacy`, `/terms`.

**The agent layer (`src/lib/agent/`) is the machine-readable half of the site**, and it is generated
from `src/content` the same way the pages are, so it cannot drift from them. Surfaces:
`llms.txt`, `llms-full.txt`, the OKF bundle (`/okf/*`, 94 cross-linked Markdown files), a plain-
Markdown mirror of every episode and post at `<path>/md`, and a full transcript at
`/podcast/episodes/<slug>/transcript.md` for episodes that have one. Everything flows through the
`AgentItem` shape in `src/lib/agent/content.ts`.

**`AgentItem` is a public contract — extend it, never reshape it.** Crawlers cache and diff these
files, so every observable field is a commitment; every field added after v1 is optional for that
reason. Any *new* machine surface must be generated from `AgentItem` rather than hand-maintained.

Two things there are load-bearing and easy to break. `pageMetadata()` must keep restating
`alternates.types`: Next replaces `alternates` wholesale rather than merging it, so the root layout's
RSS link is dropped from any page that sets its own canonical — which is every page, and it silently
shipped that way. And `episodeItems()` / `okfBundle()` are rebuilt once per generated file, so
transcript text and the bundle are memoized; removing that re-serializes the whole catalogue hundreds
of times per build.

**Transcripts are authored by hand in the episode Google Sheet**, never generated locally — WhisperX
was evaluated and dropped. Paste the text into a `transcript` column and run `npm run publish:episodes`;
`scripts/publish/transcript-text.ts` accepts the usual export shapes (`[00:12] Name: text`,
`12:34 Name: text`, or bare `Name: text`) and timestamps are optional throughout. The importer syncs
transcripts **independently of whether the episode already exists**, because all 75 are already
published. `transcriptStatus` defaults to `reviewed`; set `machine` for un-read-through ASR output —
the panel prints the distinction, and these are words attributed to named physicians.
`docs/ai-seo.md` is the living record of this layer; `docs/seo-audit.md` covers classical search.

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
  no-audio states. It is the **episode transport**: the 64-bar waveform *is* the seek control
  (a transparent native `<input type="range">` over the bars supplies drag, arrow keys and
  slider semantics; the bars are pure paint). Bar geometry takes `ui/Waveform.tsx`'s 3px
  bars on a 6px pitch and mirrors them about the centre line, so 160 flexed bars are thinned to
  1-in-4 / 1-in-2 / all by breakpoint, which holds the rendered bar near 3px at every width. The
  tiers address disjoint bar sets so they never depend on CSS emission order.

  **The bars are audio-reactive, and the two channels are deliberately separate:** colour encodes
  position (played/unplayed), height encodes live audio, so the bars can move without the seek
  control losing its meaning. While playing, each bar is its seeded height scaled by the live
  energy in the frequency band it maps to, read from a real `AnalyserNode` (fft 1024, folded into
  32 log-spaced bands, swept 3x across the field). Paused, every bar eases back to the silhouette:
  the track's identity when idle, its voice when playing. This is *within* ch.10, not an exception
  — the rule forbids motion because a permanent pulse lies about state, and these bars are driven
  by the audio actually decoding. `prefers-reduced-motion` drops the reactivity (a JS check — the
  global CSS kill-switch cannot reach a rAF loop) and keeps the playhead, which is position.

  Heights are written straight to the DOM as `scaleY` in the rAF loop: transform only, no layout,
  no React render per frame. React owns `backgroundColor` and re-renders at `timeupdate` (~4Hz);
  it also holds a *constant* `transform` in the style object, which its value-diff therefore never
  rewrites — that constant is what makes the server and first client paint agree. Do not make that
  transform dynamic; it would fight the loop.

  Analysis needs a CORS-clean stream, so the element carries `crossOrigin="anonymous"` (Libsyn
  serves `access-control-allow-origin: *` on both the redirect and the object). If that ever
  stops, the load *errors* rather than going silent, and `onError` remounts a plain element via a
  `key` change — losing the reactive bars, keeping the episode playable. A captured media element
  can never be un-captured, hence the remount. The silhouette is seeded from the episode slug —
  a stable per-episode fingerprint, not amplitude data, and it must never be labelled as audio
  analysis. The field is inert until metadata loads, because `preload="none"` means there is
  genuinely nothing to seek.

## Known stubs (intentional)

- All forms (contact, newsletter, speaker, partnership, marketing analysis, panel registration) are styled UI shells:
  they validate client-side (vanilla React state) and show pending/success states, but submission
  is stubbed with `// TODO`. `ContactForm` variants: `contact` | `analyze` | `speaker` |
  `partnership`. Don't wire backends unless asked.
- Events have a Fall 2026 series in `src/content/events.json` and still keep an empty-state
  fallback. Only the Sept 17 OD-partnerships panel carries the full landing-page layer; the other
  six are title + date, which the template renders honestly as a short page. They are not stubs
  waiting to be filled with invented copy — fill them when the real details exist.
- **Deleted pages — do not re-add:** the webinar archive and replays
  (`/resources/webinars`, and with them the webinar schema/loaders), the newsletter page
  (`/resources/newsletter`), the FAQ page (`/faq`), the podcast hub (`/podcast`),
  `/partnerships` + `/membership`, and the reviews page (`/reviews`).
  All are 301-redirected in `next.config.ts`.
  - `/podcast/episodes` is now the podcast landing page: it carries the `PodcastSeries` JSON-LD
    every episode's `partOfSeries` points at, and the nav's Podcast item points there.
  - Newsletter sign-up lives only in the footer band (`#newsletter`), which every "join the
    newsletter" CTA targets; the general FAQs live only on the homepage (`#faq`,
    `home/Faq.tsx`).
  - **Partner conversion now runs through `/contact`**, which carries the
    `ContactForm variant="partnership"` and `PARTNERSHIP_FAQS` in a `#partnership` section.
    `docs/messaging-strategy.md` still names partner conversion a primary CTA — that path is
    the contact page, not a partnerships page.
  - **Reviews came down because there are no reviews** — the page was nothing but an honest
    empty state, so it was pulled rather than shipped hollow; `/reviews` 301s to `/about`, and
    About is a plain nav link again now that its dropdown has one item. The plumbing is kept and
    unused so it can come back whole: `src/content/reviews.json`, `reviewSchema`,
    `getAllReviews()` and `components/reviews/ReviewWall.tsx`. Restore the route only once
    `reviews.json` holds real, attributed reviews.
  - `PODCAST_FAQS` (`src/content/faqs.ts`) and `membershipFaqs` (`src/lib/faq-data.ts`) are kept
    but unused.

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
most remediation is committed. `docs/ui-audit.md` is **stale** — re-verify before working it.
Two open items:
- **Nav dropdown keyboard access is intentionally deferred** — `SiteHeader` uses the legacy CSS
  hover-only menu (`group-hover`); submenus are not keyboard-reachable and the trigger has no
  `aria-expanded`. Don't "fix" this without confirming it's wanted.
- A browser pass of form screen-reader announcements and audio player states is still pending.
