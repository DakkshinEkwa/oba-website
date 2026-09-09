import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { OG_BG } from "@/lib/og/size";

/**
 * Web app manifest, served at /manifest.webmanifest. Next emits the
 * <link rel="manifest"> itself, so the layout must NOT also set metadata.manifest.
 *
 * Code rather than a static manifest.json for the same reason robots.ts and
 * sitemap.ts are code: the name, description and brand colour come from
 * src/lib/site.ts and src/lib/og/size.ts, so they cannot drift into a fourth
 * hard-coded copy.
 *
 * Deliberately minimal — no screenshots, shortcuts, or service worker. What it
 * actually buys on a static content site is the Android add-to-home-screen icon and
 * the address-bar tint; there is no offline story here, which is why `display` is
 * "browser" and not "standalone". Declaring "standalone" would prompt Chrome to
 * offer an install for an app that does not exist — the same class of false claim
 * jsonld.ts already refuses to make with SearchAction.
 *
 * Icons point into /images/ because a manifest needs URLs known at author time, and
 * Next serves /icon.png with an unknowable ?<contenthash>. oba-icon-512.png is
 * therefore byte-identical to src/app/icon.png; both come from
 * scripts/generate-brand-icons.ts.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "browser",
    background_color: OG_BG,
    theme_color: OG_BG,
    icons: [
      { src: "/images/oba-icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/images/oba-icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/images/oba-icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
