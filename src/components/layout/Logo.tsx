import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * OBA brand logo. Dark surfaces (tone="light") use a dedicated white asset
 * where the "BUSINESS ACADEMY" bar text is a transparent knockout — a plain
 * CSS invert filter would flatten the bar and its text into one white block.
 */
export function Logo({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Ophthalmology Business Academy — home"
      className={cn("inline-flex items-center", className)}
    >
      <Image
        src={tone === "light" ? "/images/oba-logo-white.png" : "/images/oba-logo.png"}
        alt="Ophthalmology Business Academy"
        width={2278}
        height={634}
        priority
        className="h-9 w-auto"
      />
    </Link>
  );
}
