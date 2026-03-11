import { describe, expect, it } from "vitest";
import { createVarName } from "../core/builders/utils/naming";

describe("createVarName", () => {
  it("creates var name with ds prefix", () => {
    expect(createVarName("$color.white", "cocso")).toBe("--cocso-color-white");
  });

  it("creates var name without prefix (tailwind namespace)", () => {
    expect(createVarName("$color.white")).toBe("--color-white");
  });

  it("converts dots to hyphens", () => {
    expect(createVarName("$color.text.primary", "cocso")).toBe(
      "--cocso-color-text-primary"
    );
  });

  it("handles hyphenated token names", () => {
    expect(createVarName("$color.neutral-950", "cocso")).toBe(
      "--cocso-color-neutral-950"
    );
  });

  it("handles font-weight tokens", () => {
    expect(createVarName("$font-weight.thin", "cocso")).toBe(
      "--cocso-font-weight-thin"
    );
    expect(createVarName("$font-weight.thin")).toBe("--font-weight-thin");
  });

  it("handles z-index tokens", () => {
    expect(createVarName("$z-index.modal-content", "cocso")).toBe(
      "--cocso-z-index-modal-content"
    );
  });
});
