import { Children, cloneElement, isValidElement, useId } from "react";
import { cn } from "@/lib/utils";

const controlBase =
  "w-full rounded-md border border-line-strong bg-canvas px-3.5 text-body text-ink-900 placeholder:text-ink-300 transition-colors focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30 disabled:opacity-50 aria-[invalid=true]:border-error aria-[invalid=true]:ring-error/20";

export function Label({
  className,
  required,
  children,
  ...props
}: React.ComponentProps<"label"> & { required?: boolean }) {
  return (
    <label className={cn("block text-small font-medium text-ink-800", className)} {...props}>
      {children}
      {required ? <span className="ml-0.5 text-error">*</span> : null}
    </label>
  );
}

export const Input = function Input({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return <input className={cn(controlBase, "h-11", className)} {...props} />;
};

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea className={cn(controlBase, "min-h-28 py-2.5", className)} {...props} />;
}

export function Select({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      className={cn(controlBase, "h-11 appearance-none bg-[length:1rem] pr-9", className)}
      {...props}
    />
  );
}

export function FieldError({
  id,
  children,
}: {
  id?: string;
  children?: React.ReactNode;
}) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="text-small text-error">
      {children}
    </p>
  );
}

type ControlProps = {
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  required?: boolean;
};

/** Label + control + error wrapper. Wires ids, error/hint announcements, and required semantics onto the child control. */
export function Field({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
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
    });
  });

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={controlId} required={required}>
        {label}
      </Label>
      {hint ? <p id={hintId} className="text-small text-ink-500">{hint}</p> : null}
      {control}
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  );
}
