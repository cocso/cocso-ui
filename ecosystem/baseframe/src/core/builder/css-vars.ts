import type {
  Token,
  Collections,
  Collection,
  Ast,
  TokenDecl,
  CollectionDecl,
  Value,
} from '../types';
import { validateAllTokens, isTokenRef, getTokenRef } from '../validator';
import { buildAst, parseValue, valueToString } from '../parser';

export interface CssVarsOptions {
  prefix?: string;
  banner?: string;
  selectors: {
    [collection: string]: {
      [mode: string]: string;
    };
  };
}

function toCssVar(name: string, prefix?: string): string {
  const clean = name.replace(/^\$/, '').replace(/\./g, '-');
  return prefix ? `--${prefix}-${clean}` : `--${clean}`;
}

function toCssValue(value: string | number | Value): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  return valueToString(value);
}

function resolveValue(
  value: string | number,
  allTokens: TokenDecl[],
  mode: string,
  prefix?: string,
): string | number | Value {
  const text = String(value);
  
  if (!text.startsWith('$')) {
    return value;
  }

  const result = parseValue(text);
  if (!result.isValid || !result.value || !isTokenRef(result.value)) {
    throw new Error(`Invalid token reference: ${text}`);
  }

  const ref = getTokenRef(result.value);
  if (!ref) {
    throw new Error(`Could not parse token reference: ${text}`);
  }

  const fullName = `$${ref.collection}.${ref.token}`;
  const found = allTokens.find(
    (t) => t.token.name === fullName,
  );

  if (!found) {
    throw new Error(`Token not found: ${text}`);
  }

  const varName = toCssVar(fullName, prefix);
  return `var(${varName})`;
}

function makeDeclaration(
  token: TokenDecl,
  mode: string,
  prefix?: string,
  allTokens?: TokenDecl[],
): string {
  const value = token.values.find((v) => v.mode === mode);
  if (!value) {
    throw new Error(`No value found for token '${token.token.name}' in mode '${mode}'`);
  }

  const resolved = allTokens ? resolveValue(value.value, allTokens, mode, prefix) : value.value;

  const varName = toCssVar(token.token.name, prefix);
  return `${varName}: ${toCssValue(resolved)};`;
}

function makeRule(
  selector: string,
  tokens: TokenDecl[],
  mode: string,
  prefix?: string,
  allTokens?: TokenDecl[],
): string {
  const declarations = tokens.map((token) => `  ${makeDeclaration(token, mode, prefix, allTokens)}`).join('\n');
  return `${selector} {\n${declarations}\n}`;
}

function makeCss(
  rules: {
    selector: string;
    tokens: TokenDecl[];
    mode: string;
    prefix?: string;
    allTokens?: TokenDecl[];
  }[],
): string {
  return rules
    .map(({ selector, tokens, mode, prefix, allTokens }) =>
      makeRule(selector, tokens, mode, prefix, allTokens),
    )
    .join('\n\n');
}

export function generateFromAst(ast: Ast, options: CssVarsOptions): string {
  const { prefix, banner = '', selectors } = options;
  const { tokens, collections } = ast;

  const rules = collections.flatMap((collection) => {
    const collectionTokens = tokens.filter((token) => token.token.collection === collection.name);

    return collection.modes.map((mode) => {
      const selector = selectors[collection.name]?.[mode];

      if (!selector) {
        throw new Error(
          `Selector for collection ${collection.name} and mode ${mode} is not defined`,
        );
      }

      return { selector, tokens: collectionTokens, mode, prefix, allTokens: tokens };
    });
  });

  const css = makeCss(rules);
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
    validation.errors.forEach((error) => {
      console.error(`  ${error.message}`);
    });
    throw new Error('Token validation failed. Please fix the errors above.');
  }

  if (validation.warnings.length > 0) {
    console.warn('Token validation warnings:');
    validation.warnings.forEach((warning) => {
      console.warn(`  ${warning}`);
    });
  }

  const ast = buildAst(tokens, collections);
  return generateFromAst(ast, options);
}

export const cssVars = {
  generateCssVariables: generate,
  generateCssVarsFromAst: generateFromAst,
  createCssVarName: toCssVar,
} as const;
