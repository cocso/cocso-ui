import type { ParseResult, Value } from '../types';
import {
  parseDuration,
  parseHex,
  parseRgb,
  parseRgba,
  parseSize,
  parseTokenRef,
} from './primitives';
import { parseShadow } from './shadow';

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
      return value.layers.map(layer => valueToString(layer)).join(', ');
    default:
      return String(value);
  }
}
