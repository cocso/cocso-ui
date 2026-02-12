import type { ParseResult, RgbaColor, ShadowLayer, SizeValue, TokenRef } from '../types';
import { parseHex, parseRgb, parseRgba, parseSize, parseTokenRef } from './primitives';

export function parseColor(value: string): ParseResult {
  if (!value) {
    return { isValid: false, error: 'Missing color value' };
  }

  if (value.startsWith('$')) {
    return parseTokenRef(value);
  }

  if (value.startsWith('var(')) {
    return { isValid: true, value: { kind: 'StringValue', value } };
  }

  const hex = parseHex(value);
  if (hex.isValid) return hex;

  const rgb = parseRgb(value);
  if (rgb.isValid) return rgb;

  const rgba = parseRgba(value);
  if (rgba.isValid) return rgba;

  return { isValid: false, error: `Invalid color: ${value}` };
}

function parseSizeOrTokenRef(value: string): ParseResult {
  if (value.startsWith('$')) {
    return parseTokenRef(value);
  }
  return parseSize(value);
}

function parseShadowLayer(value: string): ParseResult {
  const parts = value.trim().split(/\s+/);

  if (parts.length < 4) {
    return { isValid: false, error: `Invalid shadow layer format: ${value}` };
  }

  try {
    const x = parseSizeOrTokenRef(parts[0]);
    const y = parseSizeOrTokenRef(parts[1]);
    const blur = parseSizeOrTokenRef(parts[2]);
    const spread = parseSizeOrTokenRef(parts[3]);

    if (!x.isValid || !y.isValid || !blur.isValid || !spread.isValid) {
      return { isValid: false, error: `Invalid shadow dimensions: ${value}` };
    }

    const colorPart = parts.slice(4).join(' ').trim();
    const color = parseColor(colorPart);

    if (!color.isValid) {
      return { isValid: false, error: `Invalid shadow color: ${colorPart}` };
    }

    return {
      isValid: true,
      value: {
        kind: 'ShadowLayer',
        color: color.value as RgbaColor,
        offsetX: x.value as SizeValue | TokenRef,
        offsetY: y.value as SizeValue | TokenRef,
        blur: blur.value as SizeValue | TokenRef,
        spread: spread.value as SizeValue | TokenRef,
      },
    };
  } catch (_error) {
    return { isValid: false, error: `Invalid shadow layer: ${value}` };
  }
}

export function parseShadow(value: string): ParseResult {
  if (!value.includes('px') && !value.includes('$')) {
    return { isValid: false, error: `Invalid shadow format: ${value}` };
  }

  try {
    const layerStrings = value.split(',').map(s => s.trim());
    const layers: ShadowLayer[] = [];

    for (const layerStr of layerStrings) {
      const layer = parseShadowLayer(layerStr);
      if (!layer.isValid || !layer.value) {
        return { isValid: false, error: `Invalid shadow layer: ${layerStr}` };
      }
      layers.push(layer.value as ShadowLayer);
    }

    return { isValid: true, value: { kind: 'Shadow', layers } };
  } catch (_error) {
    return { isValid: false, error: `Invalid shadow format: ${value}` };
  }
}
