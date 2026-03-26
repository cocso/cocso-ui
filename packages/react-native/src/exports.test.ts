import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(currentDir, "..");

const readLines = (filePath: string): string[] =>
  fs
    .readFileSync(filePath, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

describe("react-native public exports", () => {
  it("keeps root component export contracts", () => {
    const indexLines = readLines(path.join(packageRoot, "src/index.ts"));

    expect(indexLines).toContain('export * from "./components/badge";');
    expect(indexLines).toContain('export * from "./components/input";');
    expect(indexLines).toContain('export * from "./components/button";');
    expect(indexLines).toContain('export * from "./components/modal";');
  });

  it("keeps theme export contracts", () => {
    const themeLines = readLines(path.join(packageRoot, "src/theme/index.ts"));

    expect(themeLines).toContain('export * from "./enums";');
    expect(themeLines).toContain('export * from "./tokens";');
  });
});
