/**
 * CSS Module token guard
 *
 * AGENTS.md forbids hardcoding a rethemable design token value inside a CSS
 * Module: `theme-dark.css` redefines the semantic layer and deliberately leaves
 * the raw scale alone, so a primitive written into a module keeps its value
 * when the theme flips. That is how a Dialog kept a white panel behind
 * near-white text, and how a Switch knob vanished at 1.09:1 against the dark
 * theme's checked track.
 *
 * Consumers cannot see these — the class names are content-hashed — so the
 * rule only holds if something checks it.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const COMPONENTS_DIR = join(import.meta.dirname, "..", "components");

/**
 * Primitive colors: the raw scale, plus bare `white` and `black`. Alpha
 * variants are excluded — a translucent scrim like `black-alpha-30` is a fixed
 * effect, not a themed surface.
 */
const PRIMITIVE_COLOR =
  /var\(--cocso-color-((?:neutral|primary|danger|warning|success|info)-\d+|white|black)\)/g;

/**
 * Violations that exist on `main` and are already fixed on another branch.
 * Delete the entry when the fix lands; the guard is here to stop new ones, not
 * to freeze the ones being cleaned up.
 */
const PENDING: Record<string, string> = {
  // Focus outlines move to `--cocso-color-focus-ring`.
  "button/button.module.css": "focus outline",
  "checkbox/checkbox.module.css": "focus outline",
  "link/link.module.css": "focus outline",
  "pagination/pagination.module.css": "focus outline",
  "switch/switch.module.css": "focus outline",
  // Selection colors move to `--cocso-radio-*`, focus outline to focus-ring.
  "radio-group/radio-group.module.css": "selection colors and focus outline",
  // Current crumb and separator move to semantic text tokens.
  "breadcrumb/breadcrumb.module.css": "current crumb and separator",
};

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

function primitivesIn(relativePath: string): string[] {
  const css = readFileSync(join(COMPONENTS_DIR, relativePath), "utf-8");
  return [...css.matchAll(PRIMITIVE_COLOR)].map((match) => match[1]);
}

describe("CSS Modules do not hardcode primitive colors", () => {
  const files = moduleCssFiles();

  it("finds the modules to check", () => {
    expect(files.length).toBeGreaterThan(10);
  });

  it.each(files.filter((file) => !PENDING[file]))("%s", (file) => {
    expect(primitivesIn(file)).toEqual([]);
  });

  it("has no stale entries in the pending list", () => {
    const stale = Object.keys(PENDING).filter(
      (file) => primitivesIn(file).length === 0
    );
    expect(stale).toEqual([]);
  });
});
