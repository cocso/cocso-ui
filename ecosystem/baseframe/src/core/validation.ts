import type { Schema, ValidationResult } from './schema';

const VALID_SCHEMA_KINDS = ['Tokens', 'PrimitiveTokens', 'SemanticTokens', 'ComponentTokens'] as const;

export const isSchema = (candidateObject: unknown): candidateObject is Schema => {
  if (typeof candidateObject !== 'object' || candidateObject === null) {
    return false;
  }

  const schemaCandidate = candidateObject as Record<string, unknown>;

  if (!schemaCandidate.kind || typeof schemaCandidate.kind !== 'string') {
    return false;
  }

  return VALID_SCHEMA_KINDS.includes(schemaCandidate.kind as any);
};

const TOKEN_NAME_PATTERN = /^[\w\-$.]+$/;

export const validateSchema = (targetSchema: Schema): ValidationResult => {
  const validationErrors: string[] = [];
  const validationWarnings: string[] = [];

  if (!targetSchema.metadata?.id?.trim()) {
    validationErrors.push('metadata.id is required');
  }

  if (!targetSchema.metadata?.name?.trim()) {
    validationWarnings.push('metadata.name is recommended');
  }

  if (!targetSchema.data?.collection?.trim()) {
    validationErrors.push('data.collection is required');
  }

  const tokenEntries = targetSchema.data?.tokens ? Object.entries(targetSchema.data.tokens) : [];
  
  if (!targetSchema.data?.tokens || tokenEntries.length === 0) {
    validationErrors.push('At least one token is required');
  } else {
    for (const [tokenName, tokenDefinition] of tokenEntries) {
      if (!tokenDefinition.values) {
        validationErrors.push(`Token '${tokenName}' requires values property`);
      }

      if (!tokenDefinition.description?.trim()) {
        validationWarnings.push(`Token '${tokenName}' description is recommended`);
      }

      if (!TOKEN_NAME_PATTERN.test(tokenName)) {
        validationWarnings.push(
          `Token '${tokenName}' name should follow naming convention (alphanumeric, -, ., $ only)`
        );
      }
    }
  }

  if ('extends' in targetSchema.data && targetSchema.data.extends) {
    if (!Array.isArray(targetSchema.data.extends)) {
      validationErrors.push('data.extends must be an array');
    } else if (targetSchema.data.extends.length === 0) {
      validationWarnings.push('extends array is empty');
    }
  }

  return { 
    valid: validationErrors.length === 0, 
    errors: validationErrors, 
    warnings: validationWarnings 
  };
};

const CSS_VARIABLE_PREFIX = '--cocso-';

export const formatTokenName = (tokenName: string): string => {
  const normalizedName = tokenName.replace(/^\$/, '').replace(/\./g, '-');
  return `${CSS_VARIABLE_PREFIX}${normalizedName}`;
};
