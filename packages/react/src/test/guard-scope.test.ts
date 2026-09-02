/**
 * What the component guards can see
 *
 * `module-css-tokens`, `module-css-contrast` and `component-tsx-colors` all
 * scan `src/components`. Inside that directory they widen on their own — a new
 * component is picked up without anyone remembering to list it. Outside it they
 * see nothing, and nothing says so.
 *
 * That is the same shape as every gap this repo has closed lately: a check
 * whose scope is narrower than the thing it is checking, in a way its own
 * assertions cannot detect. The contrast check covered six of nineteen recipes.
 * The surface list held the page and the cards. A consumer's guard listed one
 * package and missed a second one that had been mounted on every marketing
 * screen for months — a support-chat panel that was a white slab in the dark
 * theme, invisible to their rendered sweep because it was closed and invisible
 * to their guard because it was out of scope.
 *
 * Today nothing lives outside `src/components`. This asserts that rather than
 * assuming it, because today's answer and tomorrow's are different questions.
 */

import { readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const SRC_DIR = join(import.meta.dirname, "..");
const COMPONENTS_DIR = "components";

/** Directories under `src/` that hold no components by design. */
const NON_COMPONENT_DIRS = new Set(["test", "token", "styles"]);

function walk(dir: string, relative = ""): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = relative ? `${relative}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      found.push(...walk(join(dir, entry.name), path));
    } else {
      found.push(path);
    }
  }
  return found;
}

const OUTSIDE = walk(SRC_DIR).filter(
  (path) => !path.startsWith(`${COMPONENTS_DIR}/`)
);

describe("The component guards can see everything they are meant to", () => {
  it("has no CSS Module outside src/components", () => {
    expect(
      OUTSIDE.filter((path) => path.endsWith(".module.css")),
      "a CSS Module lives where module-css-tokens.test.ts and module-css-contrast.test.ts do not look. Move it under src/components, or widen both scans and this assertion together."
    ).toEqual([]);
  });

  it("has no component outside src/components", () => {
    const components = OUTSIDE.filter(
      (path) =>
        path.endsWith(".tsx") &&
        !(path.endsWith(".stories.tsx") || path.endsWith(".test.tsx")) &&
        !NON_COMPONENT_DIRS.has(path.split("/")[0])
    );
    expect(
      components,
      "a component lives where component-tsx-colors.test.ts does not look. Move it under src/components, or widen the scan and this assertion together."
    ).toEqual([]);
  });
});
