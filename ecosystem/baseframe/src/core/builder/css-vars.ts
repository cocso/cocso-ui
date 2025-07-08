import type {
  TokenType,
  CollectionDefinitions,
  TokenCollectionDefinition,
  ParsedAst,
  TokenDeclaration,
  TokenCollectionDeclaration,
} from '../ast';
import { validateAllTokens, parseAst } from '../ast';

export interface CssVarsOptions {
  prefix?: string;
  banner?: string;
  selectors: {
    [collection: string]: {
      [mode: string]: string;
    };
  };
}

function toCssVarName(name: string, prefix?: string): string {
  const clean = name.replace(/^\$/, '').replace(/\./g, '-');
  return prefix ? `--${prefix}-${clean}` : `--${clean}`;
}

function toCssValue(value: string | number): string {
  return typeof value === 'string' ? value : value.toString();
}

function makeDeclaration(token: TokenDeclaration, mode: string, prefix?: string): string {
  const value = token.values.find((v) => v.mode === mode);
  if (!value) {
    throw new Error(`No value found for token '${token.token.name}' in mode '${mode}'`);
  }

  const varName = toCssVarName(token.token.name, prefix);
  return `${varName}: ${toCssValue(value.value)};`;
}

function makeRule(
  selector: string,
  tokens: TokenDeclaration[],
  mode: string,
  prefix?: string,
): string {
  const decls = tokens.map((token) => `  ${makeDeclaration(token, mode, prefix)}`).join('\n');
  return `${selector} {\n${decls}\n}`;
}

function makeCss(
  rules: { selector: string; tokens: TokenDeclaration[]; mode: string; prefix?: string }[],
): string {
  return rules
    .map(({ selector, tokens, mode, prefix }) => makeRule(selector, tokens, mode, prefix))
    .join('\n\n');
}

export function generateFromAst(ast: ParsedAst, options: CssVarsOptions): string {
  const { prefix, banner = '', selectors } = options;
  const { tokens, tokenCollections } = ast;

  const rules = tokenCollections.flatMap((collection) => {
    const collectionTokens = tokens.filter((token) => token.token.collection === collection.name);

    return collection.modes.map((mode) => {
      const selector = selectors[collection.name]?.[mode];

      if (!selector) {
        throw new Error(
          `Selector for collection ${collection.name} and mode ${mode} is not defined`,
        );
      }

      return { selector, tokens: collectionTokens, mode, prefix };
    });
  });

  const css = makeCss(rules);
  return `${banner}${css}`;
}

export function generate(
  tokens: TokenType[],
  collections: CollectionDefinitions,
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

  const ast = parseAst(tokens, collections);
  return generateFromAst(ast, options);
}

export const cssVars = {
  generateCssVariables: generate,
  generateCssVarsFromAst: generateFromAst,
  createCssVarName: toCssVarName,
} as const;

export type { TokenDeclaration, TokenCollectionDeclaration, ParsedAst };
