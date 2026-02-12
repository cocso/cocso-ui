import { describe, expect, it } from 'vitest';
import {
  parseDuration,
  parseHex,
  parseRgb,
  parseRgba,
  parseSize,
  parseTokenRef,
} from '../primitives';

describe('parseHex', () => {
  it.each([
    ['#fff', '#fff'],
    ['#FFF', '#FFF'],
    ['#000', '#000'],
    ['#ffff', '#ffff'],
    ['#ffffff', '#ffffff'],
    ['#FFFFFF', '#FFFFFF'],
    ['#00000000', '#00000000'],
    ['#aaBBcc', '#aaBBcc'],
    ['#aaBBccDD', '#aaBBccDD'],
  ])('parses %s', (input, expected) => {
    const result = parseHex(input);
    expect(result.isValid).toBe(true);
    expect(result.value).toEqual({ kind: 'HexColor', value: expected });
  });

  it.each([
    '',
    'fff',
    '#gg0000',
    '#ff',
    '#fffff',
    '#fffffffff',
    'rgb(0,0,0)',
    '#',
  ])('rejects %s', input => {
    const result = parseHex(input);
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe('parseRgb', () => {
  it('parses valid rgb', () => {
    const result = parseRgb('rgb(255, 128, 0)');
    expect(result).toEqual({
      isValid: true,
      value: { kind: 'RgbColor', r: 255, g: 128, b: 0 },
    });
  });

  it('parses rgb with no spaces', () => {
    const result = parseRgb('rgb(0,0,0)');
    expect(result).toEqual({
      isValid: true,
      value: { kind: 'RgbColor', r: 0, g: 0, b: 0 },
    });
  });

  it('parses rgb with extra spaces', () => {
    const result = parseRgb('rgb(  10 ,  20 ,  30  )');
    expect(result).toEqual({
      isValid: true,
      value: { kind: 'RgbColor', r: 10, g: 20, b: 30 },
    });
  });

  it('rejects out-of-range values', () => {
    const result = parseRgb('rgb(256, 0, 0)');
    expect(result.isValid).toBe(false);
  });

  it('rejects negative values', () => {
    expect(parseRgb('rgb(-1, 0, 0)').isValid).toBe(false);
  });

  it.each([
    'rgb()',
    'rgb(1, 2)',
    'rgb(1, 2, 3, 4)',
    'rgba(0, 0, 0)',
    'not-a-color',
  ])('rejects %s', input => {
    expect(parseRgb(input).isValid).toBe(false);
  });
});

describe('parseRgba', () => {
  it('parses valid rgba', () => {
    const result = parseRgba('rgba(255, 128, 0, 0.5)');
    expect(result).toEqual({
      isValid: true,
      value: { kind: 'RgbaColor', r: 255, g: 128, b: 0, a: 0.5 },
    });
  });

  it('parses alpha = 0', () => {
    const result = parseRgba('rgba(0, 0, 0, 0)');
    expect(result.isValid).toBe(true);
    expect(result.value).toEqual({ kind: 'RgbaColor', r: 0, g: 0, b: 0, a: 0 });
  });

  it('parses alpha = 1', () => {
    const result = parseRgba('rgba(0, 0, 0, 1)');
    expect(result.isValid).toBe(true);
    expect(result.value).toEqual({ kind: 'RgbaColor', r: 0, g: 0, b: 0, a: 1 });
  });

  it('rejects alpha > 1', () => {
    expect(parseRgba('rgba(0, 0, 0, 1.5)').isValid).toBe(false);
  });

  it('rejects out-of-range rgb', () => {
    expect(parseRgba('rgba(256, 0, 0, 0.5)').isValid).toBe(false);
  });

  it.each(['rgba()', 'rgba(1, 2, 3)', 'rgb(1, 2, 3, 0.5)'])('rejects %s', input => {
    expect(parseRgba(input).isValid).toBe(false);
  });
});

describe('parseTokenRef', () => {
  it('parses simple token ref', () => {
    const result = parseTokenRef('$color.primary');
    expect(result).toEqual({
      isValid: true,
      value: { kind: 'TokenRef', collection: 'color', token: 'primary' },
    });
  });

  it('parses nested collection ref', () => {
    const result = parseTokenRef('$color.semantic.primary');
    expect(result).toEqual({
      isValid: true,
      value: { kind: 'TokenRef', collection: 'color.semantic', token: 'primary' },
    });
  });

  it('parses ref with hyphens', () => {
    const result = parseTokenRef('$my-collection.my-token');
    expect(result).toEqual({
      isValid: true,
      value: { kind: 'TokenRef', collection: 'my-collection', token: 'my-token' },
    });
  });

  it('parses ref with underscores', () => {
    const result = parseTokenRef('$my_collection.my_token');
    expect(result).toEqual({
      isValid: true,
      value: { kind: 'TokenRef', collection: 'my_collection', token: 'my_token' },
    });
  });

  it.each([
    '$',
    '$single',
    'no-dollar.ref',
    '',
    '$$double.ref',
    '$collection.',
    '$.token',
  ])('rejects %s', input => {
    expect(parseTokenRef(input).isValid).toBe(false);
  });
});

describe('parseSize', () => {
  it.each([
    ['10px', 10, 'px'],
    ['1.5rem', 1.5, 'rem'],
    ['2em', 2, 'em'],
    ['100vw', 100, 'vw'],
    ['50vh', 50, 'vh'],
    ['75%', 75, '%'],
    ['0px', 0, 'px'],
    ['-10px', -10, 'px'],
    ['.5rem', 0.5, 'rem'],
  ] as const)('parses %s → %d%s', (input, value, unit) => {
    const result = parseSize(input);
    expect(result.isValid).toBe(true);
    expect(result.value).toEqual({ kind: 'SizeValue', value, unit });
  });

  it.each(['10', 'px', '10xyz', '', 'auto', '10 px'])('rejects %s', input => {
    expect(parseSize(input).isValid).toBe(false);
  });
});

describe('parseDuration', () => {
  it.each([
    ['100ms', 100, 'ms'],
    ['1s', 1, 's'],
    ['0.3s', 0.3, 's'],
    ['250ms', 250, 'ms'],
    ['0ms', 0, 'ms'],
  ] as const)('parses %s → %d%s', (input, value, unit) => {
    const result = parseDuration(input);
    expect(result.isValid).toBe(true);
    expect(result.value).toEqual({ kind: 'DurationValue', value, unit });
  });

  it('allows negative duration (parser does not enforce non-negative)', () => {
    const result = parseDuration('-100ms');
    expect(result.isValid).toBe(true);
    expect(result.value).toEqual({ kind: 'DurationValue', value: -100, unit: 'ms' });
  });

  it.each(['100', 'ms', '1m', '', '1sec'])('rejects %s', input => {
    expect(parseDuration(input).isValid).toBe(false);
  });
});
