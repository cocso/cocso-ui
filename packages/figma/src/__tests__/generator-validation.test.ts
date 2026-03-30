/**
 * Static validation tests for generator source code.
 * These catch Figma Plugin API misuse before runtime.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const GENERATORS_DIR = join(import.meta.dirname, "../generators");

const VALID_SIZING_MODES = ["FIXED", "AUTO"];
const VALID_LAYOUT_MODES = ["HORIZONTAL", "VERTICAL", "NONE"];
const VALID_ALIGN_ITEMS = ["MIN", "CENTER", "MAX", "SPACE_BETWEEN", "BASELINE"];

function getGeneratorFiles(): string[] {
  return readdirSync(GENERATORS_DIR)
    .filter(
      (f) =>
        f.endsWith(".ts") &&
        f !== "index.ts" &&
        f !== "shared.ts" &&
        f !== "component-registry.ts"
    )
    .map((f) => join(GENERATORS_DIR, f));
}

describe("generator static validation", () => {
  const files = getGeneratorFiles();

  it("finds generator files", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const file of files) {
    const fileName = file.split("/").pop() ?? file;
    const content = readFileSync(file, "utf-8");

    describe(fileName, () => {
      it("does not use invalid sizing mode FILL", () => {
        const fillMatches = content.match(/SizingMode\s*=\s*["']FILL["']/g);
        expect(fillMatches).toBeNull();
      });

      it("does not set layoutPositioning without parent layoutMode", () => {
        // Check that layoutPositioning = "ABSOLUTE" is always preceded by
        // a layoutMode assignment on the parent (heuristic check)
        const lines = content.split("\n");
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes('layoutPositioning = "ABSOLUTE"')) {
            // Look backwards for the parent's layoutMode assignment
            const preceding = lines.slice(Math.max(0, i - 15), i).join("\n");
            expect(
              preceding.includes("layoutMode"),
              `${fileName}:${i + 1} — layoutPositioning = "ABSOLUTE" without parent layoutMode`
            ).toBe(true);
          }
        }
      });

      it("uses only valid sizing mode values", () => {
        const sizingAssignments = [
          ...content.matchAll(/primaryAxisSizingMode\s*=\s*["'](\w+)["']/g),
          ...content.matchAll(/counterAxisSizingMode\s*=\s*["'](\w+)["']/g),
        ];
        for (const match of sizingAssignments) {
          expect(
            VALID_SIZING_MODES,
            `Invalid sizing mode "${match[1]}" in ${fileName}`
          ).toContain(match[1]);
        }
      });

      it("uses only valid layout mode values", () => {
        const layoutAssignments = [
          ...content.matchAll(/layoutMode\s*=\s*["'](\w+)["']/g),
        ];
        for (const match of layoutAssignments) {
          expect(
            VALID_LAYOUT_MODES,
            `Invalid layout mode "${match[1]}" in ${fileName}`
          ).toContain(match[1]);
        }
      });

      it("uses only valid alignment values", () => {
        const alignAssignments = [
          ...content.matchAll(/primaryAxisAlignItems\s*=\s*["'](\w+)["']/g),
          ...content.matchAll(/counterAxisAlignItems\s*=\s*["'](\w+)["']/g),
        ];
        for (const match of alignAssignments) {
          expect(
            VALID_ALIGN_ITEMS,
            `Invalid align value "${match[1]}" in ${fileName}`
          ).toContain(match[1]);
        }
      });
    });
  }
});
