import { buildAst, parseValue } from "../parsers";
import type {
  Collection,
  Collections,
  ParseResult,
  Token,
  TokenDecl,
  ValidationError,
  ValidationResult,
  Value,
} from "../types";

/** Parses a single token value string and returns a `ParseResult`. */
function validateValue(value: string | number): ParseResult {
  return parseValue(value);
}

/**
 * Parses every value for every mode of each token declaration and returns
 * a flat list of results paired with their originating token metadata.
 */
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

  for (const token of tokens) {
    for (const value of token.values) {
      const result = validateValue(value.value);
      results.push({
        tokenName: token.token.name,
        collection: token.token.collection,
        mode: value.mode,
        value: value.value,
        result,
      });
    }
  }

  return results;
}

/**
 * Recursively collects all token references (`TokenRef`) embedded in a `Value`.
 *
 * Traverses `ShadowLayer` and `Shadow` composite values to extract every
 * `{ collection, token }` pair referenced within them.
 */
function getAllTokenRefs(
  value: Value
): { collection: string; token: string }[] {
  const refs: { collection: string; token: string }[] = [];

  if (value.kind === "TokenRef") {
    refs.push({ collection: value.collection, token: value.token });
  } else if (value.kind === "ShadowLayer") {
    refs.push(...getAllTokenRefs(value.color));
    refs.push(...getAllTokenRefs(value.offsetX));
    refs.push(...getAllTokenRefs(value.offsetY));
    refs.push(...getAllTokenRefs(value.blur));
    refs.push(...getAllTokenRefs(value.spread));
  } else if (value.kind === "Shadow") {
    for (const layer of value.layers) {
      refs.push(...getAllTokenRefs(layer));
    }
  }

  return refs;
}

/**
 * Validates that a token's collection exists in the definition map and that
 * every token within that collection declares values for all required modes.
 *
 * Reports `INVALID_COLLECTION` when the collection is unknown, `MISSING_MODE`
 * when a token omits a required mode, and `INVALID_VALUE_FORMAT` when a value
 * fails to parse.
 */
function validateCollection(
  token: Token,
  definitions: Map<string, Collection>
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];

  const collectionName = token.data.collection;
  const collectionDef = definitions.get(collectionName);

  if (!collectionDef) {
    errors.push({
      type: "INVALID_COLLECTION",
      message: `Collection '${collectionName}' is not defined`,
      collection: collectionName,
    });
    return { isValid: false, errors, warnings };
  }

  for (const [tokenName, tokenData] of Object.entries(token.data.tokens)) {
    const tokenModes = Object.keys(tokenData.values);
    const missingModes = collectionDef.modes.filter(
      (mode) => !tokenModes.includes(mode)
    );

    if (missingModes.length > 0) {
      errors.push({
        type: "MISSING_MODE",
        message: `Token '${tokenName}' is missing modes: ${missingModes.join(", ")}`,
        tokenName,
        collection: collectionName,
      });
    }

    for (const [mode, value] of Object.entries(tokenData.values)) {
      const result = parseValue(value);
      if (!result.isValid) {
        errors.push({
          type: "INVALID_VALUE_FORMAT",
          message:
            result.error ||
            `Invalid value format for token '${tokenName}' in mode '${mode}'`,
          tokenName,
          collection: collectionName,
          mode,
          value,
        });
      }
    }
  }

  return { isValid: errors.length === 0, errors, warnings };
}

/**
 * Validates that all token references within a set of token declarations point
 * to tokens that actually exist in the full token map.
 *
 * Reports `INVALID_VALUE_FORMAT` for unparseable values and
 * `INVALID_PRIMITIVE_TOKEN` for unresolved references.
 */
function validateTokenValues(
  tokens: TokenDecl[],
  allTokens: TokenDecl[]
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];
  const valueResults = validateAllValues(tokens);
  const tokenMap = new Map<string, TokenDecl>(
    allTokens.map((t) => [t.token.name, t])
  );

  for (const { tokenName, collection, mode, value, result } of valueResults) {
    if (!result.isValid) {
      errors.push({
        type: "INVALID_VALUE_FORMAT",
        message: result.error || "Invalid value format",
        tokenName,
        collection,
        mode,
        value,
      });
      continue;
    }

    if (result.value) {
      const tokenRefs = getAllTokenRefs(result.value);

      for (const { collection: refCollection, token: refToken } of tokenRefs) {
        const refName = `$${refCollection}.${refToken}`;
        const foundRef = tokenMap.get(refName);

        if (!foundRef) {
          errors.push({
            type: "INVALID_PRIMITIVE_TOKEN",
            message: `Referenced token '${refName}' not found`,
            tokenName,
            collection,
            mode,
            value,
          });
        }
      }
    }
  }

  return { isValid: errors.length === 0, errors, warnings };
}

/**
 * Runs full validation over all token files against the provided collection
 * definitions.
 *
 * Performs two passes:
 * 1. Per-collection structural validation (collection existence, mode coverage,
 *    value format) via `validateCollection`.
 * 2. Cross-token reference validation (dangling token refs) via
 *    `validateTokenValues` on the built AST.
 *
 * Returns a combined `ValidationResult` with all errors and warnings merged.
 */
export function validateAllTokens(
  tokens: Token[],
  definitions: Map<string, Collection>
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];

  for (const collection of tokens) {
    const result = validateCollection(collection, definitions);
    errors.push(...result.errors);
    warnings.push(...result.warnings);
  }

  const collections: Collections = {
    kind: "TokenCollections",
    metadata: { id: "temp", name: "temp" },
    data: Array.from(definitions.values()),
  };

  const ast = buildAst(tokens, collections);
  const tokenResult = validateTokenValues(ast.tokens, ast.tokens);
  errors.push(...tokenResult.errors);
  warnings.push(...tokenResult.warnings);

  return { isValid: errors.length === 0, errors, warnings };
}
