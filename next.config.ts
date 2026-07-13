import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.obacademy.org" },
      { protocol: "https", hostname: "obacademy.org" },
      { protocol: "https", hostname: "**.libsyn.com" },
      { protocol: "https", hostname: "**.libsyncdn.com" },
    ],
  },
  async redirects() {
    // 301 map from legacy WordPress URLs → new routes (SEO preservation).
    // Populated from the live sitemap during Phase 8.
    return [
      { source: "/podcast-show", destination: "/podcast/episodes", permanent: true },
      { source: "/podcast-show/:slug", destination: "/podcast/episodes/:slug", permanent: true },
      { source: "/webinar-archive", destination: "/resources/webinars", permanent: true },
      { source: "/expert-insights-hub", destination: "/resources", permanent: true },
      { source: "/newsletter", destination: "/resources/newsletter", permanent: true },
      { source: "/events", destination: "/resources/events", permanent: true },
      { source: "/hosts", destination: "/podcast/hosts", permanent: true },
      { source: "/about-podcast", destination: "/podcast", permanent: true },
      { source: "/msm/ryan", destination: "/analyze", permanent: true },
    ];
  },
};

export default nextConfig;
