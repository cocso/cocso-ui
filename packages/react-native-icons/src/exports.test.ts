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

describe("react-native-icons public exports", () => {
  it("keeps root export groups for brand and semantic icons", () => {
    const lines = readLines(path.join(packageRoot, "src/index.ts"));

    expect(lines).toContain('export * from "./components/brand";');
    expect(lines).toContain('export * from "./components/semantic";');
  });
});
