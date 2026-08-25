import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { FreeResource, FreeResourceCategory } from "@/lib/schemas";
import { resourceImage } from "@/lib/utils";

export const FREE_RESOURCE_CATEGORIES: Record<FreeResourceCategory, string> = {
  guide: "Guide",
  template: "Template",
  checklist: "Checklist",
};

/**
 * Downloadable free-resource card — same anatomy as the events grid cards:
 * cover image, mono meta line, title, CTA pill + sliding arrow, and a
 * whole-card hit target that opens the PDF in a new tab. Uses the shared
 * `.event-card` / `.event-grid` treatment (dark hover, sibling dim, anchor
 * highlight), so it must be rendered inside an `.event-grid` wrapper.
 */
export function FreeResourceCard({ resource }: { resource: FreeResource }) {
  const label = `Download ${resource.title} (PDF)`;
  const hitClassName =
    "absolute inset-0 z-[1] cursor-pointer rounded-[28px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

  return (
    <article className="event-card group flex cursor-pointer flex-col rounded-[28px] p-2">
      <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-canvas">
        <Image
          src={resourceImage(resource.image)}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>

      <div className="relative mt-6 min-w-0 px-4 sm:px-5 transition-transform duration-200 ease-in-out group-hover:translate-x-4 group-focus-within:translate-x-4">
        <p className="font-mono text-small font-light uppercase tracking-wide text-ink-400 transition-colors duration-200 ease-in-out group-hover:text-white group-focus-within:text-white">
          {FREE_RESOURCE_CATEGORIES[resource.category]}
          <span aria-hidden> · </span>
          {resource.author}
        </p>
        <h3 className="mt-3 text-body-lg font-medium leading-snug text-ink-900 transition-colors duration-200 ease-in-out group-hover:text-white group-focus-within:text-white">
          {resource.title}
        </h3>
        <p className="mt-3 line-clamp-2 text-body font-light text-ink-500 transition-colors duration-200 ease-in-out group-hover:text-white group-focus-within:text-white">
          {resource.description}
        </p>
      </div>

      <div className="relative mt-auto flex items-center justify-between gap-4 px-4 pt-6 pb-4 sm:px-5 sm:pb-5">
        <span className="inline-flex h-9 items-center rounded-pill border border-line-strong px-4 text-small font-semibold text-ink-800 transition-colors duration-200 ease-in-out group-hover:border-white/30 group-hover:text-white group-focus-within:border-white/30 group-focus-within:text-white">
          Download PDF
        </span>
        <ArrowRight
          className="size-5 -translate-x-4 text-white opacity-0 transition-[opacity,transform] duration-[50ms] ease-in-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:opacity-100"
          aria-hidden
        />
      </div>

      <a
        href={resource.pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={hitClassName}
        aria-label={label}
      />
    </article>
  );
}
