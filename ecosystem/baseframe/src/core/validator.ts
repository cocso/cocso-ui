import type {
  Token,
  Collection,
  ValidationError,
  ValidationResult,
  TokenDecl,
  Collections,
  Value,
  ParseResult,
} from './types';
import { parseValue, buildAst } from './parser';

function validateValue(value: string | number): ParseResult {
  return parseValue(value);
}

function validateAllValues(tokens: TokenDecl[]): Array<{
  tokenName: string;
  collection: string;
  mode: string;
  value: string | number;
  result: ParseResult;
}> {
  const results: Array<{
    tokenName: string;
    collection: string;
    mode: string;
    value: string | number;
    result: ParseResult;
  }> = [];

  tokens.forEach((token) => {
    token.values.forEach((value) => {
      const result = validateValue(value.value);
      results.push({
        tokenName: token.token.name,
        collection: token.token.collection,
        mode: value.mode,
        value: value.value,
        result,
      });
    });
  });

  return results;
}

export function isTokenRef(value: Value): boolean {
  return value.kind === 'TokenRef';
}

export function getTokenRef(value: Value): { collection: string; token: string } | null {
  if (value.kind === 'TokenRef') {
    return {
      collection: value.collection,
      token: value.token,
    };
  }
  return null;
}

function validateCollection(
  collection: Token,
  definitions: Map<string, Collection>,
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];

  const name = collection.data.collection;
  const def = definitions.get(name);

  if (!def) {
    errors.push({
      type: 'INVALID_COLLECTION',
      message: `Collection '${name}' is not defined in collections.yaml`,
      collection: name,
    });
    return { isValid: false, errors, warnings };
  }

  const modes = new Set(def.modes);

  Object.entries(collection.data.tokens).forEach(([tokenName, tokenData]) => {
    const tokenModes = Object.keys(tokenData.values);

    const missing = Array.from(modes).filter((mode) => !tokenModes.includes(mode));
    if (missing.length > 0) {
      errors.push({
        type: 'MISSING_MODE',
        message: `Collection '${name}' token '${tokenName}' must have values for all modes: ${missing.join(', ')}`,
        tokenName,
        collection: name,
        mode: missing.join(', '),
      });
    }

    const extra = tokenModes.filter((mode) => mode !== 'default' && !modes.has(mode));
    if (extra.length > 0) {
      warnings.push(`Token '${tokenName}' has values for undefined modes: ${extra.join(', ')}`);
    }
  });

  return { isValid: errors.length === 0, errors, warnings };
}

function validateTokenValues(tokens: TokenDecl[], allTokens: TokenDecl[]): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];

  const results = validateAllValues(tokens);

  results.forEach(({ tokenName, collection, mode, value, result }) => {
    if (!result.isValid) {
      errors.push({
        type: 'INVALID_VALUE_FORMAT',
        message: result.error || `Invalid value format for token '${tokenName}'`,
        tokenName,
        collection,
        mode,
        value,
      });
    }

    if (result.value && isTokenRef(result.value)) {
      const ref = getTokenRef(result.value);
      if (ref) {
        const fullName = `$${ref.collection}.${ref.token}`;
        const found = allTokens.find(
          (t) => t.token.name === fullName,
        );

        if (!found) {
          errors.push({
            type: 'INVALID_PRIMITIVE_TOKEN',
            message: `Token reference '${value}' in token '${tokenName}' references a non-existent token`,
            tokenName,
            collection,
            mode,
            value,
          });
        }
      }
    }
  });

  return { isValid: errors.length === 0, errors, warnings };
}

export function validateAllTokens(
  tokens: Token[],
  definitions: Map<string, Collection>,
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];

  tokens.forEach((collection) => {
    const result = validateCollection(collection, definitions);
    errors.push(...result.errors);
    warnings.push(...result.warnings);
  });

  const collections: Collections = {
    kind: 'TokenCollections',
    metadata: { id: 'temp', name: 'temp' },
    data: Array.from(definitions.values()),
  };

  const ast = buildAst(tokens, collections);

  const tokenResult = validateTokenValues(ast.tokens, ast.tokens);
  errors.push(...tokenResult.errors);
  warnings.push(...tokenResult.warnings);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
