# Implementation Plan: UI-Audit Remediation

## Overview

Remediate every finding in `docs/ui-audit.md` for obacademy.org: critical accessibility (forms, navigation, cards, audio player, empty states), contrast + reduced-motion compliance, design-system token hygiene, heading hierarchy, minor/edge fixes, and code-quality refactors. Delivered as **one PR per cluster**, merged sequentially. Verification per PR is `npx tsc --noEmit && npm run lint && npm run build`.

## Architecture Decisions

- **Forms:** `Field.tsx` becomes the single source of a11y wiring — it generates control/hint/error ids via `useId()`, clones child controls to inject `id`/`aria-describedby`/`aria-invalid`/`required`/`aria-required`. Kills the per-call-site `aria-invalid` duplication.
- **Nav dropdown:** replace the hover-only `NavDropdown` with `@radix-ui/react-dropdown-menu` (already a dependency, unused). Button trigger + hub link inside the panel; arrow-key nav, Escape, click-outside, focus management.
- **Cards:** restore the stretched-link pattern (`article` gets `relative`; title link gets `after:absolute after:inset-0 after:content-['']`); the image link becomes a decorative duplicate (`aria-hidden` + `tabIndex={-1}`).
- **Design-system:** all colors/type/radii stay on tokens. Gradients become `--gradient-*` custom properties in `@theme` (hexes live only inside token definitions). Shadows are **removed from in-flow cards** but **kept on floating/overlay surfaces** (scrolled header, dialog, dropdown); CLAUDE.md updated to match.
- **Contrast:** functional small text on light moves to `text-ink-500` (4.89:1); `.title-dim` uses a new `--color-ink-dim` token tuned ≥4.5:1 on white / ≥3:1 on `canvas-subtle` (preserves the Qoves dim-headline aesthetic). The `--color-ink-400` token value is left untouched (it also renders on dark surfaces where darkening would regress contrast).
- **Heading hierarchy:** every card grid gets an h2 above it (visible `SectionHeader` or sr-only). `EmptyState` gains a `level` prop.
- **Motion:** `useReducedMotion()` in `HeroHostStack` + `AnimatedStat`; marquee pauses on `group-focus-within`; animated stat digits are `aria-hidden` with an sr-only static value.
- **Header coupling:** new `--header-offset: 6rem` token replaces the magic `pt-24` / `-mt-24`.
- **Code quality:** extract `ui/IconCard`, a shared checklist row, a shared form `SuccessPanel`, and split `page.tsx` into `src/components/home/*`.

## Task List

### PR F — Design-system tokens (merge FIRST; owns globals.css, layout.tsx, page.tsx hero, CTASection, AuthShell, membership)
- [ ] F1: Tokenize hero + CTA gradients (`--gradient-hero`, `--gradient-cta`, `--gradient-hero-glow`); reference via `var()` in page.tsx / CTASection
- [ ] F2: Add `--color-ink-dim`; `.title-dim` uses it
- [ ] F3: Radii/type: `rounded-2xl`→`rounded-xl` (AuthShell, membership); add `--text-micro` for the two arbitrary sizes; hero h1 `text-[clamp(...)]`→`text-h1`; `.prose h3` token (`--text-h4`)
- [ ] F4: Remove decorative shadows (EpisodeCard, HeroHostStack); update CLAUDE.md shadow line
- [ ] F5: `--header-offset: 6rem` token; use in layout.tsx `pt-24` and page.tsx `-mt-24`
- [ ] F6: Scope `transition-all`→`transition-colors` (Button, resources hub link, SiteHeader)

### Checkpoint: Design tokens — tsc/lint/build; dev server shows hero/CTA gradients unchanged visually

### PR A — Forms accessibility
- [ ] A1: Rework `Field.tsx` (ids, aria-describedby, required, role="alert", hint `text-ink-500`)
- [ ] A2: Extract `SuccessPanel` (role="status" + focus-on-mount); refactor 5 forms
- [ ] A3: Submit/pending state (disabled button, spinner, aria-busy, simulated latency) across 5 forms
- [ ] A4: NewsletterForm wiring (aria-describedby, role="alert" error, pending)
- [ ] A5: styleguide Field demos get `htmlFor`/`id`

### Checkpoint: Forms — tsc/lint/build; tab-through + SR announcement of error/success in dev

### PR B — Navigation accessibility
- [ ] B1: Radix DropdownMenu NavDropdown
- [ ] B2: `aria-current="page"` on active nav links (desktop + mobile)
- [ ] B3: Skip link `pointer-events-auto`
- [ ] B4: MobileNav icon/aria-label swap, focus ring, ≥44px submenu targets

### Checkpoint: Navigation — tsc/lint/build; keyboard-only walk (Tab/arrows/Esc)

### PR C — Cards & audio player
- [ ] C1: EpisodeCard/BlogCard stretched link + decorative image link (+ shadow removal from F4 folds here)
- [ ] C2: LibsynPlayer region/aria-pressed/loading/error/no-audio states

### Checkpoint: Cards & player — tsc/lint/build; play/pause/seek + SR region announcement in browser

### PR D — Page-level a11y: empty states + heading hierarchy
- [ ] D1: EmptyState `role="status"` + `level` prop
- [ ] D2: Empty-state guards on 6 blank grids (home, blog, podcast, hosts, resources, EpisodesArchive)
- [ ] D3: h2 above h1→h3-skipping grids (7 pages)
- [ ] D4: webinars page dynamic episode count
- [ ] D5: paginated episodes `generateMetadata` description

### Checkpoint: Page-level — tsc/lint/build; heading-outline scan of each route

### PR E — Contrast & motion
- [ ] E1: Breadcrumbs `text-ink-500`
- [ ] E2: `useReducedMotion` in HeroHostStack + AnimatedStat
- [ ] E3: AnimatedStat aria-hidden + sr-only static value
- [ ] E4: EpisodeTicker focus-within pause

### Checkpoint: Contrast & motion — tsc/lint/build; reduced-motion emulation in DevTools

### PR H — Minor/edge + code quality (merge LAST)
- [ ] H1: Pagination disabled/current spans
- [ ] H2: Button default `type="button"` + transition-colors
- [ ] H3: Logo Image `alt=""` + aria-hidden
- [ ] H4: Touch targets ≥40px (44 where free)
- [ ] H5: Markdown external-only `target=_blank` + h1→h2 remap
- [ ] H6: JSON-LD kept in body, documented
- [ ] H7: Extract `ui/IconCard` + checklist row; refactor 5 grids + 2 lists
- [ ] H8: Split page.tsx into `src/components/home/*`

### Checkpoint: Complete — tsc/lint/build; visual pass on refactored pages; audit line-items traced in PR bodies

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Field cloneElement breaks a control's props | Med | Shallow merge; only inject id/aria/required when absent; verify all 5 forms + styleguide |
| Radix dropdown changes desktop hover UX | Med | Keep hover-open on trigger; menu keyboard nav is the goal |
| `--color-ink-dim` changes headline look | Low | Tuned to pass AA while visibly dimmer than ink-900; verify on canvas + canvas-subtle |
| Empty-state guards render wrong copy | Low | Reuse existing honest copy from messaging-strategy §5.7; dynamic counts only |
| page.tsx split regresses layout | Med | Extract sections without touching structure; visual pass in dev |
| Dirty working tree carries into PR branches | Med | Baseline commit of existing WIP first; PRs branch from it |

## Open Questions
- Git handling of the existing uncommitted WIP (baseline commit vs. leave dirty) — see session questions.
- Shadow policy, nav trigger, JSON-LD, empty-state copy defaults presented in spec — all accepted unless user objects.
