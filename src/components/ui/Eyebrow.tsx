import { cn } from "@/lib/utils";

type EyebrowProps = React.ComponentProps<"span"> & {
  tone?: "default" | "onDark" | "muted";
  /** Render a small leading dot (decorative status/label marker). */
  dot?: boolean;
};

const tones = {
  default: "text-ink-500",
  onDark: "text-white/70",
  muted: "text-ink-400",
};

/** Tiny mono uppercase label used above section titles and heroes. */
export function Eyebrow({ tone = "default", dot, className, children, ...props }: EyebrowProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-2 font-mono text-eyebrow uppercase", tones[tone], className)}
      {...props}
    >
      {dot ? <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}
