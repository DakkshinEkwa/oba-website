import { cn } from "@/lib/utils";

export function Prose({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("prose", className)} {...props} />;
}
