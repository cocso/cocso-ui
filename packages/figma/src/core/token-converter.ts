import type { VariableUpsertParams } from "../types/figma";
import type { FigmaColorValue, FigmaTokenDef } from "../types/token-schema";

export function groupByCollection(
  tokens: FigmaTokenDef[]
): Map<string, FigmaTokenDef[]> {
  const groups = new Map<string, FigmaTokenDef[]>();
  for (const token of tokens) {
    const existing = groups.get(token.collection);
    if (existing) {
      existing.push(token);
    } else {
      groups.set(token.collection, [token]);
    }
  }
  return groups;
}

export function toUpsertParams(
  tokens: FigmaTokenDef[],
  collectionId: string,
  modeIdMap: Record<string, string>
): VariableUpsertParams[] {
  return tokens.map((token) => {
    const values: Record<string, FigmaColorValue | number> = {};
    for (const [modeName, value] of Object.entries(token.values)) {
      const modeId = modeIdMap[modeName];
      if (modeId) {
        values[modeId] = value as FigmaColorValue | number;
      }
    }

    return {
      name: token.name,
      resolvedType: token.resolvedType,
      collectionId,
      values,
    };
  });
}
