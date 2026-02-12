import { describe, expect, it } from 'vitest';
import type { Collections, Token } from '../../types';
import { buildValidatedAst } from '../build';

const collections: Collections = {
  kind: 'TokenCollections',
  metadata: { id: 'test', name: 'Test' },
  data: [
    { name: 'color', modes: ['default', 'dark'] },
    { name: 'spacing', modes: ['default'] },
  ],
};

describe('buildValidatedAst', () => {
  it('builds AST from valid tokens', () => {
    const tokens: Token[] = [
      {
        kind: 'Tokens',
        metadata: { id: 'color', name: 'Color', description: '' },
        data: {
          collection: 'color',
          tokens: {
            '$color.primary': { values: { default: '#ff0000', dark: '#cc0000' } },
          },
        },
      },
    ];

    const ast = buildValidatedAst(tokens, collections);
    expect(ast.tokens).toHaveLength(1);
    expect(ast.collections).toHaveLength(2);
    expect(ast.tokens[0].token.name).toBe('$color.primary');
  });

  it('throws on invalid collection', () => {
    const tokens: Token[] = [
      {
        kind: 'Tokens',
        metadata: { id: 'unknown', name: 'Unknown', description: '' },
        data: {
          collection: 'unknown',
          tokens: {
            '$unknown.foo': { values: { default: '#000000' } },
          },
        },
      },
    ];

    expect(() => buildValidatedAst(tokens, collections)).toThrow('Token validation failed');
  });

  it('throws on missing modes', () => {
    const tokens: Token[] = [
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
    ];

    expect(() => buildValidatedAst(tokens, collections)).toThrow('Token validation failed');
  });

  it('throws on invalid token reference', () => {
    const tokens: Token[] = [
      {
        kind: 'Tokens',
        metadata: { id: 'color', name: 'Color', description: '' },
        data: {
          collection: 'color',
          tokens: {
            '$color.primary': { values: { default: '$nonexistent.ref', dark: '#cc0000' } },
          },
        },
      },
    ];

    expect(() => buildValidatedAst(tokens, collections)).toThrow('Token validation failed');
  });

  it('includes error details in thrown message', () => {
    const tokens: Token[] = [
      {
        kind: 'Tokens',
        metadata: { id: 'unknown', name: 'Unknown', description: '' },
        data: {
          collection: 'unknown',
          tokens: {
            '$unknown.foo': { values: { default: '#000000' } },
          },
        },
      },
    ];

    try {
      buildValidatedAst(tokens, collections);
      expect.unreachable('should have thrown');
    } catch (error) {
      expect((error as Error).message).toContain('unknown');
    }
  });

  it('builds AST from multiple valid token files', () => {
    const tokens: Token[] = [
      {
        kind: 'Tokens',
        metadata: { id: 'color', name: 'Color', description: '' },
        data: {
          collection: 'color',
          tokens: {
            '$color.primary': { values: { default: '#ff0000', dark: '#cc0000' } },
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

    const ast = buildValidatedAst(tokens, collections);
    expect(ast.tokens).toHaveLength(2);
  });

  it('builds AST from empty token list', () => {
    const ast = buildValidatedAst([], collections);
    expect(ast.tokens).toHaveLength(0);
    expect(ast.collections).toHaveLength(2);
  });
});
