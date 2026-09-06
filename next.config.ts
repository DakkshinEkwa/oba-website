import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "www.obacademy.org" },
      { protocol: "https", hostname: "obacademy.org" },
      { protocol: "https", hostname: "**.libsyn.com" },
      { protocol: "https", hostname: "**.libsyncdn.com" },
    ],
  },
  /**
   * Note: headers() requires a Node/Vercel-style host. On a pure static host
   * (e.g. GitHub Pages) these are dropped and must be set at the host instead.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
          // Enable once the final domain is confirmed and serving HTTPS:
          // { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/pdfs/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  async redirects() {
    // 301 map from legacy WordPress URLs → new routes (SEO preservation).
    // Populated from the live sitemap during Phase 8.
    return [
      { source: "/podcast-show", destination: "/podcast/episodes", permanent: true },
      { source: "/podcast-show/:slug", destination: "/podcast/episodes/:slug", permanent: true },
      { source: "/webinar-archive", destination: "/resources", permanent: true },
      { source: "/expert-insights-hub", destination: "/resources", permanent: true },
      { source: "/newsletter", destination: "/#newsletter", permanent: true },
      { source: "/events", destination: "/resources/events", permanent: true },
      { source: "/hosts", destination: "/podcast/hosts", permanent: true },
      { source: "/about-podcast", destination: "/podcast/episodes", permanent: true },
      { source: "/msm/ryan", destination: "/msm", permanent: true },
      // Legacy episode URL shape from the old live sitemap (/podcast/episode/<slug>).
      { source: "/podcast/episode", destination: "/podcast/episodes", permanent: true },
      { source: "/podcast/episode/:slug", destination: "/podcast/episodes/:slug", permanent: true },
      // Auth routes removed with the account system; the free library is the honest destination.
      { source: "/register", destination: "/resources", permanent: true },
      { source: "/login", destination: "/resources", permanent: true },
      { source: "/forgot-password", destination: "/resources", permanent: true },
      // URL parity with the current live site (obacademy.org 2026 relaunch).
      { source: "/webinars", destination: "/resources", permanent: true },
      { source: "/webinars/replays", destination: "/resources", permanent: true },
      { source: "/guest-speaker", destination: "/speak", permanent: true },
      { source: "/marketing", destination: "/msm", permanent: true },
      { source: "/analyze", destination: "/msm", permanent: true },
      // Pages removed from the site — redirected rather than left to 404.
      { source: "/podcast", destination: "/podcast/episodes", permanent: true },
      { source: "/faq", destination: "/#faq", permanent: true },
      { source: "/resources/webinars", destination: "/resources", permanent: true },
      { source: "/resources/webinars/replays", destination: "/resources", permanent: true },
      { source: "/resources/webinars/:slug", destination: "/resources", permanent: true },
      { source: "/resources/newsletter", destination: "/#newsletter", permanent: true },
      { source: "/partnerships", destination: "/contact#partnership", permanent: true },
      { source: "/membership", destination: "/resources", permanent: true },
      { source: "/reviews", destination: "/about", permanent: true },
    ];
  },
};

export default nextConfig;
