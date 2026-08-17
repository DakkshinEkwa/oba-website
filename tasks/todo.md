# Todo — Cinematic Hero + Interactive Cards (interior pages)

Extends the home `/` and `/podcast/episodes` treatment to remaining interior pages. See `docs/messaging-strategy.md` for all copy.

## Confirmed scope
- Tilt stays exclusive to `/podcast/episodes` (unique to that page)
- All other pages get cinematic `DarkHero` (no tilt)
- Form pages (`/contact`, `/newsletter`, `/analyze`) → grey `canvas-subtle` page bg + white cards
- Podcast home = `size="full"`

## Phase 2 — Content hub pages ✔
- [x] P2a: `/podcast` → `DarkHero` full (CTAs + waveform proof + stat footer)
- [x] P2b: `/resources` → `DarkHero` band
- [x] P2c: `/blog` → `DarkHero` band
- [x] P2d: `/podcast/hosts` → `DarkHero` band (+ `HeroHostStack` aside)
- [x] P2e: `/about` → `DarkHero` band (+ stat proof)
- [x] P2f: routes added to `DARK_HERO_ROUTES`

### Checkpoint 2 ✔
- [x] `tsc`/`lint`/`build` pass; nav light text legible on all new dark heroes (dev-server render verified)

## Phase 3 — Conversion pages ✔
- [x] P3a: `/speak` → `DarkHero` (CTA → `#interest`)
- [x] P3b: `/partnerships` → `DarkHero` (CTA → `#enquiry`)
- [x] P3c: `/membership` → `DarkHero`
- [x] P3d: routes added to `DARK_HERO_ROUTES`

### Checkpoint 3 ✔
- [x] `tsc`/`lint`/`build` pass; anchor CTAs clear floating nav (`scroll-mt`)

## Phase 4 — Events/webinars + light-page elevations ✔
- [x] P4a: `/resources/events` → `DarkHero` band
- [x] P4b: `/resources/webinars` → `DarkHero` band
- [x] P4c: `/resources/newsletter` → `PageHero tone="subtle"` + grey section, white card
- [x] P4d: `/contact` → `PageHero tone="subtle"` + grey section, white cards
- [x] P4e: `/analyze` → steps section grey (hero was already `canvas-subtle`)
- [x] P4f: events/webinars routes added to `DARK_HERO_ROUTES`
- [x] `PageHero` gains `tone` prop ("canvas" | "subtle")

### Checkpoint 4 ✔
- [x] `tsc`/`lint`/`build` pass; empty states render under dark hero (all 13 routes 200)

## Phase 5 — Polish
- [x] P5c: responsive/contrast pass (DarkHero already owns scrim + contrast discipline; all 13 pages render 200, no dev errors)
- [ ] Human browser pass: nav tone on dark heroes, form pages' grey cards, podcast full hero

### Checkpoint 5 (Complete)
- [x] `npx tsc --noUnusedLocals --noUnusedParameters --noEmit && npm run lint && npm run build` green
- [x] Manual curl/dev-server verification of all converted routes
- [ ] Human review before merge
