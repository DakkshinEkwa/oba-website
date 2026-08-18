"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Field, Input, Textarea, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { SuccessPanel } from "./SuccessPanel";

type Variant = "contact" | "analyze" | "speaker" | "partnership";

const successCopy: Record<Variant, string> = {
  analyze:
    "An advisor will review your practice and reach out to schedule your complimentary analysis.",
  speaker:
    "Thank you for sharing your expertise. A member of the OBA team will review your note and follow up to explore where your experience fits an upcoming conversation.",
  partnership:
    "Thank you for reaching out. A member of the OBA team will be in touch to discuss what a collaboration could look like.",
  contact: "A member of the OB Academy team will get back to you shortly.",
};

const submitLabel: Record<Variant, string> = {
  analyze: "Request my free analysis",
  speaker: "Share your area of expertise",
  partnership: "Start the conversation",
  contact: "Send message",
};

const messageField: Record<Variant, { label: string; placeholder: string }> = {
  analyze: {
    label: "What would you like to improve?",
    placeholder: "e.g. more new-patient inquiries, better online visibility…",
  },
  speaker: {
    label: "What problem could you speak to?",
    placeholder:
      "A decision you've navigated firsthand, e.g. adding a service line, adopting new technology, rebuilding a referral network…",
  },
  partnership: {
    label: "What would you like to explore?",
    placeholder:
      "e.g. supporting a panel or series, contributing implementation expertise to a relevant conversation…",
  },
  contact: { label: "Message", placeholder: "How can we help?" },
};

/** Stubbed lead/contact form — validates client-side, shows success, no backend yet. */
export function ContactForm({ variant = "contact" }: { variant?: Variant }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    if (!String(form.get("name") || "").trim()) next.name = "Please enter your name.";
    const email = String(form.get("email") || "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email.";
    if (variant === "analyze" && !String(form.get("website") || "").trim())
      next.website = "Enter your practice website.";
    if (variant === "speaker") {
      if (!String(form.get("title") || "").trim()) next.title = "Enter your professional title.";
      if (!String(form.get("role") || "").trim()) next.role = "Select an area of expertise.";
      if (!String(form.get("message") || "").trim())
        next.message = "Tell us the problem or decision you could speak to.";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) {
      // Move focus to the first invalid field so the error is discoverable.
      // Error keys are the field ids (htmlFor) wired by <Field>.
      const firstInvalid = e.currentTarget.querySelector<HTMLElement>(
        `#${Object.keys(next)[0]}`,
      );
      firstInvalid?.focus();
      return;
    }
    // TODO: POST to CRM/ESP endpoint.
    setStatus("submitting");
    window.setTimeout(() => setStatus("done"), 500);
  }

  if (status === "done") {
    return (
      <SuccessPanel
        title={
          variant === "speaker" || variant === "partnership"
            ? "Thanks, we'll follow up"
            : "Thanks, we'll be in touch"
        }
        body={successCopy[variant]}
      />
    );
  }

  const submitting = status === "submitting";

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={submitting} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="name" required error={errors.name}>
          <Input id="name" name="name" placeholder="Jane Doe" autoComplete="name" />
        </Field>
        <Field label="Email" htmlFor="email" required error={errors.email}>
          <Input id="email" name="email" type="email" placeholder="you@practice.com" autoComplete="email" />
        </Field>
      </div>
      {variant === "speaker" ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Professional title / designation" htmlFor="title" required error={errors.title}>
              <Input id="title" name="title" placeholder="MD, COO, Practice Administrator…" />
            </Field>
            <Field label="Practice or organization" htmlFor="practice">
              <Input id="practice" name="practice" placeholder="Clear Vision Eye Care" autoComplete="organization" />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Phone" htmlFor="phone">
              <Input id="phone" name="phone" type="tel" placeholder="Optional" autoComplete="tel" />
            </Field>
            <Field label="I'm applying as" htmlFor="applyAs">
              <Select id="applyAs" name="applyAs" defaultValue="">
                <option value="" disabled>
                  Select…
                </option>
                <option>Podcast guest</option>
                <option>Panelist / speaker</option>
                <option>Both: podcast & panel</option>
              </Select>
            </Field>
          </div>
          <Field
            label="Area of expertise"
            htmlFor="role"
            required
            error={errors.role}
          >
            <Select id="role" name="role" defaultValue="">
              <option value="" disabled>
                Select…
              </option>
              <option>Practice Marketing & SEO</option>
              <option>Patient Acquisition & Conversion</option>
              <option>Practice Management & Operations</option>
              <option>Premium IOL & Refractive Growth</option>
              <option>Technology & AI in Ophthalmology</option>
              <option>Leadership & Team Culture</option>
              <option>Finance, Billing & Pricing</option>
              <option>Other</option>
            </Select>
          </Field>
          <Field label="Brief bio / why you?" htmlFor="bio">
            <Textarea
              id="bio"
              name="bio"
              placeholder="A few lines about your experience and what you'd like to share."
            />
          </Field>
        </>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {variant === "partnership" ? (
            <Field label="Organization" htmlFor="practice">
              <Input id="practice" name="practice" placeholder="Your company or organization" autoComplete="organization" />
            </Field>
          ) : (
            <Field label="Practice name" htmlFor="practice">
              <Input id="practice" name="practice" placeholder="Clear Vision Eye Care" autoComplete="organization" />
            </Field>
          )}
          {variant === "analyze" ? (
            <Field label="Practice website" htmlFor="website" required error={errors.website}>
              <Input id="website" name="website" type="url" placeholder="https://…" autoComplete="url" />
            </Field>
          ) : variant === "partnership" ? (
            <Field label="Your field" htmlFor="role">
              <Select id="role" name="role" defaultValue="">
                <option value="" disabled>
                  Select…
                </option>
                <option>Diagnostics / Imaging</option>
                <option>Surgical Technology</option>
                <option>AI / Remote Monitoring</option>
                <option>Workflow / Patient Engagement</option>
                <option>Therapeutics / Vision Rehabilitation</option>
                <option>Professional Services</option>
                <option>Other</option>
              </Select>
            </Field>
          ) : (
            <Field label="Role" htmlFor="role">
              <Select id="role" name="role" defaultValue="">
                <option value="" disabled>
                  Select…
                </option>
                <option>Physician / Owner</option>
                <option>Practice Administrator</option>
                <option>Marketing / Operations</option>
                <option>Other</option>
              </Select>
            </Field>
          )}
        </div>
      )}
      <Field
        label={messageField[variant].label}
        htmlFor="message"
        required={variant === "speaker"}
        error={errors.message}
      >
        <Textarea
          id="message"
          name="message"
          placeholder={messageField[variant].placeholder}
        />
      </Field>
      <div>
        <Button type="submit" variant="primary" size="lg" disabled={submitting}>
          {submitting ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          {submitting ? "Sending…" : submitLabel[variant]}
        </Button>
      </div>
    </form>
  );
}
