import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

/**
 * Retrieval and citation crawlers for AI answer engines, explicitly allowed.
 *
 * `Google-Extended` and `Applebot-Extended` are not crawlers — they are opt-out
 * tokens for AI grounding and training. Allowing them is how a site opts *in* to
 * Google AI Overviews / AI Mode grounding and Apple Intelligence. Blocking any
 * of these means that engine cannot cite OBA at all.
 */
const AI_CRAWLERS = [
  // OpenAI
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Apple: Applebot is the crawler that actually fetches pages (Siri, Spotlight
  // and Apple Intelligence retrieval); Applebot-Extended is only the AI opt-in
  // token. Listing the token without the crawler opts in to a fetch that never
  // happens, so both are named.
  "Applebot",
  // Google / Apple AI grounding opt-in tokens
  "Google-Extended",
  "Applebot-Extended",
  // Microsoft Copilot (via Bing), and other answer engines
  "Bingbot",
  "Amazonbot",
  "Meta-ExternalAgent",
  "DuckAssistBot",
  "cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_CRAWLERS, allow: "/" },
      // Training-corpus crawler with no citation path back to the site.
      // Allowed for now; flip to `disallow` to opt out of Common Crawl.
      { userAgent: "CCBot", allow: "/" },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
