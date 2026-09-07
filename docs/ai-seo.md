# AI SEO — the agent-facing layer

Living record of everything on this site built to be read by a machine rather than a person:
`llms.txt`, `llms-full.txt`, the OKF bundle, the Markdown mirrors, transcripts, and the JSON-LD
entity graph. Companion to `docs/seo-audit.md`, which covers classical search.

**Last updated: 2026-09-07.**

---

## The one thing that matters most

Retrieval systems cite substance. Before this pass the site's entire editorial corpus was
**~26,000 words**: a median episode page carries **254 words** of body text and **42 of 75 are under
300**. Against that, ~44 hours of recorded expert conversation existed only as audio.

No amount of schema markup makes a 254-word page citable. **Transcripts are the single highest-value
AI-SEO asset this site has**, and every surface below is now built to carry them the moment they
exist.

**Status: 0 of 75, deliberately deferred.** The pipeline is complete and idle by decision — content
comes later, and nothing else has to change when it does. Transcripts are authored by hand in the
episode Google Sheet; see *Publishing a transcript* below. When this restarts, do 10–15 episodes
rather than all 75: sheet entry costs a person's hours, and you want evidence it moves before
committing the rest.

---

## Surfaces

| Surface | Route | Notes |
|---|---|---|
| `llms.txt` | `src/app/llms.txt/route.ts` | Catalogue index. Now advertised from `<head>` on `/` and listed in the sitemap. |
| `llms-full.txt` | `src/app/llms-full.txt/route.ts` | Entity roster. Each item names its own retrievable representations. |
| OKF bundle | `src/app/okf/[[...path]]/route.ts` + `src/lib/agent/okf.ts` | 94 cross-linked Markdown files, `noindex`. |
| Markdown mirrors | `src/app/blog/[slug]/md/`, `src/app/podcast/episodes/[slug]/md/` | 83 files, `noindex`, now declared via `<link rel="alternate" type="text/markdown">`. |
| **Transcript mirrors** | `src/app/podcast/episodes/[slug]/transcript.md/` | **New.** Only generated for episodes that actually have a transcript. |
| AI crawler rules | `src/app/robots.ts` | 17 named agents, no disallows. CCBot deliberately allowed. |
| RSS | `src/app/feed.xml/route.ts` | Now advertised in `<head>` on every page (it previously was not — see below). |
| Structured data | `src/lib/jsonld.ts` | Organization, WebSite, Breadcrumb, FAQ, Event, PodcastSeries, Person, **Speaker**. |
| Footer AI-summary band | `aiSummary` in `src/lib/site.ts` | Human-facing button, not a machine surface. |

Everything is generated from `src/content` through `src/lib/agent/content.ts` (the `AgentItem`
shape), so no surface can drift from the pages. **Any new surface must be generated the same way.**

### `AgentItem` is a public contract

Crawlers cache and diff these files, so every observable field is a de-facto commitment
(Hyrum's Law). **Extend it, never reshape it** — every field added after v1 is optional, and the
type carries a comment saying so.

---

## Changed in this pass (2026-09-07)

### Defects fixed

1. **The RSS `<link rel="alternate">` was emitted on zero of 110 pages.** `layout.tsx` declared it,
   but `pageMetadata()` sets `alternates: { canonical }` and Next replaces `alternates` wholesale
   rather than merging `types` — so every page that used the helper (i.e. all of them) dropped it.
   Fixed at the source in `src/lib/og/metadata.ts`; now present on all 108 real pages (the 404 and
   the error boundary are deliberately excluded). `feed.xml/route.ts`'s comment claiming the layout
   advertised it was simply false.
2. **OKF item documents had every blank line stripped.** `okf.ts`'s `.filter((s) => s !== "")` was
   meant to drop empty *sections* but also deleted the intended blank-line separators, so all 93
   files shipped with frontmatter, heading, people and body run together and no trailing newline.
   Sections are now `string | null` and only `null` is dropped.
3. **OKF `People:` was unparseable.** It comma-joined names that themselves contain commas
   ("Sarah Duval, COE, COA"). Now a Markdown list under a `## People` heading.
4. **The 83 `/md` mirrors were undiscoverable.** Nothing linked an individual one — `llms.txt` only
   described the pattern in prose, while the route files' own comments claimed "Linked from
   llms.txt". Every episode and blog page now declares its mirror as
   `<link rel="alternate" type="text/markdown">`, and `llms-full.txt` links each one.
5. **`/llms.txt` was advertised nowhere at all** — not in `<head>`, `robots.txt`, the sitemap, or
   the footer, so the entire agent layer hung off a filename a crawler had to guess. Now linked
   from `<head>` on the homepage and listed in the sitemap alongside `llms-full.txt`.
6. **All three free resources shared one URL** (`/resources/free-resources`), so `llms.txt` printed
   three titles pointing at the same address and three OKF `Dataset` files carried an identical
   `resource:`. They now carry a unique fragment plus the real `pdfUrl`. They still have no detail
   pages — that was a deliberate scope decision, not an oversight.
7. **Panels dropped their own content.** `panelItems()` hardcoded `people: []` and `tags: []`, so
   the one fully-described event's four panelists and its topic list never reached any surface, and
   all seven panels carried only a templated sentence. Now they carry real panelists, topics and an
   assembled body — the six sparse events still get the honest one-liner rather than invented copy.
8. **`Applebot` was missing from `robots.ts`.** Only `Applebot-Extended` was listed, which is the AI
   opt-in token, not the crawler that actually fetches pages — opting in to a fetch that never happened.

### Added

- **Transcript pipeline, end to end.** Optional `startSec`/`endSec` on `transcriptSegmentSchema`
  (hand-authored transcripts may have no timings), a tolerant parser
  (`scripts/publish/transcript-text.ts`), sheet ingestion, a `transcript.md` route, transcript text
  in the `/md` mirrors, pointers in `llms.txt` / `llms-full.txt` / OKF, and a `transcript` node in
  `PodcastEpisode` JSON-LD.
- **Guests became entities.** 59 named guests existed only as bare `actor` strings with no `@id`, so
  one person credited on four episodes was four anonymous mentions. `speakerListJsonLd()` now emits
  an `ItemList` of `Person` on `/podcast/speakers` with stable ids, and each episode's `actor`
  entries reference the same id. This is the largest entity-graph gain available on the site.
- **`AgentItem` extensions** (all optional): `audioUrl`, `durationSec`, `episodeNumber`,
  `transcript`, `alternates`, `fileUrl`. Episodes previously exposed no audio pointer to any agent
  surface despite the RSS feed carrying 75.
- Missing page nodes: `WebPage` on `/privacy` and `/terms`, `CollectionPage` on `/resources`,
  `/blog` and `/resources/free-resources` (the last two had an `ItemList` with no page node).
- `BlogPosting.author` now follows its value instead of always claiming `Organization`, plus a
  `publisher` link to `ORG_ID`.
- Truthful `lastModified` on the seven event pages, from `startDate`.
- `feed.xml`: `<enclosure length>` (from a measured HEAD request, never guessed),
  `itunes:episodeType`, per-episode `itunes:image`, `copyright`, `generator`, RSS-native `<image>`.
- Paginated archive pages no longer emit page 1's `BreadcrumbList` verbatim.
- Event pages now send `og:type=article` with the start date, instead of `og:type=website`.

### Performance note

`episodeItems()` now reads transcripts, and both it and `okfBundle()` are rebuilt once per generated
file. Transcript text and the OKF bundle are memoized for that reason — without it, a full catalogue
of transcripts would be re-serialized hundreds of times per build.

---

## Publishing a transcript

Transcripts are **authored by hand in the episode Google Sheet**, not generated locally. Add a
`transcript` column (and optionally `transcriptStatus`), paste the text, and run the importer:

```bash
EPISODE_SHEET_CSV_URL="<sheet CSV export URL>" npm run publish:episodes
```

The importer writes `src/content/transcripts/<slug>.json`. It syncs transcripts **independently of
whether the episode already exists**, which matters because all 75 episodes are already published —
gating it behind "new episodes only" would mean a transcript could never be added to the back
catalogue. Re-running is idempotent: only a changed transcript rewrites its file.

Accepted paste formats (`scripts/publish/transcript-text.ts`):

```
[00:12:34] Sarah Duval: text        00:12:34 Sarah Duval: text
(12:34) Sarah Duval: text           12:34 Sarah Duval: text
Sarah Duval: text                   Sarah Duval [12:34]: text
```

Lines with no speaker continue the previous turn, so a wrapped paragraph stays one segment.
Timestamps are optional throughout — a transcript pasted without them renders speaker names and no
clock, rather than a misleading `0:00` on every turn. Prose containing a colon
("Here's the thing: we hired two techs") is not mistaken for a speaker label.

`transcriptStatus` is `reviewed` by default, because a person wrote it. Set it to `machine` for
anything pasted straight out of an ASR tool without a read-through; the page then renders
"Machine-generated, not yet reviewed". **Never mark an unreviewed transcript as reviewed** — these
are words attributed to named physicians.

WhisperX was evaluated and dropped: it required a multi-gigabyte CPU-only toolchain for ~44 hours of
audio, and a machine transcript of a named clinician saying something they did not say is worse than
no transcript. `scripts/publish/transcribe.ts` was removed
(recoverable: `git show 3e28859:scripts/publish/transcribe.ts`).

---

## Open items

| Item | Status |
|---|---|
| **Transcripts: 0 of 75** | **Deferred by decision.** Largest available gain; pipeline live and idle, waiting on sheet content. |
| **F-01 — deploy** | **Handed off** to another team; this team has no domain access. See `docs/deployment.md`. |
| Content freshness | Nothing newer than **2024-06-07**. Real, not fixable by code, and never to be papered over. |
| Per-episode `tags` | 0 of 83 files, leaving six render branches permanently dead. Deferred as S-03 for lack of a verifiable source; transcripts would supply one, but tags render as visible chips and need sign-off. |
| Free-resource detail pages | Deliberately not built — would be new UI. They are addressable by fragment only. |
| `?q=` deep links in the footer band | Honoured reliably only by ChatGPT and Gemini; Claude's `/new` and Grok largely ignore it. |
| Hosts as OKF `Person` documents | Hosts appear as flat bullets in `llms.txt` and `okf/index.md`; there is no host `AgentItem` kind. |

## Verification

Ground truth is the build output, never the live domain.

```bash
npm run lint && npx tsc --noEmit && npm run build
npx tsc --noUnusedLocals --noUnusedParameters --noEmit

grep -rl 'application/rss+xml' .next/server/app --include=*.html | wc -l   # expect 108
grep -rl 'type="text/markdown"' .next/server/app --include=*.html | wc -l  # expect 83
grep -o '"@type":"Person"' .next/server/app/podcast/speakers.html | wc -l  # expect 59
head -14 .next/server/app/okf/episode-*.md.body                           # blank lines intact
grep -o 'https://www.obacademy.org[^)]*' .next/server/app/llms.txt.body | sort | uniq -d  # empty
```
