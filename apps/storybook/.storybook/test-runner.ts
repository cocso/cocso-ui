import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { TestRunnerConfig } from "@storybook/test-runner";
import { waitForPageReady } from "@storybook/test-runner";
import { toMatchImageSnapshot } from "jest-image-snapshot";

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
      failureThreshold: 0.01,
      failureThresholdType: "percent",
    });
  },
};

export default config;
