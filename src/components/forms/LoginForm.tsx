"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(form.get("email") || "")))
      next.email = "Enter a valid email.";
    if (!String(form.get("password") || "")) next.password = "Enter your password.";
    setErrors(next);
    if (Object.keys(next).length === 0) setDone(true); // TODO: wire to auth provider.
  }

  if (done) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-accent-100 bg-accent-50 px-6 py-10 text-center">
        <CheckCircle2 className="size-9 text-accent-600" aria-hidden />
        <p className="mt-3 text-body text-ink-600">
          Signed in (demo — authentication isn&apos;t wired up yet).
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <Field label="Email" htmlFor="email" required error={errors.email}>
        <Input id="email" name="email" type="email" aria-invalid={!!errors.email} autoComplete="email" />
      </Field>
      <Field label="Password" htmlFor="password" required error={errors.password}>
        <Input
          id="password"
          name="password"
          type="password"
          aria-invalid={!!errors.password}
          autoComplete="current-password"
        />
      </Field>
      <div className="flex justify-end">
        <Link href="/forgot-password" className="text-small text-accent-600 hover:text-accent-700">
          Forgot password?
        </Link>
      </div>
      <Button type="submit" variant="primary" size="lg" className="w-full">
        Log in
      </Button>
    </form>
  );
}
