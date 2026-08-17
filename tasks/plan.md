# Implementation Plan: Cinematic Hero + Interactive Card Treatment for Interior Pages

## Overview

Extend the "less dull, more visually appealing" treatment that already exists on the home page (`/`) and `/podcast/episodes` to the remaining interior pages. Today most interior pages open with the plain light `PageHero` band (`bg-canvas` + `text-ink-900`). We will replace those with the cinematic **`DarkHero`** (full-bleed slate backdrop, `--gradient-hero` glow, scrim, `animate-fade-up`, optional aside/proof/footer columns) — with copy and CTAs tailored to each page's actual content and governed by `docs/messaging-strategy.md`. Where a page already has a bespoke hero (`analyze`), we adapt it rather than force-fit `DarkHero`. We also reuse the cursor-tracking 3D tilt (from `FeaturedEpisodeCard`) on other prominent cards where it adds value without hurting a11y.

**North star (per messaging-strategy):** OBA is a professional platform for experienced ophthalmology leaders. Speaker ("Contribute") and partnership conversions are the primary CTAs; `/analyze` stays demoted and clearly labeled as an Ekwa service. Only verifiable claims (75+ episodes, since 2022, 100% ophthalmology, named hosts) appear.

## Architecture Decisions

- **Reuse `DarkHero` (band size) as the single interior-hero primitive.** It already owns the gradient/scrim/overflow-discipline and the `--header-offset` clearance. Each page passes its own `eyebrow`, `title`/`titleDim`, `lede`, `breadcrumbs`, and — where it strengthens the page — `proof`, `aside`, or `children` (CTAs).
- **Header coupling:** every page that gains a `DarkHero` must be added to `DARK_HERO_ROUTES` in `SiteHeader.tsx` so the transparent nav renders light text over the dark band. This is the highest-risk coupling — forgetting it produces white-on-white nav.
- **Keep utility/form pages light.** `/contact`, `/newsletter`, and `/analyze` lead with forms; a dark hero adds little and risks contrast on the form surfaces. For these we elevate the hero copy/CTAs within the existing light hero (or a subtle `canvas-subtle` band), not a full cinematic flip. Confirm with human.
- **Forms stay styled shells** — no backend wiring (per AGENTS.md).
- **Cards:** apply the 3D tilt only to interactive, cursor-following cards where the effect is delightful and the card remains keyboard/screen-reader accessible. `FeaturedEpisodeCard` stays as the flagship; we add a shared tilt hook so we don't duplicate logic.
- **Motion:** respect `prefers-reduced-motion` (disable tilt). Add to `SiteHeader` too so nav tone doesn't fight reduced-motion users.

## Task List

### Phase 1: Foundation — shared tilt primitive + header wiring
- [ ] T1: Extract a reusable `useTilt` hook (mouse-move rotateX/rotateY + cursor glow, disabled under `prefers-reduced-motion`) into `src/components/ui/`; refactor `FeaturedEpisodeCard` to use it (no behavior change)
- [ ] T2: Move the raw `rgba()` glow out of the tilt hook into a `--glow-*`/token-friendly pattern, keeping design-token hygiene (shadows remain elevation-only; tilt glow stays subtle)

### Checkpoint 1
- [ ] `npx tsc --noEmit`, `npm run lint`, `npm run build` pass
- [ ] `/podcast/episodes` featured card looks/behaves identical to before

### Phase 2: Content hub pages (biggest visual win)
- [ ] P2a: `/podcast` (podcast home) → `DarkHero` (band or full) with CTAs (Browse episodes / Meet the hosts) + `proof` stat row
- [ ] P2b: `/resources` (hub) → `DarkHero` band; keep hub-link grid below
- [ ] P2c: `/blog` → `DarkHero` band
- [ ] P2d: `/podcast/hosts` → `DarkHero` band; reuse `HeroHostStack` as `aside`/`proof`
- [ ] P2e: `/about` → `DarkHero` band; optional stat `proof` (count+, since 2022)
- [ ] P2f: add these routes to `DARK_HERO_ROUTES`

### Checkpoint 2
- [ ] `tsc`/`lint`/`build` pass; nav is legible (light text) on each new dark hero at all breakpoints

### Phase 3: Conversion pages (speaker/partner/membership)
- [ ] P3a: `/speak` → `DarkHero` band with the "Share your area of expertise" CTA (`#interest`) + `Send` button as `children`
- [ ] P3b: `/partnerships` → `DarkHero` band with "Start a partnership conversation" CTA (`#enquiry`)
- [ ] P3c: `/membership` → `DarkHero` band; keep the $0 / free-membership card below
- [ ] P3d: add routes to `DARK_HERO_ROUTES`

### Checkpoint 3
- [ ] `tsc`/`lint`/`build` pass; CTA anchors scroll correctly under the floating nav (`scroll-mt`)

### Phase 4: Events/webinars + light-page hero elevations
- [ ] P4a: `/resources/events` → `DarkHero` band
- [ ] P4b: `/resources/webinars` → `DarkHero` band
- [ ] P4c: `/resources/newsletter` → elevate light hero (copy/CTA), keep light
- [ ] P4d: `/contact` → elevate light hero, keep light
- [ ] P4e: `/analyze` → refine bespoke hero copy/CTAs, keep light (Ekwa service, demoted)
- [ ] P4f: add events/webinars routes to `DARK_HERO_ROUTES`

### Checkpoint 4
- [ ] `tsc`/`lint`/`build` pass; empty states (events/webinars) still render correctly under dark hero

### Phase 5: Card interactivity + polish
- [ ] P5a: apply `useTilt` to `HostCard` and/or `EpisodeCard` where it enhances scanning (optional, content-dependent)
- [ ] P5b: confirm reduced-motion path on all tilt cards
- [ ] P5c: full responsive + contrast pass (320/768/1024/1440), keyboard nav, axe pass

### Checkpoint 5 (Complete)
- [ ] All acceptance criteria met across all pages
- [ ] `npx tsc --noEmit && npm run lint && npm run build` green
- [ ] Manual browser pass of every touched page + nav tone on dark heroes
- [ ] Human review before merge

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Nav text invisible over new dark heroes (white-on-white) | High | Add every route to `DARK_HERO_ROUTES`; check in each checkpoint |
| Making form pages dark hurts readability | Med | Keep `/contact`, `/newsletter`, `/analyze` light; confirm with human |
| Tilt on cards hurts a11y/performance | Med | `useReducedMotion` disable; keep tilt on interactive cards only; subtle glow |
| Messaging drift (unsupported claims) | High | All new copy audited against `docs/messaging-strategy.md`; only verifiable proof |
| Oversized heroes compete with content | Low | `band` size for interior pages; full only where content justifies (podcast home) |

## Open Questions
- [ ] Keep `/contact`, `/newsletter`, `/analyze` light (my recommendation) or convert to dark too?
- [ ] Apply `useTilt` beyond `FeaturedEpisodeCard`, or leave other cards static?
- [ ] Podcast home: full-size cinematic (`size="full"`) or band? (full matches `/` and `/podcast/episodes` vibe)
