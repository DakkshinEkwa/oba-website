# Frontend UI Engineering Audit — obacademy.org

Audited against the `frontend-ui-engineering` skill standards (accessibility / WCAG 2.1 AA, design-system adherence, responsive behavior, state handling, code quality). All findings are verifiable with the referenced `file:line`.

## Critical — Accessibility

### Forms (all 5 + `ui/Field.tsx`)

- **Error messages are never announced.** Zero uses of `aria-describedby`, `role="alert"`, or `aria-live` in `src/`. `FieldError` renders plain text (`src/components/ui/Field.tsx:40-43`) with no `id`, and `Field` (`Field.tsx:64-71`) never wires `aria-describedby` onto the child control. Callers set `aria-invalid` (`ContactForm.tsx:86,89,104,159`, `RegisterForm.tsx:69-84`, `LoginForm.tsx:38,45`, `ForgotPasswordForm.tsx:37`, `NewsletterForm.tsx:53`) but the error text itself is never announced.
- **Required fields are visual-only.** `Field.tsx:15` renders a `*` asterisk, but no input ever receives `required` or `aria-required`.
- **No submit/pending state.** All submits are instant stubs (`ContactForm.tsx:164`, `RegisterForm.tsx:112`, `LoginForm.tsx:54`, `ForgotPasswordForm.tsx:39`, `NewsletterForm.tsx:61-67`). No disabled button, spinner, or `aria-busy`. If wired to a backend this is entirely missing.
- **Success states not announced.** Form → success swaps the DOM (`ContactForm.tsx:68-80`, `RegisterForm.tsx:53-63`, `LoginForm.tsx:24-33`, `ForgotPasswordForm.tsx:23-32`, `NewsletterForm.tsx:23-34`) with no `aria-live` region and no focus management.
- **Unlabeled controls in the reference.** `src/app/styleguide/page.tsx:116-131` renders `<Field>` with no `htmlFor` and bare inputs with no `id` — the design-system reference page demonstrates broken label association.

### Navigation (`layout/SiteHeader.tsx`, `layout/MobileNav.tsx`)

- **Dropdown submenus are mouse-only.** `SiteHeader.tsx:128` — the panel is `visibility: hidden` until `group-hover:visible group-focus-within:visible`; children of a hidden element are removed from tab order, so focus can never land inside and the submenus are effectively inaccessible by keyboard. Trigger `Link` (`:118`) has no `aria-expanded`/`aria-haspopup`.
- **Active nav links lack `aria-current="page"`.** `SiteHeader.tsx:60,68,102-105` — active state is conveyed purely visually (`bg-white/10`). Repo-wide grep confirms `aria-current` exists only in `Breadcrumbs.tsx:19` and `Pagination.tsx:37`.
- **Skip link inherits `pointer-events: none`.** `SiteHeader.tsx:38,42-47,49` — the skip `<a>` is a direct child of the `pointer-events-none` header and sits outside the `pointer-events-auto` wrapper. Visible on focus but mouse clicks pass through.
- **`MobileNav.tsx:30`** — `focus:outline-none` on `Dialog.Content` removes the focus ring on the element that receives focus on open, with no replacement.
- **`MobileNav.tsx:23`** — trigger `aria-label="Open menu"` never updates to "Close menu" when open.

### Cards (`content/EpisodeCard.tsx`, `content/BlogCard.tsx`)

- **Empty-accessible-name image links.** `EpisodeCard.tsx:11-24`, `BlogCard.tsx:11-24` — `<Link>` wrapping only `<Image alt="">` has no accessible name ("link" announced with nothing).
- **Broken stretched-link pattern.** `EpisodeCard.tsx:33` — `after:absolute` without `after:content-['']`, without `after:inset-0`, and the `article` (`:10`) has no `relative` ancestor. The `::after` never renders; the card body is not actually clickable despite the affordance.

### Audio player (`content/LibsynPlayer.tsx`)

- `:46` — wrapper `div` has no `role="region"` + `aria-label`; the player region is unlabeled.
- `:48-58` — play/pause is a real `<button>` (good) but has no `aria-pressed`; state is conveyed only by icon/label swap.
- No loading state — `preload="none"` (`:101`) plus no buffering indicator; the readout stays `0:00 / 0:00` after pressing play.
- No error state — no `onError` on `<audio>` (`:98-112`); `toggle()` (`:25-35`) optimistically sets `setPlaying(true)` before `el.play()` resolves, so a failed MP3 leaves the state stuck "playing" with silence.
- `:23` — `if (!audioUrl) return null`; an episode without audio silently leaves a blank gap.

### Empty states

- **`ui/EmptyState.tsx:15`** — plain `<div>` with no `role="status"`/`aria-live`; screen readers won't announce the transition when lists swap to empty.
- **Six pages render blank grids with no empty state:**
  - `src/app/page.tsx:289-293` (home `latest`; `featured` at `:153` is guarded)
  - `src/app/blog/page.tsx:24-28`
  - `src/app/podcast/page.tsx:65-69` (`latest`; hosts at `:72` guarded)
  - `src/app/podcast/hosts/page.tsx:23-27`
  - `src/app/resources/page.tsx:63-67` (`latest` episodes)
  - `src/components/content/EpisodesArchive.tsx:30-38` ("0 episodes · Page 1 of 1" + empty grid)

## Should-fix — Contrast & reduced motion

- **Contrast failures (WCAG AA):**
  - `text-ink-400` (`#82949f`) on small functional text ≈ **3.14:1** — `Breadcrumbs.tsx:9`, `Field.tsx:68` (hint text).
  - `.title-dim` `ink-300` (`#a4b3bc`) ≈ **2.15:1** on headline content — `globals.css:149-151`.
- **Framer Motion ignores `prefers-reduced-motion`** — zero `useReducedMotion` usages in `src/`. `HeroHostStack.tsx:25-28,37` (stagger/y/scale, `whileHover`) and `AnimatedStat.tsx:23-28` (count-up) run unconditionally; the CSS media query in `globals.css:116-127` only neutralizes CSS animations, not JS-driven ones.
- **Marquee links not keyboard-safe** — `EpisodeTicker.tsx:15,27-31` pauses only on `group-hover`; links can drift out from under keyboard focus while tabbing.
- **`AnimatedStat.tsx:19,36`** — renders intermediate values (`0,1,2,…`) into the DOM with no `aria-live`.

## Should-fix — Design system / "AI aesthetic"

- **Hardcoded hex gradients bypass the token system** (the only non-token colors in the codebase):
  - `src/app/page.tsx:92-94` — `radial-gradient(#5b7484, #3e5361, #263743, #16232c)`; `#5b7484` and `#263743` exist nowhere in the `@theme` scale.
  - `src/app/page.tsx:100-102` — `radial-gradient(rgba(214,228,235,0.5), …)` raw rgba.
  - `src/components/marketing/CTASection.tsx:29-31` — `radial-gradient(#47606f, #31434f, #1c2b35, #16232c)`; `#47606f`/`#1c2b35` off-token.
- **Shadows contradict the documented "no shadows" design rule** (CLAUDE.md): `EpisodeCard.tsx:10` (`shadow-sm` + `hover:shadow-md` + `hover:-translate-y-0.5` + `transition-all`); `HeroHostStack.tsx:40` (`shadow-lg`).
- **`transition-all`** used broadly (`EpisodeCard.tsx:10`, `Button.tsx:6`) instead of scoping to the properties that change.
- **Off-scale corner radii:** `rounded-2xl` uses Tailwind's default 1rem while `@theme` redefines `sm/md/lg/xl` (`globals.css:51-55`) — inconsistent with the custom 22px `xl`. Affected: `src/components/forms/AuthShell.tsx:27`, `src/app/membership/page.tsx:51`.
- **Off-scale arbitrary type sizes:** `LibsynPlayer.tsx:82` (`text-[0.7rem]`), `styleguide/page.tsx:168` (`text-[0.6rem]`).
- **`page.tsx:109`** — `text-[clamp(2.1rem,…)]` re-implements the h1 size instead of using the `--text-h1` token.
- **`globals.css:195`** — `.prose h3` hardcodes `font-size: 1.375rem` next to `.prose h2` which correctly uses `var(--text-h3)`.
- **Off-scale radii tokens themselves:** `--radius-sm: 6px`, `--radius-lg: 16px`, `--radius-xl: 22px` are aggressive corners for "small" cards — tokenized but worth reconsidering.

## Should-fix — Heading hierarchy & semantic

- **h1 → h3 skip on 7 pages** (no section h2 above card grids):
  - `blog/page.tsx:17` (h1 → `BlogCard` h3)
  - `podcast/page.tsx:24,51` (h1 → feature-card h3)
  - `podcast/hosts/page.tsx:16` (h1 → `HostCard` h3)
  - `resources/page.tsx:31,50` (h1 → hub-card h3)
  - `resources/events/page.tsx:21,44` and `resources/webinars/page.tsx:21,42` (h1 → h3 / `EmptyState` h3)
  - `EpisodesArchive.tsx:22` → `EpisodeCard` h3 (both `/podcast/episodes` and paginated routes)
- Pages ending in `CTASection` produce out-of-order document flow h1 → h3 → h2 (e.g. `podcast/hosts/page.tsx`).
- **`layout.tsx:76`** — `pt-24` magic value couples `<main>` offset to header height (with a `-mt-24` counter-hack for the home hero); any header change breaks offsets.
- **`resources/webinars/page.tsx:32`** — hardcodes "75+ recorded conversations" in EmptyState copy while every other page derives counts dynamically.

## Should-fix — Minor / edge

- **`Pagination.tsx:76-81`** — disabled prev/next and current page render `<span>`s carrying `aria-label`; `aria-label` on a role-less span is ignored by assistive tech.
- **`Button.tsx:51`** — no default `type` on the `<button>` branch; React defaults to `"submit"`, so a future `<Button>` inside a `<form>` without explicit `type` would submit. Latent (all current call sites pass `type="submit"`).
- **`Logo.tsx:19,31`** — `Image` `alt="Ophthalmology Business Academy"` is redundant with the link's `aria-label`; use `alt=""` + `aria-hidden` to avoid double announcement.
- **Touch targets < 44px:** `SiteHeader.tsx:68,77-88` (desktop nav ≈37px, Log In `h-9` = 36px); `MobileNav.tsx:59` (submenu ≈42px).
- **`Markdown.tsx:12-16`** — every link is forced `target="_blank"` (including same-site/anchor links) with no visual/AT indication.
- **JSON-LD `<script>` blocks** rendered inside `<main>` (`blog/[slug]/page.tsx:58`, `podcast/episodes/[slug]/page.tsx:64`).
- **`episodes/page/[page]/page.tsx:18`** — `generateMetadata` returns only `title`, no meta description (every other route has one).
- **Latent second h1** — `#` in MDX would emit an h1 after the page h1 (`Markdown.tsx`); no current content uses headings.

## Code quality

- **Icon-card grid markup duplicated 5×** (`rounded-lg border p-7` + `bg-accent-50 text-accent-600` icon chip + h3 + p):
  - `src/app/page.tsx:262-273` (engagements)
  - `src/app/podcast/page.tsx:46-54` (features)
  - `src/app/partnerships/page.tsx:91-99` (partnerFields)
  - `src/app/speak/page.tsx:123-131` (expertiseGroups)
  - `src/app/analyze/page.tsx:87-98` (steps)
  - → extract a shared `IconCard` component.
- **Checklist pattern duplicated:** `partnerships/page.tsx:128-135` and `speak/page.tsx:159-166` (`ShieldCheck` + bordered `li`).
- **`src/app/page.tsx` (317 lines)** — the only file exceeding the 200-line guideline.
- **`Layout.tsx` header-height coupling** (see heading-hierarchy section).

## Verified clean

- Exactly one `<h1>` per page on all 20 routes; `lang="en"` on `<html>`; single `<main id="main">`; `<header>`/`<footer>`/`<nav>` landmarks.
- `:focus-visible` outline globally (`globals.css:162-166`); reduced-motion honored by CSS (`globals.css:116-127, 280-282`).
- Radix Accordion (`Accordion.tsx`) and Dialog (`MobileNav.tsx`) provide `aria-expanded`, `aria-controls`, arrow/Home/End/Enter/Space nav, focus trap, Esc-to-close, focus return, scroll lock.
- `ui/` primitives use semantic tokens exclusively (no raw hex, no palette classes); spacing is on the 0.25rem scale.
- `Breadcrumbs.tsx:19` and `Pagination.tsx:37` set `aria-current` correctly.
- Footer: all icon-only links have `aria-label`, icons `aria-hidden`, external links include `rel="noopener noreferrer"`.
- `Markdown.tsx` — no `rehype-raw`/`dangerouslySetInnerHTML`; MDX HTML is not rendered raw.
- Custom `not-found.tsx`; metadata present on all static routes except the paginated archive (see above).
