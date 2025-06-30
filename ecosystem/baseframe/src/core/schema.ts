export interface BaseMetadata {
  id: string;
  name: string;
  description?: string;
  version?: string;
  filePath?: string;
}

export type TokenValue = string | number | Record<string, unknown> | unknown[];

export interface TokenDefinition {
  values: TokenValue;
  description?: string;
}

export interface TokenCollection {
  [tokenName: string]: TokenDefinition;
}

export interface TokenSchema {
  kind: 'Tokens';
  metadata: BaseMetadata;
  data: {
    collection: string;
    tokens: TokenCollection;
  };
}

export interface PrimitiveTokensSchema {
  kind: 'PrimitiveTokens';
  metadata: BaseMetadata;
  data: {
    collection: string;
    tokens: TokenCollection;
  };
}

export interface SemanticTokensSchema {
  kind: 'SemanticTokens';
  metadata: BaseMetadata;
  data: {
    collection: string;
    tokens: TokenCollection;
    extends?: string[];
  };
}

export interface ComponentTokensSchema {
  kind: 'ComponentTokens';
  metadata: BaseMetadata;
  data: {
    collection: string;
    tokens: TokenCollection;
    extends?: string[];
  };
}

export type Schema = 
  | TokenSchema
  | PrimitiveTokensSchema 
  | SemanticTokensSchema 
  | ComponentTokensSchema;

export interface BuildOptions {
  inputPattern?: string;
  outputDir?: string;
  formats?: OutputFormat[];
  individual?: boolean;
}

export type OutputFormat = 'css' | 'json';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
} 