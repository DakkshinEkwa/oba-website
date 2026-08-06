"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Stubbed newsletter signup — validates + shows success, no backend yet. */
export function NewsletterForm({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error" | "done">("idle");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      setStatus("error");
      return;
    }
    // TODO: wire to ESP/CRM provider.
    setStatus("submitting");
    window.setTimeout(() => setStatus("done"), 500);
  }

  if (status === "done") {
    return (
      <p
        role="status"
        className={cn(
          "inline-flex items-center gap-2 text-body font-medium",
          tone === "light" ? "text-accent-200" : "text-accent-700",
        )}
      >
        <Check className="size-5" aria-hidden /> You&apos;re on the list — check your inbox to confirm.
      </p>
    );
  }

  const onLight = tone === "light";
  const submitting = status === "submitting";

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={submitting} className="w-full">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="nl-email" className="sr-only">
          Email address
        </label>
        <input
          id="nl-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="you@practice.com"
          aria-invalid={status === "error"}
          aria-describedby={status === "error" ? "nl-email-error" : undefined}
          className={cn(
            "h-12 flex-1 rounded-pill border px-5 text-body focus:outline-none focus:ring-2 focus:ring-accent-500/40",
            onLight
              ? "border-white/20 bg-white/10 text-white placeholder:text-white/50"
              : "border-line-strong bg-canvas text-ink-900 placeholder:text-ink-300",
          )}
        />
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-pill bg-ink-900 px-6 font-medium text-white transition-colors hover:bg-ink-700 disabled:opacity-50"
        >
          {submitting ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          {submitting ? "Subscribing…" : "Subscribe"}
          {submitting ? null : <ArrowRight className="size-4" aria-hidden />}
        </button>
      </div>
      {status === "error" ? (
        <p id="nl-email-error" role="alert" className={cn("mt-2 text-small", onLight ? "text-accent-200" : "text-error")}>
          Please enter a valid email address.
        </p>
      ) : null}
    </form>
  );
}
