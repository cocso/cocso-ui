import type { TestRunnerConfig } from "@storybook/test-runner";
import { toMatchImageSnapshot } from "jest-image-snapshot";

const config: TestRunnerConfig = {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async postVisit(page, context) {
    // Wait for animations to settle
    await page.waitForTimeout(300);

    const image = await page.screenshot({ fullPage: false });
    expect(image).toMatchImageSnapshot({
      customSnapshotsDir: `${process.cwd()}/__snapshots__`,
      customSnapshotIdentifier: context.id,
      failureThreshold: 0.01,
      failureThresholdType: "percent",
    });
  },
};

export default config;
