import { describe, expect, it } from "vitest";
import { createVarName } from "../core/builders/utils/naming";

describe("createVarName", () => {
  it("creates var name with ds prefix", () => {
    expect(createVarName("$color.white", "ds")).toBe("--ds-color-white");
  });

  it("creates var name without prefix (tailwind namespace)", () => {
    expect(createVarName("$color.white")).toBe("--color-white");
  });

  it("converts dots to hyphens", () => {
    expect(createVarName("$color.text.primary", "ds")).toBe(
      "--ds-color-text-primary"
    );
  });

  it("handles hyphenated token names", () => {
    expect(createVarName("$color.neutral-950", "ds")).toBe(
      "--ds-color-neutral-950"
    );
  });

  it("handles font-weight tokens", () => {
    expect(createVarName("$font-weight.thin", "ds")).toBe(
      "--ds-font-weight-thin"
    );
    expect(createVarName("$font-weight.thin")).toBe("--font-weight-thin");
  });

  it("handles z-index tokens", () => {
    expect(createVarName("$z-index.modal-content", "ds")).toBe(
      "--ds-z-index-modal-content"
    );
  });
});
