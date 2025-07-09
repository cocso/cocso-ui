export interface TokenData {
  values: {
    default: string | number;
    [mode: string]: string | number;
  };
}

export interface Token {
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

export interface Collection {
  name: string;
  modes: string[];
}

export interface Collections {
  kind: 'TokenCollections';
  metadata: {
    id: string;
    name: string;
  };
  data: Collection[];
}

export interface TokenDecl {
  token: {
    name: string;
    collection: string;
  };
  values: {
    mode: string;
    value: string | number;
  }[];
}

export interface CollectionDecl {
  name: string;
  modes: string[];
}

export interface Ast {
  tokens: TokenDecl[];
  collections: CollectionDecl[];
}

export interface HexColor {
  kind: 'HexColor';
  value: `#${string}`;
}

export interface RgbColor {
  kind: 'RgbColor';
  r: number;
  g: number;
  b: number;
}

export interface RgbaColor {
  kind: 'RgbaColor';
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface TokenRef {
  kind: 'TokenRef';
  collection: string;
  token: string;
}

export interface SizeValue {
  kind: 'SizeValue';
  value: number;
  unit: 'px' | 'rem' | 'em' | 'vw' | 'vh' | '%';
}

export interface DurationValue {
  kind: 'DurationValue';
  value: number;
  unit: 'ms' | 's';
}

export interface NumberValue {
  kind: 'NumberValue';
  value: number;
}

export interface StringValue {
  kind: 'StringValue';
  value: string;
}

export type Value =
  | HexColor
  | RgbColor
  | RgbaColor
  | TokenRef
  | SizeValue
  | DurationValue
  | NumberValue
  | StringValue;

export interface ParseResult {
  isValid: boolean;
  value?: Value;
  error?: string;
}

export interface ValidationError {
  type:
    | 'INVALID_COLLECTION'
    | 'MISSING_MODE'
    | 'INVALID_TOKEN_FORMAT'
    | 'INVALID_VALUE_FORMAT'
    | 'INVALID_PRIMITIVE_TOKEN';
  message: string;
  tokenName?: string;
  collection?: string;
  mode?: string;
  value?: string | number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: string[];
}
