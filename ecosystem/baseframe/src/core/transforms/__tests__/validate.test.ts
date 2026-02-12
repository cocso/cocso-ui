import { describe, expect, it } from 'vitest';
import type { Collection, Token } from '../../types';
import { validateAllTokens } from '../validate';

function createDefinitions(
  entries: Array<{ name: string; modes: string[] }>,
): Map<string, Collection> {
  return new Map(entries.map(e => [e.name, e]));
}

const definitions = createDefinitions([
  { name: 'color', modes: ['default', 'dark'] },
  { name: 'spacing', modes: ['default'] },
]);

describe('validateAllTokens', () => {
  it('validates correct tokens', () => {
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

    const result = validateAllTokens(tokens, definitions);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('reports invalid collection', () => {
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

    const result = validateAllTokens(tokens, definitions);
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.type === 'INVALID_COLLECTION')).toBe(true);
  });

  it('reports missing modes', () => {
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

    const result = validateAllTokens(tokens, definitions);
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.type === 'MISSING_MODE')).toBe(true);
  });

  it('reports invalid token references', () => {
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

    const result = validateAllTokens(tokens, definitions);
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.type === 'INVALID_PRIMITIVE_TOKEN')).toBe(true);
  });

  it('validates valid token references', () => {
    const tokens: Token[] = [
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

    const result = validateAllTokens(tokens, definitions);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('validates multiple collections', () => {
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

    const result = validateAllTokens(tokens, definitions);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('validates empty token list', () => {
    const result = validateAllTokens([], definitions);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('ignores extra modes not in definition (validator only checks missing modes)', () => {
    const tokens: Token[] = [
      {
        kind: 'Tokens',
        metadata: { id: 'spacing', name: 'Spacing', description: '' },
        data: {
          collection: 'spacing',
          tokens: {
            '$spacing.1': { values: { default: '4px', dark: '8px' } },
          },
        },
      },
    ];

    const result = validateAllTokens(tokens, definitions);
    expect(result.isValid).toBe(true);
  });

  it('accumulates errors from multiple tokens', () => {
    const tokens: Token[] = [
      {
        kind: 'Tokens',
        metadata: { id: 'color', name: 'Color', description: '' },
        data: {
          collection: 'color',
          tokens: {
            '$color.a': { values: { default: '#ff0000' } },
            '$color.b': { values: { default: '#00ff00' } },
          },
        },
      },
    ];

    const result = validateAllTokens(tokens, definitions);
    expect(result.isValid).toBe(false);
    expect(result.errors.filter(e => e.type === 'MISSING_MODE').length).toBeGreaterThanOrEqual(2);
  });

  it('validates shadow with token references', () => {
    const tokens: Token[] = [
      {
        kind: 'Tokens',
        metadata: { id: 'color', name: 'Color', description: '' },
        data: {
          collection: 'color',
          tokens: {
            '$color.shadow': { values: { default: '#000000', dark: '#111111' } },
            '$color.elevated': {
              values: {
                default: '0px 4px 8px 0px $color.shadow',
                dark: '0px 4px 8px 0px $color.shadow',
              },
            },
          },
        },
      },
    ];

    const result = validateAllTokens(tokens, definitions);
    expect(result.isValid).toBe(true);
  });
});
