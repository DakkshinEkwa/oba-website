import { PageHero } from "@/components/marketing/PageHero";
import { Section } from "@/components/ui/Section";
import { Prose } from "@/components/ui/Prose";
import { siteConfig } from "@/lib/site";
import { pageMetadata } from "@/lib/og/metadata";

export const metadata = pageMetadata({
  title: "Terms of Use",
  description:
    "The terms that govern your use of the Ophthalmology Business Academy website.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Terms"
        title="Terms of Use"
        lede="The ground rules for using the Ophthalmology Business Academy website."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Terms" }]}
      />
      <Section spacing="default" containerSize="narrow">
        <Prose>
          <p>
            These terms govern your use of the {siteConfig.name} website and the content it
            makes available. By using the site, you agree to these terms. If you do not
            agree, please do not use the site.
          </p>

          <h2>Use of the site</h2>
          <p>
            The site is provided for personal, non-commercial, educational use. You agree
            not to misuse the site, attempt to gain unauthorized access to it, or interfere
            with its operation.
          </p>

          <h2>Content and intellectual property</h2>
          <p>
            The educational content we publish, including episodes, articles, and
            transcripts, is made available for your personal use. The site’s design, text,
            and original materials are protected by intellectual property laws. You may
            share links to our content and quote from it with attribution, but you may not
            republish or redistribute it commercially without permission.
          </p>

          <h2>Views and accuracy</h2>
          <p>
            Conversations and articles reflect the views of the people involved. We work to
            keep information accurate and current, but the content is provided for
            education, not as professional, medical, financial, or legal advice. Decisions
            about your practice remain yours.
          </p>

          <h2>No warranty</h2>
          <p>
            The site and its content are provided “as is” and “as available,” without
            warranties of any kind, express or implied. We do not guarantee that the site
            will be uninterrupted or error-free.
          </p>

          <h2>Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, {siteConfig.name} and its contributors
            are not liable for any damages arising from your use of the site or its content.
          </p>

          <h2>Third-party services</h2>
          <p>
            The site links to and embeds services provided by others, including podcast
            audio, email sign-ups, and partner websites. Those services have their own terms
            and privacy practices, which we encourage you to review.
          </p>

          <h2>Governing law</h2>
          <p>
            These terms are governed by the laws of Ontario, Canada, and any disputes are
            subject to the jurisdiction of its courts.
          </p>

          <h2>Changes to these terms</h2>
          <p>
            We may update these terms from time to time. The current version is always
            available on this page.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these terms can be sent to{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>
        </Prose>
      </Section>
    </>
  );
}
