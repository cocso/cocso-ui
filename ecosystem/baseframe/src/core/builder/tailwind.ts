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

export interface TailwindOptions {
  prefix?: string;
  banner?: string;
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

function generateThemeVariables(
  tokens: TokenDecl[],
  mode: string,
  options: TailwindOptions,
): string {
  const { prefix } = options;
  const variables: string[] = [];
  const processedTokens = new Set<string>();

  tokens.forEach((token) => {
    if (processedTokens.has(token.token.name)) return;
    processedTokens.add(token.token.name);

    const value = token.values.find((v) => v.mode === mode);
    if (!value) return;

    const resolvedValue = resolveTokenValue(value.value, tokens, prefix);
    const name = token.token.name;
    let varName: string;

    if (name.startsWith('$number.')) {
      const numberName = name.replace('$number.', '');
      varName = createCssVarName(`spacing-${numberName}`, prefix);
      if (numberName === '1') {
        variables.push(`  --spacing: ${toCssValue(resolvedValue)};`);
      }
    } else if (name.startsWith('$letter-spacing.')) {
      const trackingName = name.replace('$letter-spacing.', '');
      varName = createCssVarName(`tracking-${trackingName}`, prefix);
    } else {
      varName = createCssVarName(name, prefix);
    }

    const cssValue = toCssValue(resolvedValue);
    variables.push(`  ${varName}: ${cssValue};`);
  });

  return variables.length > 0 ? `@theme {\n${variables.join('\n')}\n}` : '';
}

function generateWildcardUtilities(): string[] {
  const utilities: string[] = [];

  utilities.push(
    `@utility bg-* { background-color: var(--color-*, var(--color-palette-*)); }`,
    `@utility text-* { color: var(--color-*, var(--color-palette-*)); }`,
    `@utility border-* { border-color: var(--color-*, var(--color-palette-*)); }`,
    `@utility fill-* { fill: var(--color-*, var(--color-palette-*)); }`,
    `@utility stroke-* { stroke: var(--color-*, var(--color-palette-*)); }`,
    '',
    `@utility font-* { font-weight: var(--font-weight-*); }`,
    `@utility tracking-* { letter-spacing: var(--tracking-*); }`,
    '',
    `@utility p-* { padding: var(--spacing-*); }`,
    `@utility px-* { padding-left: var(--spacing-*); padding-right: var(--spacing-*); }`,
    `@utility py-* { padding-top: var(--spacing-*); padding-bottom: var(--spacing-*); }`,
    `@utility pt-* { padding-top: var(--spacing-*); }`,
    `@utility pr-* { padding-right: var(--spacing-*); }`,
    `@utility pb-* { padding-bottom: var(--spacing-*); }`,
    `@utility pl-* { padding-left: var(--spacing-*); }`,
    '',
    `@utility m-* { margin: var(--spacing-*); }`,
    `@utility mx-* { margin-left: var(--spacing-*); margin-right: var(--spacing-*); }`,
    `@utility my-* { margin-top: var(--spacing-*); margin-bottom: var(--spacing-*); }`,
    `@utility mt-* { margin-top: var(--spacing-*); }`,
    `@utility mr-* { margin-right: var(--spacing-*); }`,
    `@utility mb-* { margin-bottom: var(--spacing-*); }`,
    `@utility ml-* { margin-left: var(--spacing-*); }`,
    '',
    `@utility w-* { width: var(--spacing-*); }`,
    `@utility h-* { height: var(--spacing-*); }`,
    `@utility min-w-* { min-width: var(--spacing-*); }`,
    `@utility min-h-* { min-height: var(--spacing-*); }`,
    `@utility max-w-* { max-width: var(--spacing-*); }`,
    `@utility max-h-* { max-height: var(--spacing-*); }`,
    `@utility gap-* { gap: var(--spacing-*); }`,
    `@utility space-x-* > * + * { margin-left: var(--spacing-*); }`,
    `@utility space-y-* > * + * { margin-top: var(--spacing-*); }`,
    `@utility rounded-* { border-radius: var(--spacing-*); }`,
    '',
    `@utility shadow-* { box-shadow: var(--shadow-*); }`,
    `@utility border-*-width { border-width: var(--border-width-*); }`,
  );

  return utilities;
}

export function generateFromAst(ast: Ast, options: TailwindOptions): string {
  const { banner = '' } = options;
  const { tokens, collections } = ast;

  const parts: string[] = [];

  if (banner) {
    parts.push(banner);
  }

  parts.push('@import "tailwindcss";');
  parts.push('');

  collections.forEach((collection) => {
    const collectionTokens = tokens.filter((token) => token.token.collection === collection.name);

    collection.modes.forEach((mode) => {
      const themeBlock = generateThemeVariables(collectionTokens, mode, options);
      if (themeBlock) {
        parts.push(themeBlock);
        parts.push('');
      }
    });
  });

  const wildcardUtilities = generateWildcardUtilities();

  if (wildcardUtilities.length > 0) {
    parts.push(...wildcardUtilities);
    parts.push('');
  }

  return parts.join('\n');
}

export function generate(
  tokens: Token[],
  collections: Collections,
  options: TailwindOptions,
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

export const tailwind = {
  generateTailwindCSS: generate,
  generateTailwindFromAst: generateFromAst,
  createCssVarName,
} as const;
