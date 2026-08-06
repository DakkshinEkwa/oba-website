"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { SuccessPanel } from "./SuccessPanel";

export function LoginForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(form.get("email") || "")))
      next.email = "Enter a valid email.";
    if (!String(form.get("password") || "")) next.password = "Enter your password.";
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setStatus("submitting"); // TODO: wire to auth provider.
      window.setTimeout(() => setStatus("done"), 500);
    }
  }

  if (status === "done") {
    return (
      <SuccessPanel
        title="Signed in"
        body="Signed in (demo — authentication isn't wired up yet)."
      />
    );
  }

  const submitting = status === "submitting";

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={submitting} className="grid gap-4">
      <Field label="Email" htmlFor="email" required error={errors.email}>
        <Input id="email" name="email" type="email" autoComplete="email" />
      </Field>
      <Field label="Password" htmlFor="password" required error={errors.password}>
        <Input id="password" name="password" type="password" autoComplete="current-password" />
      </Field>
      <div className="flex justify-end">
        <Link href="/forgot-password" className="text-small text-accent-600 hover:text-accent-700">
          Forgot password?
        </Link>
      </div>
      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={submitting}>
        {submitting ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        {submitting ? "Signing in…" : "Log in"}
      </Button>
    </form>
  );
}
