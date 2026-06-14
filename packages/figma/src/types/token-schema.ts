/** Figma color value with RGBA channels normalized to 0–1 range. */
export interface FigmaColorValue {
  a: number;
  b: number;
  g: number;
  r: number;
}

/** A single design token mapped to a Figma Variable. */
export interface FigmaTokenDef {
  collection: string;
  name: string;
  resolvedType: "COLOR" | "FLOAT";
  sourceTokenName: string;
  values: Record<string, FigmaColorValue | number>;
}

/** Figma Variable Collection definition. */
export interface FigmaCollectionDef {
  modes: string[];
  name: string;
}

/** A token skipped during pre-build (e.g. composite shadow). */
export interface FigmaSkippedToken {
  reason: string;
  sourceTokenName: string;
}

/**
 * Root schema for the pre-build JSON output.
 * This is the Figma Plugin runtime's sole input data source.
 */
export interface FigmaTokenData {
  collections: FigmaCollectionDef[];
  generatedAt: string;
  schemaVersion: 1;
  skipped: FigmaSkippedToken[];
  tokens: FigmaTokenDef[];
}
