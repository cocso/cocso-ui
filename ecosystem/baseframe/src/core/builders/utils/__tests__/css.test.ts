import { describe, expect, it } from 'vitest';
import type { TokenDecl, Value } from '../../../types';
import { resolveTokenValue, toCssValue } from '../css';

describe('toCssValue', () => {
  it('returns string value as-is', () => {
    expect(toCssValue('16px')).toBe('16px');
  });

  it('converts number to string', () => {
    expect(toCssValue(42)).toBe('42');
  });

  it('converts HexColor value', () => {
    const value: Value = { kind: 'HexColor', value: '#ff0000' };
    expect(toCssValue(value)).toBe('#ff0000');
  });

  it('converts SizeValue', () => {
    const value: Value = { kind: 'SizeValue', value: 16, unit: 'px' };
    expect(toCssValue(value)).toBe('16px');
  });

  it('converts RgbColor value', () => {
    const value: Value = { kind: 'RgbColor', r: 255, g: 0, b: 0 };
    expect(toCssValue(value)).toBe('rgb(255, 0, 0)');
  });

  it('converts NumberValue', () => {
    const value: Value = { kind: 'NumberValue', value: 1.5 };
    expect(toCssValue(value)).toBe('1.5');
  });

  it('converts StringValue', () => {
    const value: Value = { kind: 'StringValue', value: 'auto' };
    expect(toCssValue(value)).toBe('auto');
  });

  it('converts DurationValue', () => {
    const value: Value = { kind: 'DurationValue', value: 300, unit: 'ms' };
    expect(toCssValue(value)).toBe('300ms');
  });

  it('converts RgbaColor value', () => {
    const value: Value = { kind: 'RgbaColor', r: 0, g: 0, b: 0, a: 0.5 };
    expect(toCssValue(value)).toBe('rgba(0, 0, 0, 0.5)');
  });
});

describe('resolveTokenValue', () => {
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

  const resolver = (name: string, prefix?: string) => {
    const clean = name.replace(/^\$/, '').replace(/\./g, '-');
    return prefix ? `--${prefix}-${clean}` : `--${clean}`;
  };

  it('resolves token reference to var()', () => {
    const result = resolveTokenValue('$color.primary', allTokens, resolver);
    expect(result).toBe('var(--color-primary)');
  });

  it('resolves token reference with prefix', () => {
    const result = resolveTokenValue('$color.primary', allTokens, resolver, 'ds');
    expect(result).toBe('var(--ds-color-primary)');
  });

  it('returns plain string values unchanged', () => {
    expect(resolveTokenValue('auto', allTokens, resolver)).toBe('auto');
  });

  it('converts number values to string via parseValue', () => {
    expect(resolveTokenValue(42, allTokens, resolver)).toBe('42');
  });

  it('resolves shadow with embedded token refs', () => {
    const result = resolveTokenValue('0px 4px 8px 0px $color.primary', allTokens, resolver);
    expect(result).toContain('var(--color-primary)');
  });

  it('returns plain hex color unchanged', () => {
    expect(resolveTokenValue('#ff0000', allTokens, resolver)).toBe('#ff0000');
  });

  it('returns size value unchanged', () => {
    expect(resolveTokenValue('16px', allTokens, resolver)).toBe('16px');
  });

  it('throws for invalid token reference', () => {
    expect(() => resolveTokenValue('$nonexistent.ref', allTokens, resolver)).toThrow();
  });
});
