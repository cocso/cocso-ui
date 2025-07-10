import type { Ast, Collections, Token, TokenDecl } from '../types';
import { buildValidatedAst } from '../transforms';
import { toCssValue, resolveTokenValue } from './utils';

export interface TailwindOptions {
  prefix?: string;
  banner?: string;
}

function createTailwindVarName(name: string, prefix?: string): string {
  let clean = name.replace(/^\$/, '');

  if (clean.startsWith('number.')) {
    clean = clean.replace('number.', 'spacing-');
  } else if (clean.startsWith('letter-spacing.')) {
    clean = clean.replace('letter-spacing.', 'tracking-');
  } else {
    clean = clean.replace(/\./g, '-');
  }

  return prefix ? `--${prefix}-${clean}` : `--${clean}`;
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

    const resolvedValue = resolveTokenValue(value.value, tokens, createTailwindVarName, prefix);
    const cssValue = toCssValue(resolvedValue);

    if (token.token.name === '$number.1') {
      variables.push(`  --spacing: ${cssValue};`);
    }

    const varName = createTailwindVarName(token.token.name, prefix);

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
    `@utility space-x-* { & > * + * { margin-left: var(--spacing-*); } }`,
    `@utility space-y-* { & > * + * { margin-top: var(--spacing-*); } }`,
    `@utility rounded-* { border-radius: var(--spacing-*); }`,
    '',
    `@utility shadow-* { box-shadow: var(--shadow-*); }`,
    `@utility border-width-* { border-width: var(--border-width-*); }`,
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

export function generateTailwindCSS(
  tokens: Token[],
  collections: Collections,
  options: TailwindOptions = {},
): string {
  const ast = buildValidatedAst(tokens, collections);
  return generateFromAst(ast, options);
}

export const tailwind = {
  generateTailwindCSS,
  generateTailwindFromAst: generateFromAst,
  createTailwindVarName,
} as const;
