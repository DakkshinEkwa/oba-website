"use client";

import { useEffect, useRef } from "react";
import { CheckCircle2 } from "lucide-react";

/** Announced + focus-managed success card shown in place of a submitted form. */
export function SuccessPanel({ title, body }: { title: string; body: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="status"
      className="flex flex-col items-center rounded-xl border border-accent-100 bg-accent-50 px-6 py-12 text-center"
    >
      <CheckCircle2 className="size-10 text-accent-600" aria-hidden />
      <h3 className="mt-4 text-h3 font-normal text-ink-900">{title}</h3>
      <p className="mt-2 max-w-sm text-body text-ink-600">{body}</p>
    </div>
  );
}
