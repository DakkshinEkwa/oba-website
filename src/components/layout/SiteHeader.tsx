"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";
import { Button } from "@/components/ui/Button";
import { primaryNav, siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Routes whose hero is dark, so the attached (transparent) nav needs white text. */
const DARK_HERO_ROUTES = ["/"];

/**
 * Qoves-style nav. At the top of the page it is transparent and spread across
 * the site — no panel, no border, no shadow — with the text tone matching the
 * surface beneath (white over the dark home hero, ink over light pages). On
 * scroll it condenses into a floating detached glass bar.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onDark = scrolled || DARK_HERO_ROUTES.includes(pathname);

  return (
    <header
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-50 transition-[padding] duration-500 ease-out",
        scrolled ? "px-3 pt-3 sm:px-5 sm:pt-4" : "pt-4 sm:pt-5",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <div
        className={cn(
          "pointer-events-auto mx-auto flex h-16 items-center justify-between gap-6 border transition-[padding,max-width,border-radius,background-color,border-color] duration-500 ease-out",
          scrolled
            ? "max-w-[var(--container-wide)] rounded-xl border-white/10 bg-ink-800/70 px-3 pl-5 shadow-lg backdrop-blur-xl sm:px-3.5 sm:pl-6"
            : "max-w-[110rem] rounded-none border-transparent bg-transparent px-5 pl-6 sm:px-6 sm:pl-8 lg:px-8 lg:pl-10",
        )}
      >
        <Logo tone={onDark ? "light" : "dark"} />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {primaryNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            if (item.children) {
              return <NavDropdown key={item.label} item={item} active={active} onDark={onDark} />;
            }
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn("rounded-md px-3 py-2 text-small transition-colors", navLinkTone(onDark, active))}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-1.5 lg:flex">
          <Button
            href="/login"
            size="sm"
            className={cn(
              "bg-transparent",
              onDark
                ? "text-white/75 hover:bg-white/10 hover:text-white"
                : "text-ink-500 hover:bg-ink-900/5 hover:text-ink-900",
            )}
          >
            Log In
          </Button>
          <Button href={siteConfig.primaryCta.href} variant={onDark ? "onDark" : "primary"} size="sm">
            {siteConfig.primaryCta.label}
          </Button>
        </div>

        <div className="lg:hidden">
          <MobileNav tone={onDark ? "light" : "dark"} />
        </div>
      </div>
    </header>
  );
}

function navLinkTone(onDark: boolean, active: boolean) {
  if (onDark) return active ? "bg-white/10 text-white" : "text-white/65 hover:bg-white/10 hover:text-white";
  return active ? "bg-ink-900/5 text-ink-900" : "text-ink-500 hover:bg-ink-900/8 hover:text-ink-900";
}

function NavDropdown({
  item,
  active,
  onDark,
}: {
  item: (typeof primaryNav)[number];
  active: boolean;
  onDark: boolean;
}) {
  return (
    <div className="group relative">
      <Link
        href={item.href}
        className={cn(
          "inline-flex items-center gap-1 rounded-md px-3 py-2 text-small transition-colors",
          navLinkTone(onDark, active),
        )}
      >
        {item.label}
        <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" aria-hidden />
      </Link>
      <div className="invisible absolute left-0 top-full pt-3 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="w-72 rounded-xl border border-line bg-canvas/95 p-2 shadow-lg backdrop-blur-xl">
          {item.children!.map((child) => (
            <Link
              key={child.label}
              href={child.href}
              className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-ink-900/8"
            >
              <span className="block text-small font-medium text-ink-900">{child.label}</span>
              {child.description ? (
                <span className="mt-0.5 block text-small text-ink-400">{child.description}</span>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
