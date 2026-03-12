import type {
  Ast,
  CollectionDecl,
  Collections,
  Token,
  TokenDecl,
} from "../types";

/**
 * Builds the root {@link Ast} from a list of token groups and a collections
 * definition. This is the primary entry point for AST construction.
 *
 * @param tokens - Array of {@link Token} nodes loaded from YAML source files.
 * @param collections - The {@link Collections} node describing all collection metadata.
 * @returns A fully populated {@link Ast} ready for code generation.
 */
export function buildAst(tokens: Token[], collections: Collections): Ast {
  return {
    tokens: buildAllTokens(tokens),
    collections: buildCollections(collections),
  };
}

/**
 * Converts a {@link Collections} node into a flat array of
 * {@link CollectionDecl} values, retaining only the name and modes of each
 * collection.
 *
 * @param collections - The source collections node.
 * @returns An array of {@link CollectionDecl} objects.
 */
function buildCollections(collections: Collections): CollectionDecl[] {
  return collections.data.map((collection) => ({
    name: collection.name,
    modes: collection.modes,
  }));
}

/**
 * Converts a single {@link Token} node into an array of {@link TokenDecl}
 * values, one per token entry in the group. Each declaration pairs the token's
 * identity (name + collection) with its per-mode values.
 *
 * @param token - A single token group node.
 * @returns An array of flattened {@link TokenDecl} objects.
 */
function buildTokens(token: Token): TokenDecl[] {
  const { collection: name, tokens } = token.data;

  return Object.entries(tokens).map(([tokenName, tokenData]) => {
    const values = Object.entries(tokenData.values).map(([mode, value]) => ({
      mode,
      value: value as string | number,
    }));

    return { token: { name: tokenName, collection: name }, values };
  });
}

/**
 * Flattens all token groups in `tokens` into a single {@link TokenDecl} array
 * by applying {@link buildTokens} to each group.
 *
 * @param tokens - All token group nodes to flatten.
 * @returns A merged array of {@link TokenDecl} objects across all groups.
 */
function buildAllTokens(tokens: Token[]): TokenDecl[] {
  return tokens.flatMap(buildTokens);
}
