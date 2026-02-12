import type { ParseResult } from '../types';

export function parseHex(value: string): ParseResult {
  const regex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;

  if (!regex.test(value)) {
    return { isValid: false, error: `Invalid hex color: ${value}` };
  }

  return { isValid: true, value: { kind: 'HexColor', value: value as `#${string}` } };
}

export function parseRgb(value: string): ParseResult {
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

export function parseRgba(value: string): ParseResult {
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

export function parseTokenRef(value: string): ParseResult {
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

export function parseSize(value: string): ParseResult {
  const regex = /^([+-]?\d*\.?\d+)(px|rem|em|vw|vh|%)$/;
  const match = value.match(regex);

  if (!match) {
    return { isValid: false, error: `Invalid size: ${value}` };
  }

  const [, numValue, unit] = match;
  const num = Number.parseFloat(numValue);

  if (Number.isNaN(num)) {
    return { isValid: false, error: `Invalid size value: ${value}` };
  }

  return {
    isValid: true,
    value: { kind: 'SizeValue', value: num, unit: unit as 'px' | 'rem' | 'em' | 'vw' | 'vh' | '%' },
  };
}

export function parseDuration(value: string): ParseResult {
  const regex = /^([+-]?\d*\.?\d+)(ms|s)$/;
  const match = value.match(regex);

  if (!match) {
    return { isValid: false, error: `Invalid duration: ${value}` };
  }

  const [, numValue, unit] = match;
  const num = Number.parseFloat(numValue);

  if (Number.isNaN(num)) {
    return { isValid: false, error: `Invalid duration value: ${value}` };
  }

  return {
    isValid: true,
    value: { kind: 'DurationValue', value: num, unit: unit as 'ms' | 's' },
  };
}
