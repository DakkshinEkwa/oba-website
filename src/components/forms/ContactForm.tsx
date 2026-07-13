"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Field, Input, Textarea, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

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
      "A decision you've navigated firsthand — e.g. adding a service line, adopting new technology, rebuilding a referral network…",
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
  const [status, setStatus] = useState<"idle" | "done">("idle");
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
    if (variant === "speaker" && !String(form.get("message") || "").trim())
      next.message = "Tell us the problem or decision you could speak to.";
    setErrors(next);
    if (Object.keys(next).length === 0) {
      // TODO: POST to CRM/ESP endpoint.
      setStatus("done");
    }
  }

  if (status === "done") {
    return (
      <div className="flex flex-col items-center rounded-xl border border-accent-100 bg-accent-50 px-6 py-12 text-center">
        <CheckCircle2 className="size-10 text-accent-600" aria-hidden />
        <h3 className="mt-4 text-h3 font-normal text-ink-900">
          {variant === "speaker" || variant === "partnership"
            ? "Thanks — we'll follow up"
            : "Thanks — we'll be in touch"}
        </h3>
        <p className="mt-2 max-w-sm text-body text-ink-600">{successCopy[variant]}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="name" required error={errors.name}>
          <Input id="name" name="name" aria-invalid={!!errors.name} placeholder="Jane Doe" />
        </Field>
        <Field label="Email" htmlFor="email" required error={errors.email}>
          <Input id="email" name="email" type="email" aria-invalid={!!errors.email} placeholder="you@practice.com" />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {variant === "partnership" ? (
          <Field label="Organization" htmlFor="practice">
            <Input id="practice" name="practice" placeholder="Your company or organization" />
          </Field>
        ) : (
          <Field label={variant === "speaker" ? "Practice or organization" : "Practice name"} htmlFor="practice">
            <Input id="practice" name="practice" placeholder="Clear Vision Eye Care" />
          </Field>
        )}
        {variant === "analyze" ? (
          <Field label="Practice website" htmlFor="website" required error={errors.website}>
            <Input id="website" name="website" aria-invalid={!!errors.website} placeholder="https://…" />
          </Field>
        ) : variant === "speaker" ? (
          <Field label="Area of expertise" htmlFor="role">
            <Select id="role" name="role" defaultValue="">
              <option value="" disabled>
                Select…
              </option>
              <option>Clinical / Subspecialty Practice</option>
              <option>Practice Ownership / Medical Direction</option>
              <option>Practice Administration / Operations</option>
              <option>Patient Experience / Care Coordination</option>
              <option>Education / Academic Leadership</option>
              <option>Technology / Industry</option>
              <option>Other</option>
            </Select>
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
      <Field
        label={messageField[variant].label}
        htmlFor="message"
        required={variant === "speaker"}
        error={errors.message}
      >
        <Textarea
          id="message"
          name="message"
          aria-invalid={!!errors.message}
          placeholder={messageField[variant].placeholder}
        />
      </Field>
      <div>
        <Button type="submit" variant="primary" size="lg">
          {submitLabel[variant]}
        </Button>
      </div>
    </form>
  );
}
