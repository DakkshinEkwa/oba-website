import { cn } from "@/lib/utils";

/** Bordered icon-chip card: chip + title + body, with optional meta in the chip row and children below the body. */
export function IconCard({
  icon: Icon,
  title,
  body,
  meta,
  children,
  chip = "sm",
  bodyClassName,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body?: string;
  /** Extra content rendered beside the icon chip (e.g. a step number). */
  meta?: React.ReactNode;
  /** Content rendered below the body (e.g. a CTA). */
  children?: React.ReactNode;
  chip?: "sm" | "lg";
  bodyClassName?: string;
  className?: string;
}) {
  const chipCls = chip === "lg" ? "size-12" : "size-11";
  const iconCls = chip === "lg" ? "size-6" : "size-5";
  return (
    <div className={cn("group flex flex-col rounded-[20px] border border-line bg-canvas p-8", className)}>
      <div className={cn("flex items-center gap-3")}>
        <div className={cn("inline-flex items-center justify-center rounded-lg bg-accent-50 text-accent-600 transition-colors duration-200 ease-in-out group-hover:bg-ink-700 group-hover:text-white", chipCls)}>
          <Icon className={iconCls} aria-hidden />
        </div>
        {meta}
      </div>
      <h3 className="mt-5 text-h3 font-normal text-ink-900">{title}</h3>
      {body ? <p className={cn("mt-2 text-body font-light text-ink-400", bodyClassName)}>{body}</p> : null}
      {children}
    </div>
  );
}
