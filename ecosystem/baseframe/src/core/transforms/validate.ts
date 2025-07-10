import type {
  Token,
  Collection,
  TokenDecl,
  Collections,
  Value,
  ValidationError,
  ValidationResult,
  ParseResult,
} from '../types';
import { parseValue, buildAst } from '../parsers';

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

function getAllTokenRefs(value: Value): { collection: string; token: string }[] {
  const refs: { collection: string; token: string }[] = [];

  if (value.kind === 'TokenRef') {
    refs.push({ collection: value.collection, token: value.token });
  } else if (value.kind === 'ShadowLayer') {
    refs.push(...getAllTokenRefs(value.color));
    refs.push(...getAllTokenRefs(value.offsetX));
    refs.push(...getAllTokenRefs(value.offsetY));
    refs.push(...getAllTokenRefs(value.blur));
    refs.push(...getAllTokenRefs(value.spread));
  } else if (value.kind === 'Shadow') {
    value.layers.forEach((layer: Value) => {
      refs.push(...getAllTokenRefs(layer));
    });
  }

  return refs;
}

function validateCollection(token: Token, definitions: Map<string, Collection>): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];

  const collectionName = token.data.collection;
  const collectionDef = definitions.get(collectionName);

  if (!collectionDef) {
    errors.push({
      type: 'INVALID_COLLECTION',
      message: `Collection '${collectionName}' is not defined`,
      collection: collectionName,
    });
    return { isValid: false, errors, warnings };
  }

  Object.entries(token.data.tokens).forEach(([tokenName, tokenData]) => {
    const tokenModes = Object.keys(tokenData.values);
    const missingModes = collectionDef.modes.filter((mode) => !tokenModes.includes(mode));

    if (missingModes.length > 0) {
      errors.push({
        type: 'MISSING_MODE',
        message: `Token '${tokenName}' is missing modes: ${missingModes.join(', ')}`,
        tokenName,
        collection: collectionName,
      });
    }

    Object.entries(tokenData.values).forEach(([mode, value]) => {
      const result = parseValue(value);
      if (!result.isValid) {
        errors.push({
          type: 'INVALID_VALUE_FORMAT',
          message:
            result.error || `Invalid value format for token '${tokenName}' in mode '${mode}'`,
          tokenName,
          collection: collectionName,
          mode,
          value,
        });
      }
    });
  });

  return { isValid: errors.length === 0, errors, warnings };
}

function validateTokenValues(tokens: TokenDecl[], allTokens: TokenDecl[]): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];
  const valueResults = validateAllValues(tokens);

  valueResults.forEach(({ tokenName, collection, mode, value, result }) => {
    if (!result.isValid) {
      errors.push({
        type: 'INVALID_VALUE_FORMAT',
        message: result.error || `Invalid value format`,
        tokenName,
        collection,
        mode,
        value,
      });
      return;
    }

    if (result.value) {
      const tokenRefs = getAllTokenRefs(result.value);

      tokenRefs.forEach(({ collection: refCollection, token: refToken }) => {
        const refName = `$${refCollection}.${refToken}`;
        const foundRef = allTokens.find((t) => t.token.name === refName);

        if (!foundRef) {
          errors.push({
            type: 'INVALID_PRIMITIVE_TOKEN',
            message: `Referenced token '${refName}' not found`,
            tokenName,
            collection,
            mode,
            value,
          });
        }
      });
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

  return { isValid: errors.length === 0, errors, warnings };
}
