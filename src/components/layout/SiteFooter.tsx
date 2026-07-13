import Link from "next/link";
import { Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { FacebookIcon, LinkedinIcon, InstagramIcon } from "@/components/icons/BrandIcons";
import { footerNav, siteConfig } from "@/lib/site";

/** Light, hairline-ruled footer ending in a giant wordmark (Qoves-style). */
export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-canvas text-ink-500">
      {/* Newsletter band */}
      <div className="border-b border-line">
        <Container size="wide">
          <div className="grid gap-8 py-14 lg:grid-cols-2 lg:items-center">
            <div className="max-w-md">
              <h2 className="text-h3 font-normal text-ink-900">
                Insight for ophthalmology practice leaders
              </h2>
              <p className="mt-2 text-body text-ink-500">
                New conversations, practical articles, and event invitations — straight to your inbox.
              </p>
            </div>
            <div className="lg:w-full lg:max-w-md lg:justify-self-end">
              <NewsletterForm />
            </div>
          </div>
        </Container>
      </div>

      {/* Link columns */}
      <Container size="wide">
        <div className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-small text-ink-400">{siteConfig.description}</p>
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
              <h3 className="font-mono text-eyebrow uppercase text-ink-400">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-small text-ink-500 transition-colors hover:text-ink-900"
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

      {/* Legal bar */}
      <div className="border-t border-line">
        <Container size="wide">
          <div className="flex flex-col gap-3 py-6 text-small text-ink-400 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </p>
            <p>
              {siteConfig.address.line1}, {siteConfig.address.line2}
            </p>
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
      className="inline-flex size-9 items-center justify-center rounded-pill border border-line text-ink-400 transition-colors hover:border-line-strong hover:text-ink-900"
    >
      {children}
    </a>
  );
}
