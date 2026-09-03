/**
 * Motion and writing direction
 *
 * Two properties of the stylesheets that nothing checked, both found by asking
 * what the colour guards do not cover.
 *
 * **Motion.** Seventeen modules animate; three respected
 * `prefers-reduced-motion`. The other fourteen ran their transitions and
 * pulses regardless of a setting the user turned on for a reason. Motion in
 * this library is decoration — every component reads the same without it — so
 * there is no case where honouring the preference costs meaning.
 *
 * **Writing direction.** A physical `margin-left` is a statement about the
 * screen; the thing it usually means is "the side the text starts on", which is
 * the opposite side in an RTL document. `Button` put its icon gap on
 * `margin-right`, `Select` its chevron on `right`, `Field` its optional marker
 * on `margin-left` — all of which land on the wrong side once the document
 * direction flips.
 *
 * Physical `left`/`right`/`top`/`bottom` are left alone: `Popover` and
 * `Tooltip` use them under `[data-side="left"]`, where the side is a physical
 * fact about where the surface was placed, not a property of the text. Only
 * margin and padding are checked, and every use of those was directional.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const COMPONENTS_DIR = join(import.meta.dirname, "..", "components");

const ANIMATES = /\b(animation|transition):/;
const REDUCED_MOTION = /@media\s*\(prefers-reduced-motion:\s*reduce\)/;
const PHYSICAL_SPACING = /^\s*(margin|padding)-(left|right):/gm;

function moduleCssFiles(): string[] {
  const files: string[] = [];
  for (const dir of readdirSync(COMPONENTS_DIR, { withFileTypes: true })) {
    if (!dir.isDirectory()) {
      continue;
    }
    for (const entry of readdirSync(join(COMPONENTS_DIR, dir.name))) {
      if (entry.endsWith(".module.css")) {
        files.push(`${dir.name}/${entry}`);
      }
    }
  }
  return files.sort();
}

function read(relativePath: string): string {
  return readFileSync(join(COMPONENTS_DIR, relativePath), "utf-8");
}

/**
 * Rules whose selector names a physical side. The side is where the surface
 * was placed, so a physical offset is the correct thing to write.
 */
function withoutSideRules(css: string): string {
  return css.replace(/\[data-side="[a-z]+"\][^{]*\{[^}]*\}/g, "");
}

const FILES = moduleCssFiles();

describe("A module that animates honours prefers-reduced-motion", () => {
  it("finds modules to check", () => {
    expect(FILES.length).toBeGreaterThan(10);
  });

  const animating = FILES.filter((file) => ANIMATES.test(read(file)));

  it("finds modules that animate", () => {
    expect(animating.length).toBeGreaterThan(10);
  });

  it.each(animating)("%s", (file) => {
    expect(
      REDUCED_MOTION.test(read(file)),
      `${file} animates but never says what to do when the user has asked for less motion. Add a "@media (prefers-reduced-motion: reduce)" block setting those declarations to none.`
    ).toBe(true);
  });
});

describe("Spacing is logical, so the layout mirrors in an RTL document", () => {
  it.each(FILES)("%s", (file) => {
    const offenders = [
      ...withoutSideRules(read(file)).matchAll(PHYSICAL_SPACING),
    ].map(([match]) => match.trim());

    expect(
      offenders,
      `${file} spaces content with a physical side, which lands on the wrong side when the document direction flips. Use margin-inline-start/-end or padding-inline-start/-end.`
    ).toEqual([]);
  });
});
