/**
 * Every overlay has a story that opens it
 *
 * The visual job screenshots a story as it renders. A component whose whole
 * subject is a panel that appears on demand therefore contributed a picture of
 * its trigger and nothing else: ten baselines across the three pickers were
 * ~6KB images of one small outline Button, and Dialog, Dropdown, Popover and
 * Tooltip were the same. The panel — the layout, the day grid, the time column,
 * the backdrop — had no pixel coverage at all.
 *
 * That is not hypothetical. `DateTimePicker` shipped with its time list stacked
 * underneath the calendar instead of beside it, out of the popover. Every check
 * was green; it was found by opening Storybook by hand. The three pickers now
 * share `components/picker/*.module.css`, so one edit there reaches all three
 * popovers, and without an open-state story nothing in CI can see any of it.
 *
 * So: a component that mounts a portal, or builds on one that does, must have a
 * story that renders it open. The check finds the overlays itself rather than
 * holding a list — a list would have been written when there were four of them
 * and would still say four.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const COMPONENTS_DIR = join(import.meta.dirname, "..", "components");

/**
 * A component is an overlay if it mounts a floating layer itself, or composes
 * one of the components that does. The pickers are the second kind: they hold
 * their calendar in a `Dropdown`, and their own source never says `Portal`.
 */
const MOUNTS_PORTAL = /\b(Portal|Positioner)\b/;
const COMPOSES_OVERLAY = /from "\.\.\/(dropdown|popover|dialog|tooltip)"/;

/** The marker the test runner reads to turn motion off for the screenshot. */
const OPEN_STORY = /parameters:\s*{\s*overlay:\s*true\s*}/;

function componentDirs(): string[] {
  return readdirSync(COMPONENTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function read(dir: string, file: string): string | null {
  try {
    return readFileSync(join(COMPONENTS_DIR, dir, file), "utf-8");
  } catch {
    return null;
  }
}

const OVERLAYS = componentDirs().filter((dir) => {
  const source = read(dir, `${dir}.tsx`);
  return (
    source !== null &&
    (MOUNTS_PORTAL.test(source) || COMPOSES_OVERLAY.test(source))
  );
});

describe("Overlay components are screenshotted open, not just their trigger", () => {
  it("finds the overlays", () => {
    // Dialog, Dropdown, Popover, Tooltip, and the three pickers built on
    // Dropdown. A floor rather than an exact count, so adding one is not a
    // failure — but low enough to fail loudly if the detection above ever
    // stops matching, which would turn this whole file into a no-op.
    expect(OVERLAYS.length).toBeGreaterThanOrEqual(7);
  });

  it.each(OVERLAYS)("%s has a story that renders it open", (dir) => {
    const stories = read(dir, `${dir}.stories.tsx`);
    expect(stories, `${dir} has no stories file`).not.toBeNull();
    expect(
      OPEN_STORY.test(stories as string),
      `${dir} mounts a panel but no story opens it, so the visual check only ever sees its trigger. Add a story with \`parameters: { overlay: true }\` that renders the panel open, and regenerate baselines on the branch.`
    ).toBe(true);
  });
});
