import { okfBundle } from "@/lib/agent/okf";

/** Fully static: every bundle file is rendered once at build time (SSG). */
export const dynamic = "force-static";

export function generateStaticParams() {
  // `/okf` itself plus one route per bundle file.
  return [{ path: [] as string[] }, ...[...okfBundle().keys()].map((f) => ({ path: [f] }))];
}

/**
 * Serves the Open Knowledge Format bundle at /okf/. `/okf` and `/okf/index.md`
 * both return the index, so an agent can discover the bundle either way.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  const { path } = await params;
  const files = okfBundle();
  const key = !path || path.length === 0 ? "index.md" : path.join("/");
  const body = files.get(key);
  if (!body) return new Response("Not found", { status: 404 });

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Robots-Tag": "noindex",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
