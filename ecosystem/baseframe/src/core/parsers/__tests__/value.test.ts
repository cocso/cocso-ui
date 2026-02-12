import { describe, expect, it } from 'vitest';
import type { Value } from '../../types';
import { parseValue, valueToString } from '../value';

describe('parseValue', () => {
  it('parses number input', () => {
    const result = parseValue(42);
    expect(result).toEqual({
      isValid: true,
      value: { kind: 'NumberValue', value: 42 },
    });
  });

  it('parses float number input', () => {
    const result = parseValue(1.5);
    expect(result).toEqual({
      isValid: true,
      value: { kind: 'NumberValue', value: 1.5 },
    });
  });

  it('parses hex color string', () => {
    const result = parseValue('#ff0000');
    expect(result.isValid).toBe(true);
    expect(result.value?.kind).toBe('HexColor');
  });

  it('parses rgb color string', () => {
    const result = parseValue('rgb(255, 0, 0)');
    expect(result.isValid).toBe(true);
    expect(result.value?.kind).toBe('RgbColor');
  });

  it('parses rgba color string', () => {
    const result = parseValue('rgba(0, 0, 0, 0.5)');
    expect(result.isValid).toBe(true);
    expect(result.value?.kind).toBe('RgbaColor');
  });

  it('parses token ref string', () => {
    const result = parseValue('$color.primary');
    expect(result.isValid).toBe(true);
    expect(result.value?.kind).toBe('TokenRef');
  });

  it('parses shadow string', () => {
    const result = parseValue('0px 4px 8px 0px #000000');
    expect(result.isValid).toBe(true);
    expect(result.value?.kind).toBe('Shadow');
  });

  it('parses size string', () => {
    const result = parseValue('16px');
    expect(result.isValid).toBe(true);
    expect(result.value).toEqual({ kind: 'SizeValue', value: 16, unit: 'px' });
  });

  it('parses duration string', () => {
    const result = parseValue('300ms');
    expect(result.isValid).toBe(true);
    expect(result.value).toEqual({ kind: 'DurationValue', value: 300, unit: 'ms' });
  });

  it('falls back to StringValue for unrecognized input', () => {
    const result = parseValue('auto');
    expect(result).toEqual({
      isValid: true,
      value: { kind: 'StringValue', value: 'auto' },
    });
  });

  it('trims whitespace', () => {
    const result = parseValue('  16px  ');
    expect(result.isValid).toBe(true);
    expect(result.value).toEqual({ kind: 'SizeValue', value: 16, unit: 'px' });
  });

  it('prioritizes hex over size for ambiguous input', () => {
    const result = parseValue('#abc');
    expect(result.value?.kind).toBe('HexColor');
  });

  it('prioritizes token ref over shadow for $ prefix', () => {
    const result = parseValue('$color.primary');
    expect(result.value?.kind).toBe('TokenRef');
  });
});

describe('valueToString', () => {
  it.each<[string, Value]>([
    ['#ff0000', { kind: 'HexColor', value: '#ff0000' }],
    ['rgb(255, 0, 0)', { kind: 'RgbColor', r: 255, g: 0, b: 0 }],
    ['rgba(0, 0, 0, 0.5)', { kind: 'RgbaColor', r: 0, g: 0, b: 0, a: 0.5 }],
    ['$color.primary', { kind: 'TokenRef', collection: 'color', token: 'primary' }],
    ['16px', { kind: 'SizeValue', value: 16, unit: 'px' }],
    ['1.5rem', { kind: 'SizeValue', value: 1.5, unit: 'rem' }],
    ['300ms', { kind: 'DurationValue', value: 300, unit: 'ms' }],
    ['0.3s', { kind: 'DurationValue', value: 0.3, unit: 's' }],
    ['42', { kind: 'NumberValue', value: 42 }],
    ['auto', { kind: 'StringValue', value: 'auto' }],
  ])('serializes to %s', (expected, value) => {
    expect(valueToString(value)).toBe(expected);
  });

  it('serializes ShadowLayer', () => {
    const layer: Value = {
      kind: 'ShadowLayer',
      offsetX: { kind: 'SizeValue', value: 0, unit: 'px' },
      offsetY: { kind: 'SizeValue', value: 4, unit: 'px' },
      blur: { kind: 'SizeValue', value: 8, unit: 'px' },
      spread: { kind: 'SizeValue', value: 0, unit: 'px' },
      color: { kind: 'HexColor', value: '#000000' },
    };
    expect(valueToString(layer)).toBe('0px 4px 8px 0px #000000');
  });

  it('serializes Shadow with multiple layers', () => {
    const shadow: Value = {
      kind: 'Shadow',
      layers: [
        {
          kind: 'ShadowLayer',
          offsetX: { kind: 'SizeValue', value: 0, unit: 'px' },
          offsetY: { kind: 'SizeValue', value: 1, unit: 'px' },
          blur: { kind: 'SizeValue', value: 2, unit: 'px' },
          spread: { kind: 'SizeValue', value: 0, unit: 'px' },
          color: { kind: 'HexColor', value: '#000000' },
        },
        {
          kind: 'ShadowLayer',
          offsetX: { kind: 'SizeValue', value: 0, unit: 'px' },
          offsetY: { kind: 'SizeValue', value: 4, unit: 'px' },
          blur: { kind: 'SizeValue', value: 8, unit: 'px' },
          spread: { kind: 'SizeValue', value: 0, unit: 'px' },
          color: { kind: 'HexColor', value: '#111111' },
        },
      ],
    };
    expect(valueToString(shadow)).toBe('0px 1px 2px 0px #000000, 0px 4px 8px 0px #111111');
  });

  it('roundtrips parsed values', () => {
    const inputs = [
      '#ff0000',
      'rgb(255, 0, 0)',
      'rgba(0, 0, 0, 0.5)',
      '16px',
      '300ms',
      '$color.primary',
      '$color.semantic.primary',
    ];
    for (const input of inputs) {
      const parsed = parseValue(input);
      expect(parsed.isValid).toBe(true);
      if (parsed.value) {
        expect(valueToString(parsed.value)).toBe(input);
      }
    }
  });
});
