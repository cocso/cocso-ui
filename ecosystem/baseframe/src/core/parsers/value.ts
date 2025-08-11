import type {
  ParseResult,
  Value,
  HexColor,
  RgbColor,
  RgbaColor,
  SizeValue,
  DurationValue,
  NumberValue,
  StringValue,
  TokenRef,
  ShadowLayer,
  Shadow,
} from '../types';

export function parseValue(value: string | number): ParseResult {
  const str = String(value).trim();

  if (typeof value === 'number') {
    return { isValid: true, value: { kind: 'NumberValue', value } };
  }

  const hex = parseHex(str);
  if (hex.isValid) return hex;

  const rgb = parseRgb(str);
  if (rgb.isValid) return rgb;

  const rgba = parseRgba(str);
  if (rgba.isValid) return rgba;

  const tokenRef = parseTokenRef(str);
  if (tokenRef.isValid) return tokenRef;

  const shadow = parseShadow(str);
  if (shadow.isValid) return shadow;

  const size = parseSize(str);
  if (size.isValid) return size;

  const duration = parseDuration(str);
  if (duration.isValid) return duration;

  return { isValid: true, value: { kind: 'StringValue', value: str } };
}

export function valueToString(value: Value): string {
  switch (value.kind) {
    case 'HexColor':
      return value.value;
    case 'RgbColor':
      return `rgb(${value.r}, ${value.g}, ${value.b})`;
    case 'RgbaColor':
      return `rgba(${value.r}, ${value.g}, ${value.b}, ${value.a})`;
    case 'TokenRef':
      return `$${value.collection}.${value.token}`;
    case 'SizeValue':
      return `${value.value}${value.unit}`;
    case 'DurationValue':
      return `${value.value}${value.unit}`;
    case 'NumberValue':
      return value.value.toString();
    case 'StringValue':
      return value.value;
    case 'ShadowLayer': {
      const x = valueToString(value.offsetX);
      const y = valueToString(value.offsetY);
      const blur = valueToString(value.blur);
      const spread = valueToString(value.spread);
      const color = valueToString(value.color);
      return `${x} ${y} ${blur} ${spread} ${color}`;
    }
    case 'Shadow':
      return value.layers.map((layer) => valueToString(layer)).join(', ');
    default:
      return String(value);
  }
}

function parseHex(value: string): ParseResult {
  const regex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;

  if (!regex.test(value)) {
    return { isValid: false, error: `Invalid hex color: ${value}` };
  }

  return { isValid: true, value: { kind: 'HexColor', value: value as `#${string}` } };
}

function parseRgb(value: string): ParseResult {
  const regex = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
  const match = value.match(regex);

  if (!match) {
    return { isValid: false, error: `Invalid rgb color: ${value}` };
  }

  const [, r, g, b] = match;
  const red = Number.parseInt(r, 10);
  const green = Number.parseInt(g, 10);
  const blue = Number.parseInt(b, 10);

  if (red < 0 || red > 255 || green < 0 || green > 255 || blue < 0 || blue > 255) {
    return { isValid: false, error: `Invalid RGB values: ${value}` };
  }

  return { isValid: true, value: { kind: 'RgbColor', r: red, g: green, b: blue } };
}

function parseRgba(value: string): ParseResult {
  const regex = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([01]?\.?\d*)\s*\)$/;
  const match = value.match(regex);

  if (!match) {
    return { isValid: false, error: `Invalid rgba color: ${value}` };
  }

  const [, r, g, b, a] = match;
  const red = Number.parseInt(r, 10);
  const green = Number.parseInt(g, 10);
  const blue = Number.parseInt(b, 10);
  const alpha = Number.parseFloat(a);

  if (red < 0 || red > 255 || green < 0 || green > 255 || blue < 0 || blue > 255) {
    return { isValid: false, error: `Invalid RGB values: ${value}` };
  }

  if (alpha < 0 || alpha > 1) {
    return { isValid: false, error: `Invalid alpha value: ${value}` };
  }

  return { isValid: true, value: { kind: 'RgbaColor', r: red, g: green, b: blue, a: alpha } };
}

function parseTokenRef(value: string): ParseResult {
  const regex = /^\$[a-zA-Z0-9][a-zA-Z0-9_-]*(?:\.[a-zA-Z0-9][a-zA-Z0-9_-]*)+$/;

  if (!regex.test(value)) {
    return { isValid: false, error: `Invalid token reference: ${value}` };
  }

  const clean = value.substring(1);
  const parts = clean.split('.');

  if (parts.length < 2) {
    return { isValid: false, error: `Invalid token format: ${value}` };
  }

  const token = parts[parts.length - 1];
  const collection = parts.slice(0, -1).join('.');

  return { isValid: true, value: { kind: 'TokenRef', collection, token } };
}

function parseSize(value: string): ParseResult {
  const regex = /^([+-]?\d*\.?\d+)(px|rem|em|vw|vh|%)$/;
  const match = value.match(regex);

  if (!match) {
    return { isValid: false, error: `Invalid size: ${value}` };
  }

  const [, numValue, unit] = match;
  const num = Number.parseFloat(numValue);

  if (isNaN(num)) {
    return { isValid: false, error: `Invalid size value: ${value}` };
  }

  return {
    isValid: true,
    value: { kind: 'SizeValue', value: num, unit: unit as 'px' | 'rem' | 'em' | 'vw' | 'vh' | '%' },
  };
}

function parseDuration(value: string): ParseResult {
  const regex = /^([+-]?\d*\.?\d+)(ms|s)$/;
  const match = value.match(regex);

  if (!match) {
    return { isValid: false, error: `Invalid duration: ${value}` };
  }

  const [, numValue, unit] = match;
  const num = Number.parseFloat(numValue);

  if (isNaN(num)) {
    return { isValid: false, error: `Invalid duration value: ${value}` };
  }

  return {
    isValid: true,
    value: { kind: 'DurationValue', value: num, unit: unit as 'ms' | 's' },
  };
}

function parseColor(value: string): ParseResult {
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

function parseShadow(value: string): ParseResult {
  if (!value.includes('px') && !value.includes('$')) {
    return { isValid: false, error: `Invalid shadow format: ${value}` };
  }

  try {
    const layerStrings = value.split(',').map((s) => s.trim());
    const layers: ShadowLayer[] = [];

    for (const layerStr of layerStrings) {
      const layer = parseShadowLayer(layerStr);
      if (!layer.isValid || !layer.value) {
        return { isValid: false, error: `Invalid shadow layer: ${layerStr}` };
      }
      layers.push(layer.value as ShadowLayer);
    }

    return { isValid: true, value: { kind: 'Shadow', layers } };
  } catch (error) {
    return { isValid: false, error: `Invalid shadow format: ${value}` };
  }
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
  } catch (error) {
    return { isValid: false, error: `Invalid shadow layer: ${value}` };
  }
}

function parseSizeOrTokenRef(value: string): ParseResult {
  if (value.startsWith('$')) {
    return parseTokenRef(value);
  }
  return parseSize(value);
}
