import type { Schema, ValidationResult } from './schema';

export const isSchema = (obj: unknown): obj is Schema => {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const candidate = obj as Record<string, unknown>;

  if (!candidate.kind || typeof candidate.kind !== 'string') {
    return false;
  }

  return ['Tokens', 'PrimitiveTokens', 'SemanticTokens', 'ComponentTokens'].includes(
    candidate.kind,
  );
};

export const validateSchema = (schema: Schema): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 메타데이터 검증
  if (!schema.metadata?.id?.trim()) {
    errors.push('metadata.id가 필요해요.');
  }

  if (!schema.metadata?.name?.trim()) {
    warnings.push('metadata.name이 권장됩니다.');
  }

  // 데이터 검증
  if (!schema.data?.collection?.trim()) {
    errors.push('data.collection이 필요해요.');
  }

  if (!schema.data?.tokens || Object.keys(schema.data.tokens).length === 0) {
    errors.push('최소 하나의 토큰이 필요해요.');
  } else {
    // 토큰 정의 검증
    for (const [tokenName, tokenDef] of Object.entries(schema.data.tokens)) {
      if (!tokenDef.values) {
        errors.push(`토큰 '${tokenName}'에 values가 필요해요.`);
      }

      if (!tokenDef.description?.trim()) {
        warnings.push(`토큰 '${tokenName}'에 설명이 권장됩니다.`);
      }

      // 토큰 이름 규칙 검사
      if (!tokenName.match(/^[\w\-$.]+$/)) {
        warnings.push(`토큰 '${tokenName}' 이름이 권장 규칙과 다릅니다. (영문, 숫자, -, ., $ 만 사용)`);
      }
    }
  }

  // extends 검증 (SemanticTokens, ComponentTokens)
  if ('extends' in schema.data && schema.data.extends) {
    if (!Array.isArray(schema.data.extends)) {
      errors.push('data.extends는 배열이어야 해요.');
    } else if (schema.data.extends.length === 0) {
      warnings.push('extends 배열이 비어있어요.');
    }
  }

  return { valid: errors.length === 0, errors, warnings };
};

export const formatTokenName = (name: string): string => {
  const cleanName = name.replace(/^\$/, '').replace(/\./g, '-');
  return `--cocso-${cleanName}`;
};
