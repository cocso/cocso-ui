import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../..");
const sourceRoot = path.join(repoRoot, "packages/react-icons/src/components");
const targetRoot = path.join(
  repoRoot,
  "packages/react-native-icons/src/components"
);

const toNames = (directoryPath: string): string[] =>
  fs
    .readdirSync(directoryPath)
    .filter((fileName) => fileName.endsWith(".tsx"))
    .map((fileName) => fileName.replace(".tsx", ""))
    .sort((a, b) => a.localeCompare(b));

const toExportNames = (indexPath: string): string[] =>
  fs
    .readFileSync(indexPath, "utf8")
    .split("\n")
    .filter((line) => line.startsWith('export * from "./'))
    .map((line) => line.replace('export * from "./', "").replace('";', ""))
    .sort((a, b) => a.localeCompare(b));

describe("react-native-icons generation contract", () => {
  it("keeps brand and semantic file parity with react-icons source", () => {
    expect(toNames(path.join(targetRoot, "brand"))).toEqual(
      toNames(path.join(sourceRoot, "brand"))
    );

    expect(toNames(path.join(targetRoot, "semantic"))).toEqual(
      toNames(path.join(sourceRoot, "semantic"))
    );
  });

  it("keeps barrel exports aligned with generated files", () => {
    expect(toExportNames(path.join(targetRoot, "brand/index.ts"))).toEqual(
      toNames(path.join(targetRoot, "brand"))
    );

    expect(toExportNames(path.join(targetRoot, "semantic/index.ts"))).toEqual(
      toNames(path.join(targetRoot, "semantic"))
    );
  });
});
