import Link from "next/link";
import Image from "next/image";
import { FileText, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/schemas";
import { formatDate } from "@/lib/utils";

export function BlogCard({
  post,
  variant = "card",
}: {
  post: BlogPost;
  variant?: "card" | "panel";
}) {
  const href = `/blog/${post.slug}`;

  // Panel variant: same card anatomy as the episode/event panels — image, meta,
  // title, CTA pill, whole-card hit target, dark hover, no sliding animation.
  if (variant === "panel") {
    const label = `Read ${post.title}`;
    const textHover =
      "transition-colors duration-200 ease-in-out group-hover:text-white group-focus-within:text-white";
    return (
      <article className="panel-card group flex cursor-pointer flex-col rounded-[28px] p-4 transition-colors duration-300 ease-in-out hover:bg-ink-700 focus-within:bg-ink-700">
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

        <div className="relative mt-8 min-w-0 px-4 sm:px-5">
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
            className="size-5 text-white opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100 group-focus-within:opacity-100"
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
      <div className="flex flex-1 flex-col p-6 transition-colors duration-200 ease-in-out group-hover:bg-ink-700 group-focus-within:bg-ink-700">
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
