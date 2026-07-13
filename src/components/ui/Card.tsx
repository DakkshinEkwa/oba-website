import { cn } from "@/lib/utils";

type CardProps = React.ComponentProps<"div"> & {
  interactive?: boolean;
};

/** Bordered surface. Hairline border does the work; shadow only on hover when interactive. */
export function Card({ interactive = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-line bg-canvas",
        interactive && "transition-colors duration-200 hover:border-ink-300",
        className,
      )}
      {...props}
    />
  );
}

export function CardBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("p-6", className)} {...props} />;
}
