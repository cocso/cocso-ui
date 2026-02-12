import { describe, expect, it } from 'vitest';
import { parseColor, parseShadow } from '../shadow';

describe('parseColor', () => {
  it('parses hex color', () => {
    const result = parseColor('#ff0000');
    expect(result.isValid).toBe(true);
    expect(result.value).toEqual({ kind: 'HexColor', value: '#ff0000' });
  });

  it('parses rgb color', () => {
    const result = parseColor('rgb(255, 0, 0)');
    expect(result.isValid).toBe(true);
    expect(result.value).toEqual({ kind: 'RgbColor', r: 255, g: 0, b: 0 });
  });

  it('parses rgba color', () => {
    const result = parseColor('rgba(0, 0, 0, 0.5)');
    expect(result.isValid).toBe(true);
    expect(result.value).toEqual({ kind: 'RgbaColor', r: 0, g: 0, b: 0, a: 0.5 });
  });

  it('parses token ref as color', () => {
    const result = parseColor('$color.primary');
    expect(result.isValid).toBe(true);
    expect(result.value).toEqual({ kind: 'TokenRef', collection: 'color', token: 'primary' });
  });

  it('passes through var() references', () => {
    const result = parseColor('var(--my-color)');
    expect(result.isValid).toBe(true);
    expect(result.value).toEqual({ kind: 'StringValue', value: 'var(--my-color)' });
  });

  it('rejects empty string', () => {
    expect(parseColor('').isValid).toBe(false);
  });

  it('rejects invalid color', () => {
    expect(parseColor('not-a-color').isValid).toBe(false);
  });

  it('rejects named CSS color', () => {
    expect(parseColor('red').isValid).toBe(false);
  });
});

describe('parseShadow', () => {
  it('parses single layer with hex color', () => {
    const result = parseShadow('0px 4px 8px 0px #000000');
    expect(result.isValid).toBe(true);
    expect(result.value).toMatchObject({
      kind: 'Shadow',
      layers: [
        {
          kind: 'ShadowLayer',
          offsetX: { kind: 'SizeValue', value: 0, unit: 'px' },
          offsetY: { kind: 'SizeValue', value: 4, unit: 'px' },
          blur: { kind: 'SizeValue', value: 8, unit: 'px' },
          spread: { kind: 'SizeValue', value: 0, unit: 'px' },
          color: { kind: 'HexColor', value: '#000000' },
        },
      ],
    });
  });

  it('rejects rgba color in shadow (comma-separated args conflict with layer separator)', () => {
    const result = parseShadow('2px 4px 6px 0px rgba(0, 0, 0, 0.1)');
    expect(result.isValid).toBe(false);
  });

  it('rejects shadow with rem units (parser guard only allows px or $)', () => {
    const result = parseShadow('0rem 4rem 8rem 0rem #000000');
    expect(result.isValid).toBe(false);
  });

  it('parses multi-layer shadow', () => {
    const result = parseShadow('0px 1px 2px 0px #000000, 0px 4px 8px 0px #111111');
    expect(result.isValid).toBe(true);
    expect(result.value).toMatchObject({ kind: 'Shadow' });
    expect((result.value as { layers: unknown[] }).layers).toHaveLength(2);
  });

  it('parses shadow with token ref dimensions', () => {
    const result = parseShadow('$spacing.1 $spacing.2 $spacing.3 0px #000000');
    expect(result.isValid).toBe(true);
    expect(result.value).toMatchObject({
      kind: 'Shadow',
      layers: [
        {
          kind: 'ShadowLayer',
          offsetX: { kind: 'TokenRef', collection: 'spacing', token: '1' },
          offsetY: { kind: 'TokenRef', collection: 'spacing', token: '2' },
          blur: { kind: 'TokenRef', collection: 'spacing', token: '3' },
          spread: { kind: 'SizeValue', value: 0, unit: 'px' },
          color: { kind: 'HexColor', value: '#000000' },
        },
      ],
    });
  });

  it('parses shadow with token ref color', () => {
    const result = parseShadow('0px 4px 8px 0px $color.shadow');
    expect(result.isValid).toBe(true);
    expect(result.value).toMatchObject({
      kind: 'Shadow',
      layers: [
        {
          kind: 'ShadowLayer',
          color: { kind: 'TokenRef', collection: 'color', token: 'shadow' },
        },
      ],
    });
  });

  it('rejects value without px or $', () => {
    expect(parseShadow('auto').isValid).toBe(false);
  });

  it('rejects shadow with too few parts', () => {
    expect(parseShadow('0px 4px').isValid).toBe(false);
  });

  it('rejects shadow with invalid color part', () => {
    expect(parseShadow('0px 4px 8px 0px not-a-color').isValid).toBe(false);
  });
});
