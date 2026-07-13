import { cn } from "@/lib/utils";

type EyebrowProps = React.ComponentProps<"span"> & {
  tone?: "default" | "onDark" | "muted";
};

const tones = {
  default: "border-line-strong text-ink-500",
  onDark: "border-white/25 text-white/70",
  muted: "border-line text-ink-400",
};

/** Qoves-style outline chip: tiny mono uppercase label inside a pill hairline. */
export function Eyebrow({ tone = "default", className, ...props }: EyebrowProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill border px-3.5 py-1.5 font-mono text-eyebrow uppercase",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
