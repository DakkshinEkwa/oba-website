# SEO Audit — obacademy.org

Audited: 2026-08-25 · Scope: full technical + on-page + content audit of `https://www.obacademy.org` against the current repo build (Next.js App Router, fully static SSG).

> **Headline finding — read this first.** The code in this repository is *not* what is serving the live site. The live `www.obacademy.org` is serving an old GitHub Pages build whose canonical tags, XML sitemap, robots.txt, and Organization JSON-LD all point at the **staging domain `marketing254.github.io/Ophthalmology`**, and whose route structure doesn't match this repo (all of `/msm/`, `/speak/`, `/podcast/episodes/`, `/podcast/hosts/`, `/podcast-show/…`, `/register/` return 404). Until the deployment is corrected, every fix made in this repo is invisible to Google. Fixing the deployment is priority #1; everything else in this report assumes the repo build is what gets deployed.

---

## 1. Executive Summary

**Overall health.** The repo build is technically strong for SEO: unique titles/descriptions/canonicals on every page, a correct 109-URL sitemap, correct robots.txt, Organization + PodcastEpisode + BlogPosting JSON-LD, clean SSG performance, and proper www/https handling. The vulnerabilities are (a) the **deployment mismatch** above, (b) **title/description truncation and hero copy** that contradicts the documented messaging strategy, (c) **missed structured-data assets** (guests/tags on episodes, Event, PodcastSeries/Person, FAQ), and (d) **aging content** (nothing new since June 2024).

### Top priority issues

1. **CRITICAL — Live site is a stale staging build.** Canonical, sitemap, robots, and JSON-LD point to `marketing254.github.io/Ophthalmology`; indexed legacy URLs (`/podcast-show/…`, `/hosts/`, `/register/`) and this repo's own key routes (`/msm`, `/speak`, `/podcast/episodes`) all 404 on the live domain. Fix at the deployment/domain layer; this repo's build has never (or no longer) been deployed.
2. **HIGH — Homepage title/description truncate, and hero copy oversells.** Default title is 75 chars, homepage description 195 chars; hero H1 "Where practice strategy meets execution" and the "Personalized business education" promise contradict `docs/messaging-strategy.md` (which prescribes H1 "The business of ophthalmology, discussed by the people who run it", the verified-value lede, and a "Browse the Conversations" + "Contribute as a Speaker" CTA pairing).
3. **HIGH — Speaker-attraction structured data is missing.** 0 of 75 episodes have `guests` or `tags`; the PodcastEpisode JSON-LD has no guest/author; there is no `Person`/`PodcastSeries` page schema. The product-marketing context flags guest attribution as OBA's strongest speaker-attraction asset.
4. **MEDIUM — No Event structured data.** Seven real Fall 2026 events exist in `src/content/events.json` with dates, but there is no Event JSON-LD, no per-event pages, and no registration links (cards render as non-linking buttons).
5. **MEDIUM — Image payload and aging content.** 14 PNG sources up to 612 KB (11 MB total images); no new episodes/blog posts since June 2024.

### Quick wins (easy, high leverage)

- Deploy this repo's build to `www.obacademy.org` and re-point the domain/CNAME; replace the GitHub Pages `robots.txt`/sitemap.
- Swap `siteConfig.socials` placeholders (`https://www.facebook.com/` etc.) for the real profiles: `facebook.com/Opthos`, `instagram.com/ophthalmology_business_podcast`, `linkedin.com/company/ophthalmology-business-academy` (these are already on the live site).
- Add Event JSON-LD on `/resources/events` from `events.json` (no code-heavy work — the data already exists).
- Trim homepage description and `/msm` description to ≤160 chars; add a short title template for content pages.
- Add `guests`/`tags` to episode frontmatter (optional schema fields) and surface them in PodcastEpisode JSON-LD + episode pages.

---

## 2. Technical SEO Findings

### 2.1 Crawlability & Indexation

**F-01 — CRITICAL: Live site is a stale GitHub Pages staging build; canonical/sitemap/JSON-LD point at staging domain.**

- **Impact:** High. Google indexes and ranks the staging domain's identity for obacademy.org's URLs; canonicals actively tell Google the *staging* URL is canonical; the live site's routes don't match the repo.
- **Evidence (live `www.obacademy.org`, curl-verified 2026-08-25):**
  - `<title>Ophthalmology Business Academy | The Business of Eye Care</title>` (not the repo's default title).
  - `rel="canonical" href="https://marketing254.github.io/Ophthalmology/"`.
  - Organization JSON-LD `"@id":"https://marketing254.github.io/Ophthalmology/#organization"`; WebSite JSON-LD also points at staging.
  - `robots.txt` → `Sitemap: https://marketing254.github.io/Ophthalmology/sitemap.xml`.
  - Live `/sitemap.xml` contains exactly the 12 staging URLs (`marketing254.github.io/Ophthalmology/…`).
  - GA4 tag `G-6GDGK5QGS4` present on live site; the repo has no analytics at all.
  - Live `sameAs` points to the **real** social profiles, i.e. the live build is an older or different repo state.
- **Fix:** Deploy the current repo build to the live domain (Vercel or wherever it should live), re-point the custom domain, and confirm the deployed `robots.txt`/sitemap/canonical output uses `https://www.obacademy.org`. Remove or supersede the GitHub Pages deployment, or add a canonical domain config that emits `www.obacademy.org`. Verify post-deploy with `curl -I` on `/sitemap.xml` and `robots.txt`.
- **Priority:** 1 (blocking).

**F-02 — HIGH: Indexed legacy URLs and this repo's core routes 404 on the live domain.**

- **Impact:** High. Google still indexes legacy WordPress URLs (e.g. `www.obacademy.org/podcast-show/ophthalmology-business-academy-vision-and-podcast-strategy/` published 2022-11-22, and `/hosts/`, `/register/`). They all 404 on the live site, wasting the site's strongest historical equity and eroding trust.
- **Evidence:** `curl` status codes on `www.obacademy.org`: `/podcast/episodes/` 404, `/msm/` 404, `/speak/` 404, `/hosts/` 404, `/podcast-show/…/` 404, `/register/` 404, `/analyze/` 404. Working live routes are the old structure only: `/`, `/podcast/`, `/webinars/`, `/reviews/`, `/resources/`, `/guest-speaker/`, `/marketing/`, `/contact/` (all 200, trailing-slash style). `/marketing` → 308 → `/marketing/` (no 301 to `/msm`).
- **Fix:** The repo's `next.config.ts` already maps `/podcast-show/:slug` → `/podcast/episodes/:slug`, `/hosts` → `/podcast/hosts`, `/analyze` & `/marketing` → `/msm`. Once the current build is deployed those 301s restore the old URLs. Add a 301 for `/register` → `/membership` (or a sensible destination) and for `/guest-speaker/` → `/speak`. Also consider the old `/podcast/episode/` (singular) → `/podcast/episodes/`.
- **Priority:** 1 (blocking).

**F-03 — OK: robots.txt is correct in the repo build.**

- **Impact:** None (working as intended).
- **Evidence:** Built HTML `robots.txt` → `User-agent: *`, `Allow: /`, `Disallow: /styleguide`, `Sitemap: https://www.obacademy.org/sitemap.xml`. No accidental blocks.
- **Fix:** None (once deployed).
- **Priority:** n/a.

**F-04 — OK: Sitemap is complete and correct in the repo build.**

- **Impact:** Positive.
- **Evidence:** Built `sitemap.xml` body: 109 URLs = 20 static + 75 episodes + 3 pagination pages (`/podcast/episodes/page/2..4`) + 8 blog posts + 0 webinars (no webinar content exists; `/resources/webinars` and `/replays` are honest empty states). All URLs use `https://www.obacademy.org`, no staging URLs, correct priorities/changefreq.
- **Fix:** None in repo. Once deployed, submit the sitemap in Google Search Console (it's the staging URL that's currently submitted/referenced).
- **Priority:** n/a.

**F-05 — OK: Canonicalization is consistent in the repo build.**

- **Impact:** Positive.
- **Evidence:** Every page emits a self-referencing canonical on `https://www.obacademy.org` (www canonicalized); pagination pages are self-canonical (no cross-canonical to page 1, which is correct); OG/twitter URLs match canonical.
- **Fix:** None. (Self-canonical pagination means no `rel=prev/next` is needed — Google ignores it.)
- **Priority:** n/a.

**F-06 — OK: Indexability is correct in the repo build.**

- **Impact:** Positive.
- **Evidence:** Every route except `/styleguide` is indexable (`index,follow`); `/styleguide` has `noindex` in the built HTML as intended.
- **Fix:** None.
- **Priority:** n/a.

**F-07 — OK: HTTPS, HSTS, and www/non-www redirects.**

- **Impact:** Positive.
- **Evidence:** `https://www.obacademy.org` 200 with HSTS header (Vercel 308s); `http`→`https` and non-www→www redirect correctly; no mixed content observed.
- **Fix:** None.
- **Priority:** n/a.

**F-08 — OK: Static generation / performance posture.**

- **Impact:** Positive. Fully static SSG, no API routes, no client-side rendering dependency for content. Next/Image optimizer + `sizes` props on card images.
- **Evidence:** Repo architecture (AGENTS.md), built HTML in `.next/server/app`.
- **Fix:** None. (Image sources still need optimization — see P-05.)
- **Priority:** n/a.

**F-09 — INFO: No hreflang needed.**

- **Impact:** None. Site is English-only; `lang="en"` set on `<html>`. No i18n/locale variants exist, so hreflang would be noise.
- **Fix:** None.
- **Priority:** n/a.

**F-10 — LOW: No analytics or Search Console verification in the repo.**

- **Impact:** Medium-long term. You cannot measure organic traffic, see coverage errors, or verify the property.
- **Evidence:** Repo layout has no analytics scripts; live site has GA4 `G-6GDGK5QGS4` from the old build.
- **Fix:** Add GA4 (same `G-6GDGK5QGS4` property) and GSC verification (`google-site-verification` meta or DNS) to the repo, and verify the property as `https://www.obacademy.org/` (not the staging domain).
- **Priority:** 3 (quick).

**F-11 — LOW: No podcast RSS/feed in the repo or on the live site.**

- **Impact:** Low-Medium. The podcast exists on Apple Podcasts (id `1656023936`), but there's no site-served RSS feed, so the site can't drive podcast discovery or show per-episode enclosure data.
- **Evidence:** No `/feed` or podcast RSS route in repo or live site.
- **Fix:** Optionally generate a podcast RSS feed from `src/content/episodes/*.mdx` (title, description, `audioUrl`, `publishedAt`, image). Out of scope for a pure SEO pass but high value for the podcast asset.
- **Priority:** 4 (long-term).

### 2.2 URL structure & site architecture

- **OK:** URLs are lowercase, hyphen-separated, readable (`/podcast/episodes/<slug>`, `/blog/<slug>`), and within 2–3 clicks of the homepage via primary nav.
- **OK:** No session IDs, parameters, or faceted navigation.
- **LOW:** `src/content` frontmatter carries a `sourceUrl` field (all 75 episodes, all 8 posts) that points at the old `www.obacademy.org/podcast-show/…` URLs. It isn't rendered anywhere, so it's not a crawl signal, but it's dead metadata and should be updated or removed if it's ever surfaced.

---

## 3. On-Page SEO Findings

**P-01 — MEDIUM: Episode `<title>` tags are too long.**

- **Issue:** The title template `%s · Ophthalmology Business Academy` pushes content titles well past the visible SERP area.
- **Impact:** Low-Medium. Google rewrites over-long titles; truncation wastes your keyword-real-estate and CTR.
- **Evidence:** Built episode HTML: "Ophthalmology Business Academy Vision and Podcast Strategy · Ophthalmology Business Academy" (91 chars). Across 75 episodes, **54/75 exceed 70 chars; longest is 106** ("From Clinical Practice to Clinical Development: A Career Transition Guide · …").
- **Fix:** For content pages, use a shorter template (e.g. `%s · OB Academy` or episode number + short title), or trim long titles in frontmatter. Not critical, but a cheap win.
- **Priority:** 3 (quick).

**P-02 — MEDIUM: Blog `<title>` tags are too long.**

- **Impact:** Low-Medium. Same truncation risk.
- **Evidence:** All 8 blog posts exceed 60 chars after the template suffix; longest 116 ("Tackling Staffing Shortage in Ophthalmology: Strategies and Technological Solutions · …").
- **Fix:** Same as P-01.
- **Priority:** 3 (quick).

**P-03 — MEDIUM: Several meta descriptions exceed ~160 chars.**

- **Impact:** Low-Medium. Descriptions get cut in the SERP; the key message can be lost.
- **Evidence:** Homepage description 195 chars (`siteConfig.description`); `/msm` description 192 chars; two episode excerpts 168 and 178 chars.
- **Fix:** Trim the homepage description (it can state the verified value prop in ≤160), trim `/msm` copy to ≤160, and keep future episode excerpts ≤160.
- **Priority:** 3 (quick).

**P-04 — MEDIUM: Homepage H1 and hero copy don't match the documented messaging strategy.**

- **Issue:** The hero makes an unverifiable promise and omits the strategic primary CTA.
- **Impact:** Medium. The H1 contains no keyword and the "Personalized business education" claim describes nothing the site actually does (per `docs/messaging-strategy.md`, which flags exactly this). The messaging doc prescribes H1 "The business of ophthalmology, / discussed by the people who run it", lede "Candid, non-promotional conversations with the practice owners, administrators, physicians, and industry experts navigating the decisions behind stronger eye-care practices", and CTAs **[Browse the Conversations → /podcast/episodes]** + **[Contribute as a Speaker → /speak]**. Current hero CTAs are "Browse Episodes" (fine) and "Free Strategy Call" → `/msm` (promotes the Ekwa service as co-primary — contradicts the doc's "primary CTA = speaker").
- **Evidence:** `src/components/home/HeroSection.tsx` lines 23–31.
- **Fix:** Update hero copy per the messaging doc; make "Contribute as a Speaker" the secondary hero CTA and keep the Ekwa offer contextually at `/msm` and on `/about`. Only use verified claims (75+ episodes, six named hosts, since 2022, 100% ophthalmology).
- **Priority:** 2 (high impact).

**P-05 — LOW/MEDIUM: Image sources are heavy; alts are empty.**

- **Impact:** Low-Medium. Next/Image optimizer resizes at request time, so this isn't a CWV blocker, but large PNG sources still cost bandwidth and slow the optimizer's first pass; empty `alt=""` on the episode-page hero image is acceptable (title adjacent) but descriptive alt would help a11y and a small relevance signal.
- **Evidence:** `public/images` is 11 MB: 14 PNGs (up to 612 KB, e.g. `podcast-thumbnails/ep071.png`), 73 JPGs in `images/episodes` (3.2 MB), 5 WebPs; `images/podcast-thumbnails` alone is 5.6 MB for 10 PNGs. Card + episode-hero images use `alt=""`.
- **Fix:** Convert PNG sources to WebP/AVIF (or recompress), set `format`/`quality` on `next/image`, and use episode titles as `alt` on the episode page hero (cards can stay decorative `alt=""`).
- **Priority:** 3 (quick) / 4 (source conversion).

**P-06 — INFO: Internal linking.**

- **Impact:** Low. Important pages are within 2 clicks; `/reviews` is reachable only via nav (its body is an honest empty state per docs — acceptable). Episode pages link to 3 related episodes + archive. Blog posts link to episodes and vice versa (verified in LatestContent sections). No orphan pages of consequence.
- **Fix:** None required. When reviews/webinars get real content, add contextual links from related pages.
- **Priority:** n/a.

---

## 4. Structured Data Findings

**S-01 — OK: Organization JSON-LD present site-wide; PodcastEpisode per episode; BlogPosting per post.**

- **Impact:** Positive. All verified present in built HTML (server-rendered, not JS-injected).
- **Evidence:** `src/app/layout.tsx` (Organization), `src/app/podcast/episodes/[slug]/page.tsx` (PodcastEpisode with `partOfSeries`), blog pages (BlogPosting).
- **Fix:** None.
- **Priority:** n/a.

**S-02 — MEDIUM: Organization `sameAs` uses placeholder social URLs.**

- **Impact:** Low-Medium. Google's knowledge graph loses the connection to real profiles; the live site already has the real ones.
- **Evidence:** `src/lib/site.ts` socials are `https://www.facebook.com/`, `https://www.linkedin.com/`, `https://www.instagram.com/`; the live build's `sameAs` is `["https://www.facebook.com/Opthos/","https://www.instagram.com/ophthalmology_business_podcast/","https://www.linkedin.com/company/ophthalmology-business-academy/"]`.
- **Fix:** Update `siteConfig.socials` to the real URLs (and link them in the footer while at it).
- **Priority:** 2 (high impact, trivial change).

**S-03 — HIGH: No episode guests or tags anywhere; PodcastEpisode schema lacks guest/author.**

- **Impact:** High for the speaker/authority strategy. The product-marketing context names guest attribution as OBA's single strongest speaker-attraction asset; guests also give the site natural entity/keyword surface ("[Guest name] on [topic]" SERP opportunities) and strengthen E-E-A-T.
- **Evidence:** 0 of 75 episode MDX files contain `guests:` or `tags:` frontmatter; PodcastEpisode JSON-LD emits no `guest`/`author` (only name/date/description/url/episodeNumber/associatedMedia/partOfSeries).
- **Fix:** Add optional `guests: string[]` (and optionally `tags: string[]`) to `src/lib/schemas.ts` and the 75 MDX files (the scraper output included guest names in episode bodies — e.g., episode 1 names Guido Piquet and Naren Arulrajah), render "With: …" on episode pages, and emit `guest` (Person) in the JSON-LD. All new fields must be optional so existing content doesn't break the build.
- **Priority:** 2 (high impact).

**S-04 — MEDIUM: No Event structured data despite 7 real events.**

- **Impact:** Medium. Event JSON-LD can surface rich results (date/time, virtual attendance) and is a clean win because the data already exists.
- **Evidence:** `src/content/events.json` has 7 events (2026-09-17 → 2026-12-15, all virtual) with slugs, titles, and startDates; `/resources/events` renders `EventCard`s; no Event JSON-LD anywhere; no per-event route exists in `src/app`; none of the events has a `registrationUrl`, so cards render as non-linking buttons.
- **Fix:** Emit `Event` JSON-LD (with `startDate`, `eventAttendanceMode`, `location: VirtualLocation`, `eventStatus`) on `/resources/events` from `events.json`. Medium-term, add per-event pages (`/resources/events/[slug]`) with Event schema and registration links.
- **Priority:** 2 (high impact, low effort) / 4 (detail pages).

**S-05 — LOW/MEDIUM: Missing WebPage/BreadcrumbList, FAQPage, PodcastSeries (full), ItemList.**

- **Impact:** Low-Medium. Breadcrumbs on episode/blog pages are rendered visually but not in schema; `/membership`, `/speak`, `/msm`, `/partnerships` contain FAQ/accordion blocks eligible for FAQPage schema; the episode archive could use `ItemList`; the podcast hub could carry a full `PodcastSeries` with `host`/`publisher`/`genre`.
- **Evidence:** Repo components: `Breadcrumbs` (visual only), FAQ/accordion blocks on the above pages.
- **Fix:** Add JSON-LD incrementally — BreadcrumbList on episode/blog pages first, then FAQPage on pages with visible FAQs, then PodcastSeries on `/podcast`.
- **Priority:** 3 (quick) / 4 (long-term).

---

## 5. Content Findings

**C-01 — MEDIUM: Content is aging; no new episodes or posts since mid-2024.**

- **Impact:** Medium. Google's freshness signals and the site's credibility for a "2026" relaunch are undermined by a library frozen at June 2024.
- **Evidence:** 75 episodes dated 2022-11 → 2024-06; 8 blog posts 2022-07 → 2024-02. No content newer than 2024-06 anywhere in `src/content`.
- **Fix:** Refresh/update high-traffic episodes and posts, and publish on a sustainable cadence. Keep claims verifiable (no "weekly content" claims per messaging doc).
- **Priority:** 4 (long-term).

**C-02 — INFO: Honest empty states are fine.**

- **Impact:** None. `/resources/webinars`, `/resources/webinars/replays`, and `/reviews` render honest empty states per the messaging doc rather than placeholder junk — correct call.
- **Fix:** None.
- **Priority:** n/a.

**C-03 — OK: Free resources and events are real.**

- **Evidence:** 3 PDFs in `src/content/free-resources.json` match `public/pdfs/`; 7 events in `events.json`. Event `image` optional with `eventImage()` placeholder fallback.
- **Fix:** None.
- **Priority:** n/a.

**C-04 — LOW: Old `sourceUrl` frontmatter points to 404 URLs.**

- **Impact:** Low (not rendered/crawled), but misleading if ever surfaced.
- **Evidence:** All 75 episodes + 8 posts carry `sourceUrl` referencing `www.obacademy.org/podcast-show/…` etc.
- **Fix:** Update to the new canonical paths or drop the field.
- **Priority:** 4 (long-term).

---

## 6. Prioritized Action Plan

### 6.1 Critical (blocking indexation/rankings)

1. **Deploy the current repo build to `www.obacademy.org`** and fix the domain/CNAME config so robots.txt, sitemap, canonical, and JSON-LD emit `https://www.obacademy.org` — not `marketing254.github.io/Ophthalmology`. (F-01)
2. **Verify the 301 map is live** (`next.config.ts`: `/podcast-show/:slug` → `/podcast/episodes/:slug`, `/hosts` → `/podcast/hosts`, `/analyze`, `/marketing` → `/msm`) and add `/register` → `/membership`, `/guest-speaker` → `/speak`, `/podcast/episode/:slug` → `/podcast/episodes/:slug`. (F-02)
3. **Add the site to Google Search Console** as `https://www.obacademy.org/`, verify, submit the real sitemap, and request re-indexing of the legacy URLs. (F-10)

### 6.2 High-impact improvements

4. Update homepage hero copy to the messaging-doc version and restore **Contribute as a Speaker → /speak** as a primary CTA. (P-04)
5. Replace placeholder socials with real profiles (S-02) — also fixes Organization `sameAs`.
6. Add `guests` (and `tags`) to episode schema + frontmatter and surface them in PodcastEpisode JSON-LD and episode pages. (S-03)
7. Add Event JSON-LD on `/resources/events` from `events.json`. (S-04)

### 6.3 Quick wins

8. Trim homepage and `/msm` descriptions to ≤160 chars. (P-03)
9. Add a short title template for episode/blog pages (or trim long titles). (P-01/P-02)
10. Add BreadcrumbList JSON-LD on episode/blog pages. (S-05)
11. Compress/convert PNG sources (14 PNGs, up to 612 KB) to WebP; use episode-title alt on episode hero images. (P-05)
12. Add GA4 (`G-6GDGK5QGS4`) to the repo layout. (F-10)

### 6.4 Long-term

13. Refresh/continue publishing content (nothing new since June 2024). (C-01)
14. Per-event pages with Event schema + registration links. (S-04)
15. PodcastSeries + Person schema for hosts; consider host pages. (S-03/S-05)
16. Podcast RSS feed for Apple Podcasts/Spotify ingestion from episode content. (F-11)
17. Clean up dead `sourceUrl` frontmatter. (C-04)

---

## Remediation status (2026-08-25)

**Done in this repo (verify with `lint` + `tsc --noUnusedLocals --noUnusedParameters` + `build`):**

- **F-02** — 301 map extended in `next.config.ts`: `/register`, `/login`, `/forgot-password` → `/membership`; `/guest-speaker` → `/speak`; `/podcast/episode(/:slug)` → `/podcast/episodes(/:slug)` (legacy maps already present).
- **F-10** — GA4 `G-6GDGK5QGS4` added to `src/app/layout.tsx` (afterInteractive).
- **F-11** — `/feed.xml` static podcast RSS 2.0 feed (`src/app/feed.xml/route.ts`, `export const dynamic = "force-static"`), advertised via `<link rel="alternate">`; 75 items, valid XML.
- **P-01/P-02** — Title template shortened to `%s · OB Academy` for content pages.
- **P-03 (not applied)** — Client chose to keep the previous copy, so the homepage description (195 chars), `/msm` (192 chars), and the two long episode excerpts (170/178 chars) remain >160. Accepted tradeoff; titles still shorten via the `%s · OB Academy` template.
- **P-04 (not applied)** — Client chose to keep the previous copy site-wide rather than the messaging-doc variant. All visible copy restored to the pre-rewrite text: hero H1 "Where practice strategy meets execution." / lede / "Browse Episodes" + "Free Strategy Call" CTAs, the original `/msm` description, and the episode excerpts. The footer "Get an AI summary of Obacademy" band was removed (along with `src/components/icons/AiIcons.tsx` and the `aiSummary` config). Kept: one invisible whitespace fix in the H1 so it reads cleanly to crawlers/screen readers, plus all SEO/structured-data work below.
- **P-05** — All 14 PNG sources converted to WebP (~5.9 MB → ~0.5 MB); episode hero images use descriptive `alt` (cards stay decorative `alt=""`); site logo updated in `Logo.tsx` (WebP), OG asset keeps PNG (`src/lib/og/assets.ts`) for Satori compatibility.
- **S-02** — Real socials (`facebook.com/Opthos`, `linkedin.com/company/ophthalmology-business-academy`, `instagram.com/ophthalmology_business_podcast`) in `siteConfig.socials` → Organization `sameAs`.
- **S-03** — All 75 episodes gained `guests`/`hostSlugs` frontmatter (name-verified against episode bodies); PodcastEpisode JSON-LD now has `actor` (guests) + `author` (hosts); `/podcast` emits `PodcastSeries`; `/podcast/hosts` emits Person `ItemList`. (The visible "With:" guest line was removed when page copy was restored per client preference — re-addable in one line.)
- **S-04** — `Event` JSON-LD on `/resources/events` from `events.json`.
- **S-05** — BreadcrumbList on episode + blog pages; FAQPage on `/membership` + `/msm`; ItemList on episode archive + blog listing.
- **S-04 (detail pages)** — `/resources/events/[slug]` SSG pages for all 7 scheduled Fall 2026 panels, each with scoped `Event` JSON-LD (`startDate`, `eventAttendanceMode`, `eventStatus`, `location`, `url`, `image` when present) + BreadcrumbList; added to `sitemap.xml` (113 URLs total). Event cards now link to their detail page (or `registrationUrl` when one exists) and use an honest "Details" label instead of a dead "Reserve" button.

**External / intentionally not done:**

- **F-01 (blocking)** — Deploy this build to `www.obacademy.org`; live site is a stale GitHub Pages build whose canonical/sitemap/robots/JSON-LD point to `marketing254.github.io/Ophthalmology`. Fix at the deployment/domain layer, then verify canonical/sitemap/robots emit `https://www.obacademy.org`.
- **F-10 (rest)** — Google Search Console verification + sitemap resubmission for `https://www.obacademy.org/`.
- **C-01** — Content freshness (needs real new episodes/posts; not fabricatable).
- **C-04** — `sourceUrl` frontmatter cleanup (dead metadata, never rendered; 301s cover the old URLs). Not removed to avoid churn on 75 files.
- **S-03 (part)** — Episode `tags` omitted (no verifiable per-episode tag source).
