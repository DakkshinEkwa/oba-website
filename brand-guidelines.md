# OBA Brand Guidelines

These are the OBA brand guidelines: everything needed to produce an
Ophthalmology Business Academy artifact without asking a question.

How to read this:

- **Binding.** Every rule below. Each names the failure it prevents; if the failure
  does not apply to your case, raise it rather than ignoring the rule.
- **Generated.** Every value is read from `design/tokens.json` or from the file it
  describes, at build time. Nothing is transcribed, so nothing can go stale.
- **Illustrative.** Any figure inside a post specimen is sample copy; its layer is
  named `... - replace`. Swap it for real practice data before anything ships.
- **Colour, type and asset tables** are complete. The visual boards carry the layouts
  that prose cannot: open the SVG linked at the end of each chapter.

## Chapters

- 1. Color Palette Overview
- 2. Typography Inter and IBM Plex Mono
- 3. Layout and Spacing
- 4. Surfaces and Components
- 5. Dots Texture
- 6. Imagery and Content
- 7. Post Specifications
- 8. Wordmark and Logo
- 9. Voice and Tone
- 10. Misuse and Motion

---

## 1. Color Palette Overview

Every colour OBA uses, and which of them may touch. The palette is deliberately small and has no chromatic accent: the brand reads as one system because there is nothing to co-ordinate.

### Rules

**There is no chromatic accent. White is the accent.**  
*Prevents:* A stray brand colour, which is what makes a system look like a template.  
*Source:* The eyebrow dot in every mark is white at .85 - the library has never used another hue.

**Text on the dark ground is white, GLOW at .72, or ACCENTTEXT. Nothing else.**  
*Prevents:* Captions that fail contrast at the size they are actually read.  
*Source:* ACCENTTEXT is the only tint measured at 8.3:1 over PAGEBG.

**Alpha is baked per node, from the fixed ladder. Never a group opacity, never a mask.**  
*Prevents:* Canva and Figma flatten group opacity on import and the artwork changes.  
*Source:* build-assets.py: '#ffffff at brand alphas, no gradients, no fonts, no external refs.'

**There is one gradient - the hero lobe, STEEL through INK900 at the fixed stops. Any other gradient is not OBA.**  
*Prevents:* A second gradient reads as a second brand.  
*Source:* tokens.json brand.gradient; the same four stops render the boards, the site and the posts.

**The complete palette**

| Token | Value | What it is for |
|---|---|---|
| BG | #DADFE8 | the light sheet these guidelines are printed on |
| RULE | #C8CCD3 | the hairline under a section label |
| INK900 | #16232C | primary ink; darkest hero stop; body text on light |
| INK800 | #22323D | card fill on light grounds |
| INK700 | #31434F | secondary card fill |
| INK600 | #465A66 | muted ink; the dimmed half of a two-tone title |
| ACC600 | #3D5361 | accent surface |
| PAGEBG | #0D151B | dark page ground for posts, banner and the guidelines document |
| STEEL | #5B7484 | hero gradient stop 0% - the lit edge of the slate lobe |
| SLATE5 | #3E5361 | hero gradient stop 34% |
| SLATE7 | #263743 | hero gradient stop 62% |
| GLOW | #D6E4EB | hero glow; the pale half of a two-tone headline |
| CHIPBG | #F1F3F7 | chip and light-well fill |
| SCRIM | #0B1220 | left scrim over the hero, so headline type stays legible |
| TILEBG | #2A3741 | the tile behind a monogram, when no headshot is available |
| MONOINK | #F0F4F6 | the initials on a monogram tile |
| WHITE | #FFFFFF | the accent. OBA has no chromatic accent - white is it |
| ACCENTTEXT | #A9C1D0 | pale accent for small text on the dark ground - 8.3:1, the only tint that passes at caption size |

Board: [Color Palette - OBA.svg](Color%20Palette%20-%20OBA.svg)


## 2. Typography Inter and IBM Plex Mono

Two families, used for different jobs. Inter carries meaning; the mono carries labels. Mixing those jobs is the fastest way to make an OBA artifact look like someone else's.

### Rules

**IBM Plex Mono is uppercase, tracked wide, and used only for eyebrows, tokens, counters and footers. It never sets body copy.**  
*Prevents:* Mono body copy reads as code, not as a practice-management brand.  
*Source:* Every board eyebrow and post footer in the system.

**A headline is Inter 300 with the turn dimmed: full white for the claim, GLOW at .72 or white at .55 for the line that turns it. One dimmed line, never two.**  
*Prevents:* A headline with no dimmed line has no emphasis; one with two has no claim.  
*Source:* Imagery & Content board, 'Two-tone headline'; templates dim a line with a `~` prefix.

**One to three headline lines, text-wrap balance, -0.02em.**  
*Prevents:* Four lines at title size overflow the safe area on portrait and story.  
*Source:* Imagery & Content board: '1-3 LINES - TEXT-WRAP BALANCE - -0.02EM'.

**Nothing below the caption size for its format. On landscape that is 14 px.**  
*Prevents:* Type below the caption floor is gone at thumbnail scale, so it was never read.  
*Source:* tokens.json type scale.

**Type sizes, by format**

| Format | Eyebrow | Title | Body | Caption |
|---|---|---|---|---|
| Square | 25 | 51 | 24 | 17 |
| Portrait | 26 | 60 | 26 | 18 |
| Story | 29 | 85 | 30 | 20 |
| Landscape | 20 | 48 | 19 | 14 |

Board: [Typography - OBA.svg](Typography%20-%20OBA.svg)


## 3. Layout and Spacing

The grid the boards and posts are built on, the safe areas that keep content out from under platform UI, and the rule that positions are measured rather than eyeballed.

### Rules

**Positions come from a mark's measured footprint, never from an eyeballed coordinate.**  
*Prevents:* Collisions. The first pass ran a chair grid through its own annotation and put a sankey under the footer URL.  
*Source:* posts/README.md, 'Layout rule'; msize() in build-posts.py.

**Every composition is checked against the safe-area sheet for its ratio (safe-area-4x5, safe-area-16x9) before it ships.**  
*Prevents:* Captions, avatars and platform chrome cover anything that strays outside.  
*Source:* assets/safe-area-4x5.svg, assets/safe-area-16x9.svg.

**An empty shell is never placed bare. If a shell has no content, the shell goes too.**  
*Prevents:* A credential-chip with no label is a blob, not a component.  
*Source:* posts/README.md.

**Canvas formats**

| Format | Size | Pad | Top | Bottom |
|---|---|---|---|---|
| Square | 1080 x 1080 | 56 | 46 | 42 |
| Portrait | 1080 x 1350 | 64 | 54 | 50 |
| Story | 1080 x 1920 | 64 | 58 | 58 |
| Landscape | 1200 x 630 | 52 | 40 | 36 |

Board: [Layout & Spacing - OBA.svg](Layout%20&%20Spacing%20-%20OBA.svg)


## 4. Surfaces and Components

Cards, chips, wells and hairlines: what may sit on what, at which radius, at which alpha.

### Rules

**Three radii: 30 for boards and cards, 18 for portrait tiles, 999 for pills. No other radius.**  
*Prevents:* A fourth radius makes the set look assembled from parts.  
*Source:* build-boards.py page()/card(); the website's own scale (6/10/16/22/999) is a documented divergence, not a licence.

**A hairline is 1 px of the pale at .12-.16, never a grey.**  
*Prevents:* A grey hairline turns the palette warm-neutral and kills the slate.  
*Source:* tokens.json document.ALPHA; the chip and tile shells in assets/.

**The alpha ladder**

| Name | Value | Used for |
|---|---|---|
| bar | 0.28 | waveform and chart bars |
| hairline | 0.14 | 1 px rules and shell strokes |
| eyebrowDot | 0.85 | the dot before an eyebrow |
| dim | 0.55 | the dimmed turn of a headline |
| muted | 0.66 | secondary label text |
| faint | 0.45 | annotation on a board |

Board: [Surfaces & Components - OBA.svg](Surfaces%20&%20Components%20-%20OBA.svg)


## 5. Dots Texture

The dot field that keeps a flat fill alive at thumbnail scale, drawn as geometry so nothing has to flatten it.

### Rules

**The dot field is an 18 px grid with alpha baked per dot.**  
*Prevents:* A masked or grouped texture is destroyed by Canva import and by PNG export.  
*Source:* build-boards.py dots_defs(); build-assets.py 'Dots' family.

**Texture sits under content, never over it, and never carries meaning on its own.**  
*Prevents:* A dot field read as data is a chart nobody can read.  
*Source:* The ishihara-plate mark is the one exception, and it encodes a number on purpose.

Board: [Dots Texture - OBA.svg](Dots%20Texture%20-%20OBA.svg)


## 6. Imagery and Content

Headshots, monogram fallbacks, bylines and the label formats that sit around them.

### Rules

**Headshot files are first-last.jpg, lowercase, dash-separated.**  
*Prevents:* Resolution fails silently and the monogram appears instead of the person.  
*Source:* Imagery & Content board, 'File naming'.

**Resolution order is name, then headshots/, then relative, then absolute, then data URI.**  
*Prevents:* An absolute path that works locally and breaks for everyone else.  
*Source:* Imagery & Content board, 'Resolution order'.

**Images are object-fit: cover / xMidYMid slice. Never letterboxed, never stretched.**  
*Prevents:* A stretched portrait is the single most obvious sign of an un-designed asset.  
*Source:* Imagery & Content board, 'Fit'.

**When an image is absent the monogram tile stands in: TILEBG, rx 18, hairline .16, initials in Inter 300, and the pill reads PORTRAIT.**  
*Prevents:* A broken layout. The fallback is a designed state, not an error state.  
*Source:* Imagery & Content board, 'Monogram fallback'.

**Portraits are 4:5 and at least 800 px on the short edge.**  
*Prevents:* Undersized images are accepted silently by both engines and go soft on export.  
*Source:* Imagery & Content board divergence panel - this one is prose, nothing validates it yet.

Board: [Imagery & Content - OBA.svg](Imagery%20&%20Content%20-%20OBA.svg)


## 7. Post Specifications

Every composition that ships, specified to the number. The figures are read from the artwork itself, so a specification here cannot disagree with the piece it describes.

### Rules

**One CTA per asset, and it is the smallest next commitment.**  
*Prevents:* Two asks in one artifact means neither is taken.  
*Source:* GTM v2 section 9 rule 1, and section 4.

**First-touch content - clips, quotes, thumbnails, link cards - never carries the Practice Growth Diagnostic CTA. It routes to the pillar page.**  
*Prevents:* A human-conversation ask on first touch spends trust that has not been earned, and in a small community that damage travels.  
*Source:* GTM v2 section 9 rule 4; balancing loop B1.

**Every illustrative figure is sample copy until it is replaced. Its text node is named '... - replace'.**  
*Prevents:* An invented number shipping as a real one.  
*Source:* posts/README.md; build-posts.py header.

**A composition must still read at 120 px, in greyscale, and cropped.**  
*Prevents:* A feed is a contrast competition. A mark that dies in all three is decoration.  
*Source:* asset-ideas.md, 'The constraints that generate the library'.

**The eight compositions**

| File | Canvas | Leans on | Demonstrates |
|---|---|---|---|
| stat-referral-decay | 1080 x 1350 | cohort-dots rule-eyebrow | Referral decay |
| panel-four-leaders | 1080 x 1350 | portrait-quad convergence-four countdown-ticks | Panel announcement |
| quote-pull | 1080 x 1080 | quote-corners waveform-quote speaker-dots credential-chip | Pull quote |
| clip-teaser | 1080 x 1350 | clip-window episode-badge speaker-dots | Clip teaser |
| carousel-01-cover | 1080 x 1350 | acuity-ladder page-counter swipe-arrow | Carousel cover |
| carousel-02-utilisation | 1080 x 1350 | chair-grid page-counter swipe-arrow | Carousel page |
| link-card | 1200 x 630 | sankey-lite rule-eyebrow | Link card |
| thumbnail | 1920 x 1080 | ishihara-plate waveform-32 rule-eyebrow | Video thumbnail |

**The type each composition actually uses**

| File | Sizes present | Weights | Mono tracking |
|---|---|---|---|
| stat-referral-decay | 168 / 76 / 26 / 22 / 20 / 17 | 200 / 300 / 400 / 500 | 2.4-3.08 |
| panel-four-leaders | 66 / 22 / 20 / 17 / 16 | 300 / 500 | 2.2-3.08 |
| quote-pull | 60 / 24 / 17 / 16 | 300 / 500 | 2.2-3.2 |
| clip-teaser | 74 / 46 / 30 / 26 / 22 / 17 | 300 / 500 | 2.4-3.4 |
| carousel-01-cover | 78 / 22 / 20 / 17 | 300 / 500 | 2.4-3.08 |
| carousel-02-utilisation | 74 / 30 / 22 / 17 | 300 / 500 | 2.4-3.08 |
| link-card | 48 / 22 / 17 | 300 / 500 | 2.4-3.08 |
| thumbnail | 104 / 30 / 26 / 22 | 300 / 500 | 3-3.64 |

Board: [Post Specs - OBA.svg](Post%20Specs%20-%20OBA.svg)


## 8. Wordmark and Logo

How the mark is placed, at what minimum size, and on which grounds.

> **Provisional.** A new logo is planned. This chapter documents only what is true of the current raster artwork (oba-website/oba-logo.png); the geometry rules that need a vector original - optical clear space, scaling ratios, monochrome and reversed lockups - land with the redesign.

### Rules

**Never re-typeset the wordmark. Use the file.**  
*Prevents:* A wordmark set by hand is a different wordmark, and nobody notices until two versions are in the wild.  
*Source:* Standing rule; the artwork is the only source.

**Clear space on every side is at least the height of the mark itself.**  
*Prevents:* A crowded mark stops reading as a mark and starts reading as a label.  
*Source:* Measured from the current raster; restate in optical terms once a vector exists.

**The mark goes on PAGEBG, INK900, or white. Never on the hero gradient, never on a photograph.**  
*Prevents:* The gradient's mid-tones eat the mark's contrast where the lobe is brightest.  
*Source:* Derived from the palette's contrast pairs.

**Written out, it is Ophthalmology Business Academy on first use, OBA after.**  
*Prevents:* 'OBA' cold means nothing to a practice owner who has not met the brand.  
*Source:* tokens.json brand.label / brand.wordmark.

**The artwork as it stands**

| Property | Value |
|---|---|
| file | oba-website/oba-logo.png |
| format | PNG raster - no vector original exists yet |
| intrinsic size | 2500 x 1600 px |
| file size | 99.4 KB |
| minimum on screen | 1250 px wide (half intrinsic - below this the counters fill in) |
| clear space | one mark-height on every side (1600 px at intrinsic size) |
| legal grounds | PAGEBG, INK900, white |
| never | the hero gradient, a photograph, or re-typeset by hand |

Board: [Wordmark & Logo - OBA.svg](Wordmark%20&%20Logo%20-%20OBA.svg)


## 9. Voice and Tone

How OBA writes. The rules are drawn from the GTM strategy rather than invented, because voice here is a commercial constraint, not a style preference: the audience is a small community of practice owners, and trust is a stock that depletes.

### Rules

**The offer is comparison, not content. Lead with a benchmark, an economic model, or a decision framework - the thing an owner cannot get by looking at their own practice.**  
*Prevents:* 'Content' is a poor trade for an owner's contact data and time; comparison is not.  
*Source:* GTM v2 section 3, 'Information asymmetry, used deliberately'.

**Nothing is pitch-shaped. Value is delivered at zero purchase probability.**  
*Prevents:* A pitch spends trust, and in a small ophthalmology community reputational damage propagates through referral networks faster than trust replenishes.  
*Source:* GTM v2 balancing loop B1; section 10, 'Principal risk'.

**The CTA is the smallest next commitment, and there is exactly one per asset.**  
*Prevents:* An ask that outruns the relationship is refused, and the refusal is remembered.  
*Source:* GTM v2 section 4, CTA rules; section 9 rule 1.

**The human conversation is the Practice Growth Diagnostic. Never 'MSM', never 'marketing strategy meeting', in anything a practice sees.**  
*Prevents:* The old name signals agency sales, which is the reason the step was mis-timed.  
*Source:* GTM v2 section 4, offer ladder.

**Every figure carries its source, or is marked as illustrative. An estimate says it is an estimate.**  
*Prevents:* One unsourced number, once challenged by a practice owner, discredits the rest.  
*Source:* GTM v2's own habit of marking '(assumption; verify)'; the '- replace' convention.

**One flagship asset per pillar, not a stream. Cut volume, raise density.**  
*Prevents:* The binding constraint is an owner's attention, not our output. Streams are ignored; one memorable asset is remembered.  
*Source:* GTM v2 section 3, last row of the decoupling table.

**Plain clinical-business English. No agency vocabulary - no 'synergy', no 'leverage' as a verb, no 'unlock', no 'game-changing', no 'revolutionary'.**  
*Prevents:* The audience is surgeons and administrators who read marketing language as noise.  
*Source:* OBA-Host.md, on representing the questions an owner is actually thinking about.

Open question for the next revision: there is no written rule yet for how OBA refers to named vendors, competitors or a speaker's own practice in copy. GTM v2 constrains vendor-led panels but says nothing about naming in text. Left blank on purpose rather than invented.

Board: [Voice & Tone - OBA.svg](Voice%20&%20Tone%20-%20OBA.svg)


## 10. Misuse and Motion

The same rules, inverted: what breaks the brand, and the one place motion is allowed.

### Rules

**The only animated component is live-dot-anim, and it animates only while an event is genuinely live.**  
*Prevents:* A permanent pulsing dot is a lie about state, and readers learn to ignore it.  
*Source:* assets/live-dot-anim.svg - the only motion in the system.

**Nothing else moves. No entrance animations on boards, posts or exported SVG.**  
*Prevents:* Motion in a static export is either dropped or janky; both look broken.  
*Source:* The asset contract: no external refs, no scripted behaviour.

**Every failure this document prevents, and the rule that prevents it**

| The failure | The rule |
|---|---|
| A stray brand colour, which is what makes a system look like a template. | There is no chromatic accent. White is the accent. |
| Captions that fail contrast at the size they are actually read. | Text on the dark ground is white, GLOW at .72, or ACCENTTEXT. Nothing else. |
| Canva and Figma flatten group opacity on import and the artwork changes. | Alpha is baked per node, from the fixed ladder. Never a group opacity, never a mask. |
| A second gradient reads as a second brand. | There is one gradient - the hero lobe, STEEL through INK900 at the fixed stops. Any other gradient is not OBA. |
| Mono body copy reads as code, not as a practice-management brand. | IBM Plex Mono is uppercase, tracked wide, and used only for eyebrows, tokens, counters and footers. It never sets body copy. |
| A headline with no dimmed line has no emphasis; one with two has no claim. | A headline is Inter 300 with the turn dimmed: full white for the claim, GLOW at .72 or white at .55 for the line that turns it. One dimmed line, never two. |
| Four lines at title size overflow the safe area on portrait and story. | One to three headline lines, text-wrap balance, -0.02em. |
| Type below the caption floor is gone at thumbnail scale, so it was never read. | Nothing below the caption size for its format. On landscape that is 14 px. |
| Collisions. The first pass ran a chair grid through its own annotation and put a sankey under the footer URL. | Positions come from a mark's measured footprint, never from an eyeballed coordinate. |
| Captions, avatars and platform chrome cover anything that strays outside. | Every composition is checked against the safe-area sheet for its ratio (safe-area-4x5, safe-area-16x9) before it ships. |
| A credential-chip with no label is a blob, not a component. | An empty shell is never placed bare. If a shell has no content, the shell goes too. |
| A fourth radius makes the set look assembled from parts. | Three radii: 30 for boards and cards, 18 for portrait tiles, 999 for pills. No other radius. |
| A grey hairline turns the palette warm-neutral and kills the slate. | A hairline is 1 px of the pale at .12-.16, never a grey. |
| A masked or grouped texture is destroyed by Canva import and by PNG export. | The dot field is an 18 px grid with alpha baked per dot. |
| A dot field read as data is a chart nobody can read. | Texture sits under content, never over it, and never carries meaning on its own. |
| Resolution fails silently and the monogram appears instead of the person. | Headshot files are first-last.jpg, lowercase, dash-separated. |
| An absolute path that works locally and breaks for everyone else. | Resolution order is name, then headshots/, then relative, then absolute, then data URI. |
| A stretched portrait is the single most obvious sign of an un-designed asset. | Images are object-fit: cover / xMidYMid slice. Never letterboxed, never stretched. |
| A broken layout. The fallback is a designed state, not an error state. | When an image is absent the monogram tile stands in: TILEBG, rx 18, hairline .16, initials in Inter 300, and the pill reads PORTRAIT. |
| Undersized images are accepted silently by both engines and go soft on export. | Portraits are 4:5 and at least 800 px on the short edge. |
| Two asks in one artifact means neither is taken. | One CTA per asset, and it is the smallest next commitment. |
| A human-conversation ask on first touch spends trust that has not been earned, and in a small community that damage travels. | First-touch content - clips, quotes, thumbnails, link cards - never carries the Practice Growth Diagnostic CTA. It routes to the pillar page. |
| An invented number shipping as a real one. | Every illustrative figure is sample copy until it is replaced. Its text node is named '... - replace'. |
| A feed is a contrast competition. A mark that dies in all three is decoration. | A composition must still read at 120 px, in greyscale, and cropped. |
| A wordmark set by hand is a different wordmark, and nobody notices until two versions are in the wild. | Never re-typeset the wordmark. Use the file. |
| A crowded mark stops reading as a mark and starts reading as a label. | Clear space on every side is at least the height of the mark itself. |
| The gradient's mid-tones eat the mark's contrast where the lobe is brightest. | The mark goes on PAGEBG, INK900, or white. Never on the hero gradient, never on a photograph. |
| 'OBA' cold means nothing to a practice owner who has not met the brand. | Written out, it is Ophthalmology Business Academy on first use, OBA after. |
| 'Content' is a poor trade for an owner's contact data and time; comparison is not. | The offer is comparison, not content. Lead with a benchmark, an economic model, or a decision framework - the thing an owner cannot get by looking at their own practice. |
| A pitch spends trust, and in a small ophthalmology community reputational damage propagates through referral networks faster than trust replenishes. | Nothing is pitch-shaped. Value is delivered at zero purchase probability. |
| An ask that outruns the relationship is refused, and the refusal is remembered. | The CTA is the smallest next commitment, and there is exactly one per asset. |
| The old name signals agency sales, which is the reason the step was mis-timed. | The human conversation is the Practice Growth Diagnostic. Never 'MSM', never 'marketing strategy meeting', in anything a practice sees. |
| One unsourced number, once challenged by a practice owner, discredits the rest. | Every figure carries its source, or is marked as illustrative. An estimate says it is an estimate. |
| The binding constraint is an owner's attention, not our output. Streams are ignored; one memorable asset is remembered. | One flagship asset per pillar, not a stream. Cut volume, raise density. |
| The audience is surgeons and administrators who read marketing language as noise. | Plain clinical-business English. No agency vocabulary - no 'synergy', no 'leverage' as a verb, no 'unlock', no 'game-changing', no 'revolutionary'. |
| A permanent pulsing dot is a lie about state, and readers learn to ignore it. | The only animated component is live-dot-anim, and it animates only while an event is genuinely live. |
| Motion in a static export is either dropped or janky; both look broken. | Nothing else moves. No entrance animations on boards, posts or exported SVG. |

Board: [Misuse & Motion - OBA.svg](Misuse%20&%20Motion%20-%20OBA.svg)

