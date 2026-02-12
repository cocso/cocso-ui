import { buildAst } from '../parsers';
import type { Ast, Collections, Token, ValidationError } from '../types';
import { validateAllTokens } from './validate';

export function buildValidatedAst(tokens: Token[], collections: Collections): Ast {
  const collectionMap = new Map(collections.data.map(collection => [collection.name, collection]));

  const validation = validateAllTokens(tokens, collectionMap);

  if (!validation.isValid) {
    const details = validation.errors
      .map((error: ValidationError) => `  ${error.message}`)
      .join('\n');
    throw new Error(`Token validation failed:\n${details}`);
  }

  return buildAst(tokens, collections);
}
