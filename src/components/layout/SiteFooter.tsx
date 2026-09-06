import Link from "next/link";
import { Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { FacebookIcon, LinkedinIcon, InstagramIcon } from "@/components/icons/BrandIcons";
import { ChatGPTIcon, ClaudeIcon, GeminiIcon, GrokIcon, SparkleIcon } from "@/components/icons/AiIcons";
import { aiSummary, footerNav, siteConfig } from "@/lib/site";

const aiBrandIcons = {
  ChatGPT: ChatGPTIcon,
  Claude: ClaudeIcon,
  Gemini: GeminiIcon,
  Grok: GrokIcon,
} as const;

/** Dark cinematic footer on --gradient-hero, hairline-ruled bands. */
export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink-900 text-white/65">
      <div aria-hidden className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div aria-hidden className="absolute inset-0 opacity-25" style={{ background: "var(--gradient-hero-glow)" }} />

      {/* Newsletter band — the site's only sign-up surface, and the target of
          every "join the newsletter" CTA now that /resources/newsletter is gone. */}
      <div id="newsletter" className="relative scroll-mt-24 border-b border-white/10">
        <Container size="wide">
          <div className="grid gap-8 py-14 lg:grid-cols-2 lg:items-center">
            <div className="max-w-md">
              <h2 className="text-h3 font-normal text-white">
                Insight for ophthalmology practice leaders
              </h2>
              <p className="mt-2 text-body text-white/65">
                New conversations, practical articles, and event invitations, straight to your inbox.
              </p>
            </div>
            <div className="lg:w-full lg:max-w-md lg:justify-self-end">
              <NewsletterForm tone="light" />
            </div>
          </div>
        </Container>
      </div>

      {/* Link columns */}
      <Container size="wide" className="relative">
        <div className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <Logo tone="light" />
            <p className="mt-4 text-small text-white/45">{siteConfig.description}</p>
            <div className="mt-5 flex items-center gap-2">
              <SocialLink href={siteConfig.socials.facebook} label="Facebook">
                <FacebookIcon className="size-4" />
              </SocialLink>
              <SocialLink href={siteConfig.socials.linkedin} label="LinkedIn">
                <LinkedinIcon className="size-4" />
              </SocialLink>
              <SocialLink href={siteConfig.socials.instagram} label="Instagram">
                <InstagramIcon className="size-4" />
              </SocialLink>
              <SocialLink href={`mailto:${siteConfig.email}`} label="Email">
                <Mail className="size-4" aria-hidden />
              </SocialLink>
            </div>
          </div>

          {footerNav.map((col) => (
            <div key={col.title}>
              <h3 className="font-mono text-eyebrow uppercase text-white/45">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-small text-white/65 transition-colors hover:text-white focus-visible:outline-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>

      {/* AI summary band */}
      <div id="ai-summary" className="relative scroll-mt-(--header-offset) border-t border-white/10">
        <Container size="wide">
          <div className="flex flex-col items-center gap-4 py-8 text-small text-white/65 sm:flex-row sm:justify-center sm:gap-3">
            <p className="flex items-center gap-2">
              <SparkleIcon className="size-4" />
              {aiSummary.label}
            </p>
            <ul className="flex items-center gap-2.5">
              {aiSummary.providers.map((provider) => {
                const Icon = aiBrandIcons[provider.name];
                const href = `${provider.chatUrl}?q=${encodeURIComponent(aiSummary.prompt)}`;
                return (
                  <li key={provider.name}>
                    <a
                      href={href}
                      aria-label={`${aiSummary.label} with ${provider.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex size-10 items-center justify-center rounded-md border border-white/15 bg-white/10 text-white transition hover:border-white/35 hover:bg-white/20 focus-visible:outline-white"
                    >
                      <Icon className="size-5" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </Container>
      </div>

      {/* Legal bar */}
      <div className="relative border-t border-white/10">
        <Container size="wide">
          <div className="flex flex-col gap-3 py-6 text-small text-white/45 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <p>
                {siteConfig.address.line1}, {siteConfig.address.line2}
              </p>
              <span aria-hidden className="text-white/25">
                ·
              </span>
              <Link href="/privacy" className="transition-colors hover:text-white focus-visible:outline-white">
                Privacy
              </Link>
              <span aria-hidden className="text-white/25">
                ·
              </span>
              <Link href="/terms" className="transition-colors hover:text-white focus-visible:outline-white">
                Terms
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex size-9 items-center justify-center rounded-pill border border-white/15 text-white/65 transition-colors hover:border-white/35 hover:text-white focus-visible:outline-white"
    >
      {children}
    </a>
  );
}
