import { describe, expect, it } from "vitest";
import { groupByCollection, toUpsertParams } from "../core/token-converter";
import type { FigmaTokenDef } from "../types/token-schema";

const sampleTokens: FigmaTokenDef[] = [
  {
    name: "color/white",
    sourceTokenName: "$color.white",
    collection: "cocso-ui",
    resolvedType: "COLOR",
    values: { default: { r: 1, g: 1, b: 1, a: 1 } },
  },
  {
    name: "spacing/8",
    sourceTokenName: "$spacing.8",
    collection: "cocso-ui",
    resolvedType: "FLOAT",
    values: { default: 16 },
  },
  {
    name: "other/token",
    sourceTokenName: "$other.token",
    collection: "other-collection",
    resolvedType: "FLOAT",
    values: { default: 42 },
  },
];

describe("groupByCollection", () => {
  it("groups tokens by collection name", () => {
    const groups = groupByCollection(sampleTokens);
    expect(groups.size).toBe(2);
    expect(groups.get("cocso-ui")).toHaveLength(2);
    expect(groups.get("other-collection")).toHaveLength(1);
  });

  it("returns empty map for empty input", () => {
    const groups = groupByCollection([]);
    expect(groups.size).toBe(0);
  });
});

describe("toUpsertParams", () => {
  it("converts tokens to upsert parameters with mode mapping", () => {
    const tokens = sampleTokens.filter((t) => t.collection === "cocso-ui");
    const params = toUpsertParams(tokens, "collection-123", {
      default: "mode-456",
    });

    expect(params).toHaveLength(2);

    expect(params[0].name).toBe("color/white");
    expect(params[0].resolvedType).toBe("COLOR");
    expect(params[0].collectionId).toBe("collection-123");
    expect(params[0].values["mode-456"]).toEqual({ r: 1, g: 1, b: 1, a: 1 });

    expect(params[1].name).toBe("spacing/8");
    expect(params[1].resolvedType).toBe("FLOAT");
    expect(params[1].values["mode-456"]).toBe(16);
  });

  it("skips modes not in modeIdMap", () => {
    const tokens: FigmaTokenDef[] = [
      {
        name: "test/token",
        sourceTokenName: "$test.token",
        collection: "c",
        resolvedType: "FLOAT",
        values: { default: 10, dark: 20 },
      },
    ];
    const params = toUpsertParams(tokens, "c-id", { default: "m-default" });

    expect(params[0].values["m-default"]).toBe(10);
    expect(Object.keys(params[0].values)).toHaveLength(1);
  });
});
