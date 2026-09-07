# Deployment — read before you host this

Written for whoever wires this repo up to `www.obacademy.org`. It assumes you have domain and
hosting access and no prior context on the codebase.

**The short version: this site cannot go on a pure static host without extra work.** It is fully
statically generated, so a static host *looks* like it works — every page renders — while silently
dropping two things the site's search visibility depends on. Details in §1.

---

## 1. Host requirements

Next.js 16 App Router, fully SSG. No database, no API routes, no auth, no server state. Node 20+.

```bash
npm ci
npm run build          # also runs zod content validation; invalid content fails the build
npm run start          # serves the production build
```

The build emits static HTML for all 110 pages, plus ~180 machine-readable files (RSS, sitemap,
`llms.txt`, an OKF bundle, and Markdown mirrors of every episode and post).

### What breaks on a static host, and why it is invisible

`next.config.ts` declares two maps that are applied by the **host**, not baked into the output:

| Map | Contents | If dropped |
|---|---|---|
| `redirects()` | **28 permanent 301s** | Every legacy WordPress URL the old site had indexed — `/podcast-show/<slug>`, `/guest-speaker`, `/webinar-archive`, `/hosts`, `/events` and 23 more — returns 404. Accumulated link equity is lost, not redirected. |
| `headers()` | Security headers + `Cache-Control` | `X-Robots-Tag: noindex` disappears from `/okf/*` and all `*/md` mirrors, so ~180 alternate representations of existing pages become indexable duplicate content competing with the real pages. |

Neither failure produces an error, a warning, or a visibly broken page. The site looks fine and the
SEO quietly degrades. **This is the single highest-risk decision in the handover.**

`next.config.ts` carries a build-time guard that throws if someone sets `output: "export"`, because
that is the usual accidental route into this state.

### Recommended: Vercel

Zero-config for this repo — `vercel.json` is committed, the framework is detected, and both maps are
applied natively. Nothing else to do.

### If you must use a static host

Re-home both maps onto the host *before* cutting over, and verify with §4:

- Translate all 28 entries from `redirects()` into host-level 301 rules.
- Translate `headers()`, **especially `X-Robots-Tag: noindex`** on `/okf/*` and `/*/md`. If your host
  cannot set per-path response headers, do not use it — there is no HTML-level substitute for a
  header on a non-HTML file.

---

## 2. Environment variables

All optional; the build succeeds without them.

| Variable | Effect |
|---|---|
| `NEXT_PUBLIC_GSC_TOKEN` | Emits the Google Search Console verification meta tag. |
| `NEXT_PUBLIC_BING_TOKEN` | Emits `msvalidate.01` for Bing Webmaster Tools. |
| `EPISODE_SHEET_CSV_URL` | **CI only.** Google Sheet CSV export URL for the content pipeline. Set as a repo secret, not a deploy env var. |

GA4 (`G-6GDGK5QGS4`) is hardcoded in `src/lib/site.ts` and needs no configuration.

---

## 3. Canonical host

Every absolute URL on the site — canonicals, sitemap, JSON-LD, OG tags, RSS — is derived from
`siteConfig.url` in `src/lib/site.ts`, currently `https://www.obacademy.org`.

Serve that exact origin. Specifically:

- **`www` is canonical.** Redirect apex `obacademy.org` → `www.obacademy.org`, 301.
- **HTTPS only.** Redirect http → https.
- **No trailing slashes** (`trailingSlash: false`, set in `vercel.json`).
- If the final hostname differs from the above, change `siteConfig.url` and rebuild. Do not paper
  over a mismatch at the host — a canonical tag pointing somewhere other than the served URL is worse
  than no canonical.

Enable HSTS once HTTPS is confirmed stable. The header is written and commented out in
`next.config.ts` for exactly this reason — enabling it before the certificate chain is settled can
lock users out of the domain.

---

## 4. Post-deploy verification

Run these against the live domain. Every one currently fails on the domain as served today, because
it is still serving an unrelated stale build.

```bash
# 1. Legacy 301s survived the host. Expect 301 and a Location header, not 404.
curl -sI https://www.obacademy.org/podcast-show/switching-emr-systems | head -3
curl -sI https://www.obacademy.org/guest-speaker | head -3

# 2. Security headers are applied.
curl -sI https://www.obacademy.org/ | grep -i "x-content-type-options\|referrer-policy"

# 3. The mirrors are noindex. This one is easy to miss and costly.
curl -sI https://www.obacademy.org/podcast/episodes/switching-emr-systems/md | grep -i x-robots-tag
curl -sI https://www.obacademy.org/okf/index.md | grep -i x-robots-tag

# 4. Canonical points at the served origin.
curl -s https://www.obacademy.org/about | grep -o '<link rel="canonical"[^>]*>'

# 5. Agent surfaces resolve.
curl -sI https://www.obacademy.org/llms.txt | head -1
curl -sI https://www.obacademy.org/feed.xml | head -1
curl -s https://www.obacademy.org/sitemap.xml | grep -c "<loc>"    # expect 109

# 6. apex → www
curl -sI https://obacademy.org/ | head -3
```

Then, in Search Console: verify the property, submit `https://www.obacademy.org/sitemap.xml`, and
use the URL Inspection tool on one episode page to confirm Google reads the `PodcastEpisode` JSON-LD.

The old build's URLs are already indexed against this domain, so expect a transition period while
Google recrawls. The 301 map is what carries that over — which is why check 1 matters most.

---

## 5. Ongoing content pipeline

`.github/workflows/publish-episodes.yml` runs daily and on demand. It reads the episode Google Sheet,
writes new episodes and any transcripts into `src/content/`, and commits. It needs the
`EPISODE_SHEET_CSV_URL` repo secret and is a no-op without it.

It commits to the default branch, so whatever hosting you choose should deploy on push to that branch.

---

## 6. What is deliberately not done

So you don't "fix" things that are decisions:

- **No transcripts yet.** The full pipeline ships and is idle by choice; content comes later. See
  `docs/ai-seo.md`.
- **No site search**, and `WebSite.potentialAction` deliberately omits `SearchAction`. Declaring a
  search capability the site lacks is a false claim to search engines.
- **No auth.** `/login`, `/register`, `/forgot-password` were removed and 301 to `/resources`.
  Do not re-add them.
- **All forms are styled shells** with client-side validation and stubbed submission. They are not
  wired to a backend, by design. Do not promote conversion paths until they are.
- **`not-found.tsx` emits no canonical.** Intentional — a 404 must not claim one.
- **Nothing published since 2024-06-07.** Known and honest; the site never claims a publishing
  cadence, and it must not start.
