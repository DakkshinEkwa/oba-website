---
description: Audit this repo's technical and on-page SEO against the seo-audit skill and rewrite docs/seo-audit.md
argument-hint: "[route or area, or blank for a full audit]"
---

Run an SEO audit on this repo.

Load the `seo-audit` skill and follow it — but the skill is generic, so the sections below
override it wherever they conflict. **Skip the skill's "Initial Assessment" interrogation
entirely**; the answers are here.

Scope for this run: **$ARGUMENTS** (empty means a full audit.)

## Site context — do not ask the user for this

- Ophthalmology Business Academy (`https://www.obacademy.org`), a static Next.js 16 App Router
  site, fully SSG. No database, no API routes, no auth, no site search.
- Content site for ophthalmology practice leaders: 75 episodes, 8 posts, 7 panels, 6 hosts.
- Primary conversions are speaker ("Contribute", `/speak`) and partner (`/contact#partnership`).
  The marketing-analysis offer at `/msm` must stay transparently attributed to Ekwa and separate
  from OBA editorial.
- Positioning source of truth: `.agents/product-marketing.md` and `docs/messaging-strategy.md`.

## Override: how to detect structured data here

The skill warns that `curl`/WebFetch cannot see JS-injected JSON-LD and tells you to use a browser.
**That does not apply.** This site is statically generated and its JSON-LD is server-rendered into
the HTML. Ground truth is the build output:

```bash
npm run lint && npx tsc --noEmit && npm run build
npx tsc --noUnusedLocals --noUnusedParameters --noEmit
grep -o '<script type="application/ld+json"[^>]*>.*</script>' .next/server/app/index.html
```

**Do not audit the live domain.** `www.obacademy.org` currently serves a stale GitHub Pages build
whose canonical, sitemap, robots and JSON-LD all point at `marketing254.github.io/Ophthalmology`.
Auditing it produces findings about code that is not in this repo.

## Carry these forward — they are open, and two are settled

`docs/seo-audit.md` is stale (dated 2026-08-25, predating the ai-seo work and a wave of route
removals). Rewrite it against the current codebase, but preserve these:

| ID | State |
|---|---|
| **F-01** | CRITICAL, external, **blocking**. Deploy this build to `www.obacademy.org`; the live site is a stale GitHub Pages build. Nothing else in the audit matters until this ships. |
| **F-10** (rest) | External. Google Search Console verification + sitemap resubmission for the real domain. Tokens land via `NEXT_PUBLIC_GSC_TOKEN` / `NEXT_PUBLIC_BING_TOKEN`. |
| **C-01** | Content freshness — nothing newer than June 2024. Needs real new episodes/posts; not fabricatable. |
| **C-04 / §2.2** | Dead `sourceUrl` frontmatter on 75 episodes + 8 posts. Never rendered; 301s cover the old URLs. Left deliberately to avoid churn. |
| **S-03** (part) | Per-episode `tags` omitted — no verifiable source for them. |
| **P-03** | **Client-rejected.** Over-160-char descriptions on the homepage, `/msm`, and two episodes. Accepted tradeoff. |
| **P-04** | **Client-rejected.** The messaging-doc H1 and "Contribute as a Speaker" primary CTA were declined in favour of the existing copy. Accepted tradeoff. |

**Do not re-raise P-03 or P-04 as new findings.** They were decided. Record them as accepted
tradeoffs and move on.

## Re-verify, do not trust, the old audit's "done" claims

The previous audit's targets have moved. Check against the current codebase before repeating any
of them:

- `next.config.ts` now 301s `/podcast`, `/membership`, `/partnerships`, `/resources/webinars`,
  `/resources/newsletter`, `/faq` and `/reviews` away. So "FAQPage on `/membership`" and
  "PodcastSeries on `/podcast`" describe routes that no longer exist — the series node now lives
  on `/podcast/episodes`, and the general FAQs on the homepage (`#faq`).
- `docs/ui-audit.md` is stale too. Its claim that `podcast/episodes/page/[page]` has no meta
  description is false today — that route uses `pageMetadata()` with a per-page range description.
- The AI layer (`llms.txt`, `llms-full.txt`, OKF, `*/md` routes) shipped after the audit was
  written and is not mentioned in it at all. See `/ai-seo` for that surface; don't duplicate it
  here beyond noting crawlability.

## Constraints

- **The site's UI and copy are frozen.** Report copy findings — title length, description length,
  heading text, thin content — as recommendations. Never apply them.
- Do not re-add deleted routes. Do not add `/login`, `/register`, or `/forgot-password`.
- Nav dropdown keyboard access is **intentionally deferred** (`SiteHeader` uses the legacy CSS
  hover menu). Don't file it as a new finding without saying it was a deliberate choice.
- Never invent `lastModified` dates in the sitemap — `sitemap.ts` deliberately emits them only
  where a truthful date exists, because Google discounts lastmod site-wide once it detects
  fabricated values.

## Output

1. **Rewrite `docs/seo-audit.md`** against the current codebase, using the skill's report structure
   (Executive Summary → Technical → On-Page → Structured Data → Content → Prioritized Action Plan).
   Keep the existing ID scheme (`F-` technical, `P-` on-page, `S-` structured data, `C-` content)
   and severity markers, and end with a dated remediation appendix splitting "done in this repo"
   from "external / intentionally not done".
2. Apply clearly-safe non-copy fixes and list exactly what you changed.
3. Summarise in chat: top priorities, what you fixed, what needs a human or a deploy.
