import { describe, expect, it } from 'vitest';
import type { TokenDecl, Value } from '../../types';
import { createTokenResolver } from '../resolve';

const allTokens: TokenDecl[] = [
  {
    token: { name: '$color.primary', collection: 'color' },
    values: [{ mode: 'default', value: '#ff0000' }],
  },
  {
    token: { name: '$spacing.1', collection: 'spacing' },
    values: [{ mode: 'default', value: '4px' }],
  },
];

const namer = (name: string) => `--${name.replace(/^\$/, '').replace(/\./g, '-')}`;

describe('createTokenResolver', () => {
  describe('resolveTokenRef', () => {
    it('resolves existing token ref to var()', () => {
      const resolver = createTokenResolver(allTokens, namer);
      const ref = { kind: 'TokenRef' as const, collection: 'color', token: 'primary' };
      expect(resolver.resolveTokenRef(ref)).toBe('var(--color-primary)');
    });

    it('throws for non-existent token ref', () => {
      const resolver = createTokenResolver(allTokens, namer);
      const ref = { kind: 'TokenRef' as const, collection: 'color', token: 'missing' };
      expect(() => resolver.resolveTokenRef(ref)).toThrow('Token not found: $color.missing');
    });
  });

  describe('resolve', () => {
    it('resolves TokenRef to StringValue with var()', () => {
      const resolver = createTokenResolver(allTokens, namer);
      const value: Value = { kind: 'TokenRef', collection: 'color', token: 'primary' };
      const resolved = resolver.resolve(value);
      expect(resolved).toEqual({ kind: 'StringValue', value: 'var(--color-primary)' });
    });

    it('returns HexColor unchanged', () => {
      const resolver = createTokenResolver(allTokens, namer);
      const value: Value = { kind: 'HexColor', value: '#ff0000' };
      expect(resolver.resolve(value)).toEqual(value);
    });

    it('returns SizeValue unchanged', () => {
      const resolver = createTokenResolver(allTokens, namer);
      const value: Value = { kind: 'SizeValue', value: 16, unit: 'px' };
      expect(resolver.resolve(value)).toEqual(value);
    });

    it('returns NumberValue unchanged', () => {
      const resolver = createTokenResolver(allTokens, namer);
      const value: Value = { kind: 'NumberValue', value: 42 };
      expect(resolver.resolve(value)).toEqual(value);
    });

    it('returns StringValue unchanged', () => {
      const resolver = createTokenResolver(allTokens, namer);
      const value: Value = { kind: 'StringValue', value: 'auto' };
      expect(resolver.resolve(value)).toEqual(value);
    });

    it('returns DurationValue unchanged', () => {
      const resolver = createTokenResolver(allTokens, namer);
      const value: Value = { kind: 'DurationValue', value: 300, unit: 'ms' };
      expect(resolver.resolve(value)).toEqual(value);
    });

    it('returns RgbColor unchanged', () => {
      const resolver = createTokenResolver(allTokens, namer);
      const value: Value = { kind: 'RgbColor', r: 255, g: 0, b: 0 };
      expect(resolver.resolve(value)).toEqual(value);
    });

    it('returns RgbaColor unchanged', () => {
      const resolver = createTokenResolver(allTokens, namer);
      const value: Value = { kind: 'RgbaColor', r: 0, g: 0, b: 0, a: 0.5 };
      expect(resolver.resolve(value)).toEqual(value);
    });

    it('resolves ShadowLayer with token ref color', () => {
      const resolver = createTokenResolver(allTokens, namer);
      const value: Value = {
        kind: 'ShadowLayer',
        offsetX: { kind: 'SizeValue', value: 0, unit: 'px' },
        offsetY: { kind: 'SizeValue', value: 4, unit: 'px' },
        blur: { kind: 'SizeValue', value: 8, unit: 'px' },
        spread: { kind: 'SizeValue', value: 0, unit: 'px' },
        color: { kind: 'TokenRef', collection: 'color', token: 'primary' },
      };

      const resolved = resolver.resolve(value);
      expect(resolved).toMatchObject({
        kind: 'ShadowLayer',
        color: { kind: 'StringValue', value: 'var(--color-primary)' },
        offsetX: { kind: 'SizeValue', value: 0, unit: 'px' },
        offsetY: { kind: 'SizeValue', value: 4, unit: 'px' },
        blur: { kind: 'SizeValue', value: 8, unit: 'px' },
        spread: { kind: 'SizeValue', value: 0, unit: 'px' },
      });
    });

    it('resolves ShadowLayer with token ref dimensions', () => {
      const resolver = createTokenResolver(allTokens, namer);
      const value: Value = {
        kind: 'ShadowLayer',
        offsetX: { kind: 'TokenRef', collection: 'spacing', token: '1' },
        offsetY: { kind: 'SizeValue', value: 4, unit: 'px' },
        blur: { kind: 'SizeValue', value: 8, unit: 'px' },
        spread: { kind: 'SizeValue', value: 0, unit: 'px' },
        color: { kind: 'HexColor', value: '#000000' },
      };

      const resolved = resolver.resolve(value);
      expect(resolved).toMatchObject({
        kind: 'ShadowLayer',
        offsetX: { kind: 'StringValue', value: 'var(--spacing-1)' },
      });
    });

    it('resolves Shadow with nested token refs', () => {
      const resolver = createTokenResolver(allTokens, namer);
      const value: Value = {
        kind: 'Shadow',
        layers: [
          {
            kind: 'ShadowLayer',
            offsetX: { kind: 'SizeValue', value: 0, unit: 'px' },
            offsetY: { kind: 'SizeValue', value: 4, unit: 'px' },
            blur: { kind: 'SizeValue', value: 8, unit: 'px' },
            spread: { kind: 'SizeValue', value: 0, unit: 'px' },
            color: { kind: 'TokenRef', collection: 'color', token: 'primary' },
          },
        ],
      };

      const resolved = resolver.resolve(value);
      expect(resolved).toMatchObject({
        kind: 'Shadow',
        layers: [
          {
            kind: 'ShadowLayer',
            color: { kind: 'StringValue', value: 'var(--color-primary)' },
          },
        ],
      });
    });

    it('throws when resolving non-existent token ref', () => {
      const resolver = createTokenResolver(allTokens, namer);
      const value: Value = { kind: 'TokenRef', collection: 'color', token: 'missing' };
      expect(() => resolver.resolve(value)).toThrow('Token not found');
    });
  });
});
