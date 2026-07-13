import { cn } from "@/lib/utils";

type ContainerProps = React.ComponentProps<"div"> & {
  size?: "wide" | "default" | "narrow";
};

const sizes = {
  wide: "max-w-[var(--container-wide)]",
  default: "max-w-[var(--container-default)]",
  narrow: "max-w-[var(--container-narrow)]",
};

export function Container({ size = "default", className, ...props }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full px-5 sm:px-6 lg:px-8", sizes[size], className)}
      {...props}
    />
  );
}
