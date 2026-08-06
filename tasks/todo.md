# Todo — UI-Audit Remediation

Merge order: F → A → B → C → D → E → H. Each PR verified with `npx tsc --noEmit && npm run lint && npm run build`.

## PR F — Design-system tokens
- [ ] F1: Tokenize hero + CTA gradients (`--gradient-hero`, `--gradient-cta`, `--gradient-hero-glow`); reference via `var()`
- [ ] F2: Add `--color-ink-dim`; `.title-dim` uses it
- [ ] F3: `rounded-2xl`→`rounded-xl` (AuthShell, membership); `--text-micro` token (LibsynPlayer, styleguide); hero h1 → `text-h1`; `.prose h3` → `--text-h4`
- [ ] F4: Remove decorative shadows (EpisodeCard, HeroHostStack); update CLAUDE.md shadow line
- [ ] F5: `--header-offset: 6rem`; layout.tsx `pt-24`, page.tsx `-mt-24`
- [ ] F6: Scope `transition-all`→`transition-colors` (Button, resources hub, SiteHeader)

## PR A — Forms accessibility
- [ ] A1: Rework `Field.tsx` (useId ids, aria-describedby, required/aria-required, FieldError role="alert", hint `text-ink-500`)
- [ ] A2: Extract `SuccessPanel`; refactor 5 forms to it
- [ ] A3: Submit/pending state in all 5 forms (disabled + spinner + aria-busy)
- [ ] A4: NewsletterForm (aria-describedby, role="alert", pending)
- [ ] A5: styleguide Field demos `htmlFor`/`id`

## PR B — Navigation accessibility
- [ ] B1: Radix DropdownMenu NavDropdown (keyboard, aria-expanded, Escape, click-outside)
- [ ] B2: `aria-current="page"` on active nav links
- [ ] B3: Skip link `pointer-events-auto`
- [ ] B4: MobileNav icon/aria-label swap, focus ring, ≥44px submenu

## PR C — Cards & audio player
- [ ] C1: EpisodeCard/BlogCard stretched link + decorative image link (+ shadow removal)
- [ ] C2: LibsynPlayer region / aria-pressed / loading / error / no-audio

## PR D — Page-level a11y (empty states + heading hierarchy)
- [ ] D1: EmptyState `role="status"` + `level` prop
- [ ] D2: Empty-state guards (home, blog, podcast, hosts, resources, EpisodesArchive)
- [ ] D3: h2 above card grids (blog, podcast features, hosts, resources hub, events, webinars, EpisodesArchive)
- [ ] D4: webinars dynamic episode count
- [ ] D5: paginated episodes metadata description

## PR E — Contrast & motion
- [ ] E1: Breadcrumbs `text-ink-500`
- [ ] E2: `useReducedMotion` (HeroHostStack, AnimatedStat)
- [ ] E3: AnimatedStat aria-hidden + sr-only value
- [ ] E4: EpisodeTicker focus-within pause

## PR H — Minor/edge + code quality
- [ ] H1: Pagination disabled/current spans (aria)
- [ ] H2: Button default `type="button"`, transition-colors
- [ ] H3: Logo Image `alt=""` + aria-hidden
- [ ] H4: Touch targets ≥40px
- [ ] H5: Markdown external-only `target=_blank` + h1→h2 remap
- [ ] H6: JSON-LD kept in body + comment
- [ ] H7: Extract `ui/IconCard` + checklist row; refactor grids/lists
- [ ] H8: Split page.tsx into `src/components/home/*`
