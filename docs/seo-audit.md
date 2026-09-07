# SEO audit — obacademy.org

**Audited: 2026-09-07.** Rewritten from scratch against the current codebase; the previous audit
(2026-08-25) predated the AI-SEO layer, the speakers page and a wave of route removals, and roughly a
third of its citations pointed at files that no longer exist.

**Method:** this site is fully statically generated, so every meta tag and JSON-LD blob is in the
prerendered HTML. Ground truth is `.next/server/app/**/*.{html,body}` after `npm run build` —
**not** the live domain, which serves a different build entirely (F-01).

IDs: `F-` technical/crawl · `P-` on-page · `S-` structured data · `C-` content.

---

## Executive summary

The technical and structured-data layers are strong and, after this pass, close to complete. Two
things gate real-world performance, and neither is a markup problem:

1. **F-01 — the site is not deployed.** `www.obacademy.org` still serves a stale GitHub Pages build
   whose canonical tags, sitemap, robots and Organization JSON-LD all point at
   `marketing254.github.io/Ophthalmology`. None of the work in this repo is visible to any crawler.
   Everything below is theoretical until this ships.
2. **C-01 / C-02 — the site is thin and it is old.** ~26,000 words of body copy across 83 pages,
   a median episode page of 254 words, and nothing published since **2024-06-07**.

The highest-value SEO action available is not a tag. It is publishing transcripts for 75 episodes
that already have the rendering, schema and retrieval plumbing waiting for them (see `docs/ai-seo.md`).

**Scale:** 110 static HTML pages — 17 static routes, 75 episodes, 8 posts, 7 events, 3 paginated
archives — plus 109 sitemap URLs and ~180 machine-readable alternates.

---

## 1. Technical

**F-01 — Live site is a stale GitHub Pages build. CRITICAL · Priority 1 · EXTERNAL, BLOCKING.**
Canonical, sitemap, robots and Organization JSON-LD on the live domain all reference
`marketing254.github.io/Ophthalmology`, and its route structure does not match this repo (`/msm/`,
`/speak/`, `/podcast/episodes/` all 404). *Fix:* deploy this build to `www.obacademy.org`.
**Unchanged since the last audit. Nothing else in this document matters until it ships.**

**Ownership: handed off.** This team has no domain or hosting access. The receiving party needs
`docs/deployment.md`, which covers the host requirements, the silent static-host failure mode, and a
post-deploy verification checklist.

**F-02 — Redirects and headers depend on the host. HIGH · Priority 1 · Fixed (documented).**
`next.config.ts` carries 28 permanent redirects preserving every indexed legacy WordPress URL, plus
the security headers. Both `redirects()` and `headers()` are **dropped on a pure static host**. The
config previously warned about `headers()` only — the redirects are the more damaging half, and on a
static host all 28 legacy URLs become 404s while ~180 `/okf` and `/md` mirrors lose their
`X-Robots-Tag: noindex` and turn into indexable duplicates. Target is Vercel; `vercel.json` added and
the risk is now documented in `next.config.ts`. *Verify on the preview deploy before promoting.*

**F-03 — robots.txt. OK (improved).** No disallows, 17 named AI crawlers, sitemap and host declared.
`Applebot` was missing — only `Applebot-Extended` was listed, which is the AI opt-in token rather
than the crawler that fetches pages. Added. Note: the previous audit claimed a `Disallow: /styleguide`
exists; it does not, and never did — `/styleguide` relies on `noindex`, which is sufficient.

**F-04 — Sitemap. OK (improved).** 109 URLs. `lastModified` is emitted only where a truthful value
exists, which is correct and must stay that way — Google discounts lastmod site-wide once it detects
invented dates. Added this pass: truthful `lastModified` on the 7 event pages (from `startDate`), and
`/llms.txt` + `/llms-full.txt`, which are indexable text documents that nothing previously linked.
`/okf/*` and the `/md` mirrors stay out by design — they carry `noindex` and are alternate
representations of pages already listed.

**F-05 — Canonicalisation. OK.** All 110 pages carry a self-referential canonical. Paginated pages
are self-canonical, which matches current Google guidance. `not-found.tsx` deliberately hand-rolls its
metadata to emit **no** canonical — correct, and the reason `pageMetadata()` is not widened to
express it.

**F-06 — Indexability. OK.** `/styleguide` is `noindex, follow`. The OKF bundle and all Markdown
mirrors carry `X-Robots-Tag: noindex` (contingent on F-02).

**F-07 — HTTPS / HSTS. INFO.** HSTS is present but commented out in `next.config.ts` pending final
domain confirmation. Enable at deploy.

**F-08 — Performance posture. OK.** Fully SSG, no client data fetching. All 19 `next/image` call
sites use `fill` + `sizes` or explicit `width`/`height`, so there is no CLS risk from missing
intrinsic size.

**F-09 — hreflang. INFO.** Single-locale site; none needed.

**F-10 — Analytics and Search Console. LOW · Priority 3 · Partly external.** GA4 (`G-6GDGK5QGS4`)
ships. Search Console and Bing verification are still **not done** — tokens land via
`NEXT_PUBLIC_GSC_TOKEN` / `NEXT_PUBLIC_BING_TOKEN` (`src/app/layout.tsx`). Requires the deploy first.

**F-11 — Podcast feed. LOW · Fixed in code, blocked on data.** `/feed.xml` now emits
`<enclosure length>` where the byte size has been measured off the real MP3 by the publish pipeline,
plus `itunes:episodeType`, per-episode `itunes:image`, `copyright`, `generator` and an RSS-native
`<image>`. **Submission to Apple/Spotify still needs `durationSec` and `audioBytes` backfilled across
the catalogue** — 0 of 75 episodes carry either today. A wrong length is worse than none, so both are
written only from a measured value, never guessed.

**F-12 — RSS was advertised nowhere. HIGH · Fixed.** `<link rel="alternate" type="application/rss+xml">`
was declared in the root layout but appeared on **0 of 110 built pages**: `pageMetadata()` sets
`alternates: { canonical }` and Next replaces `alternates` wholesale rather than merging `types`.
Fixed at the source; now on all 108 real pages.

---

## 2. On-page

**P-01 / P-02 — Title lengths. MEDIUM · Priority 3 · RECOMMENDATION ONLY (copy freeze).**
As rendered (including the ` · OB Academy` template, which adds 14 characters): **42 of 75 episode
titles**, **6 of 8 post titles** and **7 of 7 event titles** exceed 60 characters. Longest is 101
(`/resources/events/building-a-trusted-counseling-system-without-turning-education-into-a-sales-conversation`).
*Root cause:* there is no `seoTitle` field in `episodeSchema` or `blogPostSchema`, so a SERP title
cannot be shortened independently of the on-page H1. **Recommended fix is to add that field**, then
author values — the field is a code change, the values are copy.

**P-03 — Description lengths. MEDIUM · Priority 3 · CLIENT-REJECTED, settled.**
Over-160-character descriptions on the homepage (195), `/msm` (192), `/speak` (184) and two episodes
were raised previously and the client chose to keep the copy. **Recorded as an accepted tradeoff; do
not re-raise.**

**P-04 — Homepage H1 and primary CTA. MEDIUM · Priority 2 · CLIENT-REJECTED, settled.**
The `docs/messaging-strategy.md` H1 and the "Contribute as a Speaker" primary CTA were declined in
favour of the existing copy. **Accepted tradeoff; do not re-raise.**

**P-05 — Descriptions are unauthored at scale. HIGH · RECOMMENDATION ONLY.**
**1 of 75 episodes** and **0 of 8 posts** set `seoDescription`. Everything else is machine-derived by
`metaDescription()` from a scraped WordPress teaser or the first body sentence. Consequences: 18
episode descriptions exceed 160 characters (max 197), and three are under 70 and meaningless — the
worst is 52 characters: *"Dr. Melendez is such a cool and enthusiastic person!"*. Separately, the
event description template restates an already-long title
(`resources/events/[slug]/page.tsx`), which is why 6 of 7 panels break 160 with a maximum of 208.
Zero duplicate descriptions across 110 pages, which is genuinely good.

**P-06 — Image alt text. MEDIUM · RECOMMENDATION ONLY.**
**16 of 19 `<Image>` call sites use `alt=""`**, including host and speaker portraits, event artwork,
free-resource covers and the site logo. Defensible for card thumbnails whose adjacent link text names
the item; not for portraits, and it means zero image-search surface for the resource library. Most are
one-line fixes sourcing an existing data field (`alt={host.name}`), so this is cheap whenever the
freeze lifts.

**P-07 — Internal linking. INFO.** Sound. One avoidable pattern: four episode bodies contain
**absolute self-referential legacy URLs** (`/register/`, `/msm/ryan/`, `/podcast-show/`) that 301
rather than 404 — an unnecessary hop on every render. Episode bodies are explicitly out of scope per
`docs/messaging-strategy.md` §5.6.

**P-08 — Pagination. OK (improved).** Distinct titles and genuine range descriptions per page,
self-canonical, included in the sitemap with truthful `lastModified`. Fixed this pass: pages 2–4 were
emitting page 1's `BreadcrumbList` verbatim, so every paginated page claimed to *be* the archive root.
`rel="prev"`/`rel="next"` remain absent — deprecated by Google, still read by Bing; low priority.

---

## 3. Structured data

**S-01 — Core coverage. OK.** Organization + WebSite emitted globally with stable `@id`s;
`BlogPosting`, `PodcastEpisode`, `Event`, `FAQPage`, `BreadcrumbList`, `PodcastSeries` and
`ItemList` all present on the right routes.

**S-02 — Organization `sameAs`. OK.** Real socials; placeholders removed previously.

**S-03 — Episode people and topics. HIGH · Guests done, tags deferred.**
Guests are now populated on **62 of 75** episodes (59 distinct names, 65 headshots on disk). Fixed
this pass: those guests were bare `actor` strings with no `@id`, so one person credited on four
episodes was four anonymous mentions rather than one entity. `/podcast/speakers` now emits an
`ItemList` of 59 `Person` nodes with stable ids, and each episode's `actor` entries reference the same
id. **Per-episode `tags` remain omitted — 0 of 83 files** — deferred for lack of a verifiable source,
which leaves six render branches permanently dead. Transcripts would supply that source, but tags are
authored classification that renders as visible chips, so it needs sign-off. Also still absent:
`durationSec` on 0 of 75, so schema.org `duration` never renders.

**S-04 — Events. OK.** Full `Event` nodes with `VirtualLocation`, conditional `Offer` only where a
registration URL exists. Fixed this pass: event pages sent `og:type=website`, so the start date never
reached Open Graph; they now send `article` with `publishedTime`.

**S-05 — Page-level nodes. MEDIUM · Fixed.** Added `WebPage` to `/privacy` and `/terms` (the only
indexable content pages with no page node) and `CollectionPage` to `/resources`, `/blog` and
`/resources/free-resources` — the last two had an `ItemList` with no page node to hang it on.
`/resources` is the content hub and previously described none of the directory it renders.

**S-06 — BlogPosting authorship. MEDIUM · Fixed.** `author` was hardcoded
`{"@type": "Organization"}` regardless of the value, so a named byline would have been typed as an
organisation. It now follows the value, and a `publisher` link to `ORG_ID` was added along with
`keywords` when tags exist.

**S-07 — PodcastEpisode completeness. LOW · Fixed.** Added `image` (present in the schema and
rendered on-page but absent from the JSON-LD) and a `transcript` `MediaObject` pointing at the new
`transcript.md` route.

**S-08 — `WebSite.potentialAction` / SearchAction. CORRECT AS-IS.** Deliberately not emitted: there
is no site search, and declaring one would be a false capability claim. Documented in `jsonld.ts`.
**Do not "fix" this.**

**S-09 — Unused FAQ data. LOW · RECOMMENDATION ONLY.** `PODCAST_FAQS` (`src/content/faqs.ts`) and
`membershipFaqs` (`src/lib/faq-data.ts`) are defined and consumed by nothing — a ready-made `FAQPage`
for `/podcast/episodes`. Wiring it renders a visible accordion, so it is a UI change and out of scope
under the freeze.

---

## 4. Content

**C-01 — Freshness. MEDIUM · Priority 4 · NOT FIXABLE BY CODE.** Nothing published since
**2024-06-07**; 7 of 8 blog posts are from 2022. Needs real new episodes or posts. Must never be
papered over — `notesForAiSystems()` states the cadence honestly, and no cadence claim is permitted
anywhere per `docs/messaging-strategy.md` §7.

**C-02 — Thin pages. MEDIUM · The central finding.** Median episode body **254 words**; **42 of 75
under 300**; all 8 blog posts 282–391 words. Total site corpus ~26,000 words. Meanwhile ~44 hours of
recorded expert conversation sits untranscribed. **Publishing transcripts is the single highest-value
SEO and AI-SEO action available**, and the full pipeline — schema, loader, server-rendered panel,
Markdown mirror, JSON-LD, sheet ingestion — now exists and is idle. See `docs/ai-seo.md`.

**C-03 — Honest empty states. OK.** Six of seven events carry only title and date and render the
short page that supports; nothing is invented to fill a gap. Correct behaviour, keep it.

**C-04 — Dead `sourceUrl` frontmatter. LOW · Priority 4 · DELIBERATELY NOT DONE.** 83 files carry a
`sourceUrl` pointing at dead `obacademy.org/podcast-show/…` URLs. Read by nothing; the 301 map covers
the old URLs. Left to avoid churn across 83 files.

**C-05 — Orphaned content plumbing. INFO.** `reviews.json` (4 placeholders), `reviewSchema`,
`getAllReviews()` and `ReviewWall.tsx` have no call sites — kept intentionally so `/reviews` can
return whole once real attributed reviews exist. `libsynId` and `authorSlug` are declared and unread.

---

## 5. Prioritised action plan

| # | ID | Action | Owner |
|---|---|---|---|
| 1 | F-01 | **Deploy to a host that honours `redirects()` + `headers()`**, then run the `docs/deployment.md` §4 checks. | Handed off |
| 2 | C-02 | Publish transcripts via the episode sheet — **deferred**; 10–15 high-intent episodes first, not all 75. | Content, later |
| 3 | F-10 | GSC + Bing verification and sitemap submission, post-deploy. | External |
| 4 | F-11 | Backfill `durationSec` + `audioBytes` so the podcast feed becomes submittable. | Pipeline |
| 5 | P-05 / P-01 | Add `seoTitle` / author `seoDescription` values. | Copy — needs freeze lifted |
| 6 | S-03 | Decide on per-episode `tags`, now that transcripts can source them. | Needs sign-off |
| 7 | P-06 | Real `alt` text on portraits, event and resource imagery. | Needs freeze lifted |
| 8 | C-01 | Resume publishing. | Content |

---

## 6. Remediation log — 2026-09-07

**Done in this repo:** F-02 (documented + `vercel.json`), F-03 (`Applebot`), F-04 (event
`lastModified`, `llms.txt` in sitemap), F-11 (feed completeness + measured `enclosure length`), F-12
(RSS alternate on all pages), P-08 (paginated breadcrumbs), S-03 (guest entity graph, 59 `Person`
nodes), S-04 (event `og:type`), S-05 (missing page nodes ×5), S-06 (BlogPosting author + publisher),
S-07 (episode `image` + `transcript`). Plus the agent-layer fixes recorded in `docs/ai-seo.md`.

**External / blocked:** F-01 (deploy), F-10 (Search Console), F-11 backfill (needs sheet data).

**Intentionally not done:** P-03 and P-04 (client-rejected, settled — do not re-raise), C-01 (not
fabricatable), C-04 (churn), S-03 tags (no verifiable source, needs sign-off), S-08 (correct as-is),
S-09 and P-06 and P-05 (copy/UI freeze — recommendations only), free-resource detail pages (new UI).
