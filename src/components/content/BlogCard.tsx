import Link from "next/link";
import Image from "next/image";
import { FileText } from "lucide-react";
import type { BlogPost } from "@/lib/schemas";
import { formatDate } from "@/lib/utils";

export function BlogCard({ post }: { post: BlogPost }) {
  const href = `/blog/${post.slug}`;
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-line bg-canvas transition-colors duration-200 hover:border-ink-300">
      <Link href={href} className="relative block aspect-[16/9] overflow-hidden bg-canvas-subtle">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-300">
            <FileText className="size-10" aria-hidden />
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 font-mono text-eyebrow uppercase text-ink-400">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          {post.readingTimeMin ? (
            <>
              <span aria-hidden>·</span>
              <span>{post.readingTimeMin} min read</span>
            </>
          ) : null}
        </div>
        <h3 className="mt-2 text-body-lg font-medium leading-snug">
          <Link href={href} className="transition-colors group-hover:text-accent-700">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-body text-ink-500">{post.excerpt}</p>
      </div>
    </article>
  );
}
