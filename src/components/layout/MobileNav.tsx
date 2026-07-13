"use client";

import { useState } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/Button";
import { primaryNav, siteConfig } from "@/lib/site";

export function MobileNav({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          className={
            tone === "light"
              ? "inline-flex size-11 items-center justify-center rounded-pill text-white hover:bg-white/10"
              : "inline-flex size-11 items-center justify-center rounded-pill text-ink-900 hover:bg-ink-900/5"
          }
          aria-label="Open menu"
        >
          <Menu className="size-6" aria-hidden />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink-900/40 backdrop-blur-sm data-[state=open]:animate-fade-up" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-canvas shadow-lg focus:outline-none">
          <div className="flex h-18 items-center justify-between border-b border-line px-5">
            <Logo />
            <Dialog.Close
              className="inline-flex size-11 items-center justify-center rounded-md text-ink-700 hover:bg-canvas-subtle"
              aria-label="Close menu"
            >
              <X className="size-6" aria-hidden />
            </Dialog.Close>
          </div>
          <Dialog.Title className="sr-only">Site navigation</Dialog.Title>

          <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Mobile">
            {primaryNav.map((item) => (
              <div key={item.label} className="py-1">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2.5 text-body-lg font-semibold text-ink-900 hover:bg-canvas-subtle"
                >
                  {item.label}
                </Link>
                {item.children ? (
                  <div className="ml-3 border-l border-line pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className="block rounded-md px-3 py-2 text-body text-ink-500 hover:bg-canvas-subtle hover:text-ink-900"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </nav>

          <div className="flex flex-col gap-2 border-t border-line p-5">
            <Button href="/login" variant="outline" onClick={() => setOpen(false)}>
              Log In
            </Button>
            <Button href={siteConfig.primaryCta.href} variant="primary" onClick={() => setOpen(false)}>
              {siteConfig.primaryCta.label}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
