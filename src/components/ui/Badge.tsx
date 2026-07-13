import { cn } from "@/lib/utils";

type BadgeProps = React.ComponentProps<"span"> & {
  tone?: "neutral" | "accent" | "outline";
};

const tones = {
  neutral: "bg-canvas-subtle text-ink-600 border border-line",
  accent: "bg-accent-50 text-accent-700 border border-accent-100",
  outline: "border border-line-strong text-ink-600",
};

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-small font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
