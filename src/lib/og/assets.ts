import { join } from "node:path";
import { readFile } from "node:fs/promises";

const fontsDir = join(process.cwd(), "src/lib/og/fonts");

export const interLight = await readFile(join(fontsDir, "Inter-Light.ttf"));
export const plexMono = await readFile(join(fontsDir, "IBMPlexMono-Medium.ttf"));

const logoData = await readFile(
  join(process.cwd(), "public/images/oba-logo-white.png"),
  "base64",
);
export const logoSrc = `data:image/png;base64,${logoData}`;
