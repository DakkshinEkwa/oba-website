"use client";

import dynamic from "next/dynamic";

/**
 * Keeps `three` out of the server bundle and off the hero's critical path.
 * `next/dynamic` with `ssr: false` cannot be called from a server component,
 * so HeroSection imports this thin client wrapper instead.
 */
const HeroGlobe = dynamic(() => import("./HeroGlobe"), {
  ssr: false,
  // No placeholder: the globe is an absolutely-positioned decorative layer, so an
  // in-flow box here would only squash the hero copy until the chunk lands.
  loading: () => null,
});

export function HeroGlobeMount() {
  return <HeroGlobe />;
}
