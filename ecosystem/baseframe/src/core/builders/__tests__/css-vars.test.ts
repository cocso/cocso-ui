import { describe, expect, it } from 'vitest';
import type { Ast, Collections, Token, TokenDecl } from '../../types';
import { generateCssVariables, generateFromAst } from '../css-vars';

const collections: Collections = {
  kind: 'TokenCollections',
  metadata: { id: 'test', name: 'Test' },
  data: [
    { name: 'color', modes: ['default', 'dark'] },
    { name: 'spacing', modes: ['default'] },
  ],
};

const validTokens: Token[] = [
  {
    kind: 'Tokens',
    metadata: { id: 'color', name: 'Color', description: '' },
    data: {
      collection: 'color',
      tokens: {
        '$color.primary': { values: { default: '#ff0000', dark: '#cc0000' } },
        '$color.secondary': { values: { default: '#00ff00', dark: '#00cc00' } },
      },
    },
  },
  {
    kind: 'Tokens',
    metadata: { id: 'spacing', name: 'Spacing', description: '' },
    data: {
      collection: 'spacing',
      tokens: {
        '$spacing.1': { values: { default: '4px' } },
      },
    },
  },
];

function createAst(): Ast {
  const tokens: TokenDecl[] = [
    {
      token: { name: '$color.primary', collection: 'color' },
      values: [
        { mode: 'default', value: '#ff0000' },
        { mode: 'dark', value: '#cc0000' },
      ],
    },
    {
      token: { name: '$spacing.1', collection: 'spacing' },
      values: [{ mode: 'default', value: '4px' }],
    },
  ];

  return {
    collections: [
      { name: 'color', modes: ['default', 'dark'] },
      { name: 'spacing', modes: ['default'] },
    ],
    tokens,
  };
}

describe('generateFromAst', () => {
  it('generates CSS variables with :root selector', () => {
    const ast = createAst();
    const result = generateFromAst(ast, {});
    expect(result).toContain(':root');
    expect(result).toContain('--color-primary');
    expect(result).toContain('#ff0000');
  });

  it('generates separate rules per mode', () => {
    const ast = createAst();
    const result = generateFromAst(ast, {});
    const rootCount = (result.match(/:root/g) || []).length;
    expect(rootCount).toBeGreaterThanOrEqual(2);
  });

  it('applies custom selectors', () => {
    const ast = createAst();
    const result = generateFromAst(ast, {
      selectors: {
        color: {
          default: ':root',
          dark: '[data-theme="dark"]',
        },
      },
    });
    expect(result).toContain('[data-theme="dark"]');
    expect(result).toContain('#cc0000');
  });

  it('places dark mode values under correct selector', () => {
    const ast = createAst();
    const result = generateFromAst(ast, {
      selectors: {
        color: {
          default: ':root',
          dark: '[data-theme="dark"]',
        },
      },
    });
    const darkBlock = result.slice(result.indexOf('[data-theme="dark"]'));
    expect(darkBlock).toContain('#cc0000');
    expect(darkBlock).not.toContain('#ff0000');
  });

  it('applies prefix to variable names', () => {
    const ast = createAst();
    const result = generateFromAst(ast, { prefix: 'ds' });
    expect(result).toContain('--ds-color-primary');
    expect(result).toContain('--ds-spacing-1');
  });

  it('prepends banner', () => {
    const ast = createAst();
    const banner = '/* Auto-generated */\n';
    const result = generateFromAst(ast, { banner });
    expect(result.startsWith(banner)).toBe(true);
  });

  it('generates valid CSS structure', () => {
    const ast = createAst();
    const result = generateFromAst(ast, {});
    const openBraces = (result.match(/{/g) || []).length;
    const closeBraces = (result.match(/}/g) || []).length;
    expect(openBraces).toBe(closeBraces);
  });
});

describe('generateCssVariables', () => {
  it('generates end-to-end from tokens and collections', () => {
    const result = generateCssVariables(validTokens, collections);
    expect(result).toContain('--color-primary');
    expect(result).toContain('--spacing-1');
    expect(result).toContain('#ff0000');
    expect(result).toContain('4px');
  });

  it('applies options', () => {
    const result = generateCssVariables(validTokens, collections, { prefix: 'ds' });
    expect(result).toContain('--ds-color-primary');
  });

  it('throws on invalid tokens', () => {
    const invalidTokens: Token[] = [
      {
        kind: 'Tokens',
        metadata: { id: 'unknown', name: 'Unknown', description: '' },
        data: {
          collection: 'unknown',
          tokens: { '$unknown.foo': { values: { default: '#000000' } } },
        },
      },
    ];

    expect(() => generateCssVariables(invalidTokens, collections)).toThrow();
  });

  it('resolves token references to var()', () => {
    const tokensWithRef: Token[] = [
      {
        kind: 'Tokens',
        metadata: { id: 'color', name: 'Color', description: '' },
        data: {
          collection: 'color',
          tokens: {
            '$color.base': { values: { default: '#ff0000', dark: '#cc0000' } },
            '$color.primary': { values: { default: '$color.base', dark: '$color.base' } },
          },
        },
      },
    ];

    const result = generateCssVariables(tokensWithRef, collections);
    expect(result).toContain('var(--color-base)');
  });
});
