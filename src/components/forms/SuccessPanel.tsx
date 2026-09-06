"use client";

import { useEffect, useRef } from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tone } from "@/components/ui/Field";

/** Announced + focus-managed success card shown in place of a submitted form. */
export function SuccessPanel({
  title,
  body,
  tone = "default",
}: {
  title: string;
  body: string;
  tone?: Tone;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="status"
      className={cn(
        "flex flex-col items-center rounded-xl border px-6 py-12 text-center",
        tone === "onDark"
          ? "border-white/15 bg-white/5"
          : "border-accent-100 bg-accent-50",
      )}
    >
      <CheckCircle2
        className={cn("size-10", tone === "onDark" ? "text-white" : "text-accent-600")}
        aria-hidden
      />
      <h3
        className={cn(
          "mt-4 text-h3 font-normal",
          tone === "onDark" ? "text-white" : "text-ink-900",
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          "mt-2 max-w-sm text-body",
          tone === "onDark" ? "text-white/70" : "text-ink-600",
        )}
      >
        {body}
      </p>
    </div>
  );
}
