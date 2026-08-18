import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Mic, Handshake, ArrowUpRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/marketing/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach the Ophthalmology Business Academy team: general questions, speaking, or partnerships.",
};

const intents = [
  {
    icon: Mic,
    title: "Interested in speaking?",
    body: "If you've navigated a problem your peers are still facing, start on the speaker page.",
    href: "/speak",
    label: "Become a Speaker",
  },
  {
    icon: Handshake,
    title: "Exploring a partnership?",
    body: "Organizations serving ophthalmology can read how we collaborate before reaching out.",
    href: "/partnerships",
    label: "Explore Partnerships",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        tone="subtle"
        eyebrow="We'd love to hear from you"
        title="Get in touch"
        lede="Questions about the academy, the podcast, an episode, or anything else? Send a note and we'll get back to you."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <Section tone="subtle" spacing="default">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="text-h3 font-normal">Looking for something specific?</h2>
            <ul className="mt-6 space-y-4">
              {intents.map((i) => (
                <li key={i.href} className="rounded-lg border border-line bg-canvas p-5">
                  <div className="flex items-start gap-3">
                    <i.icon className="mt-0.5 size-5 text-accent-600" aria-hidden />
                    <div>
                      <p className="text-body font-semibold text-ink-800">{i.title}</p>
                      <p className="mt-1 text-body text-ink-500">{i.body}</p>
                      <Link
                        href={i.href}
                        className="mt-2 inline-flex items-center gap-1 text-small font-semibold text-accent-600 hover:text-accent-700"
                      >
                        {i.label} <ArrowUpRight className="size-4" aria-hidden />
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <h2 className="mt-10 text-h3 font-normal">Reach us directly</h2>
            <ul className="mt-6 space-y-5">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-5 text-accent-600" aria-hidden />
                <div>
                  <p className="text-small font-semibold text-ink-800">Email</p>
                  <a href={`mailto:${siteConfig.email}`} className="text-body text-accent-600 hover:text-accent-700">
                    {siteConfig.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-5 text-accent-600" aria-hidden />
                <div>
                  <p className="text-small font-semibold text-ink-800">Address</p>
                  <p className="text-body text-ink-500">
                    {siteConfig.address.line1}
                    <br />
                    {siteConfig.address.line2}
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-line bg-canvas p-6 sm:p-8">
            <ContactForm variant="contact" />
          </div>
        </div>
      </Section>
    </>
  );
}
