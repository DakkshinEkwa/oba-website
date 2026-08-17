import { cn } from "@/lib/utils";

const HEIGHTS = [40, 70, 55, 90, 60, 100, 50, 85, 65, 45, 75, 55, 95, 60, 40, 80];

/** Decorative audio waveform — bars take their color from `currentColor`. */
export function Waveform({
  bars = 14,
  baseHeight = 28,
  animated = false,
  className,
  barClassName,
}: {
  bars?: number;
  baseHeight?: number;
  /** Pulse the bars like a live audio visualizer. Reduced-motion users get
   *  static bars via the global base-layer animation kill-switch. */
  animated?: boolean;
  className?: string;
  barClassName?: string;
}) {
  const heights = Array.from({ length: bars }, (_, i) => HEIGHTS[i % HEIGHTS.length]);
  return (
    <div aria-hidden className={cn("flex items-end gap-[3px]", className)}>
      {heights.map((h, i) => (
        <span
          key={i}
          className={cn("w-1 rounded-full bg-current", animated && "animate-waveform", barClassName)}
          style={{
            height: `${(h / 100) * baseHeight}px`,
            ...(animated ? { animationDelay: `${(i % 8) * 0.11}s` } : {}),
          }}
        />
      ))}
    </div>
  );
}
