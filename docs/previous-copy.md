# OBA Website — Previous Copy (pre-rewrite reference)

Verbatim record of the site copy as it stood before the July 2026 messaging rewrite
(see `docs/messaging-strategy.md` for the audit and rationale behind the changes).
Content pages (episode/blog MDX bodies, `hosts.json` bios) were not rewritten and are not duplicated here.

---

## Global (`src/lib/site.ts`, `layout.tsx`)

- **Site description** (meta, footer, JSON-LD):
  > Actionable business-building resources, strategies, and expert insight for ophthalmologists — podcasts, webinars, and training that turn clinical excellence into a thriving practice.
- **Default SEO title:** `Ophthalmology Business Academy — Business Growth for Ophthalmology`
- **Primary CTA (site-wide, header + CTA bands):** **Analyze Your Marketing** → `/analyze`
- **Primary nav:** Resources (Expert Insights Hub — "Curated business insight in one place" / Webinar Archive — "On-demand expert sessions" / Blog — "Articles on practice growth" / Newsletter — "Weekly strategies to your inbox" / Events — "Live panels and meetups") · Podcast (Episodes — "Every episode, on demand" / Hosts — "Meet the voices behind OBA" / About the Podcast — "What the show is about") · Membership · About · Contact
- **Footer "Academy" column:** About · Membership · Analyze Your Marketing · Contact
- **Footer newsletter band:**
  > **Weekly insight for ophthalmology practices**
  > Practical business strategies, new episodes, and event invites — straight to your inbox.

## Shared CTA band (`CTASection.tsx` defaults — closed Home, About, Membership, Podcast, Resources)

- Eyebrow: "Grow your practice"
- H2: "See exactly where your / *practice marketing stands.*"
- Body:
  > Get a complimentary, no-obligation analysis of your digital marketing from an advisor who works exclusively with medical practices.
- CTAs: **Analyze Your Marketing** → `/analyze` · **Explore membership** → `/membership`

---

## Homepage (`/`)

- **Hero eyebrow:** "Join **1,000s** of practice owners"
- **Hero H1:** "Master the business / *behind the practice.*"
- **Hero copy:**
  > Personalized business education for ophthalmologists — strategies, expert interviews, and training built on what actually grows practices.
- **CTAs:** Analyze Your Marketing → `/analyze` · Browse episodes → `/podcast/episodes`
- **Micro-labels:** Practitioner-led / "75+ expert episodes" · Specific / "Built for eye care" · Actionable / "Strategies, not theory"
- **Featured strip eyebrow:** "Latest episode" (+ "Listen to this episode")
- **Stat band:** 75+ Podcast episodes · 6 Expert hosts & guests · Weekly New business insight · 100% Ophthalmology-focused
- **Why join section:** eyebrow "Why join OB Academy"; title "Everything you need to run / *the business side of eye care.*"; lede:
  > Clinical skill builds a reputation. Business skill builds a practice. OB Academy gives ophthalmologists both.
  1. **Weekly educational content** — "Fresh podcast episodes, articles, and expert sessions covering marketing, operations, leadership, and finance — every week."
  2. **Events & webinar access** — "Enroll in live panels and on-demand webinars with leaders who have scaled real ophthalmology practices."
  3. **Expert networking** — "Connect with practice owners, administrators, and industry experts who understand the business of eye care."
- **Latest episodes:** eyebrow "The podcast", title "Latest from the show" · **Blog:** eyebrow "Insights", title "From the blog"

---

## About (`/about`)

- **SEO title:** "About" · **Meta:** "The Ophthalmology Business Academy provides actionable business-building resources, tips, and strategies to all ophthalmologists."
- **Hero:** eyebrow "Our mission"; H1 "Building the business skills ophthalmology needs"; lede = meta text.
- **Intro:**
  > As the business of medicine grows more competitive, clinical excellence alone no longer guarantees a healthy practice. Marketing, operations, staffing, finance, and leadership increasingly determine whether a practice thrives or merely survives.
  >
  > OB Academy was founded to close that gap. Through 75+ podcast episodes, articles, webinars, and events, we give ophthalmologists and their teams the practical, business-focused education that medical school never covered — all in one place, and all specific to eye care.
- **What we believe** ("The principles behind everything we publish"):
  - **Business skill is clinical skill** — "Medical training builds exceptional clinicians. Running a thriving practice takes a different set of skills — and we exist to teach them."
  - **Practical over theoretical** — "Everything we publish comes from people who operate real practices. If it hasn't worked in the field, it doesn't make the show."
  - **Made for ophthalmology** — "Generic business advice only goes so far. Our content is specific to the realities of eye care practices."
- **Team section:** eyebrow "The team", title "Hosts & regular contributors"

---

## Membership (`/membership`)

- **Meta:** "Join the Ophthalmology Business Academy for full access to podcasts, webinars, events, and expert business resources."
- **Hero:** eyebrow "Join the academy"; H1 "Everything you need, in one membership"; lede "Unlock the full OB Academy library — podcasts, webinars, events, and weekly business insight built for ophthalmology practices."
- **Pricing card:** Free membership · $0 / forever · "Full access to the academy's educational resources."
  Included: Full podcast library — every episode, on demand · On-demand webinars and expert sessions · Weekly newsletter with business strategies · Priority invitations to live events and panels · Networking with practice owners and administrators · New educational content every week
  CTA: **Create your free account** · "Already a member? Log in"
- **FAQ:**
  - How much does membership cost? — "Membership is free to join. Create an account to unlock the full library of resources."
  - Who is membership for? — "Ophthalmologists, practice owners, administrators, and anyone growing the business side of an eye care practice."
  - Can I cancel anytime? — "Yes — there's no long-term commitment."

---

## Contact (`/contact`)

- **Meta:** "Get in touch with the Ophthalmology Business Academy team."
- **Hero:** eyebrow "We'd love to hear from you"; H1 "Get in touch"; lede "Questions about the academy, the podcast, or partnering with us? Send a note and we'll get back to you."
- Sections: "Reach us directly" (email + address) + contact form. (No speaker/partnership routing existed.)

---

## Podcast — About the show (`/podcast`)

- **Meta:** "The Ophthalmology Business Podcast — candid conversations on marketing, operations, leadership, and growth for eye care practices."
- **Hero:** eyebrow "The Ophthalmology Business Podcast"; H1 "Real conversations on the business of eye care"; lede "75+ episodes of candid, practical insight from the physicians, administrators, and experts growing modern ophthalmology practices." CTAs: Browse all episodes · Meet the hosts
- **Feature cards:**
  - **Practitioner-led** — "Hosted by operators and physicians who run real practices — not theorists."
  - **Actionable every week** — "Each episode ends with strategies you can apply to your practice immediately."
  - **Built on relationships** — "Guests share what actually moved the needle for their teams and patients."
- Sections: "Latest episodes" · eyebrow "The voices", title "Hosts & regular guests"

## Podcast — Hosts (`/podcast/hosts`)

- **Hero:** eyebrow "The people behind the show"; H1 "Hosts & regular guests"; lede "Operators, physicians, and industry experts who bring real-world experience to every conversation."

## Podcast — Episodes archive (`/podcast/episodes`)

- **Hero:** eyebrow "The Ophthalmology Business Podcast"; H1 "Every episode, on demand"; lede "Candid conversations with the physicians, administrators, and industry experts shaping the business of eye care."

---

## Resources hub (`/resources`)

- **Meta:** "Podcasts, articles, webinars, and events — every OB Academy resource for growing your ophthalmology practice, in one place."
- **Hero:** eyebrow "Expert Insights Hub"; H1 "Every resource for growing your practice"; lede "Podcasts, articles, webinars, and events — curated for ophthalmologists and practice owners."
- **Hub cards:** Podcast — "Weekly conversations with practice leaders." · Blog — "Practical articles on practice growth." · Webinars — "On-demand expert sessions." · Events — "Live panels and meetups." · Newsletter — "Weekly strategies to your inbox."

## Events (`/resources/events`) — empty state

- **Hero:** eyebrow "Connect & learn"; H1 "Events & live panels"; lede "Meet peers, learn from experts, and grow your network at OB Academy events."
- **Empty state:** "New events coming soon" — "Our next round of live panels and meetups is being scheduled. Join the newsletter to be the first to know." CTA: Join the newsletter

## Webinars (`/resources/webinars`) — empty state

- **Hero:** eyebrow "On-demand sessions"; H1 "Webinar archive"; lede "Deep-dive sessions with experts on marketing, operations, and leadership for eye care practices."
- **Empty state:** "New sessions on the way" — "We're recording our next round of expert webinars. In the meantime, explore the podcast for weekly insight." CTA: Browse podcast episodes

## Newsletter (`/resources/newsletter`)

- **Meta:** "Join the OB Academy newsletter for weekly business strategies, new episodes, and event invites."
- **Hero:** eyebrow "Stay in the loop"; H1 "Weekly insight for ophthalmology practices"; lede "Join thousands of practice owners getting practical, business-focused strategies in their inbox."
- **Benefits:** Weekly business strategies tailored to ophthalmology practices · First access to new podcast episodes and webinars · Invitations to live panels and events · No spam — unsubscribe anytime

## Blog (`/blog`) — unchanged in rewrite

- **Hero:** eyebrow "Insights"; H1 "The OB Academy blog"; lede "Practical, business-focused articles for ophthalmologists and practice owners."

---

## Analyze Your Marketing (`/analyze`)

- **SEO title:** "Analyze Your Marketing" · **Meta:** "Get a complimentary, no-obligation analysis of your ophthalmology practice's digital marketing from an advisor who works exclusively with medical practices."
- **Hero:** eyebrow "Complimentary marketing analysis"; H1 "See exactly where your practice marketing stands"; sub:
  > A no-obligation review of your digital marketing from an advisor who works exclusively with medical practices. Know what's working, what isn't, and what to fix first.
- **Trust bullets:** No cost, no obligation · Specific to ophthalmology · Actionable in days, not months
- **Form card:** "Request your free analysis" / "Takes under a minute."
- **Three simple steps:** 01 "We review your presence" — "Website, search visibility, reviews, and how you compare to nearby practices." · 02 "You get a clear report" — "A plain-language breakdown of what's working and where you're losing patients." · 03 "You get an action plan" — "Specific, prioritized recommendations you can act on — with or without us."
- **FAQ:**
  - Is this really free? — "Yes. The analysis is complimentary and there is no obligation to buy anything."
  - Who performs the analysis? — "An advisor who works exclusively with medical and ophthalmology practices — not a generalist agency." *(no Ekwa attribution)*
  - How long does it take? — "The review takes a few business days, after which an advisor walks you through the findings."
  - What do you need from me? — "Just your practice name and website. The more context you share, the more tailored the analysis."

---

## Auth (`/login`, `/register`, `/forgot-password`)

- **AuthShell value panel:** "Join thousands of ophthalmology practices growing with OB Academy." Perks: Full podcast & webinar library · Weekly business strategies · Invitations to live events. Footer: "Free to join · No credit card required"
- **Register meta:** "Join the Ophthalmology Business Academy free to unlock podcasts, webinars, and expert business resources." H1 "Create your free account"; subtitle "Unlock the full library of business resources for ophthalmology practices."
- **Login:** H1 "Welcome back"; subtitle "Log in to access your OB Academy resources."
- **Forgot password:** H1 "Reset your password"; subtitle "Enter your email and we'll send you a reset link." (panel variant: "Practical business education, built for eye care.")

## Form microcopy (pre-rewrite `ContactForm`)

- Variants: `contact`, `analyze` only (no speaker/partnership variants existed).
- Buttons: "Send message" / "Request my free analysis"
- Success (analyze): "Thanks — we'll be in touch" / "An advisor will review your practice and reach out to schedule your complimentary analysis."
- Success (contact): "A member of the OB Academy team will get back to you shortly."

---

## Pages that did not exist before the rewrite

- `/speak` (Become a Speaker)
- `/partnerships`
