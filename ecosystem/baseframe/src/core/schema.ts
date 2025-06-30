/**
 * 메타데이터
 */
export interface BaseMetadata {
  id: string;
  name: string;
  description?: string;
  version?: string;
}

/**
 * 토큰 값 타입
 */
export type TokenValue = string | number | Record<string, unknown> | unknown[];

/**
 * 토큰 정의
 */
export interface TokenDefinition {
  values: TokenValue;
  description?: string;
}

/**
 * 토큰 컬렉션
 */
export interface TokenCollection {
  [tokenName: string]: TokenDefinition;
}

/**
 * 기본 토큰 스키마 (packages/baseframe 토큰용)
 */
export interface TokenSchema {
  kind: 'Tokens';
  metadata: BaseMetadata;
  data: {
    collection: string;
    tokens: TokenCollection;
  };
}

/**
 * 원시 토큰 스키마
 */
export interface PrimitiveTokensSchema {
  kind: 'PrimitiveTokens';
  metadata: BaseMetadata;
  data: {
    collection: string;
    tokens: TokenCollection;
  };
}

/**
 * 의미론적 토큰 스키마
 */
export interface SemanticTokensSchema {
  kind: 'SemanticTokens';
  metadata: BaseMetadata;
  data: {
    collection: string;
    tokens: TokenCollection;
    extends?: string[];
  };
}

/**
 * 컴포넌트 토큰 스키마
 */
export interface ComponentTokensSchema {
  kind: 'ComponentTokens';
  metadata: BaseMetadata;
  data: {
    collection: string;
    tokens: TokenCollection;
    extends?: string[];
  };
}

/**
 * 지원되는 모든 스키마 타입
 */
export type Schema = 
  | TokenSchema
  | PrimitiveTokensSchema 
  | SemanticTokensSchema 
  | ComponentTokensSchema;

/**
 * 빌드 옵션
 */
export interface BuildOptions {
  inputPattern?: string;
  outputDir?: string;
  formats?: OutputFormat[];
}

/**
 * 출력 형식
 */
export type OutputFormat = 'css' | 'json';

/**
 * 검증 결과
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
} 