import { cn } from "@/lib/utils";

/** Bordered icon-chip card: chip + title + body, with optional meta in the chip row and children below the body. */
export function IconCard({
  icon: Icon,
  title,
  body,
  meta,
  children,
  chip = "sm",
  /** "stacked" (default): chip above the title. "inline": chip to the left of the title. */
  layout = "stacked",
  bodyClassName,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body?: string;
  /** Extra content rendered beside the icon chip (e.g. a step number). Ignored in "inline" layout. */
  meta?: React.ReactNode;
  /** Content rendered below the body (e.g. a CTA). */
  children?: React.ReactNode;
  chip?: "sm" | "lg";
  layout?: "stacked" | "inline";
  bodyClassName?: string;
  className?: string;
}) {
  const chipCls = chip === "lg" ? "size-12" : "size-11";
  const iconCls = chip === "lg" ? "size-6" : "size-5";
  const chipEl = (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-600 transition-colors duration-200 ease-in-out group-hover:bg-ink-700 group-hover:text-white",
        chipCls,
      )}
    >
      <Icon className={iconCls} aria-hidden />
    </div>
  );

  return (
    <div className={cn("group flex flex-col rounded-[20px] border border-line bg-canvas p-8", className)}>
      {layout === "inline" ? (
        <div className="flex items-center gap-4">
          {chipEl}
          <h3 className="text-h3 font-normal text-ink-900">{title}</h3>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            {chipEl}
            {meta}
          </div>
          <h3 className="mt-5 text-h3 font-normal text-ink-900">{title}</h3>
        </>
      )}
      {body ? (
        <p className={cn(layout === "inline" ? "mt-4" : "mt-2", "text-body font-light text-ink-400", bodyClassName)}>
          {body}
        </p>
      ) : null}
      {children}
    </div>
  );
}
