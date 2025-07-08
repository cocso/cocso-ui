import type {
  TokenType,
  CollectionDefinitions,
  TokenCollectionDeclaration,
  TokenDeclaration,
  ParsedAst,
} from './types';

export function parseCollections(collections: CollectionDefinitions): TokenCollectionDeclaration[] {
  return collections.data.map((collection) => ({
    name: collection.name,
    modes: collection.modes,
  }));
}

export function parseTokens(collection: TokenType): TokenDeclaration[] {
  const { collection: collectionName, tokens } = collection.data;

  return Object.entries(tokens).map(([tokenName, tokenData]) => {
    const values = Object.entries(tokenData.values).map(([mode, value]) => ({
      mode,
      value: value as string | number,
    }));

    return { token: { name: tokenName, collection: collectionName }, values };
  });
}

export function parseAllTokens(tokenCollections: TokenType[]): TokenDeclaration[] {
  return tokenCollections.flatMap(parseTokens);
}

export function parseAst(
  tokenCollections: TokenType[],
  collections: CollectionDefinitions,
): ParsedAst {
  return {
    tokens: parseAllTokens(tokenCollections),
    tokenCollections: parseCollections(collections),
  };
}
