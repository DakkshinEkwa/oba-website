import { ImageResponse } from "next/og";
import type { ReactElement } from "react";
import { interLight, plexMono } from "./assets";
import { OG_SIZE } from "./size";

export function renderOgImage(element: ReactElement) {
  return new ImageResponse(element, {
    ...OG_SIZE,
    fonts: [
      { name: "Inter", data: interLight, style: "normal", weight: 300 },
      { name: "IBM Plex Mono", data: plexMono, style: "normal", weight: 500 },
    ],
  });
}
