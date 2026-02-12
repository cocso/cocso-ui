import { describe, expect, it } from 'vitest';
import type { Ast, Collections, Token, TokenDecl } from '../../types';
import { generateFromAst, generateTailwindCSS } from '../tailwind';

const collections: Collections = {
  kind: 'TokenCollections',
  metadata: { id: 'test', name: 'Test' },
  data: [
    { name: 'color', modes: ['default'] },
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
        '$color.primary': { values: { default: '#ff0000' } },
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
      values: [{ mode: 'default', value: '#ff0000' }],
    },
    {
      token: { name: '$spacing.1', collection: 'spacing' },
      values: [{ mode: 'default', value: '4px' }],
    },
  ];

  return {
    collections: [
      { name: 'color', modes: ['default'] },
      { name: 'spacing', modes: ['default'] },
    ],
    tokens,
  };
}

describe('generateFromAst', () => {
  it('generates @theme block with primitive vars', () => {
    const ast = createAst();
    const result = generateFromAst(ast, {});
    expect(result).toContain('@theme {');
    expect(result).toContain('--color-primary: #ff0000;');
    expect(result).toContain('--spacing-1: 4px;');
  });

  it('generates @theme inline for vars referencing other vars', () => {
    const tokens: TokenDecl[] = [
      {
        token: { name: '$color.base', collection: 'color' },
        values: [{ mode: 'default', value: '#ff0000' }],
      },
      {
        token: { name: '$color.primary', collection: 'color' },
        values: [{ mode: 'default', value: '$color.base' }],
      },
    ];
    const ast: Ast = {
      collections: [{ name: 'color', modes: ['default'] }],
      tokens,
    };

    const result = generateFromAst(ast, {});
    expect(result).toContain('@theme inline {');
    expect(result).toContain('var(--color-base)');
  });

  it('applies prefix to variable names', () => {
    const ast = createAst();
    const result = generateFromAst(ast, { prefix: 'ds' });
    expect(result).toContain('--ds-color-primary');
    expect(result).toContain('--ds-spacing-1');
  });

  it('prepends banner', () => {
    const ast = createAst();
    const banner = '/* Tailwind theme */';
    const result = generateFromAst(ast, { banner });
    expect(result.startsWith(banner)).toBe(true);
  });

  it('generates utility definitions', () => {
    const ast = createAst();
    const result = generateFromAst(ast, {});
    expect(result).toContain('@utility bg-*');
    expect(result).toContain('@utility text-*');
    expect(result).toContain('@utility p-*');
    expect(result).toContain('@utility rounded-*');
    expect(result).toContain('@utility shadow-*');
  });

  it('deduplicates tokens across modes', () => {
    const tokens: TokenDecl[] = [
      {
        token: { name: '$color.primary', collection: 'color' },
        values: [
          { mode: 'default', value: '#ff0000' },
          { mode: 'dark', value: '#cc0000' },
        ],
      },
    ];
    const ast: Ast = {
      collections: [{ name: 'color', modes: ['default', 'dark'] }],
      tokens,
    };

    const result = generateFromAst(ast, {});
    const themeBlock = result.slice(result.indexOf('@theme {'), result.indexOf('}') + 1);
    const matches = themeBlock.match(/--color-primary/g) || [];
    expect(matches.length).toBe(1);
  });
});

describe('generateTailwindCSS', () => {
  it('generates end-to-end from tokens and collections', () => {
    const result = generateTailwindCSS(validTokens, collections);
    expect(result).toContain('@theme');
    expect(result).toContain('--color-primary');
    expect(result).toContain('--spacing-1');
    expect(result).toContain('@utility');
  });

  it('applies options', () => {
    const result = generateTailwindCSS(validTokens, collections, { prefix: 'ds' });
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

    expect(() => generateTailwindCSS(invalidTokens, collections)).toThrow();
  });

  it('generates valid output structure', () => {
    const result = generateTailwindCSS(validTokens, collections);
    expect(result).toContain('@theme {');
    expect(result).toContain('@utility bg-*');
    expect(result).not.toContain('undefined');
    expect(result).not.toContain('NaN');
  });
});
