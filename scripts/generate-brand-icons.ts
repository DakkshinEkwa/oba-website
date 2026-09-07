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

/* ── The favicon mark ───────────────────────────────────────────────────────
 * A purpose-drawn small-size version of the eye, used ONLY for the favicon.ico
 * entries (16/32/48). Every larger icon keeps the real glyph.
 *
 * Why the glyph itself cannot be the favicon: it is four concentric bands —
 * ring 262→312, ring 165→212, then the iris at r114 — drawn at a ~50px stroke
 * on a 778px glyph, i.e. 6.4% of its width. On a 32px tile each of those bands
 * lands on ~1.1px and they mush into a grey tangle; at 16px nothing survives.
 * brand-guidelines.md ch.8 states the same limit from the other direction:
 * "minimum on screen 1250 px wide - below this the counters fill in."
 *
 * So the favicon keeps the mark's geometry and drops a band. Every number below
 * was *measured* off oba-logo-white.png rather than redrawn by eye: the eye
 * centre, both ring bands, the iris, the two circular edges the lash sweep runs
 * between, and the fact that the pupil is a circle internally tangent to the
 * iris — which is why it reads as a notch opening outward and not a closed hole.
 * The reduction is exactly three moves: drop the inner ring, open the remaining
 * ring's stroke from 50 to 72, and grow the iris from 114 to 176 so it still
 * holds the tile. Nothing is re-typeset and no new curve is invented.
 *
 * The pupil is dropped at 16px only: at that size the notch eats enough of the
 * iris that the disc reads as a "C". Browsers that pick the 32 or 48 entry
 * never see the difference — and Next declares favicon.ico as sizes="48x48",
 * so most of them do.
 *
 * This is also the mark's first vector original — brand-guidelines.md records
 * that none exists — so scripts/assets/oba-eye-mark.svg is written from these
 * same constants and therefore cannot drift from the rasters.
 */
const MARK = {
  cx: 566, cy: 328, // eye centre, in oba-logo-white.png glyph pixels
  ringOuter: 312, // the outer band's outer radius; unchanged from the glyph
  ringInner: 240, // was 262 — the stroke opens inward to 72px
  ringFrom: -60, ringTo: -236, // SVG degrees (y-down); open across the lower right
  iris: 176, // was 114
  pupilFrac: 0.32, // was 48/114 = 0.42; trimmed so the disc still reads as a disc
  pupilAngle: -44,
  // The lash is the region between two circular edges meeting at a tip. Both
  // circles were fitted through three points sampled off the raster.
  lash: {
    tip: [0, 326] as const,
    upper: { cx: 584, cy: 669, r: 677.3, end: -99 },
    lower: { cx: 805, cy: 1120, r: 1130.3, end: -101 },
  },
} as const;

const MARK_FRAC = 0.9;

/**
 * Corner radius of the favicon tile, as a fraction of its size. 1/8 lands on whole
 * pixels at all three ICO sizes (16→2, 32→4, 48→6), which matters: a fractional
 * radius at 16px spends its whole corner on antialiasing and reads as grime rather
 * than a curve.
 *
 * Only the favicon rounds. apple-icon.png stays square because iOS masks it into its
 * own ~22% superellipse and a pre-rounded tile would be clipped twice; the maskable
 * manifest icon stays square because Android crops it; and podcast-artwork.png /
 * oba-logo-square.png stay square and opaque because the directories and Google read
 * them as flat artwork.
 */
const MARK_RADIUS = 1 / 8;

const rad = (deg: number) => (deg * Math.PI) / 180;
const on = (cx: number, cy: number, r: number, deg: number): [number, number] => [
  cx + r * Math.cos(rad(deg)),
  cy + r * Math.sin(rad(deg)),
];
const f = (n: number) => n.toFixed(2);

/** Closed circle as a path, so winding can be chosen: a counter-wound circle cuts. */
function circlePath(cx: number, cy: number, r: number, clockwise: boolean): string {
  const s = clockwise ? 1 : 0;
  return (
    `M${f(cx - r)},${f(cy)}A${f(r)},${f(r)} 0 1 ${s} ${f(cx + r)},${f(cy)}` +
    `A${f(r)},${f(r)} 0 1 ${s} ${f(cx - r)},${f(cy)}Z`
  );
}

function ringPath(): string {
  const { cx, cy, ringOuter: ro, ringInner: ri, ringFrom: a0, ringTo: a1 } = MARK;
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  const sweep = a1 > a0 ? 1 : 0;
  const [x1, y1] = on(cx, cy, ro, a0);
  const [x2, y2] = on(cx, cy, ro, a1);
  const [x3, y3] = on(cx, cy, ri, a1);
  const [x4, y4] = on(cx, cy, ri, a0);
  return (
    `M${f(x1)},${f(y1)}A${ro},${ro} 0 ${large} ${sweep} ${f(x2)},${f(y2)}` +
    `L${f(x3)},${f(y3)}A${ri},${ri} 0 ${large} ${1 - sweep} ${f(x4)},${f(y4)}Z`
  );
}

/** The iris disc, with the pupil as a counter-wound tangent circle that cuts it. */
function irisPath(pupil: boolean): string {
  const { cx, cy, iris: r, pupilFrac, pupilAngle } = MARK;
  const disc = circlePath(cx, cy, r, true);
  if (!pupil) return disc;
  const rp = r * pupilFrac;
  const [px, py] = on(cx, cy, r - rp, pupilAngle); // internally tangent, as in the glyph
  return `${disc} ${circlePath(px, py, rp, false)}`;
}

function lashPath(): string {
  const { tip, upper: u, lower: l } = MARK.lash;
  const [ux, uy] = on(u.cx, u.cy, u.r, u.end);
  const [lx, ly] = on(l.cx, l.cy, l.r, l.end);
  return (
    `M${f(tip[0])},${f(tip[1])}A${u.r},${u.r} 0 0 1 ${f(ux)},${f(uy)}` +
    `L${f(lx)},${f(ly)}A${l.r},${l.r} 0 0 0 ${f(tip[0])},${f(tip[1])}Z`
  );
}

/**
 * Both lash arcs are monotone over the range actually drawn, so their endpoints
 * plus the ring circle give the mark's true bounds — no path flattening needed.
 * (The iris sits wholly inside the ring.)
 */
function markBounds() {
  const { cx, cy, ringOuter: ro, lash } = MARK;
  const [ux, uy] = on(lash.upper.cx, lash.upper.cy, lash.upper.r, lash.upper.end);
  const [lx, ly] = on(lash.lower.cx, lash.lower.cy, lash.lower.r, lash.lower.end);
  const xs = [cx - ro, cx + ro, lash.tip[0], ux, lx];
  const ys = [cy - ro, cy + ro, lash.tip[1], uy, ly];
  return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
}

const markPaths = (pupil: boolean) =>
  `<path d="${lashPath()}"/><path d="${ringPath()}"/><path d="${irisPath(pupil)}"/>`;

/** The white mark on a transparent square tile, ready to composite over a ground. */
function faviconMarkSvg(size: number, pupil: boolean): Buffer {
  const b = markBounds();
  const w = b.x1 - b.x0;
  const h = b.y1 - b.y0;
  const s = (size * MARK_FRAC) / Math.max(w, h);
  const tx = size / 2 - ((b.x0 + b.x1) / 2) * s;
  const ty = size / 2 - ((b.y0 + b.y1) / 2) * s;
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
      `<g transform="translate(${f(tx)},${f(ty)}) scale(${s.toFixed(5)})" fill="#fff" fill-rule="evenodd">` +
      `${markPaths(pupil)}</g></svg>`,
  );
}

/** The committed vector original: tight viewBox, currentColor, no ground. */
function markSourceSvg(): string {
  const b = markBounds();
  const w = b.x1 - b.x0;
  const h = b.y1 - b.y0;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${f(b.x0)} ${f(b.y0)} ${f(w)} ${f(h)}" ` +
    `fill="currentColor" fill-rule="evenodd" role="img" aria-label="Ophthalmology Business Academy">` +
    `<title>OBA eye mark (small-size)</title>${markPaths(true)}</svg>\n`
  );
}

/** The rounded tile, as a mask: white inside the corner radius, transparent outside. */
function roundedTileSvg(size: number): Buffer {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
      `<rect width="${size}" height="${size}" rx="${size * MARK_RADIUS}" fill="#fff"/></svg>`,
  );
}

/**
 * square(), but for the generated mark: no source raster, so no crop box.
 *
 * This is the one icon that keeps its alpha channel — the rounded corners have to be
 * transparent, since the tile sits on browser chrome whose colour we do not know. The
 * `dest-in` composite runs last and clips everything painted before it.
 */
async function squareMark(opts: { size: number; pupil: boolean; out: string }) {
  const { size, pupil, out } = opts;
  await sharp(heroGradientSvg(size))
    .composite([
      { input: faviconMarkSvg(size, pupil) },
      { input: roundedTileSvg(size), blend: "dest-in" },
    ])
    .png({ compressionLevel: 9 })
    .toFile(out);
  const { size: bytes } = fs.statSync(out);
  console.log(
    `  ${path.relative(root, out).padEnd(46)} ${size}x${size}  ${(bytes / 1024).toFixed(0)} KB` +
      `${pupil ? "" : "  (pupil dropped)"}`,
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
  //
  // These three, alone among the icons, are drawn from MARK rather than cropped from
  // the logo: at 16-48px the glyph's four concentric bands fill in. See the block at
  // the top of this file.
  console.log("\nfavicon.ico inputs");
  for (const s of [16, 32, 48]) {
    await squareMark({ size: s, pupil: s > 16, out: path.join(iconSrc, `${s}.png`) });
  }

  // The mark's vector original, written from the same constants so it can never drift
  // from the rasters above. A build input only — it is not served, precisely so it is
  // not mistaken for the logo, which stays the raster lockup.
  console.log("\nvector original");
  const assets = path.join(here, "assets");
  fs.mkdirSync(assets, { recursive: true });
  const svgOut = path.join(assets, "oba-eye-mark.svg");
  fs.writeFileSync(svgOut, markSourceSvg());
  console.log(`  ${path.relative(root, svgOut)}`);
}

main();
