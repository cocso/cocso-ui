export interface FigmaColorValue {
  a: number;
  b: number;
  g: number;
  r: number;
}

export interface FigmaTokenDef {
  collection: string;
  name: string;
  resolvedType: "COLOR" | "FLOAT";
  sourceTokenName: string;
  values: Record<string, FigmaColorValue | number>;
}

export interface FigmaCollectionDef {
  modes: string[];
  name: string;
}

export interface FigmaSkippedToken {
  reason: string;
  sourceTokenName: string;
}

export interface FigmaTokenData {
  collections: FigmaCollectionDef[];
  generatedAt: string;
  schemaVersion: 1;
  skipped: FigmaSkippedToken[];
  tokens: FigmaTokenDef[];
}
