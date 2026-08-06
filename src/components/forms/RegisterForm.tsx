"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Field, Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { SuccessPanel } from "./SuccessPanel";
import { cn } from "@/lib/utils";

const professions = [
  "Ophthalmologist",
  "Optometrist",
  "Practice Administrator",
  "Practice Owner",
  "Marketing / Operations",
  "Technician / Staff",
  "Industry Partner",
  "Other",
];

function strength(pw: string): { score: number; label: string; cls: string } {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const labels = ["Too short", "Weak", "Fair", "Good", "Strong"];
  const colors = ["bg-error", "bg-error", "bg-warning", "bg-accent-400", "bg-success"];
  return { score: s, label: labels[s], cls: colors[s] };
}

export function RegisterForm() {
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const st = strength(password);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    if (!String(form.get("firstName") || "").trim()) next.firstName = "Required.";
    if (!String(form.get("lastName") || "").trim()) next.lastName = "Required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(form.get("email") || "")))
      next.email = "Enter a valid email.";
    if (password.length < 8) next.password = "Use at least 8 characters.";
    setErrors(next);
    if (Object.keys(next).length === 0) {
      // TODO: wire to auth provider (Auth.js / Clerk / Supabase).
      setStatus("submitting");
      window.setTimeout(() => setStatus("done"), 500);
    }
  }

  if (status === "done") {
    return (
      <SuccessPanel
        title="Account created"
        body="Welcome to OB Academy. (Demo — no account is actually created yet.)"
      />
    );
  }

  const submitting = status === "submitting";

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={submitting} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name" htmlFor="firstName" required error={errors.firstName}>
          <Input id="firstName" name="firstName" autoComplete="given-name" />
        </Field>
        <Field label="Last name" htmlFor="lastName" required error={errors.lastName}>
          <Input id="lastName" name="lastName" autoComplete="family-name" />
        </Field>
      </div>
      <Field label="Work email" htmlFor="email" required error={errors.email}>
        <Input id="email" name="email" type="email" autoComplete="email" />
      </Field>
      <Field label="Password" htmlFor="password" required error={errors.password}>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Field>
      {password ? (
        <div className="-mt-2 flex items-center gap-3">
          <div className="flex h-1.5 flex-1 gap-1">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={cn("flex-1 rounded-full", i < st.score ? st.cls : "bg-line-strong")}
              />
            ))}
          </div>
          <span className="w-16 text-right text-small text-ink-500">{st.label}</span>
        </div>
      ) : null}
      <Field label="I am a…" htmlFor="profession" hint="Optional — helps us tailor content to you.">
        <Select id="profession" name="profession" defaultValue="">
          <option value="" disabled>
            Select your role…
          </option>
          {professions.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </Select>
      </Field>
      <Button type="submit" variant="primary" size="lg" className="mt-2 w-full" disabled={submitting}>
        {submitting ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        {submitting ? "Creating account…" : "Create free account"}
      </Button>
      <p className="text-center text-small text-ink-500">
        By creating an account you agree to our terms and privacy policy.
      </p>
    </form>
  );
}
