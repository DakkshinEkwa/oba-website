import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-pill font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600 disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap",
  {
    variants: {
      variant: {
        primary: "bg-ink-900 text-white hover:bg-ink-700",
        secondary: "bg-accent-600 text-white hover:bg-accent-700",
        outline:
          "border border-line-strong bg-canvas text-ink-800 hover:border-ink-300 hover:bg-canvas-subtle",
        ghost: "text-ink-700 hover:bg-canvas-subtle",
        link: "text-ink-900 hover:text-ink-500 underline-offset-4 hover:underline rounded-none px-0",
        onDark: "bg-white text-ink-900 hover:bg-canvas-subtle",
        frosted:
          "border border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20",
      },
      size: {
        sm: "h-9 px-4 text-small",
        md: "h-11 px-5 text-body",
        lg: "h-12 px-7 text-body-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonBaseProps = VariantProps<typeof buttonVariants> & {
  className?: string;
  children?: React.ReactNode;
};

type ButtonAsButton = ButtonBaseProps &
  Omit<React.ComponentProps<"button">, "children"> & { href?: undefined };

type ButtonAsLink = ButtonBaseProps &
  Omit<React.ComponentProps<typeof Link>, "children"> & { href: string };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant, size, className, ...rest } = props;
  const classes = cn(buttonVariants({ variant, size }), className);

  if ("href" in rest && rest.href !== undefined) {
    return <Link className={classes} {...(rest as ButtonAsLink)} />;
  }
  return <button className={classes} {...(rest as ButtonAsButton)} />;
}
