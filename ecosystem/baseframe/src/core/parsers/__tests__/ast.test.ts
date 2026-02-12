import { describe, expect, it } from 'vitest';
import type { Collections, Token } from '../../types';
import { buildAst } from '../ast';

const collections: Collections = {
  kind: 'TokenCollections',
  metadata: { id: 'test', name: 'Test' },
  data: [
    { name: 'color', modes: ['default', 'dark'] },
    { name: 'spacing', modes: ['default'] },
  ],
};

describe('buildAst', () => {
  it('builds AST from single token file', () => {
    const tokens: Token[] = [
      {
        kind: 'Tokens',
        metadata: { id: 'color', name: 'Color', description: '' },
        data: {
          collection: 'color',
          tokens: {
            '$color.primary': {
              values: { default: '#ff0000', dark: '#cc0000' },
            },
          },
        },
      },
    ];

    const ast = buildAst(tokens, collections);

    expect(ast.collections).toEqual([
      { name: 'color', modes: ['default', 'dark'] },
      { name: 'spacing', modes: ['default'] },
    ]);
    expect(ast.tokens).toHaveLength(1);
    expect(ast.tokens[0]).toEqual({
      token: { name: '$color.primary', collection: 'color' },
      values: [
        { mode: 'default', value: '#ff0000' },
        { mode: 'dark', value: '#cc0000' },
      ],
    });
  });

  it('builds AST from multiple token files', () => {
    const tokens: Token[] = [
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

    const ast = buildAst(tokens, collections);
    expect(ast.tokens).toHaveLength(3);
    expect(ast.tokens.map(t => t.token.name)).toEqual([
      '$color.primary',
      '$color.secondary',
      '$spacing.1',
    ]);
  });

  it('handles empty token list', () => {
    const ast = buildAst([], collections);
    expect(ast.tokens).toEqual([]);
    expect(ast.collections).toHaveLength(2);
  });

  it('preserves token value types', () => {
    const tokens: Token[] = [
      {
        kind: 'Tokens',
        metadata: { id: 'spacing', name: 'Spacing', description: '' },
        data: {
          collection: 'spacing',
          tokens: {
            '$spacing.1': { values: { default: '4px' } },
            '$spacing.scale': { values: { default: 1.5 } },
          },
        },
      },
    ];

    const ast = buildAst(tokens, collections);
    const stringToken = ast.tokens.find(t => t.token.name === '$spacing.1');
    const numberToken = ast.tokens.find(t => t.token.name === '$spacing.scale');

    expect(stringToken?.values[0].value).toBe('4px');
    expect(numberToken?.values[0].value).toBe(1.5);
  });
});
