---
description: Review and extend the site's AI-discoverability layer (llms.txt, OKF, markdown routes, structured data) against the ai-seo skill
argument-hint: "[area to focus on, or blank for a full pass]"
---

Run an AI-SEO pass on this repo.

Load the `ai-seo` skill and follow it — but the skill is generic, so the sections below
override it wherever they conflict. **Skip the skill's "Before Starting" interrogation
entirely**; the answers are here.

Focus for this run: **$ARGUMENTS** (empty means a full pass.)

## Site context — do not ask the user for this

- Ophthalmology Business Academy (`https://www.obacademy.org`), a static Next.js App Router
  site, fully SSG. No database, no API routes, no account system.
- Audience: experienced ophthalmology practice owners, administrators, and physicians.
  Positioned as a professional platform, **not** a lead-gen funnel.
- Library: 75 podcast episodes (since 2022), 8 blog posts, 7 Fall 2026 live panels, 6 named
  hosts, free resources. Nothing newer than June 2024 — content freshness is a known,
  unfixable-by-us gap; never paper over it.
- Positioning source of truth, in priority order: `.agents/product-marketing.md`, then
  `docs/messaging-strategy.md`. Read both before proposing anything content-shaped.

## Already shipped — review and extend, do not rebuild

The AI layer exists. Verify and improve it; don't propose it as new work.

| Surface | Where |
|---|---|
| `llms.txt` | `src/app/llms.txt/route.ts` |
| `llms-full.txt` | `src/app/llms-full.txt/route.ts` (metadata-only by design — episode bodies are short teasers) |
| Open Knowledge Format bundle | `src/app/okf/[[...path]]/route.ts` + `src/lib/agent/okf.ts` |
| Markdown alternates | `src/app/blog/[slug]/md/`, `src/app/podcast/episodes/[slug]/md/` |
| AI crawler rules | `src/app/robots.ts` — 16 named agents; CCBot deliberately allowed |
| RSS | `src/app/feed.xml/route.ts` |
| Structured data | `src/lib/jsonld.ts` (Organization, WebSite, Breadcrumb, FAQ, Event, PodcastSeries, Person) |
| Footer "Get an AI summary" band | `aiSummary` in `src/lib/site.ts`, rendered by `SiteFooter.tsx` |

All of it is generated from `src/content` through `src/lib/agent/content.ts` (the `AgentItem`
shape), so these surfaces cannot drift from the pages. Any new surface should be generated the
same way rather than hand-maintained.

## Known open gaps — check each run

- `resourceItems()` gives every free resource `path: "/resources/free-resources"`, so they share
  one URL in llms.txt and OKF and are not individually addressable.
- Panels and free resources appear in llms.txt/llms-full.txt/OKF but have no `/md` route.
- `llms.txt` is not advertised from `<head>`; only RSS is, via `alternates.types` in
  `src/app/layout.tsx`.
- `docs/seo-audit.md` claims the `aiSummary` footer band was removed. That is stale — it ships.
- The `?q=` deep-link pattern in the footer band is honoured reliably only by ChatGPT and Grok;
  Claude's `/new` and Gemini's `/app` largely ignore it.

## Constraints

- **The site's UI and copy are frozen.** Do not edit page copy, components, or layout. Report
  copy-shaped findings as recommendations; never apply them.
- Obey `docs/messaging-strategy.md`. Only verifiable proof: 75+ episodes, six named hosts, since
  2022, 100% ophthalmology. Never "thousands of practices" or "weekly content". Describe empty
  sections honestly.
- Do not re-add deleted routes (`/podcast`, `/membership`, `/partnerships`, `/reviews`,
  `/resources/webinars`, `/resources/newsletter`, `/faq`) — all are 301'd in `next.config.ts`.
- There is no auth and no site search. Do not declare capabilities the site lacks in structured
  data; `jsonld.ts` already refuses `SearchAction` for exactly this reason.

## Verification

Ground truth is the build output, not the live domain — `www.obacademy.org` currently serves a
stale GitHub Pages build (see F-01 in `docs/seo-audit.md`). This site is SSG, so JSON-LD and meta
tags are in the prerendered HTML:

```bash
npm run lint && npx tsc --noEmit && npm run build
npx tsc --noUnusedLocals --noUnusedParameters --noEmit
# then grep .next/server/app/**/*.html, or `npm run start` and curl the routes
```

## Output

1. Write or update **`docs/ai-seo.md`** as the living record: what exists, what changed this run,
   what is still open, and why anything was deliberately not done.
2. Apply clearly-safe non-copy fixes (routes, metadata, structured data, generator logic) and list
   exactly what you changed.
3. Summarise in chat: what you changed, what you recommend, what is blocked and on whom.
