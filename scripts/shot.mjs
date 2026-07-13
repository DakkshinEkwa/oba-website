import { chromium } from "playwright";

const OUT = "/tmp/claude-1001/-home-dakkshin-Obsidian-Vaults-Ekwa-Work-OBA-oba-website/d1f2e067-22b9-4825-a3e4-e2d5e61f2480/scratchpad";
const targets = process.argv.slice(2);
const pages = targets.length ? targets : ["/", "/styleguide"];

const browser = await chromium.launch();
for (const p of pages) {
  const name = p === "/" ? "home" : p.replace(/\//g, "_").replace(/^_/, "");
  // desktop
  const dctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const dp = await dctx.newPage();
  await dp.goto(`http://localhost:3100${p}`, { waitUntil: "networkidle", timeout: 60000 });
  await dp.waitForTimeout(600);
  await dp.screenshot({ path: `${OUT}/${name}-desktop.png`, fullPage: true });
  await dctx.close();
  // mobile
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const mp = await mctx.newPage();
  await mp.goto(`http://localhost:3100${p}`, { waitUntil: "networkidle", timeout: 60000 });
  await mp.waitForTimeout(600);
  await mp.screenshot({ path: `${OUT}/${name}-mobile.png`, fullPage: true });
  await mctx.close();
  console.log(`shot ${p} → ${name}-desktop.png / ${name}-mobile.png`);
}
await browser.close();
