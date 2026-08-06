"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { SuccessPanel } from "./SuccessPanel";

export function ForgotPasswordForm() {
  const [error, setError] = useState<string>();
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") || "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email.");
      return;
    }
    setError(undefined);
    setStatus("submitting"); // TODO: wire to auth provider.
    window.setTimeout(() => setStatus("done"), 500);
  }

  if (status === "done") {
    return (
      <SuccessPanel
        title="Reset link sent"
        body="If an account exists for that email, a reset link is on its way."
      />
    );
  }

  const submitting = status === "submitting";

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={submitting} className="grid gap-4">
      <Field label="Email" htmlFor="email" required error={error}>
        <Input id="email" name="email" type="email" autoComplete="email" />
      </Field>
      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={submitting}>
        {submitting ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        {submitting ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  );
}
