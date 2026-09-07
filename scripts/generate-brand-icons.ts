/**
 * One-off dev tool (like scripts/generate-landmask.ts): renders every square brand
 * raster the site needs from the one committed logo lockup.
 *
 *   npx tsx scripts/generate-brand-icons.ts
 *
 * The output is committed. Re-run only when public/images/oba-logo.webp changes.
 *
 * Why static PNGs rather than Next `icon.tsx` / ImageResponse routes: two of these
 * files are consumed by systems outside the browser.
 *   - Organization.logo in src/lib/jsonld.ts asserts width/height as fact, and wants
 *     a durable URL.
 *   - <itunes:image> in src/app/feed.xml must end in .png or .jpg, and podcast
 *     directories key show artwork on the URL.
 * Every Next metadata route emits a `?<contenthash>` query and no file extension, so
 * editing an unrelated OG card would churn both URLs. Files under public/images/ are
 * stable and already served `immutable` by next.config.ts.
 *
 * Square-format note: the OBA logo is a 3.59:1 horizontal lockup, so anything that must
 * be square is driven by the eye glyph on its own (1.23:1, near-square) rather than by
 * the lockup. That covers the icons *and* the podcast artwork, where the lockup left
 * ~75% of the tile empty and went illegible at Apple's ~55px list size. The glyph is
 * existing brand artwork used at a new size — not an invented stacked lockup, which
 * brand-guidelines.md ch.8 (Provisional) defers to the logo redesign. Only
 * oba-logo-square.png keeps the full lockup, because Organization.logo is read large
 * and is meant to identify the org by name.
 *
 * Ground: the icons are the white mark on the hero gradient, matching the OG cards and
 * the site's dark heroes — one dark brand tile everywhere the mark appears on its own.
 * oba-logo-square.png is the sole exception and stays on white, because Google renders
 * Organization.logo on light knowledge-panel cards.
 *
 * sharp cannot encode ICO, so src/app/favicon.ico is built separately from the
 * .icon-src/ PNGs this script emits. See the note at the bottom of this file.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..");
const IMAGES = path.join(root, "public", "images");
const APP = path.join(root, "src", "app");

const SRC_COLOR = path.join(IMAGES, "oba-logo.webp");
const SRC_WHITE = path.join(IMAGES, "oba-logo-white.png");

const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };
// Mirrors OG_BG in src/lib/og/size.ts — the hero gradient's terminal stop. Duplicated
// rather than imported so this script stays free of the `@/` path alias and of
// src/lib/og/assets.ts (a top-level-await module that eagerly base64s the whole logo).
const INK900 = { r: 0x16, g: 0x23, b: 0x2c, alpha: 1 };

type Box = { left: number; top: number; width: number; height: number };
type Ground = "hero" | "white";

/**
 * `--gradient-hero` from src/app/globals.css as a square SVG, so a raster icon stands on
 * the same ground the CSS paints and the OG cards render.
 *
 * CSS `radial-gradient(115% 90% at 78% 30%, …)` is an *ellipse*: radii 115%/90% of the
 * box, centred at 78%/30%. SVG radial gradients are circular, so the ellipse is made by
 * scaling y about the centre — hence r = rx and the transform's y factor of ry/rx.
 */
function heroGradientSvg(size: number): Buffer {
  const cx = 0.78 * size;
  const cy = 0.3 * size;
  const rx = 1.15 * size;
  const ry = 0.9 * size;
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
      `<defs><radialGradient id="hero" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${rx}" ` +
      `gradientTransform="translate(${cx} ${cy}) scale(1 ${ry / rx}) translate(${-cx} ${-cy})">` +
      `<stop offset="0" stop-color="#5b7484"/>` +
      `<stop offset="0.34" stop-color="#3e5361"/>` +
      `<stop offset="0.62" stop-color="#263743"/>` +
      `<stop offset="1" stop-color="#16232c"/>` +
      `</radialGradient></defs>` +
      `<rect width="${size}" height="${size}" fill="url(#hero)"/></svg>`,
  );
}

/**
 * The logo is a lockup: an eye glyph, a gutter, then the wordmark. Nothing in the file
 * records where the split is, so find it from the alpha channel rather than hard-coding
 * a pixel column — a future logo swap should fail loudly here, not silently crop the
 * wrong thing.
 */
async function findGlyphBox(file: string): Promise<Box> {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Column-major on purpose: the inner loop must scan a whole column so `break` means
  // "this column has ink", not "this row has ink".
  const occupied = new Uint8Array(width);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (data[(y * width + x) * channels + 3] > 8) {
        occupied[x] = 1;
        break;
      }
    }
  }

  const MIN_GUTTER = 15;
  let gutterStart = -1;
  let run = 0;
  for (let x = 0; x < width; x++) {
    if (!occupied[x]) {
      if (run === 0) gutterStart = x;
      run++;
    } else {
      if (run >= MIN_GUTTER && gutterStart > 0) break;
      run = 0;
      gutterStart = -1;
    }
  }
  if (run < MIN_GUTTER || gutterStart <= 0) {
    throw new Error(`No gutter of >=${MIN_GUTTER}px found in ${file}; the lockup changed.`);
  }
  // Self-check against the logo this script was written for (gutter at x 778-817).
  if (gutterStart < 770 || gutterStart > 790) {
    throw new Error(
      `Glyph/wordmark gutter starts at x=${gutterStart}, outside the expected 770-790. ` +
        `The logo changed — re-verify the crop before trusting this output.`,
    );
  }

  // Trim the glyph vertically too, so the mark centres on its own ink rather than on
  // the lockup's full-height box.
  let top = height;
  let bottom = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < gutterStart; x++) {
      if (data[(y * width + x) * channels + 3] > 8) {
        if (y < top) top = y;
        if (y > bottom) bottom = y;
        break;
      }
    }
  }
  return { left: 0, top, width: gutterStart, height: bottom - top + 1 };
}

/**
 * Composite `src` (optionally cropped to `box`) onto an opaque square of `ground`,
 * scaled so the art occupies `frac` of the width.
 *
 * Opaque matters: Apple's artwork pipeline handles RGBA unpredictably, and flatten()
 * alone leaves a 4-channel PNG whose alpha is merely all-opaque — removeAlpha() is what
 * actually drops to 3 channels.
 */
async function square(opts: {
  src: string;
  box?: Box;
  size: number;
  frac: number;
  ground: Ground;
  out: string;
}) {
  const { src, box, size, frac, ground, out } = opts;
  const meta = box ?? (await sharp(src).metadata());
  const w = Math.round(size * frac);
  const h = Math.round((w / meta.width!) * meta.height!);

  let pipeline = sharp(src);
  if (box) pipeline = pipeline.extract(box);
  const art = await pipeline
    .resize(w, h, { kernel: "lanczos3", fit: "fill" })
    .png()
    .toBuffer();

  const base =
    ground === "hero"
      ? sharp(heroGradientSvg(size))
      : sharp({ create: { width: size, height: size, channels: 4, background: WHITE } });

  await base
    .composite([{ input: art, left: Math.round((size - w) / 2), top: Math.round((size - h) / 2) }])
    // Both grounds are already opaque; this is what actually drops the alpha channel.
    .flatten({ background: ground === "hero" ? INK900 : WHITE })
    .removeAlpha()
    // No `palette: true` — quantizing would band the logo's teal gradient.
    .png({ compressionLevel: 9 })
    .toFile(out);

  const { size: bytes } = fs.statSync(out);
  console.log(`  ${path.relative(root, out).padEnd(46)} ${size}x${size}  ${(bytes / 1024).toFixed(0)} KB`);
}

async function main() {
  // Derived from the white file because every glyph crop below reads it — the assertion
  // inside should guard the artwork actually being cropped, not its colour sibling.
  const glyph = await findGlyphBox(SRC_WHITE);
  console.log(
    `glyph: ${glyph.width}x${glyph.height} at y=${glyph.top} (${(glyph.width / glyph.height).toFixed(2)}:1)\n`,
  );

  const iconSrc = path.join(IMAGES, ".icon-src");
  fs.mkdirSync(iconSrc, { recursive: true });

  console.log("structured data / feed artwork");
  // The full lockup, white ground: Google renders Organization.logo on light
  // knowledge-panel cards, and this is the one square asset read large enough for the
  // wordmark to do its job.
  await square({ src: SRC_COLOR, size: 1024, frac: 0.82, ground: "white", out: path.join(IMAGES, "oba-logo-square.png") });
  // Show art is an icon, not a wordmark — directories print the show title as text
  // beside it — so this is the white glyph filling the tile. 3000 is Apple's stated
  // maximum (min 1400) and one file also satisfies Spotify's >=1400.
  await square({ src: SRC_WHITE, box: glyph, size: 3000, frac: 0.76, ground: "hero", out: path.join(IMAGES, "podcast-artwork.png") });

  // Icons: the white glyph alone on the hero gradient. A 3.59:1 wordmark is illegible at
  // 32px; the glyph is real brand artwork (no re-typesetting) and its filled iris
  // survives the downscale. At 16px the gradient reads as flat dark, which is the point
  // — the contrast carrying the mark is white-on-dark, not the gradient.
  console.log("\nicons");
  await square({ src: SRC_WHITE, box: glyph, size: 512, frac: 0.72, ground: "hero", out: path.join(APP, "icon.png") });
  // iOS masks apple-icon into a ~22% superellipse, so keep the art well inside and ship
  // it square and opaque — no pre-rounded corners, no gloss.
  await square({ src: SRC_WHITE, box: glyph, size: 180, frac: 0.66, ground: "hero", out: path.join(APP, "apple-icon.png") });

  // Manifest icons live in public/images/ because manifest.ts must reference them by a
  // URL known at author time, and /icon.png carries an unknowable ?<contenthash>.
  // oba-icon-512.png is therefore byte-identical to src/app/icon.png. Unavoidable.
  console.log("\nmanifest icons");
  await square({ src: SRC_WHITE, box: glyph, size: 192, frac: 0.72, ground: "hero", out: path.join(IMAGES, "oba-icon-192.png") });
  await square({ src: SRC_WHITE, box: glyph, size: 512, frac: 0.72, ground: "hero", out: path.join(IMAGES, "oba-icon-512.png") });
  // Android maskable icons are cropped to a circle of 80% diameter; 55% sits comfortably
  // inside that safe zone.
  await square({ src: SRC_WHITE, box: glyph, size: 512, frac: 0.55, ground: "hero", out: path.join(IMAGES, "oba-icon-512-maskable.png") });

  // ICO inputs. sharp has no ICO encoder, so src/app/favicon.ico is packed separately:
  //   magick public/images/.icon-src/{16,32,48}.png src/app/favicon.ico
  //
  // 16/32/48 only: ImageMagick writes ICO entries as raw BMP, so adding a 256px entry
  // takes the file from 15KB to 285KB for a size no browser reads off a favicon —
  // /icon.png (512) and /apple-icon.png (180) already cover the large cases.
  //
  // The .ico is kept at all (rather than relying on icon.png alone) because Next serves
  // the PNG at /icon.png?<hash>, and some crawlers and feed readers request bare
  // /favicon.ico without reading the document head.
  console.log("\nfavicon.ico inputs");
  for (const s of [16, 32, 48]) {
    await square({ src: SRC_WHITE, box: glyph, size: s, frac: 0.86, ground: "hero", out: path.join(iconSrc, `${s}.png`) });
  }
}

main();
