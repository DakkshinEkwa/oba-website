"use client";

import { useState } from "react";
import { MailCheck } from "lucide-react";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function ForgotPasswordForm() {
  const [error, setError] = useState<string>();
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") || "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email.");
      return;
    }
    setError(undefined);
    setDone(true); // TODO: wire to auth provider.
  }

  if (done) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-accent-100 bg-accent-50 px-6 py-10 text-center">
        <MailCheck className="size-9 text-accent-600" aria-hidden />
        <p className="mt-3 text-body text-ink-600">
          If an account exists for that email, a reset link is on its way.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <Field label="Email" htmlFor="email" required error={error}>
        <Input id="email" name="email" type="email" aria-invalid={!!error} autoComplete="email" />
      </Field>
      <Button type="submit" variant="primary" size="lg" className="w-full">
        Send reset link
      </Button>
    </form>
  );
}
