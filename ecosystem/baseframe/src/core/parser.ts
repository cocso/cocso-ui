import type {
  Value,
  ParseResult,
  HexColor,
  RgbColor,
  RgbaColor,
  TokenRef,
  SizeValue,
  DurationValue,
  NumberValue,
  StringValue,
  Token,
  Collections,
  CollectionDecl,
  TokenDecl,
  Ast,
} from './types';

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

  const size = parseSize(str);
  if (size.isValid) return size;

  const duration = parseDuration(str);
  if (duration.isValid) return duration;

  return { isValid: true, value: { kind: 'StringValue', value: str } };
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
  const red = parseInt(r, 10);
  const green = parseInt(g, 10);
  const blue = parseInt(b, 10);

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
  const red = parseInt(r, 10);
  const green = parseInt(g, 10);
  const blue = parseInt(b, 10);
  const alpha = parseFloat(a);

  if (red < 0 || red > 255 || green < 0 || green > 255 || blue < 0 || blue > 255) {
    return { isValid: false, error: `Invalid RGB values: ${value}` };
  }

  if (alpha < 0 || alpha > 1) {
    return { isValid: false, error: `Invalid alpha value: ${value}` };
  }

  return { isValid: true, value: { kind: 'RgbaColor', r: red, g: green, b: blue, a: alpha } };
}

function parseTokenRef(value: string): ParseResult {
  const regex = /^\$[a-zA-Z][a-zA-Z0-9_-]*(?:\.[a-zA-Z][a-zA-Z0-9_-]*)+$/;
  
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
  const num = parseFloat(numValue);

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
  const num = parseFloat(numValue);

  if (isNaN(num)) {
    return { isValid: false, error: `Invalid duration value: ${value}` };
  }

  return {
    isValid: true,
    value: { kind: 'DurationValue', value: num, unit: unit as 'ms' | 's' },
  };
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
    default:
      return String(value);
  }
}

function buildCollections(collections: Collections): CollectionDecl[] {
  return collections.data.map((collection) => ({
    name: collection.name,
    modes: collection.modes,
  }));
}

function buildTokens(token: Token): TokenDecl[] {
  const { collection: name, tokens } = token.data;

  return Object.entries(tokens).map(([tokenName, tokenData]) => {
    const values = Object.entries(tokenData.values).map(([mode, value]) => ({
      mode,
      value: value as string | number,
    }));

    return { token: { name: tokenName, collection: name }, values };
  });
}

function buildAllTokens(tokens: Token[]): TokenDecl[] {
  return tokens.flatMap(buildTokens);
}

export function buildAst(tokens: Token[], collections: Collections): Ast {
  return {
    tokens: buildAllTokens(tokens),
    collections: buildCollections(collections),
  };
}
