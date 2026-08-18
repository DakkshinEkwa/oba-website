import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/marketing/PageHero";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export const metadata: Metadata = {
  title: "Newsletter",
  description:
    "Join the OBA newsletter: practical business insight for ophthalmology practices, new conversations, and event invitations.",
};

const benefits = [
  "Business insight specific to ophthalmology practices",
  "New conversations and articles as they're published",
  "Invitations to panels and events, before they're announced publicly",
  "No spam: unsubscribe anytime",
];

export default function NewsletterPage() {
  return (
    <>
      <PageHero
        tone="subtle"
        eyebrow="Stay in the loop"
        title="Insight for ophthalmology practice leaders"
        lede="Practical, business-focused insight from OBA's conversations, delivered to your inbox, free."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "Newsletter" }]}
      />
      <Section tone="subtle" spacing="default" containerSize="narrow">
        <div className="rounded-xl border border-line bg-canvas p-8 sm:p-10">
          <ul className="mb-8 grid gap-3 sm:grid-cols-2">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-body text-ink-600">
                <Check className="mt-0.5 size-5 shrink-0 text-accent-600" aria-hidden />
                {b}
              </li>
            ))}
          </ul>
          <NewsletterForm />
          <p className="mt-4 text-small text-ink-400">
            By subscribing you agree to receive email updates from the Ophthalmology Business Academy.
          </p>
        </div>
      </Section>
    </>
  );
}
