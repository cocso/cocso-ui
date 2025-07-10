import type { Token, Collections, Ast, TokenDecl, CollectionDecl } from '../types';

export function buildAst(tokens: Token[], collections: Collections): Ast {
  return {
    tokens: buildAllTokens(tokens),
    collections: buildCollections(collections),
  };
}

function buildCollections(collections: Collections): CollectionDecl[] {
  return collections.data.map((collection) => ({
    name: collection.name,
    modes: collection.modes,
  }));
}

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

function buildAllTokens(tokens: Token[]): TokenDecl[] {
  return tokens.flatMap(buildTokens);
}
