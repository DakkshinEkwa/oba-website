import Link from "next/link";
import Image from "next/image";
import { FileText, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/schemas";
import { cn, formatDate } from "@/lib/utils";

export function BlogCard({
  post,
  variant = "card",
}: {
  post: BlogPost;
  variant?: "card" | "panel" | "slider";
}) {
  const href = `/blog/${post.slug}`;

  // Panel and slider share one anatomy — image, meta, title, CTA pill,
  // whole-card hit target — and differ only in how hover behaves. "panel" is
  // the static treatment (`.panel-card`); "slider" is the free-resources /
  // events treatment (`.event-card`): the highlight glides between cards,
  // siblings dim, and the content shifts right. Slider must be rendered inside
  // an `.event-grid`.
  if (variant === "panel" || variant === "slider") {
    const slider = variant === "slider";
    const label = `Read ${post.title}`;
    const textHover =
      "transition-colors duration-200 ease-in-out group-hover:text-white group-focus-within:text-white";
    return (
      <article
        className={cn(
          "group flex cursor-pointer flex-col rounded-[28px]",
          slider ? "event-card p-2" : "panel-card p-4",
        )}
      >
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-canvas">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-ink-300">
              <FileText className="size-10" aria-hidden />
            </div>
          )}
        </div>

        <div
          className={cn(
            "relative mt-8 min-w-0 px-4 sm:px-5",
            slider &&
              "transition-transform duration-200 ease-in-out group-hover:translate-x-4 group-focus-within:translate-x-4",
          )}
        >
          <p className={`font-mono text-small font-light uppercase tracking-wide text-ink-400 ${textHover}`}>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            {post.readingTimeMin ? (
              <>
                <span aria-hidden> · </span>
                <span>{post.readingTimeMin} min read</span>
              </>
            ) : null}
          </p>
          <h3 className={`mt-3 text-body-lg font-medium leading-snug text-ink-900 ${textHover}`}>
            {post.title}
          </h3>
        </div>

        <div className="relative mt-auto flex items-center justify-between gap-4 px-4 pt-7 pb-5 sm:px-5 sm:pb-6">
          <span className="inline-flex h-9 items-center rounded-pill border border-line-strong px-4 text-small font-semibold text-ink-800 transition-colors duration-200 ease-in-out group-hover:border-white/30 group-hover:text-white group-focus-within:border-white/30 group-focus-within:text-white">
            Read article
          </span>
          <ArrowRight
            className={
              slider
                ? "size-5 -translate-x-4 text-white opacity-0 transition-[opacity,transform] duration-[50ms] ease-in-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:opacity-100"
                : "size-5 text-white opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100 group-focus-within:opacity-100"
            }
            aria-hidden
          />
        </div>

        <Link
          href={href}
          className="absolute inset-0 z-[1] cursor-pointer rounded-[28px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label={label}
        />
      </article>
    );
  }

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[20px] border border-line bg-canvas">
      <Link
        href={href}
        aria-hidden
        tabIndex={-1}
        className="relative z-[1] block aspect-[16/9] overflow-hidden bg-canvas-subtle"
      >
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-300">
            <FileText className="size-10" aria-hidden />
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-6 transition-[background] duration-200 ease-in-out group-hover:[background:var(--gradient-hero)] group-focus-within:[background:var(--gradient-hero)]">
        <div className="flex items-center gap-2 font-mono text-eyebrow font-light uppercase text-ink-400 transition-colors duration-200 ease-in-out group-hover:text-white group-focus-within:text-white">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          {post.readingTimeMin ? (
            <>
              <span aria-hidden>·</span>
              <span>{post.readingTimeMin} min read</span>
            </>
          ) : null}
        </div>
        <h3 className="mt-2 text-body-lg font-medium leading-snug text-ink-900 transition-colors duration-200 ease-in-out group-hover:text-white group-focus-within:text-white">
          <Link
            href={href}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-body font-light text-ink-400 transition-colors duration-200 ease-in-out group-hover:text-white group-focus-within:text-white">
          {post.excerpt}
        </p>
      </div>
    </article>
  );
}
