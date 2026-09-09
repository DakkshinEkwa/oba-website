import { PageHero } from "@/components/marketing/PageHero";
import { Section } from "@/components/ui/Section";
import { Prose } from "@/components/ui/Prose";
import { siteConfig } from "@/lib/site";
import { pageMetadata } from "@/lib/og/metadata";
import { pageJsonLd } from "@/lib/jsonld";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How the Ophthalmology Business Academy collects, uses, and protects your information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            pageJsonLd({
              type: "WebPage",
              name: "Privacy Policy",
              description:
                "How the Ophthalmology Business Academy collects, uses, and protects your information.",
              path: "/privacy",
            }),
          ),
        }}
      />
      <PageHero
        eyebrow="Privacy"
        title="Privacy Policy"
        lede="How we handle the information you share with the Ophthalmology Business Academy."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Privacy" }]}
      />
      <Section spacing="default" containerSize="narrow">
        <Prose>
          <p>
            This policy explains what information the Ophthalmology Business Academy
            (“{siteConfig.name}”, “we”, “us”) collects through this website, why we collect
            it, and the choices you have. It applies to the site and the services offered
            from it. Our contact address is {siteConfig.address.line1},{" "}
            {siteConfig.address.line2}.
          </p>

          <h2>Information we collect</h2>
          <ul>
            <li>
              <strong>Information you give us.</strong> When you contact us, apply to speak,
              enquire about partnerships, or request a marketing analysis, we receive the
              details you submit, typically your name, email address, practice or
              organization, and anything you write to us.
            </li>
            <li>
              <strong>Newsletter sign-ups.</strong> When you subscribe to the newsletter we
              collect your email address.
            </li>
            <li>
              <strong>Technical information.</strong> Like most websites, we may collect
              basic technical data (such as browser type and pages visited) through cookies
              and similar technologies.
            </li>
          </ul>

          <h2>How we use your information</h2>
          <ul>
            <li>To respond to your questions, applications, and enquiries.</li>
            <li>To send the newsletter and other communications you have asked for.</li>
            <li>To operate, improve, and protect the website.</li>
            <li>To meet legal and security obligations.</li>
          </ul>
          <p>
            We do not sell your personal information, and we do not use it for advertising
            unless you have chosen to hear from us.
          </p>

          <h2>Newsletter and email</h2>
          <p>
            Newsletter sign-ups are processed through a third-party email provider so that
            messages can be delivered reliably. Every email we send includes a way to
            unsubscribe, and you can ask to be removed at any time by emailing{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>

          <h2>Cookies and analytics</h2>
          <p>
            We use cookies and similar technologies to keep the site working and to
            understand how it is used so we can improve it. You can disable cookies in your
            browser, though some parts of the site may not work as well without them.
          </p>

          <h2>Sharing and third parties</h2>
          <p>
            We share information only with the service providers needed to operate this site
            (for example, hosting and email delivery), and only to the extent necessary to
            provide those services. We may disclose information where the law requires it.
          </p>

          <h2>Data retention and security</h2>
          <p>
            We keep personal information only as long as needed for the purposes described
            here, and we take reasonable steps to protect it. No method of transmission or
            storage is completely secure, so we cannot guarantee absolute security.
          </p>

          <h2>Your rights</h2>
          <p>
            Depending on where you live, you may have the right to access, correct, or
            delete the personal information we hold about you, or to object to or restrict
            certain processing. To exercise any of these rights, email{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            We may update this policy from time to time. The current version is always
            available on this page.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this policy can be sent to{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>
        </Prose>
      </Section>
    </>
  );
}
