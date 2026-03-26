/**
 * extract-components.ts
 *
 * Renders the component catalog in a real browser via Playwright,
 * extracts computed styles from the DOM, and writes a JSON spec file
 * that the Figma plugin uses to generate accurate Figma components.
 *
 * Usage:  pnpm extract
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const CATALOG_PORT = 5199;
const CATALOG_URL = `http://localhost:${CATALOG_PORT}`;
const OUT_PATH = resolve(scriptDir, "../src/generated/component-specs.json");
const BROWSER_SCRIPT = resolve(scriptDir, "browser-extract.js");

async function main() {
  console.log("Extracting component specs from rendered DOM...\n");

  // Dynamically import Playwright
  let chromium: typeof import("playwright").chromium;
  try {
    const pw = await import("playwright");
    chromium = pw.chromium;
  } catch {
    console.error(
      "Playwright is required for extraction.\n" +
        "Install: pnpm add -D playwright && npx playwright install chromium"
    );
    process.exit(1);
  }

  // Start the catalog Vite dev server
  const { createServer } = await import("vite");
  const server = await createServer({
    configFile: resolve(scriptDir, "../catalog/vite.config.ts"),
    server: { port: CATALOG_PORT, strictPort: true },
  });
  await server.listen();
  console.log(`Catalog server running at ${CATALOG_URL}`);

  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
    });

    await page.goto(CATALOG_URL, { waitUntil: "networkidle" });

    // Wait for Pretendard webfont to load and rendering to settle
    await page
      .waitForFunction(() => document.fonts.check("16px Pretendard Variable"), {
        timeout: 10_000,
      })
      .catch(() => {
        console.warn(
          "Pretendard font did not load — falling back to system fonts"
        );
      });
    await page.waitForTimeout(500);

    // Inject the extraction script (plain JS, avoids esbuild __name issues)
    await page.addScriptTag({ path: BROWSER_SCRIPT });

    // Run extraction
    const specs = await page.evaluate(() => {
      return (
        window as unknown as { __extractComponents: () => unknown }
      ).__extractComponents();
    });

    // Ensure output directory exists
    const outDir = resolve(OUT_PATH, "..");
    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true });
    }

    writeFileSync(OUT_PATH, JSON.stringify(specs, null, 2));

    const specObj = specs as Record<string, unknown[]>;
    const componentCount = Object.keys(specObj).length;
    const variantCount = Object.values(specObj).reduce(
      (sum, arr) => sum + arr.length,
      0
    );
    console.log(
      `\nExtracted ${variantCount} variants across ${componentCount} components`
    );
    console.log(`Written to: ${OUT_PATH}`);

    await browser.close();
  } finally {
    await server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
