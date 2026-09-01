import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { TestRunnerConfig } from "@storybook/test-runner";
import { waitForPageReady } from "@storybook/test-runner";
import { toMatchImageSnapshot } from "jest-image-snapshot";

/**
 * Number of differing pixels tolerated before a story fails.
 *
 * Deliberately an absolute count, not a percentage. `failureThresholdType:
 * "percent"` compares `diffPixelCount / totalPixels`, and every screenshot here
 * is a 1280x720 viewport (921,600 px) holding one `layout: centered` component,
 * so the denominator is mostly empty canvas. At the previous `0.01` percent
 * setting a story could differ by up to 9,216 pixels and still pass — enough to
 * hide an entire added Badge, which is exactly what happened: a Badge variant
 * was added to the Variants story and the run reported it as unchanged.
 *
 * Baselines are captured on the same CI runner image as the comparison, so
 * genuine noise is near zero; this budget only absorbs incidental
 * anti-aliasing drift.
 */
const FAILURE_THRESHOLD_PIXELS = 100;

const config: TestRunnerConfig = {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async postVisit(page, context) {
    // Wait for Storybook page to be fully ready (fonts, assets, rendering)
    await waitForPageReady(page);

    const image = await page.screenshot({ fullPage: false });

    // Save current screenshot for CI visual regression reporting (before/after/diff)
    const currentDir = join(process.cwd(), "__snapshots__", "__current__");
    mkdirSync(currentDir, { recursive: true });
    writeFileSync(join(currentDir, `${context.id}.png`), image);

    expect(image).toMatchImageSnapshot({
      customSnapshotsDir: `${process.cwd()}/__snapshots__`,
      customSnapshotIdentifier: context.id,
      failureThreshold: FAILURE_THRESHOLD_PIXELS,
      failureThresholdType: "pixel",
    });
  },
};

export default config;
