import { chromium } from "playwright";

const OUT =
  "/tmp/claude-1001/-home-dakkshin-Obsidian-Vaults-Ekwa-Work-OBA-oba-website/d1f2e067-22b9-4825-a3e4-e2d5e61f2480/scratchpad";
const BASE = "http://localhost:3100";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });

await page.screenshot({ path: `${OUT}/nav-attached.png`, clip: { x: 0, y: 0, width: 1440, height: 260 } });

await page.mouse.wheel(0, 800);
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/nav-floating.png`, clip: { x: 0, y: 0, width: 1440, height: 260 } });

// interior (light) page, top state
await page.goto(`${BASE}/podcast/episodes`, { waitUntil: "networkidle" });
await page.screenshot({ path: `${OUT}/nav-attached-light.png`, clip: { x: 0, y: 0, width: 1440, height: 260 } });

await browser.close();
console.log("done");
