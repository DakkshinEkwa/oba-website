import { Children, cloneElement, isValidElement, useId } from "react";
import { cn } from "@/lib/utils";

export type Tone = "default" | "onDark";

const controlBase =
  "w-full rounded-md border px-3.5 text-body transition-colors focus:outline-none focus:ring-2 disabled:opacity-50";

/** Per-tone control skin. onDark uses the brand hairline (white at .15) over glass. */
const controlTone: Record<Tone, string> = {
  default:
    "border-line-strong bg-canvas text-ink-900 placeholder:text-ink-300 focus:border-accent-500 focus:ring-accent-500/30 aria-[invalid=true]:border-error aria-[invalid=true]:ring-error/20",
  onDark:
    "border-white/15 bg-white/5 text-white placeholder:text-white/40 focus:border-white/45 focus:ring-white/25 aria-[invalid=true]:border-error-soft aria-[invalid=true]:ring-error-soft/25",
};

export function Label({
  className,
  required,
  tone = "default",
  children,
  ...props
}: React.ComponentProps<"label"> & { required?: boolean; tone?: Tone }) {
  return (
    <label
      className={cn(
        "block text-small",
        // Type reads optically heavier on the dark ground, so the label drops a
        // step there; light-ground forms keep font-medium.
        tone === "onDark" ? "font-normal text-white/90" : "font-medium text-ink-800",
        className,
      )}
      {...props}
    >
      {children}
      {required ? (
        <span className={cn("ml-0.5", tone === "onDark" ? "text-error-soft" : "text-error")}>*</span>
      ) : null}
    </label>
  );
}

export const Input = function Input({
  className,
  tone = "default",
  ...props
}: React.ComponentProps<"input"> & { tone?: Tone }) {
  return <input className={cn(controlBase, controlTone[tone], "h-11", className)} {...props} />;
};

export function Textarea({
  className,
  tone = "default",
  ...props
}: React.ComponentProps<"textarea"> & { tone?: Tone }) {
  return (
    <textarea className={cn(controlBase, controlTone[tone], "min-h-28 py-2.5", className)} {...props} />
  );
}

export function Select({
  className,
  tone = "default",
  ...props
}: React.ComponentProps<"select"> & { tone?: Tone }) {
  return (
    <select
      className={cn(
        controlBase,
        controlTone[tone],
        "h-11 appearance-none bg-[length:1rem] pr-9",
        tone === "onDark" && "[&>option]:bg-ink-900 [&>option]:text-white",
        className,
      )}
      {...props}
    />
  );
}

export function FieldError({
  id,
  tone = "default",
  children,
}: {
  id?: string;
  tone?: Tone;
  children?: React.ReactNode;
}) {
  if (!children) return null;
  return (
    <p
      id={id}
      role="alert"
      className={cn("text-small", tone === "onDark" ? "text-error-soft" : "text-error")}
    >
      {children}
    </p>
  );
}

type ControlProps = {
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  required?: boolean;
  tone?: Tone;
};

/** Label + control + error wrapper. Wires ids, error/hint announcements, and required semantics onto the child control. */
export function Field({
  label,
  htmlFor,
  required,
  error,
  hint,
  tone = "default",
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  const autoId = useId();
  const controlId = htmlFor ?? autoId;
  const hintId = hint ? `${controlId}-hint` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  const control = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    const element = child as React.ReactElement<ControlProps>;
    return cloneElement(element, {
      id: element.props.id ?? controlId,
      "aria-describedby": element.props["aria-describedby"] ?? describedBy,
      "aria-invalid": element.props["aria-invalid"] ?? Boolean(error),
      required: required || undefined,
      tone: element.props.tone ?? tone,
    });
  });

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={controlId} required={required} tone={tone}>
        {label}
      </Label>
      {hint ? (
        <p
          id={hintId}
          className={cn("text-small", tone === "onDark" ? "text-pale-accent" : "text-ink-500")}
        >
          {hint}
        </p>
      ) : null}
      {control}
      <FieldError id={errorId} tone={tone}>
        {error}
      </FieldError>
    </div>
  );
}
