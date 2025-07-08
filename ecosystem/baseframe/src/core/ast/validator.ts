import type {
  TokenType,
  TokenCollectionDefinition,
  ValidationError,
  TokenValidationResult,
} from './types';

export function validateCollection(
  collection: TokenType,
  collectionDefinitions: Map<string, TokenCollectionDefinition>,
): TokenValidationResult {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];

  const collectionName = collection.data.collection;
  const collectionDef = collectionDefinitions.get(collectionName);

  if (!collectionDef) {
    errors.push({
      type: 'INVALID_COLLECTION',
      message: `Collection '${collectionName}' is not defined in collections.yaml`,
      collection: collectionName,
    });
    return { isValid: false, errors, warnings };
  }

  const definedModes = new Set(collectionDef.modes);

  Object.entries(collection.data.tokens).forEach(([tokenName, tokenData]) => {
    const tokenModes = Object.keys(tokenData.values);

    const missingModes = Array.from(definedModes).filter((mode) => !tokenModes.includes(mode));
    if (missingModes.length > 0) {
      errors.push({
        type: 'MISSING_MODE',
        message: `Collection '${collectionName}' token '${tokenName}' must have values for all modes: ${missingModes.join(', ')}`,
        tokenName,
        collection: collectionName,
        mode: missingModes.join(', '),
      });
    }

    const extraModes = tokenModes.filter((mode) => mode !== 'default' && !definedModes.has(mode));
    if (extraModes.length > 0) {
      warnings.push(
        `Token '${tokenName}' has values for undefined modes: ${extraModes.join(', ')}`,
      );
    }
  });

  return { isValid: errors.length === 0, errors, warnings };
}

export function validateAllTokens(
  tokenCollections: TokenType[],
  collectionDefinitions: Map<string, TokenCollectionDefinition>,
): TokenValidationResult {
  const allErrors: ValidationError[] = [];
  const allWarnings: string[] = [];

  tokenCollections.forEach((collection) => {
    const result = validateCollection(collection, collectionDefinitions);
    allErrors.push(...result.errors);
    allWarnings.push(...result.warnings);
  });

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
}
