import type { SyncResult, VariableUpsertParams } from "../types/figma";
import type { FigmaColorValue, FigmaTokenData } from "../types/token-schema";
import { clampColor, isValidColor } from "./color-converter";
import { groupByCollection, toUpsertParams } from "./token-converter";

function getOrCreateCollection(name: string): {
  collection: VariableCollection;
  modeIdMap: Record<string, string>;
} {
  const existing = figma.variables
    .getLocalVariableCollections()
    .find((c: VariableCollection) => c.name === name);

  const collection = existing ?? figma.variables.createVariableCollection(name);

  const modeIdMap: Record<string, string> = {};
  for (const mode of collection.modes) {
    modeIdMap[mode.name] = mode.modeId;
  }

  if (!modeIdMap.default && collection.modes.length > 0) {
    const firstMode = collection.modes[0];
    collection.renameMode(firstMode.modeId, "default");
    modeIdMap.default = firstMode.modeId;
  }

  return { collection, modeIdMap };
}

function findExistingVariable(
  name: string,
  collectionId: string,
  resolvedType: VariableResolvedDataType
): Variable | undefined {
  return figma.variables
    .getLocalVariables(resolvedType)
    .find(
      (v: Variable) =>
        v.name === name && v.variableCollectionId === collectionId
    );
}

function setVariableValue(
  variable: Variable,
  modeId: string,
  value: FigmaColorValue | number
): void {
  if (typeof value === "object" && "r" in value) {
    const color = isValidColor(value) ? value : clampColor(value);
    variable.setValueForMode(modeId, color);
  } else {
    variable.setValueForMode(modeId, value as number);
  }
}

function applyValues(
  variable: Variable,
  values: Record<string, FigmaColorValue | number>
): void {
  for (const [modeId, value] of Object.entries(values)) {
    setVariableValue(variable, modeId, value);
  }
}

function upsertVariable(param: VariableUpsertParams, result: SyncResult): void {
  const existing = findExistingVariable(
    param.name,
    param.collectionId,
    param.resolvedType
  );

  if (existing) {
    applyValues(existing, param.values);
    result.updated++;
  } else {
    const variable = figma.variables.createVariable(
      param.name,
      param.collectionId,
      param.resolvedType
    );
    applyValues(variable, param.values);
    result.created++;
  }
}

/**
 * Sync all tokens from pre-built data to Figma Variables.
 * Uses non-destructive upsert: creates new variables, updates existing, never deletes.
 */
export function syncTokens(data: FigmaTokenData): SyncResult {
  const result: SyncResult = {
    created: 0,
    errors: [],
    skipped: data.skipped.length,
    skippedTokens: data.skipped.map((s) => ({
      name: s.sourceTokenName,
      reason: s.reason,
    })),
    updated: 0,
  };

  const groups = groupByCollection(data.tokens);

  for (const [collectionName, tokens] of groups) {
    try {
      const { collection, modeIdMap } = getOrCreateCollection(collectionName);
      const params = toUpsertParams(tokens, collection.id, modeIdMap);

      for (const param of params) {
        try {
          upsertVariable(param, result);
        } catch (err) {
          result.errors.push(
            `Failed to sync ${param.name}: ${err instanceof Error ? err.message : String(err)}`
          );
        }
      }
    } catch (err) {
      result.errors.push(
        `Failed to process collection ${collectionName}: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  return result;
}
