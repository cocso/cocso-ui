import type { Token, Collections, Ast, ValidationError } from '../types';
import { validateAllTokens } from './validate';
import { buildAst } from '../parsers';

export function buildValidatedAst(tokens: Token[], collections: Collections): Ast {
  const collectionMap = new Map(
    collections.data.map((collection) => [collection.name, collection]),
  );

  const validation = validateAllTokens(tokens, collectionMap);

  if (!validation.isValid) {
    console.error('Token validation failed:');
    validation.errors.forEach((error: ValidationError) => {
      console.error(`  ${error.message}`);
    });
    throw new Error('Token validation failed. Please fix the errors above.');
  }

  if (validation.warnings.length > 0) {
    console.warn('Token validation warnings:');
    validation.warnings.forEach((warning: string) => {
      console.warn(`  ${warning}`);
    });
  }

  return buildAst(tokens, collections);
}
