"use client";

import dynamic from "next/dynamic";

/**
 * Keeps `three` out of the server bundle and off the hero's critical path.
 * `next/dynamic` with `ssr: false` cannot be called from a server component,
 * so HeroSection imports this thin client wrapper instead.
 */
const HeroGlobe = dynamic(() => import("./HeroGlobe"), {
  ssr: false,
  loading: () => <div className="aspect-square w-full max-w-[520px]" />,
});

export function HeroGlobeMount() {
  return <HeroGlobe />;
}
