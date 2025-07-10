import type { Ast, Collections, Token, TokenDecl } from '../types';
import { buildValidatedAst } from '../transforms';
import { toCssValue, resolveTokenValue } from './utils';

export interface TailwindOptions {
  prefix?: string;
  banner?: string;
}

function createVarName(name: string, prefix?: string): string {
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

function createTheme(tokens: TokenDecl[], mode: string, options: TailwindOptions): string {
  const { prefix } = options;
  const vars: string[] = [];
  const processed = new Set<string>();

  tokens.forEach((token) => {
    if (processed.has(token.token.name)) return;
    processed.add(token.token.name);

    const value = token.values.find((v) => v.mode === mode);
    if (!value) return;

    const resolved = resolveTokenValue(value.value, tokens, createVarName, prefix);
    const css = toCssValue(resolved);

    if (token.token.name === '$number.1') {
      vars.push(`  --spacing: ${css};`);
    }

    const varName = createVarName(token.token.name, prefix);
    vars.push(`  ${varName}: ${css};`);
  });

  return vars.length > 0 ? `@theme {\n${vars.join('\n')}\n}` : '';
}

function createUtilities(): string[] {
  return [
    `@utility bg-* { background-color: --value(--color-*); }`,
    `@utility text-* { color: --value(--color-*); }`,
    `@utility border-* { border-color: --value(--color-*); }`,
    `@utility fill-* { fill: --value(--color-*); }`,
    `@utility stroke-* { stroke: --value(--color-*); }`,
    `@utility p-* { padding: --value(--spacing-*); }`,
    `@utility px-* { padding-left: --value(--spacing-*); padding-right: --value(--spacing-*); }`,
    `@utility py-* { padding-top: --value(--spacing-*); padding-bottom: --value(--spacing-*); }`,
    `@utility pt-* { padding-top: --value(--spacing-*); }`,
    `@utility pr-* { padding-right: --value(--spacing-*); }`,
    `@utility pb-* { padding-bottom: --value(--spacing-*); }`,
    `@utility pl-* { padding-left: --value(--spacing-*); }`,
    `@utility m-* { margin: --value(--spacing-*); }`,
    `@utility mx-* { margin-left: --value(--spacing-*); margin-right: --value(--spacing-*); }`,
    `@utility my-* { margin-top: --value(--spacing-*); margin-bottom: --value(--spacing-*); }`,
    `@utility mt-* { margin-top: --value(--spacing-*); }`,
    `@utility mr-* { margin-right: --value(--spacing-*); }`,
    `@utility mb-* { margin-bottom: --value(--spacing-*); }`,
    `@utility ml-* { margin-left: --value(--spacing-*); }`,
    `@utility w-* { width: --value(--spacing-*); }`,
    `@utility h-* { height: --value(--spacing-*); }`,
    `@utility min-w-* { min-width: --value(--spacing-*); }`,
    `@utility min-h-* { min-height: --value(--spacing-*); }`,
    `@utility max-w-* { max-width: --value(--spacing-*); }`,
    `@utility max-h-* { max-height: --value(--spacing-*); }`,
    `@utility gap-* { gap: --value(--spacing-*); }`,
    `@utility space-x-* { & > :not(:last-child) { --tw-space-x-reverse: 0; margin-inline-start: calc(--value(--spacing-*) * var(--tw-space-x-reverse)); margin-inline-end: calc(--value(--spacing-*) * calc(1 - var(--tw-space-x-reverse))); } }`,
    `@utility space-y-* { & > :not(:last-child) { --tw-space-y-reverse: 0; margin-block-start: calc(--value(--spacing-*) * var(--tw-space-y-reverse)); margin-block-end: calc(--value(--spacing-*) * calc(1 - var(--tw-space-y-reverse))); } }`,
    `@utility space-x-reverse { & > :not(:last-child) { --tw-space-x-reverse: 1; } }`,
    `@utility space-y-reverse { & > :not(:last-child) { --tw-space-y-reverse: 1; } }`,
    `@utility rounded-* { border-radius: --value(--spacing-*); }`,
    `@utility font-* { font-weight: --value(--font-weight-*); }`,
    `@utility tracking-* { letter-spacing: --value(--tracking-*); }`,
    `@utility shadow-* { box-shadow: --value(--shadow-*); }`,
    `@utility border-width-* { border-width: --value(--border-width-*); }`,
  ];
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
      const theme = createTheme(collectionTokens, mode, options);
      if (theme) {
        parts.push(theme);
        parts.push('');
      }
    });
  });

  const utilities = createUtilities();

  if (utilities.length > 0) {
    parts.push(...utilities);
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
  generateFromAst,
  createVarName,
} as const;
