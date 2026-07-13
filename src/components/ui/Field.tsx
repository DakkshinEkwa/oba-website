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

export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <p className="text-small text-error">{children}</p>;
}

/** Label + control + error wrapper. */
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
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>
      {hint ? <p className="text-small text-ink-400">{hint}</p> : null}
      {children}
      <FieldError>{error}</FieldError>
    </div>
  );
}
