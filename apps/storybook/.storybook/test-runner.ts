import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { TestRunnerConfig } from "@storybook/test-runner";
import { waitForPageReady } from "@storybook/test-runner";
import { checkA11y, injectAxe } from "axe-playwright";
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
 * The count used to be 100. That is still more than a small control can show:
 * recolouring the whole 1px border of a 16px Checkbox moves 76 pixels, and the
 * Avatar's initials changing from grey to near-black moved 76 — both passed as
 * "unchanged", the second for five months. Measured across 33 stories whose
 * render did not change, the difference between baseline and run was exactly
 * 0 pixels in every one, so the budget below absorbs nothing real; it is only
 * insurance against a single anti-aliased edge.
 */
const FAILURE_THRESHOLD_PIXELS = 16;

/**
 * Which pass this run is. Both walk every story with a real browser, and they
 * are separate jobs so a failure says which kind it is rather than reporting an
 * accessibility defect as a visual regression.
 */
const A11Y_ONLY = process.env.STORYBOOK_A11Y === "1";

/**
 * Rules that fire on the harness rather than the component.
 *
 * `region` wants every piece of page content inside a landmark. A story renders
 * one bare component with no page around it, so it fires on all of them, and a
 * component library does not own the page's landmarks.
 *
 * Everything else stays on — including the rules that need layout, which is the
 * point of running here instead of in jsdom. `color-contrast` and target size
 * cannot be evaluated without a rendered box, so the unit-level check disables
 * them and this one does not.
 */
const HARNESS_RULES = {
  region: { enabled: false },
};

const config: TestRunnerConfig = {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async preVisit(page) {
    if (A11Y_ONLY) {
      await injectAxe(page);
    }
  },
  async postVisit(page, context) {
    // Wait for Storybook page to be fully ready (fonts, assets, rendering)
    await waitForPageReady(page);

    if (A11Y_ONLY) {
      await checkA11y(page, "#storybook-root", {
        axeOptions: { rules: HARNESS_RULES },
        detailedReport: true,
        detailedReportOptions: { html: true },
      });
      return;
    }

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
