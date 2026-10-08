import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type {
  PrepareContext,
  TestContext,
  TestRunnerConfig,
} from "@storybook/test-runner";
import { getStoryContext, waitForPageReady } from "@storybook/test-runner";
import { checkA11y, injectAxe } from "axe-playwright";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import type { Page } from "playwright";

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

/**
 * Whether a story declares itself an open overlay (`parameters.overlay`).
 *
 * An overlay's panel lives in a portal under `<body>`, and every such story in
 * this repo used to screenshot its trigger and nothing else — the panel had no
 * pixel coverage at all. A story that opens one needs two things the others do
 * not, and both are per-story rather than global so no existing baseline moves:
 *
 * - Motion off. All four overlay modules animate on enter and all four already
 *   branch on `prefers-reduced-motion: reduce` to `animation: none`, so the
 *   deterministic frame is reached through the component's own affordance
 *   rather than a sleep. Emulating it globally would instead change what the
 *   Spinner and Skeleton baselines capture: those run a decorative animation
 *   with no still frame, and under `reduce` the Spinner swaps to a different
 *   animation entirely. Their current baselines are the default rendering, and
 *   that is the one worth guarding.
 * - A wider axe scope. `#storybook-root` cannot see a portal, so an overlay
 *   checked against it is checked empty. Worse, an open Dialog marks the rest
 *   of the document inert, so the scoped run would be inspecting a hidden
 *   subtree and reporting on nothing.
 */
async function isOverlayStory(page: Page, context: TestContext) {
  const { parameters } = await getStoryContext(page, context);
  return parameters?.overlay === true;
}

/**
 * Base UI's focus guards: `<span aria-hidden="true" tabindex="0">` sentinels it
 * mounts around an open popup to keep Tab inside it.
 *
 * axe reports them under `aria-hidden-focus`, correctly by the letter of the
 * rule, and they are upstream markup that nothing in this repo can change. They
 * are excluded as nodes rather than by switching the rule off, so a genuine
 * `aria-hidden-focus` defect in our own overlay content still fails the job —
 * turning off a serious rule to get a green tick is how a check stops finding
 * things.
 *
 * They also sit inside `#storybook-root`, not only in the portal, so narrowing
 * the scope back would not have avoided them: any story that opens an overlay
 * meets this, wherever axe is pointed.
 */
const BASE_UI_FOCUS_GUARD = "[data-base-ui-focus-guard]";

/**
 * An overlay story is checked against `body`, not `#storybook-root`, because
 * the panel is in a portal and a scoped run would be inspecting everything
 * except the thing the story is about. An open Dialog also marks the rest of
 * the document inert, so the scoped run would be reading a hidden subtree.
 *
 * This is the check that holds the pickers to their markup. Pointed at `body`
 * it fails on a critical `aria-required-children` for as long as they host a
 * calendar inside `Dropdown.Content` — Base UI's `Menu.Popup`, which reports
 * `role="menu"`, a role whose required `menuitem` children a grid of days does
 * not have. Swap any picker back to `Dropdown` and this job goes red.
 */
async function axeContext(page: Page, context: TestContext) {
  return (await isOverlayStory(page, context))
    ? { exclude: [[BASE_UI_FOCUS_GUARD]], include: [["body"]] }
    : "#storybook-root";
}

/**
 * The first navigation of each worker, retried.
 *
 * The runner's own `prepare` calls `page.goto` once, on Playwright's default
 * 30s navigation timeout, with no retry. Several workers open the static
 * server at the same moment and one of them occasionally does not get a
 * response in time; the suite then reports `Test suite failed to run —
 * page.goto: Timeout 30000ms exceeded` while every test in it passes. It has
 * landed twice recently, on `pagination` and on `accordion`, each time on a
 * change that had nothing to do with either, and each time a re-run was green.
 *
 * A failure that is really "the server was slow to answer" should not read as
 * a broken story, so this waits longer and tries again. A server that is
 * genuinely down still fails, three attempts later, with the runner's own
 * connection-refused message intact.
 */
const NAVIGATION_TIMEOUT_MS = 60_000;
const NAVIGATION_ATTEMPTS = 3;

async function prepare({
  page,
  browserContext,
  testRunnerConfig,
}: PrepareContext) {
  const targetURL = process.env.TARGET_URL ?? "http://localhost:6006";
  const iframeURL = new URL("iframe.html", targetURL).toString();

  if (testRunnerConfig?.getHttpHeaders) {
    const headers = await testRunnerConfig.getHttpHeaders(iframeURL);
    await browserContext.setExtraHTTPHeaders(headers);
  }

  for (let attempt = 1; attempt <= NAVIGATION_ATTEMPTS; attempt += 1) {
    try {
      await page.goto(iframeURL, {
        timeout: NAVIGATION_TIMEOUT_MS,
        waitUntil: "load",
      });
      return;
    } catch (error) {
      if (attempt === NAVIGATION_ATTEMPTS) {
        throw error;
      }
      await page.waitForTimeout(2000);
    }
  }
}

const config: TestRunnerConfig = {
  prepare,
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async preVisit(page, context) {
    // Set on every story, not only the overlays: the runner reuses one page, so
    // a value left behind by the previous story would leak into this one.
    await page.emulateMedia({
      reducedMotion: (await isOverlayStory(page, context)) ? "reduce" : null,
    });

    if (!A11Y_ONLY) {
      return;
    }
    // The test runner reuses a page across stories, and Storybook moves between
    // them without a document navigation, so `window.axe` survives. Injecting
    // it again on top of a live instance is what produced `Axe is already
    // running` — a failure that reads like an accessibility violation, fails
    // the gate, and passes on a re-run. Nine stories failed that way on this
    // branch and none of them had anything wrong with them.
    const alreadyInjected = await page.evaluate(
      () => typeof (window as { axe?: unknown }).axe !== "undefined"
    );
    if (!alreadyInjected) {
      await injectAxe(page);
    }
  },
  async postVisit(page, context) {
    // Wait for Storybook page to be fully ready (fonts, assets, rendering)
    await waitForPageReady(page);

    if (A11Y_ONLY) {
      await checkA11y(page, await axeContext(page, context), {
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
