import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  // Next emits its own noindex for not-found. The canonical must be cleared or
  // the 404 inherits the layout's "/" and claims to be the homepage.
  alternates: { canonical: null },
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
