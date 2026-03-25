import type { FigmaColorValue } from "./token-schema";

/** Parameters for creating or updating a Figma Variable. */
export interface VariableUpsertParams {
  collectionId: string;
  name: string;
  resolvedType: "COLOR" | "FLOAT";
  values: Record<string, FigmaColorValue | number>;
}

/** Result of a sync operation. */
export interface SyncResult {
  created: number;
  errors: string[];
  skipped: number;
  skippedTokens: Array<{ name: string; reason: string }>;
  updated: number;
}
