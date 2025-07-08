export interface TokenData {
  values: {
    default: string | number;
    [mode: string]: string | number;
  };
}

export interface TokenType {
  kind: 'Tokens';
  metadata: {
    id: string;
    name: string;
    description: string;
  };
  data: {
    collection: string;
    tokens: Record<string, TokenData>;
  };
}

export interface TokenCollectionDefinition {
  name: string;
  modes: string[];
}

export interface CollectionDefinitions {
  kind: 'TokenCollections';
  metadata: {
    id: string;
    name: string;
  };
  data: TokenCollectionDefinition[];
}

export interface TokenDeclaration {
  token: {
    name: string;
    collection: string;
  };
  values: {
    mode: string;
    value: string | number;
  }[];
}

export interface TokenCollectionDeclaration {
  name: string;
  modes: string[];
}

export interface ParsedAst {
  tokens: TokenDeclaration[];
  tokenCollections: TokenCollectionDeclaration[];
}

export interface ValidationError {
  type: 'INVALID_COLLECTION' | 'MISSING_MODE' | 'INVALID_TOKEN_FORMAT';
  message: string;
  tokenName?: string;
  collection?: string;
  mode?: string;
}

export interface TokenValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: string[];
}
