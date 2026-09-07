export const OG_SIZE = { width: 1200, height: 630 } as const;

/**
 * The flat terminal stop of the hero gradient. Still the right value anywhere a
 * single colour is required — `theme-color`, the manifest, and the opaque flatten
 * behind generated rasters — none of which can carry a gradient.
 */
export const OG_BG = "#16232c";

/**
 * `--gradient-hero` from src/app/globals.css, transcribed so the OG cards stand on
 * the same ground as the site's dark heroes rather than on flat ink.
 *
 * Verified to render in satori as written: the bright stop lands at 78%/30% and the
 * far corner resolves to OG_BG, so no shape keyword or fallback is needed. Keep it
 * byte-identical to the token — this is a copy, and the two must not drift.
 */
export const OG_GRADIENT =
  "radial-gradient(115% 90% at 78% 30%, #5b7484 0%, #3e5361 34%, #263743 62%, #16232c 100%)";
