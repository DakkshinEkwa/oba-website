# Todo — UI-Audit Remediation

Merge order: F → A → B → C → D → E → H. All committed to `main`.

## PR F — Design-system tokens ✔
- [x] F1: Tokenize hero + CTA gradients (`--gradient-hero`, `--gradient-cta`, `--gradient-hero-glow`); reference via `var()`
- [x] F2: Add `--color-ink-dim`; `.title-dim` uses it
- [x] F3: `rounded-2xl`→`rounded-xl` (AuthShell, membership); `--text-micro` token (LibsynPlayer, styleguide); hero h1 → `text-h1`; `.prose h3` → `--text-h4`
- [x] F4: Remove decorative shadows (EpisodeCard, HeroHostStack); update CLAUDE.md shadow line
- [x] F5: `--header-offset: 6rem`; layout.tsx `pt-24`, page.tsx `-mt-24`
- [x] F6: Scope `transition-all`→`transition-colors` (Button, resources hub, SiteHeader)

## PR A — Forms accessibility ✔
- [x] A1: Rework `Field.tsx` (useId ids, aria-describedby, required/aria-required, FieldError role="alert", hint `text-ink-500`)
- [x] A2: Extract `SuccessPanel`; refactor 5 forms to it
- [x] A3: Submit/pending state in all 5 forms (disabled + spinner + aria-busy)
- [x] A4: NewsletterForm (aria-describedby, role="alert", pending)
- [x] A5: styleguide Field demos `htmlFor`/`id`

## PR B — Navigation accessibility ✔ (dropdown intentionally reverted)
- [x] B1: ~~Radix DropdownMenu NavDropdown~~ — intentionally reverted to the legacy CSS hover menu (keyboard-inaccessible dropdown finding re-opened / deferred)
- [x] B2: `aria-current="page"` on active nav links
- [x] B3: Skip link `pointer-events-auto`
- [x] B4: MobileNav icon/aria-label swap, focus ring, ≥44px submenu

## PR C — Cards & audio player ✔
- [x] C1: EpisodeCard/BlogCard stretched link + decorative image link (+ shadow removal)
- [x] C2: LibsynPlayer region / aria-pressed / loading / error / no-audio

## PR D — Page-level a11y (empty states + heading hierarchy) ✔
- [x] D1: EmptyState `role="status"` + `level` prop
- [x] D2: Empty-state guards (home, blog, podcast, hosts, resources, EpisodesArchive)
- [x] D3: h2 above card grids (blog, podcast features, hosts, resources hub, events, webinars, EpisodesArchive)
- [x] D4: webinars dynamic episode count
- [x] D5: paginated episodes metadata description

## PR E — Contrast & motion ✔
- [x] E1: Breadcrumbs `text-ink-500`
- [x] E2: `useReducedMotion` (HeroHostStack, AnimatedStat)
- [x] E3: AnimatedStat aria-hidden + sr-only value
- [x] E4: EpisodeTicker focus-within pause

## PR H — Minor/edge + code quality ✔
- [x] H1: Pagination disabled/current spans (aria)
- [x] H2: Button default `type="button"`, transition-colors
- [x] H3: Logo Image `alt=""` + aria-hidden
- [x] H4: Touch targets ≥40px
- [x] H5: Markdown external-only `target=_blank` + h1→h2 remap
- [x] H6: JSON-LD kept in body + comment
- [x] H7: Extract `ui/IconCard` + checklist row; refactor grids/lists
- [x] H8: Split page.tsx into `src/components/home/*`

## Final verification
- [x] `npx tsc --noEmit` per PR
- [x] `npm run lint` per PR
- [x] `npm run build` per PR
- [ ] Browser pass (form SR announcements, audio player states) — pending tooling
- [ ] Nav dropdown keyboard access — intentionally deferred (kept the CSS hover menu)
