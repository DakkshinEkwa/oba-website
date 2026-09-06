import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import type { BlogPost } from "@/lib/schemas";
import { formatDate } from "@/lib/utils";

/**
 * One dense article row — the blog counterpart to `EpisodeRow`, sharing the
 * `.episode-list` / `.episode-row` treatment so the sliding highlight behaves
 * identically in both lists.
 *
 * Exactly one interactive element: the title link, stretched over the row by
 * `after:inset-0`. The thumbnail and the arrow are decorative.
 *
 * Deliberately no excerpt. Every post's raw `excerpt` is the first ~20 words of
 * the body with a WordPress `[…]` marker still attached, so printing it raw is
 * how that artifact reaches the page. The date and reading time are real.
 */
export function BlogRow({ post, priority = false }: { post: BlogPost; priority?: boolean }) {
  const href = `/blog/${post.slug}`;

  return (
    <li className="episode-row group grid grid-cols-[6rem_minmax(0,1fr)] items-center gap-5 rounded-[20px] px-6 py-6 sm:grid-cols-[8rem_minmax(0,1fr)_auto] sm:gap-7 sm:px-8 sm:py-7">
      <div className="relative aspect-video overflow-hidden rounded-md bg-canvas">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt=""
            fill
            priority={priority}
            sizes="(max-width:640px) 96px, 128px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-300">
            <FileText className="size-5 sm:size-6" aria-hidden />
          </div>
        )}
      </div>

      <div className="relative min-w-0 transition-transform duration-200 ease-in-out group-hover:translate-x-4 group-focus-within:translate-x-4">
        <p className="font-mono text-small font-light uppercase tracking-wide text-ink-400 transition-colors duration-200 ease-in-out group-hover:text-white group-focus-within:text-white">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        </p>
        <h3 className="mt-2 text-h4 font-normal text-ink-900 transition-colors duration-200 ease-in-out group-hover:text-white group-focus-within:text-white">
          <Link
            href={href}
            className="after:absolute after:inset-0 after:z-10 after:content-[''] focus-visible:outline-offset-4"
          >
            {post.title}
          </Link>
        </h3>
      </div>

      <div className="relative hidden items-center justify-self-end gap-5 sm:flex">
        <span className="font-mono text-small font-light uppercase tracking-wide text-ink-400 transition-colors duration-200 ease-in-out group-hover:text-white group-focus-within:text-white">
          {post.readingTimeMin} min read
        </span>
        <ArrowRight
          className="size-5 text-white opacity-0 transition-[opacity,transform] duration-200 ease-in-out group-hover:translate-x-1 group-hover:opacity-100 group-focus-within:translate-x-1 group-focus-within:opacity-100"
          aria-hidden
        />
      </div>
    </li>
  );
}
