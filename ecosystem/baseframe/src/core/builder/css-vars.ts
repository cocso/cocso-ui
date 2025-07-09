import type {
  Ast,
  Collections,
  Token,
  TokenDecl,
  Value,
  TokenRef,
  ValidationError,
} from '../types';
import { validateAllTokens } from '../validator';
import { buildAst, parseValue, valueToString } from '../parser';
import { createTokenResolver } from '../resolver';

export interface CssVarsOptions {
  prefix?: string;
  banner?: string;
  selectors: {
    [collection: string]: {
      [mode: string]: string;
    };
  };
}

function createCssVarName(name: string, prefix?: string): string {
  const clean = name.replace(/^\$/, '').replace(/\./g, '-');
  return prefix ? `--${prefix}-${clean}` : `--${clean}`;
}

function toCssValue(value: string | number | Value): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  return valueToString(value);
}

function resolveTokenValue(
  value: string | number,
  allTokens: TokenDecl[],
  prefix?: string,
): string | number {
  const text = String(value);

  if (!text.startsWith('$')) {
    const parsed = parseValue(text);
    if (parsed.isValid && parsed.value) {
      const resolver = createTokenResolver(allTokens, 'default', (name) =>
        createCssVarName(name, prefix),
      );
      const resolved = resolver.resolve(parsed.value);
      return toCssValue(resolved);
    }
    return value;
  }

  const parsed = parseValue(text);
  if (!parsed.isValid || !parsed.value) {
    throw new Error(`Invalid token reference: ${text}`);
  }

  const resolver = createTokenResolver(allTokens, 'default', (name) =>
    createCssVarName(name, prefix),
  );
  return resolver.resolveTokenRef(parsed.value as TokenRef);
}

function createDeclaration(
  token: TokenDecl,
  mode: string,
  allTokens: TokenDecl[],
  prefix?: string,
): string {
  const value = token.values.find((v) => v.mode === mode);
  if (!value) {
    throw new Error(`No value found for token '${token.token.name}' in mode '${mode}'`);
  }

  const resolvedValue = resolveTokenValue(value.value, allTokens, prefix);
  const varName = createCssVarName(token.token.name, prefix);
  return `${varName}: ${toCssValue(resolvedValue)};`;
}

function createRule(
  selector: string,
  tokens: TokenDecl[],
  mode: string,
  allTokens: TokenDecl[],
  prefix?: string,
): string {
  const declarations = tokens
    .map((token) => `  ${createDeclaration(token, mode, allTokens, prefix)}`)
    .join('\n');
  return `${selector} {\n${declarations}\n}`;
}

export function generateFromAst(ast: Ast, options: CssVarsOptions): string {
  const { prefix, banner = '', selectors } = options;
  const { tokens, collections } = ast;

  const css = collections
    .flatMap((collection) => {
      const collectionTokens = tokens.filter((token) => token.token.collection === collection.name);

      return collection.modes.map((mode) => {
        const selector = selectors[collection.name]?.[mode];

        if (!selector) {
          throw new Error(
            `Selector for collection ${collection.name} and mode ${mode} is not defined`,
          );
        }

        return createRule(selector, collectionTokens, mode, tokens, prefix);
      });
    })
    .join('\n\n');

  return `${banner}${css}`;
}

export function generate(
  tokens: Token[],
  collections: Collections,
  options: CssVarsOptions,
): string {
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

  const ast = buildAst(tokens, collections);
  return generateFromAst(ast, options);
}

export const cssVars = {
  generateCssVariables: generate,
  generateCssVarsFromAst: generateFromAst,
  createCssVarName,
} as const;
