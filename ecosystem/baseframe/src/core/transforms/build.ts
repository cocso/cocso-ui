import { buildAst } from "../parsers";
import type { Ast, Collections, Token, ValidationError } from "../types";
import { validateAllTokens } from "./validate";

/**
 * Validates raw token data against collection definitions and builds a typed AST.
 *
 * Runs `validateAllTokens` first; if any validation errors are found, they are
 * collected and thrown as a single `Error` with a formatted message.
 * On success, delegates to `buildAst` to produce the final `Ast` structure.
 *
 * @throws {Error} When one or more tokens fail validation.
 */
export function buildValidatedAst(
  tokens: Token[],
  collections: Collections
): Ast {
  const collectionMap = new Map(
    collections.data.map((collection) => [collection.name, collection])
  );

  const validation = validateAllTokens(tokens, collectionMap);

  if (!validation.isValid) {
    const messages = (validation.errors as ValidationError[])
      .map((e) => `  ${e.message}`)
      .join("\n");
    throw new Error(`Token validation failed:\n${messages}`);
  }

  return buildAst(tokens, collections);
}
