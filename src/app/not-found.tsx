import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

const TITLE = "Page not found";
// Same sentence the page shows below the heading — a 404 has nothing else to describe.
const DESCRIPTION =
  "The page you're looking for may have moved. Try the podcast, the blog, or head back home.";

/**
 * Hand-rolled rather than routed through pageMetadata(), which always sets
 * alternates.canonical from `path` — there is no path value that yields null, and
 * clearing the canonical is the whole point here.
 */
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  // Next emits its own noindex for not-found. The canonical must be cleared or
  // the 404 inherits the layout's "/" and claims to be the homepage.
  alternates: { canonical: null },
  // Without this the layout's `index, follow` also emits, leaving the page with two
  // contradictory robots tags.
  robots: { index: false, follow: true },
  // Next replaces the parent openGraph wholesale rather than merging field by field,
  // so declaring it here means re-supplying `images`. No `url`: a 404 has no
  // canonical address, and omitting og:url is the only honest value.
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_US",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/opengraph-image", alt: siteConfig.name }],
  },
};

export default function NotFound() {
  return (
    <Section spacing="loose">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-mono text-eyebrow uppercase text-accent-600">Error 404</p>
        <h1 className="mt-4 text-h1 font-light tracking-tight text-ink-900">This page couldn&apos;t be found</h1>
        <p className="mt-4 text-lede text-ink-500">
          The page you&apos;re looking for may have moved. Try the podcast, the blog, or head back home.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/" variant="primary">
            Back to home
          </Button>
          <Button href="/podcast/episodes" variant="outline">
            Browse episodes
          </Button>
        </div>
      </div>
    </Section>
  );
}
