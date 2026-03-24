export interface VariableUpsertParams {
  collectionId: string;
  name: string;
  resolvedType: "COLOR" | "FLOAT";
  values: Record<string, RGBA | number>;
}

export interface RGBA {
  a: number;
  b: number;
  g: number;
  r: number;
}

export interface SyncResult {
  created: number;
  errors: string[];
  skipped: number;
  skippedTokens: Array<{ name: string; reason: string }>;
  updated: number;
}
