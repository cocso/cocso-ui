import { describe, expect, it } from "vitest";
import {
  generateCssVariables,
  generateFromAst,
} from "../core/builders/css-vars";
import { buildValidatedAst } from "../core/transforms";
import type { Collections, Token } from "../core/types";

const MINIMAL_COLLECTIONS: Collections = {
  kind: "TokenCollections",
  metadata: { id: "test", name: "test" },
  data: [{ name: "global", modes: ["default"] }],
};

function makeToken(
  name: string,
  value: string | number,
  collection = "global"
): Token {
  return {
    kind: "Tokens",
    metadata: { id: "test", name: "test", description: "" },
    data: {
      collection,
      tokens: { [name]: { values: { default: value } } },
    },
  };
}

describe("css-vars generateFromAst", () => {
  it("generates :root block with prefixed vars", () => {
    const tokens = [makeToken("$color.white", "#FFFFFF")];
    const ast = buildValidatedAst(tokens, MINIMAL_COLLECTIONS);
    const result = generateFromAst(ast, {
      prefix: "cocso",
      selectors: { global: { default: ":root" } },
    });
    expect(result).toContain(":root {");
    expect(result).toContain("--cocso-color-white: #ffffff;");
  });

  it("resolves token reference to var()", () => {
    const tokens = [
      makeToken("$color.neutral-950", "#131416"),
      makeToken("$color.text.primary", "$color.neutral-950"),
    ];
    const ast = buildValidatedAst(tokens, MINIMAL_COLLECTIONS);
    const result = generateFromAst(ast, {
      prefix: "cocso",
      selectors: { global: { default: ":root" } },
    });
    expect(result).toContain(
      "--cocso-color-text-primary: var(--cocso-color-neutral-950);"
    );
  });

  it("adds trailing newline to output", () => {
    const tokens = [makeToken("$color.white", "#FFFFFF")];
    const ast = buildValidatedAst(tokens, MINIMAL_COLLECTIONS);
    const result = generateFromAst(ast, {
      prefix: "cocso",
      selectors: { global: { default: ":root" } },
    });
    expect(result.endsWith("\n")).toBe(true);
  });

  it("falls back to :root when no selector configured", () => {
    const tokens = [makeToken("$color.white", "#FFFFFF")];
    const ast = buildValidatedAst(tokens, MINIMAL_COLLECTIONS);
    const result = generateFromAst(ast, { prefix: "cocso" });
    expect(result).toContain(":root {");
  });

  it("includes banner at start of output when banner provided", () => {
    const tokens = [makeToken("$color.white", "#FFFFFF")];
    const ast = buildValidatedAst(tokens, MINIMAL_COLLECTIONS);
    const banner = "/* generated */\n";
    const result = generateFromAst(ast, {
      prefix: "cocso",
      selectors: { global: { default: ":root" } },
      banner,
    });
    expect(result.startsWith(banner)).toBe(true);
  });

  it("generateCssVariables wraps generateFromAst correctly", () => {
    const tokens = [makeToken("$color.white", "#FFFFFF")];
    const result = generateCssVariables(tokens, MINIMAL_COLLECTIONS, {
      prefix: "cocso",
      selectors: { global: { default: ":root" } },
    });
    expect(result).toContain(":root {");
    expect(result).toContain("--cocso-color-white: #ffffff;");
    expect(result.endsWith("\n")).toBe(true);
  });

  it("throws when a required mode value is missing", () => {
    const ast = {
      collections: [{ name: "global", modes: ["default", "dark"] }],
      tokens: [
        {
          token: { name: "$color.white", collection: "global" },
          values: [{ mode: "default", value: "#FFFFFF" }],
        },
      ],
    };

    expect(() => generateFromAst(ast, { prefix: "cocso" })).toThrow(
      "No value found for token '$color.white' in mode 'dark'"
    );
  });
});
