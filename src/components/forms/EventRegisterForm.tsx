"use client";

import { useState } from "react";
import { ArrowRight, Loader2, Lock } from "lucide-react";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { SuccessPanel } from "./SuccessPanel";

/**
 * Panel registration form — the nine fields the registration page collects, in
 * its order: name, contact, role, practice, the two yes/no questions, and the
 * question for the panel.
 *
 * **Submission is stubbed**, like every other form on this site (see
 * "Known stubs" in CLAUDE.md). The live registration page posts this exact
 * payload to a Google Apps Script endpoint as `no-cors` JSON —
 * `{event_key, first_name, last_name, email, phone, job_title, practice_name,
 * text_reminder, practice_owner, question, source_id}` — so wiring this up is
 * a POST to that URL plus an `eventKey` on the event in `events.json`. Until
 * that happens it validates, shows the pending and success states, and sends
 * nothing.
 *
 * Validation is the site's own pattern: `noValidate` plus a manual pass, so
 * the messages are ours and focus moves to the first invalid control rather
 * than leaving a browser bubble to do it.
 */
const TAGS = ["Moderated Q&A", "Replay included", "Practical playbooks"];

/**
 * Controls sit a shade below the card rather than on it: the card is already
 * white, so `bg-canvas` fields read as one undivided surface with only their
 * hairline to find them by. `canvas-subtle` is the site's own step down, the
 * same one `Button variant="outline"` hovers to. Placeholders are the
 * registration page's, which are examples rather than restatements of the
 * label — a placeholder that repeats its label earns nothing and disappears
 * the moment someone types.
 */
const CONTROL = "bg-canvas-subtle";

export function EventRegisterForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const value = (name: string) => String(form.get(name) ?? "").trim();
    const next: Record<string, string> = {};

    if (!value("first_name")) next.first_name = "Enter your first name.";
    if (!value("last_name")) next.last_name = "Enter your last name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value("email"))) next.email = "Enter a valid email.";
    if (!value("phone")) next.phone = "Enter a phone number.";
    if (!value("job_title")) next.job_title = "Enter your job title.";
    if (!value("practice_name")) next.practice_name = "Enter your practice name.";
    if (!value("text_reminder")) next.text_reminder = "Choose one.";
    if (!value("practice_owner")) next.practice_owner = "Choose one.";
    if (!value("question")) next.question = "Tell the panel what you'd like them to address.";

    setErrors(next);
    if (Object.keys(next).length > 0) {
      // Error keys are the control ids, so the first one focuses directly.
      e.currentTarget.querySelector<HTMLElement>(`#${Object.keys(next)[0]}`)?.focus();
      return;
    }

    // TODO: POST the payload above to the registration endpoint.
    setStatus("submitting");
    window.setTimeout(() => setStatus("done"), 500);
  }

  if (status === "done") {
    return (
      <SuccessPanel
        title="You're registered"
        body="Check your inbox for the joining link. The replay is sent to everyone who registers."
              />
    );
  }

  const submitting = status === "submitting";

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={submitting} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="First name" htmlFor="first_name" required error={errors.first_name}>
          <Input
            id="first_name"
            name="first_name"
            placeholder="First name"
            autoComplete="given-name"
            className={CONTROL}
          />
        </Field>
        <Field label="Last name" htmlFor="last_name" required error={errors.last_name}>
          <Input
            id="last_name"
            name="last_name"
            placeholder="Last name"
            autoComplete="family-name"
            className={CONTROL}
          />
        </Field>
      </div>

      <Field label="Email address" htmlFor="email" required error={errors.email}>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@yourpractice.com"
          autoComplete="email"
          className={CONTROL}
        />
      </Field>

      <Field label="Phone" htmlFor="phone" required error={errors.phone}>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+1 (555) 123-4567"
          autoComplete="tel"
          className={CONTROL}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Job title" htmlFor="job_title" required error={errors.job_title}>
          <Input
            id="job_title"
            name="job_title"
            placeholder="e.g. Practice Administrator"
            autoComplete="organization-title"
            className={CONTROL}
          />
        </Field>
        <Field label="Practice name" htmlFor="practice_name" required error={errors.practice_name}>
          <Input
            id="practice_name"
            name="practice_name"
            placeholder="Your practice"
            autoComplete="organization"
            className={CONTROL}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Would you like a text reminder?"
          htmlFor="text_reminder"
          required
          error={errors.text_reminder}
        >
          <Select id="text_reminder" name="text_reminder" defaultValue="" className={CONTROL}>
            <option value="">Select…</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </Select>
        </Field>
        <Field
          label="Are you an owner of the practice?"
          htmlFor="practice_owner"
          required
          error={errors.practice_owner}
        >
          <Select id="practice_owner" name="practice_owner" defaultValue="" className={CONTROL}>
            <option value="">Select…</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </Select>
        </Field>
      </div>

      <Field
        label="What question would you like the panel to address?"
        htmlFor="question"
        required
        error={errors.question}
      >
        <Textarea
          id="question"
          name="question"
          rows={3}
          placeholder="Share the question you'd like the panel to address…"
          className={CONTROL}
        />
      </Field>

      <Button type="submit" size="lg" disabled={submitting} className="w-full">
        {submitting ? (
          <>
            <Loader2 aria-hidden className="size-4 animate-spin" />
            Registering…
          </>
        ) : (
          <>
            Register free — save my seat
            <ArrowRight aria-hidden className="size-4" />
          </>
        )}
      </Button>

      <p className="flex items-start gap-2 text-micro leading-relaxed text-ink-400">
        <Lock aria-hidden className="mt-px size-3.5 shrink-0" />
        Your info is secure. We never spam — unsubscribe anytime.
      </p>

      <ul className="flex flex-wrap gap-2">
        {TAGS.map((tag) => (
          <li
            key={tag}
            className="rounded-pill border border-line bg-canvas-subtle px-3 py-1 font-mono text-micro uppercase tracking-wide text-ink-500"
          >
            {tag}
          </li>
        ))}
      </ul>
    </form>
  );
}
